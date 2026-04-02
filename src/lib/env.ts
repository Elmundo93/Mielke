/**
 * Typsichere Prüfung der Pflicht-Umgebungsvariablen beim Server-Start.
 * Import in src/lib/mail.ts oder instrumentation.ts.
 */
export function assertEnv() {
  const required = ["RESEND_API_KEY", "MAIL_FROM", "MAIL_FALLBACK_TO"] as const;
  const missing = required.filter((k) => !process.env[k]);
  if (missing.length > 0) {
    throw new Error(`[env] Fehlende Umgebungsvariablen: ${missing.join(", ")}`);
  }
}
