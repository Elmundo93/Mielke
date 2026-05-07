import fs from "node:fs/promises";
import path from "node:path";

const BLOB_TOKEN = process.env.MielkeBlob_READ_WRITE_TOKEN ?? process.env.BLOB_READ_WRITE_TOKEN;
const USE_BLOB = !!BLOB_TOKEN;
const IS_PRODUCTION = process.env.NODE_ENV === "production";

const LOCAL_CONTENT_DIR = process.env.DATA_DIR
  ? path.resolve(process.env.DATA_DIR)
  : path.join(process.cwd(), "src", "content");

export type ContentDirEntry = {
  filename: string;
  content: string;
};

function contentPath(relPath: string): string {
  return `content/${relPath}`;
}

function mergeWithDefaults<T>(defaults: T, parsed: unknown): T {
  if (
    defaults &&
    parsed &&
    typeof defaults === "object" &&
    typeof parsed === "object" &&
    !Array.isArray(defaults) &&
    !Array.isArray(parsed)
  ) {
    return { ...defaults, ...parsed } as T;
  }
  return parsed as T;
}

function shouldFallbackToFilesystem(): boolean {
  // Lokal und Preview darf der Dateisystem-Fallback die Entwicklung erleichtern.
  // In Production soll ein Blob-Fehler sichtbar werden, statt still alte Build-Daten auszuliefern.
  return !IS_PRODUCTION;
}

export async function readContentFile<T>(
  relPath: string,
  defaults: T
): Promise<T> {
  if (USE_BLOB) {
    return readFromBlob(relPath, defaults);
  }
  return readFromFilesystem(relPath, defaults);
}

async function readFromBlob<T>(relPath: string, defaults: T): Promise<T> {
  const { list } = await import("@vercel/blob");
  const pathname = contentPath(relPath);

  try {
    const { blobs } = await list({ prefix: pathname, token: BLOB_TOKEN });
    const blob = blobs.find((b) => b.pathname === pathname);

    if (!blob) {
      if (shouldFallbackToFilesystem()) return readFromFilesystem(relPath, defaults);
      return defaults;
    }

    const res = await fetch(blob.url, { cache: "no-store" });
    if (!res.ok) {
      throw new Error(`Blob konnte nicht gelesen werden (${res.status} ${res.statusText}): ${pathname}`);
    }

    const parsed = JSON.parse(await res.text());
    return mergeWithDefaults(defaults, parsed);
  } catch (err) {
    console.error(`[storage] Blob-Lesefehler für ${pathname}:`, err);
    if (shouldFallbackToFilesystem()) return readFromFilesystem(relPath, defaults);
    throw err;
  }
}

async function readFromFilesystem<T>(relPath: string, defaults: T): Promise<T> {
  try {
    const p = path.join(LOCAL_CONTENT_DIR, relPath);
    const parsed = JSON.parse(await fs.readFile(p, "utf8"));
    return mergeWithDefaults(defaults, parsed);
  } catch (err) {
    console.warn(`[storage] Dateisystem-Fallback liefert Defaults für ${relPath}:`, err);
    return defaults;
  }
}

export async function readContentDirEntries(relDir: string): Promise<ContentDirEntry[]> {
  if (USE_BLOB) {
    return readDirFromBlob(relDir);
  }
  return readDirFromFilesystem(relDir);
}

async function readDirFromBlob(relDir: string): Promise<ContentDirEntry[]> {
  const { list } = await import("@vercel/blob");
  const prefix = contentPath(`${relDir}/`);

  try {
    const { blobs } = await list({ prefix, token: BLOB_TOKEN });
    const jsonBlobs = blobs.filter((b) => b.pathname.endsWith(".json"));

    if (jsonBlobs.length === 0) {
      if (shouldFallbackToFilesystem()) return readDirFromFilesystem(relDir);
      return [];
    }

    return Promise.all(
      jsonBlobs.map(async (b) => {
        const res = await fetch(b.url, { cache: "no-store" });
        if (!res.ok) {
          throw new Error(`Blob konnte nicht gelesen werden (${res.status} ${res.statusText}): ${b.pathname}`);
        }
        return {
          filename: path.basename(b.pathname),
          content: await res.text(),
        };
      })
    );
  } catch (err) {
    console.error(`[storage] Blob-Verzeichnisfehler für ${prefix}:`, err);
    if (shouldFallbackToFilesystem()) return readDirFromFilesystem(relDir);
    throw err;
  }
}

async function readDirFromFilesystem(relDir: string): Promise<ContentDirEntry[]> {
  try {
    const dir = path.join(LOCAL_CONTENT_DIR, relDir);
    const files = await fs.readdir(dir);
    return Promise.all(
      files
        .filter((f) => f.endsWith(".json"))
        .map(async (f) => ({
          filename: f,
          content: await fs.readFile(path.join(dir, f), "utf8"),
        }))
    );
  } catch (err) {
    console.warn(`[storage] Dateisystem-Verzeichnis leer/default für ${relDir}:`, err);
    return [];
  }
}

export async function writeContentFile(
  relPath: string,
  content: string
): Promise<void> {
  if (USE_BLOB) {
    await writeToBlob(relPath, content);
  } else {
    await writeToFilesystem(relPath, content);
  }
}

export async function readPrivateContentFile<T>(
  relPath: string,
  defaults: T
): Promise<T> {
  if (USE_BLOB) {
    return readPrivateFromBlob(relPath, defaults);
  }
  return readFromFilesystem(relPath, defaults);
}

export async function writePrivateContentFile(
  relPath: string,
  content: string
): Promise<void> {
  if (USE_BLOB) {
    await writePrivateToBlob(relPath, content);
  } else {
    await writeToFilesystem(relPath, content);
  }
}

async function writeToBlob(relPath: string, content: string): Promise<void> {
  const { put } = await import("@vercel/blob");
  await put(contentPath(relPath), content, {
    access: "public",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json",
    token: BLOB_TOKEN,
  });
}

async function readPrivateFromBlob<T>(relPath: string, defaults: T): Promise<T> {
  const { get, BlobNotFoundError } = await import("@vercel/blob");
  const pathname = contentPath(relPath);

  try {
    const result = await get(pathname, { access: "private", token: BLOB_TOKEN });

    if (!result || result.statusCode !== 200 || !result.stream) {
      return defaults;
    }

    const text = await new Response(result.stream).text();
    const parsed = JSON.parse(text);
    return mergeWithDefaults(defaults, parsed);
  } catch (err) {
    if (err instanceof BlobNotFoundError) {
      if (shouldFallbackToFilesystem()) return readFromFilesystem(relPath, defaults);
      return defaults;
    }
    console.error(`[storage] Privater Blob-Lesefehler für ${pathname}:`, err);
    if (shouldFallbackToFilesystem()) return readFromFilesystem(relPath, defaults);
    throw err;
  }
}

async function writePrivateToBlob(relPath: string, content: string): Promise<void> {
  const { put } = await import("@vercel/blob");
  await put(contentPath(relPath), content, {
    access: "private",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json",
    token: BLOB_TOKEN,
  });
}

async function writeToFilesystem(relPath: string, content: string): Promise<void> {
  const p = path.join(LOCAL_CONTENT_DIR, relPath);
  await fs.mkdir(path.dirname(p), { recursive: true });
  await fs.writeFile(p, content, "utf8");
}
