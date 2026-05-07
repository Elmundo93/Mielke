"use client";

import { useState, useTransition } from "react";
import { saveSmtpSettings, sendTestMail, type SmtpSettingsFormData } from "@/lib/admin-actions";

type EnvOverrides = {
  host: boolean;
  port: boolean;
  user: boolean;
  pass: boolean;
  from: boolean;
  fallbackTo: boolean;
  secure: boolean;
};

export default function SmtpSettingsForm({
  initialValues,
  envOverrides,
}: {
  initialValues: SmtpSettingsFormData;
  envOverrides: EnvOverrides;
}) {
  const [data, setData] = useState<SmtpSettingsFormData>(initialValues);
  const [showPass, setShowPass] = useState(false);
  const [testEmail, setTestEmail] = useState("");
  const [saveStatus, setSaveStatus] = useState<"idle" | "saved" | "error">("idle");
  const [testStatus, setTestStatus] = useState<"idle" | "sent" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [testErrorMsg, setTestErrorMsg] = useState("");
  const [isSaving, startSaveTransition] = useTransition();
  const [isTesting, startTestTransition] = useTransition();

  function setField<K extends keyof SmtpSettingsFormData>(key: K, value: SmtpSettingsFormData[K]) {
    setData((prev) => ({ ...prev, [key]: value }));
    setSaveStatus("idle");
  }

  function handleSave() {
    startSaveTransition(async () => {
      const result = await saveSmtpSettings(data);
      if (result.ok) {
        setSaveStatus("saved");
      } else {
        setSaveStatus("error");
        setErrorMsg(result.error);
      }
    });
  }

  function handleTest() {
    startTestTransition(async () => {
      setTestStatus("idle");
      const result = await sendTestMail(testEmail);
      if (result.ok) {
        setTestStatus("sent");
      } else {
        setTestStatus("error");
        setTestErrorMsg(result.error);
      }
    });
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h2 className="font-semibold text-gray-900">Server-Verbindung</h2>

        <div className="grid grid-cols-3 gap-3">
          <div className="col-span-2">
            <Field label="SMTP-Host" locked={envOverrides.host}>
              <input
                type="text"
                value={data.host}
                onChange={(e) => setField("host", e.target.value)}
                disabled={envOverrides.host}
                placeholder="mail.example.com"
                className={inputCls(envOverrides.host)}
              />
            </Field>
          </div>
          <div>
            <Field label="Port" locked={envOverrides.port}>
              <input
                type="number"
                value={data.port as number}
                onChange={(e) => setField("port", Number(e.target.value))}
                disabled={envOverrides.port}
                placeholder="587"
                className={inputCls(envOverrides.port)}
              />
            </Field>
          </div>
        </div>

        <Field label="Verschlüsselung" locked={envOverrides.secure}>
          <div className="flex gap-4 mt-1">
            {[
              { label: "STARTTLS (Port 587)", value: false },
              { label: "SSL/TLS (Port 465)", value: true },
            ].map(({ label, value }) => (
              <label key={label} className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="radio"
                  checked={data.secure === value}
                  onChange={() => setField("secure", value)}
                  disabled={envOverrides.secure}
                  className="accent-emerald-600"
                />
                {label}
              </label>
            ))}
          </div>
        </Field>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h2 className="font-semibold text-gray-900">Zugangsdaten</h2>

        <Field label="Benutzername / E-Mail" locked={envOverrides.user}>
          <input
            type="text"
            value={data.user}
            onChange={(e) => setField("user", e.target.value)}
            disabled={envOverrides.user}
            placeholder="kontakt@sanitaetshaus-mielke.de"
            className={inputCls(envOverrides.user)}
          />
        </Field>

        <Field label="Passwort" locked={envOverrides.pass}>
          <div className="relative">
            <input
              type={showPass ? "text" : "password"}
              value={data.pass}
              onChange={(e) => setField("pass", e.target.value)}
              disabled={envOverrides.pass}
              placeholder="••••••••"
              className={inputCls(envOverrides.pass) + " pr-10"}
            />
            {!envOverrides.pass && (
              <button
                type="button"
                onClick={() => setShowPass((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                tabIndex={-1}
              >
                {showPass ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            )}
          </div>
        </Field>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h2 className="font-semibold text-gray-900">Absender</h2>

        <Field label="Absender-Adresse (From)" locked={envOverrides.from}>
          <input
            type="text"
            value={data.from}
            onChange={(e) => setField("from", e.target.value)}
            disabled={envOverrides.from}
            placeholder="Sanitätshaus Mielke <kontakt@sanitaetshaus-mielke.de>"
            className={inputCls(envOverrides.from)}
          />
        </Field>

        <Field label="Empfängeradresse für Kontaktanfragen" locked={envOverrides.fallbackTo}>
          <input
            type="email"
            value={data.fallbackTo}
            onChange={(e) => setField("fallbackTo", e.target.value)}
            disabled={envOverrides.fallbackTo}
            placeholder="info@sanitaetshaus-mielke.de"
            className={inputCls(envOverrides.fallbackTo)}
          />
          <p className="mt-1 text-xs text-gray-500">An diese Adresse werden alle eingehenden Kontaktformular-Anfragen weitergeleitet.</p>
        </Field>
      </div>

      <div className="flex items-center justify-between gap-3">
        <div className="text-sm">
          {saveStatus === "saved" && (
            <span className="text-emerald-600 font-medium">Gespeichert.</span>
          )}
          {saveStatus === "error" && (
            <span className="text-red-600">{errorMsg}</span>
          )}
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors"
        >
          {isSaving ? "Speichern…" : "Einstellungen speichern"}
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="font-semibold text-gray-900 mb-3">Verbindung testen</h2>
        <p className="text-sm text-gray-500 mb-4">
          Sendet eine Testmail mit den aktuell gespeicherten Einstellungen.
        </p>
        <div className="flex gap-2">
          <input
            type="email"
            value={testEmail}
            onChange={(e) => { setTestEmail(e.target.value); setTestStatus("idle"); }}
            placeholder="test@example.com"
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <button
            onClick={handleTest}
            disabled={isTesting || !testEmail}
            className="px-4 py-2 bg-gray-800 hover:bg-gray-900 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors whitespace-nowrap"
          >
            {isTesting ? "Senden…" : "Testmail senden"}
          </button>
        </div>
        {testStatus === "sent" && (
          <p className="mt-2 text-sm text-emerald-600 font-medium">Testmail erfolgreich gesendet.</p>
        )}
        {testStatus === "error" && (
          <p className="mt-2 text-sm text-red-600">{testErrorMsg}</p>
        )}
      </div>
    </div>
  );
}

function Field({
  label,
  locked,
  children,
}: {
  label: string;
  locked: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-center gap-1.5 mb-1">
        <label className="text-sm font-medium text-gray-700">{label}</label>
        {locked && (
          <span className="text-xs bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded font-medium">
            Env
          </span>
        )}
      </div>
      {children}
    </div>
  );
}

function inputCls(locked: boolean) {
  return [
    "w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500",
    locked
      ? "border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed"
      : "border-gray-300 bg-white",
  ].join(" ");
}
