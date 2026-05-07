#!/usr/bin/env node
/**
 * Synct src/content/ mit dem Vercel Blob.
 *
 * Für jedes Verzeichnis das in src/content/ existiert:
 *   - Fehlende Blobs werden hochgeladen
 *   - Veraltete Blobs (umbenannte / gelöschte Dateien) werden entfernt
 *
 * Blob-Pfade außerhalb von src/content/ (z.B. content/settings/) werden
 * nie angefasst, da sie rein admin-seitig verwaltet werden.
 */
import { list, put, del } from "@vercel/blob";
import { readdir, readFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const CONTENT_DIR = resolve(__dirname, "../src/content");
const BLOB_TOKEN =
  process.env.MielkeBlob_READ_WRITE_TOKEN ?? process.env.BLOB_READ_WRITE_TOKEN;

if (!BLOB_TOKEN) {
  console.log("[seed-blob] Kein Blob-Token – wird übersprungen.");
  process.exit(0);
}

async function walkDir(dir, base) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = new Map(); // relPath → absPath
  for (const entry of entries) {
    const rel = base ? `${base}/${entry.name}` : entry.name;
    if (entry.isDirectory()) {
      for (const [k, v] of await walkDir(join(dir, entry.name), rel))
        files.set(k, v);
    } else if (entry.name.endsWith(".json")) {
      files.set(rel, join(dir, entry.name));
    }
  }
  return files;
}

async function listAllBlobs(prefix) {
  const blobs = [];
  let cursor;
  do {
    const result = await list({ prefix, token: BLOB_TOKEN, cursor, limit: 1000 });
    blobs.push(...result.blobs);
    cursor = result.cursor;
  } while (cursor);
  return blobs;
}

async function getTopLevelDirs() {
  const entries = await readdir(CONTENT_DIR, { withFileTypes: true });
  return entries.filter((e) => e.isDirectory()).map((e) => e.name);
}

async function main() {
  // Nur Verzeichnisse syngen, die im Repo existieren.
  const managedDirs = await getTopLevelDirs();
  console.log(`[seed-blob] Verwaltete Verzeichnisse: ${managedDirs.join(", ")}`);

  const localFiles = await walkDir(CONTENT_DIR, ""); // relPath → absPath
  const localBlobPaths = new Set(
    [...localFiles.keys()].map((rel) => `content/${rel}`)
  );

  let uploaded = 0;
  let deleted = 0;
  let skipped = 0;

  for (const dir of managedDirs) {
    const prefix = `content/${dir}/`;
    const blobs = await listAllBlobs(prefix);

    // Veraltete Blobs löschen
    const stale = blobs.filter((b) => !localBlobPaths.has(b.pathname));
    if (stale.length > 0) {
      await del(stale.map((b) => b.url), { token: BLOB_TOKEN });
      for (const b of stale) console.log(`[seed-blob] ✕ ${b.pathname}`);
      deleted += stale.length;
    }

    // Fehlende Blobs hochladen
    const existingPaths = new Set(blobs.map((b) => b.pathname));
    for (const [relPath, absPath] of localFiles) {
      const blobPath = `content/${relPath}`;
      if (!blobPath.startsWith(prefix)) continue;
      if (existingPaths.has(blobPath)) {
        skipped++;
        continue;
      }
      const content = await readFile(absPath, "utf8");
      await put(blobPath, content, {
        access: "private",
        addRandomSuffix: false,
        allowOverwrite: true,
        contentType: "application/json",
        token: BLOB_TOKEN,
      });
      console.log(`[seed-blob] ↑ ${blobPath}`);
      uploaded++;
    }
  }

  console.log(
    `[seed-blob] Fertig – ${uploaded} hochgeladen, ${deleted} gelöscht, ${skipped} unverändert.`
  );
}

main().catch((err) => {
  console.error("[seed-blob] Fehler:", err);
  process.exit(1);
});
