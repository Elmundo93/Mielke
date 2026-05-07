#!/usr/bin/env node
/**
 * Seeded alle JSON-Dateien aus src/content/ in den Vercel Blob.
 * Bereits vorhandene Dateien werden übersprungen (Admin-Edits bleiben erhalten).
 * Neue Dateien im Repo werden beim nächsten Build automatisch hochgeladen.
 */
import { list, put } from "@vercel/blob";
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
  const files = [];
  for (const entry of entries) {
    const rel = base ? `${base}/${entry.name}` : entry.name;
    if (entry.isDirectory()) {
      files.push(...(await walkDir(join(dir, entry.name), rel)));
    } else if (entry.name.endsWith(".json")) {
      files.push(rel);
    }
  }
  return files;
}

async function getExistingBlobs() {
  const existing = new Set();
  let cursor;
  do {
    const result = await list({
      prefix: "content/",
      token: BLOB_TOKEN,
      cursor,
      limit: 1000,
    });
    for (const b of result.blobs) existing.add(b.pathname);
    cursor = result.cursor;
  } while (cursor);
  return existing;
}

async function main() {
  console.log("[seed-blob] Prüfe vorhandene Blobs…");
  const existing = await getExistingBlobs();

  const files = await walkDir(CONTENT_DIR, "");
  let uploaded = 0;
  let skipped = 0;

  for (const relPath of files) {
    const blobPath = `content/${relPath}`;

    if (existing.has(blobPath)) {
      skipped++;
      continue;
    }

    const content = await readFile(join(CONTENT_DIR, relPath), "utf8");
    await put(blobPath, content, {
      access: "public",
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType: "application/json",
      token: BLOB_TOKEN,
    });
    console.log(`[seed-blob] ↑ ${blobPath}`);
    uploaded++;
  }

  console.log(
    `[seed-blob] Fertig – ${uploaded} hochgeladen, ${skipped} bereits vorhanden.`
  );
}

main().catch((err) => {
  console.error("[seed-blob] Fehler:", err);
  process.exit(1);
});
