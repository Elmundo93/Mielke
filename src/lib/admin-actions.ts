"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import type { Job, ImpressumContent, DatenschutzContent } from "@/lib/content";
import { requireAdmin } from "@/lib/admin-auth";
import { readContentFile, writeContentFile } from "@/lib/storage";
import { readSmtpSettings, writeSmtpSettings, resolveSmtpConfig } from "@/lib/settings";

// ── Audit Log ──────────────────────────────────────────────────────────────────

function auditLog(action: string, details?: Record<string, unknown>): void {
  console.info(JSON.stringify({ audit: true, action, ts: new Date().toISOString(), ...details }));
}

// ── Shared ─────────────────────────────────────────────────────────────────────

const LocationSlugSchema = z.enum([
  "grossalmerode",
  "hessisch-lichtenau",
  "kaufungen",
  "witzenhausen",
]);

function normalizeList(items: string[]): string[] {
  return items.map((item) => item.trim()).filter(Boolean);
}

function adminError(err: unknown): { ok: false; error: string } {
  return { ok: false, error: err instanceof Error ? err.message : "Nicht autorisiert." };
}

async function assertAdminResult(): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    await requireAdmin();
    return { ok: true };
  } catch (err) {
    return adminError(err);
  }
}

// ── Impressum ──────────────────────────────────────────────────────────────────

const ImpressumSchema = z.object({
  companyName: z.string(),
  ownerName: z.string(),
  address: z.string(),
  postalCode: z.string(),
  city: z.string(),
  phone: z.string(),
  email: z.string(),
  ustIdNr: z.string(),
  beruf: z.string(),
  kammer: z.string(),
  responsibleName: z.string(),
  responsibleAddress: z.string(),
  responsiblePostalCode: z.string(),
  responsibleCity: z.string(),
});

export type ImpressumFormData = ImpressumContent;

export async function saveImpressum(
  data: ImpressumFormData
): Promise<{ ok: true } | { ok: false; error: string }> {
  const auth = await assertAdminResult();
  if (!auth.ok) return auth;

  const parsed = ImpressumSchema.safeParse(data);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0].message };

  try {
    await writeContentFile("impressum/content.json", JSON.stringify(parsed.data, null, 2));
    auditLog("saveImpressum");
    revalidatePath("/impressum");
    revalidatePath("/admin/impressum");
    return { ok: true };
  } catch (err) {
    console.error("saveImpressum error:", err);
    return { ok: false, error: err instanceof Error ? err.message : "Konnte nicht gespeichert werden." };
  }
}

// ── Datenschutz ────────────────────────────────────────────────────────────────

const DatenschutzSchema = z.object({
  hostingAnbieter: z.string(),
  hostingStandort: z.string(),
  smtpAnbieter: z.string(),
  rezeptUploadAktiv: z.boolean(),
  datenschutzbeauftragterAktiv: z.boolean(),
  datenschutzbeauftragterName: z.string(),
  datenschutzbeauftragterEmail: z.string(),
  letzteAktualisierung: z.string(),
});

export type DatenschutzFormData = DatenschutzContent;

export async function saveDatenschutz(
  data: DatenschutzFormData
): Promise<{ ok: true } | { ok: false; error: string }> {
  const auth = await assertAdminResult();
  if (!auth.ok) return auth;

  const parsed = DatenschutzSchema.safeParse(data);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0].message };

  try {
    await writeContentFile("datenschutz/content.json", JSON.stringify(parsed.data, null, 2));
    auditLog("saveDatenschutz");
    revalidatePath("/datenschutz");
    revalidatePath("/admin/datenschutz");
    return { ok: true };
  } catch (err) {
    console.error("saveDatenschutz error:", err);
    return { ok: false, error: err instanceof Error ? err.message : "Konnte nicht gespeichert werden." };
  }
}

// ── SMTP Settings ──────────────────────────────────────────────────────────────

const SmtpSettingsSchema = z.object({
  host: z.string().min(1, "Host ist erforderlich."),
  port: z.coerce.number().int().positive("Port muss eine positive Zahl sein."),
  user: z.string().min(1, "Benutzer ist erforderlich."),
  pass: z.string().min(1, "Passwort ist erforderlich."),
  from: z.string().min(1, "Absenderadresse ist erforderlich."),
  fallbackTo: z.string().email("Muss eine gültige E-Mail-Adresse sein."),
  secure: z.boolean(),
});

export type SmtpSettingsFormData = z.input<typeof SmtpSettingsSchema>;

export async function saveSmtpSettings(
  data: SmtpSettingsFormData
): Promise<{ ok: true } | { ok: false; error: string }> {
  const auth = await assertAdminResult();
  if (!auth.ok) return auth;

  const parsed = SmtpSettingsSchema.safeParse(data);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0].message };

  try {
    await writeSmtpSettings(parsed.data);
    auditLog("saveSmtpSettings");
    return { ok: true };
  } catch (err) {
    console.error("saveSmtpSettings error:", err);
    return { ok: false, error: err instanceof Error ? err.message : "Konnte nicht gespeichert werden." };
  }
}

export async function sendTestMail(
  to: string
): Promise<{ ok: true } | { ok: false; error: string }> {
  const auth = await assertAdminResult();
  if (!auth.ok) return auth;

  const emailCheck = z.string().email().safeParse(to);
  if (!emailCheck.success) return { ok: false, error: "Ungültige E-Mail-Adresse." };

  try {
    const nodemailer = (await import("nodemailer")).default;
    const stored = await readSmtpSettings();
    const config = resolveSmtpConfig(stored);

    if (!config.host || !config.user || !config.pass) {
      return { ok: false, error: "SMTP-Konfiguration unvollständig. Bitte zuerst speichern." };
    }

    const transporter = nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: config.secure,
      auth: { user: config.user, pass: config.pass },
      requireTLS: config.port === 587,
    });

    await transporter.sendMail({
      from: config.from,
      to,
      subject: "Testmail – Sanitätshaus Mielke",
      text: "Die SMTP-Konfiguration funktioniert korrekt.",
    });

    return { ok: true };
  } catch (err) {
    console.error("sendTestMail error:", err);
    return { ok: false, error: err instanceof Error ? err.message : "Versand fehlgeschlagen." };
  }
}

// ── Jobs ───────────────────────────────────────────────────────────────────────

const JobSchema = z.object({
  id: z.string().min(1),
  active: z.boolean(),
  category: z.string().min(1),
  title: z.string().min(1),
  location: z.string(),
  type: z.string(),
  start: z.string(),
  summary: z.string(),
  tasks: z.array(z.string()).transform(normalizeList),
  requirements: z.array(z.string()).transform(normalizeList),
  offer: z.array(z.string()).transform(normalizeList),
});

export type JobFormData = z.input<typeof JobSchema>;

async function readJobs(): Promise<Job[]> {
  return readContentFile<Job[]>("karriere/jobs.json", []);
}

async function writeJobs(jobs: Job[]): Promise<void> {
  await writeContentFile("karriere/jobs.json", JSON.stringify(jobs, null, 2));
}

export async function toggleJob(
  id: string,
  active: boolean
): Promise<{ ok: true } | { ok: false; error: string }> {
  const auth = await assertAdminResult();
  if (!auth.ok) return auth;

  try {
    const jobs = await readJobs();
    const exists = jobs.some((j) => j.id === id);
    if (!exists) return { ok: false, error: "Stelle nicht gefunden." };

    const next = jobs.map((j) => (j.id === id ? { ...j, active } : j));
    await writeJobs(next);
    auditLog("toggleJob", { id, active });
    revalidatePath("/karriere");
    revalidatePath("/admin/karriere");
    return { ok: true };
  } catch (err) {
    console.error("toggleJob error:", err);
    return { ok: false, error: err instanceof Error ? err.message : "Konnte nicht gespeichert werden." };
  }
}

export async function saveJob(
  id: string,
  data: JobFormData
): Promise<{ ok: true } | { ok: false; error: string }> {
  const auth = await assertAdminResult();
  if (!auth.ok) return auth;

  const parsed = JobSchema.safeParse(data);
  if (!parsed.success) return { ok: false, error: parsed.error.message };

  try {
    const jobs = await readJobs();
    const idx = jobs.findIndex((j) => j.id === id);
    if (idx === -1) return { ok: false, error: "Stelle nicht gefunden." };

    jobs[idx] = parsed.data;
    await writeJobs(jobs);
    auditLog("saveJob", { id });
    revalidatePath("/karriere");
    revalidatePath("/admin/karriere");
    revalidatePath(`/admin/karriere/${id}`);
    return { ok: true };
  } catch (err) {
    console.error("saveJob error:", err);
    return { ok: false, error: err instanceof Error ? err.message : "Datei konnte nicht gespeichert werden." };
  }
}

// ── Locations ──────────────────────────────────────────────────────────────────

const OpeningHourSchema = z.object({
  day: z.string().min(1),
  opens: z.string(),
  closes: z.string(),
  pause: z.object({ from: z.string(), to: z.string() }).optional(),
});

const LocationSchema = z.object({
  name: z.string().min(1),
  phone: z.string(),
  email: z.string().email().or(z.literal("")),
  address: z.string(),
  postalCode: z.string(),
  city: z.string(),
  introText: z.string(),
  heroImage: z.string(),
  lat: z.number(),
  lon: z.number(),
  services: z.array(z.string()).transform(normalizeList),
  accessibility: z.array(z.string()).transform(normalizeList),
  openingHours: z.array(OpeningHourSchema),
  diashowImages: z.array(z.string()).transform(normalizeList),
});

export type LocationFormData = z.input<typeof LocationSchema>;

export async function saveLocation(
  slug: string,
  data: LocationFormData
): Promise<{ ok: true } | { ok: false; error: string }> {
  const auth = await assertAdminResult();
  if (!auth.ok) return auth;

  const parsedSlug = LocationSlugSchema.safeParse(slug);
  if (!parsedSlug.success) return { ok: false, error: "Ungültiger Standort-Slug." };

  const parsed = LocationSchema.safeParse(data);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.message };
  }

  try {
    const safeSlug = parsedSlug.data;
    await writeContentFile(`locations/${safeSlug}.json`, JSON.stringify(parsed.data, null, 2));
    auditLog("saveLocation", { slug: safeSlug });
    revalidatePath("/");
    revalidatePath("/standorte");
    revalidatePath(`/standorte/${safeSlug}`);
    revalidatePath("/kontakt");
    revalidatePath("/admin/standorte");
    revalidatePath(`/admin/standorte/${safeSlug}`);
    revalidatePath("/", "layout");
    return { ok: true };
  } catch (err) {
    console.error("saveLocation error:", err);
    return { ok: false, error: err instanceof Error ? err.message : "Datei konnte nicht gespeichert werden." };
  }
}
