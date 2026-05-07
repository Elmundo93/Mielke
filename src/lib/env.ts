/**
 * Typsichere Prüfung der Pflicht-Umgebungsvariablen beim Server-Start.
 * Import in serverseitigen Modulen, wenn harte Runtime-Prüfung gewünscht ist.
 */
export function assertEnv() {
  const required = ["SMTP_HOST", "SMTP_USER", "SMTP_PASS", "MAIL_FALLBACK_TO"] as const;
  const missing = required.filter((k) => !process.env[k]);
  if (missing.length > 0) {
    throw new Error(`[env] Fehlende Umgebungsvariablen: ${missing.join(", ")}`);
  }
}

export function assertAdminEnv() {
  const required = ["KEYSTATIC_ADMIN_PASSWORD", "KEYSTATIC_SECRET"] as const;
  const missing = required.filter((k) => !process.env[k]);
  if (missing.length > 0) {
    throw new Error(`[admin-env] Fehlende Umgebungsvariablen: ${missing.join(", ")}`);
  }
}
