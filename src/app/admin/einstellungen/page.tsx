import Link from "next/link";
import { readSmtpSettings, resolveSmtpConfig } from "@/lib/settings";
import SmtpSettingsForm from "./SmtpSettingsForm";

export default async function EinstellungenPage() {
  const stored = await readSmtpSettings();
  const resolved = resolveSmtpConfig(stored);

  const envOverrides = {
    host: !!process.env.SMTP_HOST,
    port: !!process.env.SMTP_PORT,
    user: !!process.env.SMTP_USER,
    pass: !!process.env.SMTP_PASS,
    from: !!(process.env.SMTP_FROM ?? process.env.MAIL_FROM),
    fallbackTo: !!process.env.MAIL_FALLBACK_TO,
    secure: !!process.env.SMTP_SECURE,
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-xl mx-auto">
        <div className="mb-6 flex items-center gap-3">
          <Link
            href="/admin"
            className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Admin
          </Link>
          <span className="text-gray-300">/</span>
          <span className="text-sm text-gray-700 font-medium">E-Mail-Einstellungen</span>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-1">E-Mail-Einstellungen</h1>
        <p className="text-sm text-gray-500 mb-6">SMTP-Zugangsdaten und Empfängeradresse für das Kontaktformular.</p>

        {Object.values(envOverrides).some(Boolean) && (
          <div className="mb-6 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-sm text-amber-800">
            Einige Felder werden durch Umgebungsvariablen überschrieben und können hier nicht geändert werden.
          </div>
        )}

        <SmtpSettingsForm
          initialValues={{
            host: resolved.host,
            port: resolved.port,
            user: resolved.user,
            pass: "",
            from: resolved.from,
            fallbackTo: resolved.fallbackTo,
            secure: resolved.secure,
          }}
          envOverrides={envOverrides}
          hasStoredPass={!!stored.encryptedPass || !!stored.pass}
        />
      </div>
    </div>
  );
}
