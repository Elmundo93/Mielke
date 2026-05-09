import { NextResponse } from "next/server";
import { HealthcareRequestSchema } from "@/lib/validation/healthcare-request";
import { sendHealthcareMail } from "@/lib/mail";

export const maxDuration = 30;

const ALLOWED_MIME_TYPES = new Set([
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
]);

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const MAX_FILES = 5;

async function isMimeValid(file: File, declaredType: string): Promise<boolean> {
  try {
    const header = new Uint8Array(await file.slice(0, 12).arrayBuffer());
    const isPdf = header[0] === 0x25 && header[1] === 0x50 && header[2] === 0x44 && header[3] === 0x46;
    const isJpeg = header[0] === 0xff && header[1] === 0xd8 && header[2] === 0xff;
    const isPng = header[0] === 0x89 && header[1] === 0x50 && header[2] === 0x4e && header[3] === 0x47;
    const isWebp =
      header[0] === 0x52 && header[1] === 0x49 && header[2] === 0x46 && header[3] === 0x46 &&
      header[8] === 0x57 && header[9] === 0x45 && header[10] === 0x42 && header[11] === 0x50;
    if (declaredType === "application/pdf") return isPdf;
    if (declaredType === "image/jpeg") return isJpeg;
    if (declaredType === "image/png") return isPng;
    if (declaredType === "image/webp") return isWebp;
    return false;
  } catch {
    return false;
  }
}

function sanitizeFilename(name: string): string {
  return name.replace(/[^a-zA-Z0-9.\-_äöüÄÖÜß ]/g, "_").replace(/\.{2,}/g, "_").slice(0, 200);
}

export async function POST(req: Request) {
  const form = await req.formData();

  const data: Record<string, string> = {};
  for (const [key, value] of form.entries()) {
    if (typeof value === "string") data[key] = value;
  }

  const tooFast = data.ts && Date.now() - Number(data.ts) < 2000;
  if ((data.hp && data.hp.length > 0) || tooFast) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const parsed = HealthcareRequestSchema.safeParse(data);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, errors: parsed.error.flatten() }, { status: 400 });
  }

  const rawFiles = form.getAll("dokument") as File[];

  if (rawFiles.length > MAX_FILES) {
    return NextResponse.json({ ok: false, error: "Zu viele Dateien." }, { status: 400 });
  }

  const validatedFiles: File[] = [];
  for (const file of rawFiles) {
    if (file.size === 0) continue;
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ ok: false, error: `Datei "${sanitizeFilename(file.name)}" überschreitet 5 MB.` }, { status: 400 });
    }
    if (!ALLOWED_MIME_TYPES.has(file.type)) {
      return NextResponse.json({ ok: false, error: `Dateityp nicht erlaubt: ${file.type || "unbekannt"}` }, { status: 400 });
    }
    if (!(await isMimeValid(file, file.type))) {
      return NextResponse.json({ ok: false, error: "Dateiinhalt stimmt nicht mit dem deklarierten Typ überein." }, { status: 400 });
    }
    validatedFiles.push(new File([file], sanitizeFilename(file.name), { type: file.type }));
  }

  try {
    await sendHealthcareMail({
      type: parsed.data.type,
      anrede: parsed.data.anrede,
      vorname: parsed.data.vorname,
      nachname: parsed.data.nachname,
      email: parsed.data.email,
      telefon: parsed.data.telefon,
      standort: parsed.data.standort,
      message: parsed.data.message,
      consentTimestamp: new Date().toISOString(),
      files: validatedFiles,
    });
  } catch (err) {
    console.error("[healthcare] Mail-Versand fehlgeschlagen:", err);
    return NextResponse.json({ ok: false, error: "mail_failed" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
