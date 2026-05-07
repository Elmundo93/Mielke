#!/usr/bin/env node
/**
 * Löscht Blob-Dateien, die in src/content/ nicht mehr existieren.
 * Einmalig ausführen nach Umbenennungen von Content-Dateien.
 *
 * Ausführen: node scripts/cleanup-blob.mjs
 * Dry-Run:   node scripts/cleanup-blob.mjs --dry-run
 */
import { list, del } from "@vercel/blob";
import { readdir } from "node:fs/promises";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const CONTENT_DIR = resolve(__dirname, "../src/content");
const BLOB_TOKEN =
  process.env.MielkeBlob_READ_WRITE_TOKEN ?? process.env.BLOB_READ_WRITE_TOKEN;
const DRY_RUN = process.argv.includes("--dry-run");

if (!BLOB_TOKEN) {
  console.log("[cleanup-blob] Kein Blob-Token – abgebrochen.");
  process.exit(1);
}

async function walkDir(dir, base) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = new Set();
  for (const entry of entries) {
    const rel = base ? `${base}/${entry.name}` : entry.name;
    if (entry.isDirectory()) {
      for (const f of await walkDir(join(dir, entry.name), rel)) files.add(f);
    } else if (entry.name.endsWith(".json")) {
      files.add(rel);
    }
  }
  return files;
}

async function getAllBlobs() {
  const blobs = [];
  let cursor;
  do {
    const result = await list({ prefix: "content/", token: BLOB_TOKEN, cursor, limit: 1000 });
    blobs.push(...result.blobs);
    cursor = result.cursor;
  } while (cursor);
  return blobs;
}

async function main() {
  if (DRY_RUN) console.log("[cleanup-blob] Dry-Run – es wird nichts gelöscht.\n");

  const [blobs, localFiles] = await Promise.all([
    getAllBlobs(),
    walkDir(CONTENT_DIR, ""),
  ]);

  const toDelete = blobs.filter((b) => {
    const localPath = b.pathname.replace(/^content\//, "");
    return !localFiles.has(localPath);
  });

  if (toDelete.length === 0) {
    console.log("[cleanup-blob] Keine veralteten Blobs gefunden.");
    return;
  }

  console.log(`[cleanup-blob] ${toDelete.length} veraltete Datei(en) gefunden:`);
  for (const b of toDelete) {
    console.log(`  ${DRY_RUN ? "(würde löschen)" : "✕"} ${b.pathname}`);
  }

  if (!DRY_RUN) {
    await del(toDelete.map((b) => b.url), { token: BLOB_TOKEN });
    console.log("\n[cleanup-blob] Gelöscht.");
  }
}

main().catch((err) => {
  console.error("[cleanup-blob] Fehler:", err);
  process.exit(1);
});
