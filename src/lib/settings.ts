import { readPrivateContentFile, writePrivateContentFile } from "@/lib/storage";

export interface SmtpSettings {
  host?: string;
  port?: number;
  user?: string;
  pass?: string;
  from?: string;
  fallbackTo?: string;
  secure?: boolean;
}

export interface ResolvedSmtpConfig {
  host: string;
  port: number;
  user: string;
  pass: string;
  from: string;
  fallbackTo: string;
  secure: boolean;
}

export async function readSmtpSettings(): Promise<SmtpSettings> {
  return readPrivateContentFile<SmtpSettings>("settings/smtp.json", {});
}

export async function writeSmtpSettings(settings: SmtpSettings): Promise<void> {
  await writePrivateContentFile("settings/smtp.json", JSON.stringify(settings, null, 2));
}

function parseBool(value: string | undefined, fallback: boolean): boolean {
  if (value === undefined) return fallback;
  return ["1", "true", "yes", "on"].includes(value.toLowerCase());
}

export function resolveSmtpConfig(stored: SmtpSettings): ResolvedSmtpConfig {
  const port = Number(process.env.SMTP_PORT ?? stored.port ?? 587);
  return {
    host: process.env.SMTP_HOST ?? stored.host ?? "",
    port,
    user: process.env.SMTP_USER ?? stored.user ?? "",
    pass: process.env.SMTP_PASS ?? stored.pass ?? "",
    from:
      process.env.SMTP_FROM ??
      process.env.MAIL_FROM ??
      stored.from ??
      "Sanitätshaus Mielke <kontakt@sanitaetshaus-mielke.de>",
    fallbackTo:
      process.env.MAIL_FALLBACK_TO ??
      stored.fallbackTo ??
      "info@sanitaetshaus-mielke.de",
    secure: parseBool(process.env.SMTP_SECURE, stored.secure ?? port === 465),
  };
}
