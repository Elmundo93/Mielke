"use client";

import { useState, useTransition } from "react";
import { saveDatenschutz, type DatenschutzFormData } from "@/lib/admin-actions";

export default function DatenschutzEditForm({
  initialValues,
}: {
  initialValues: DatenschutzFormData;
}) {
  const [data, setData] = useState<DatenschutzFormData>(initialValues);
  const [status, setStatus] = useState<"idle" | "saved" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [isPending, startTransition] = useTransition();

  function setField<K extends keyof DatenschutzFormData>(
    key: K,
    value: DatenschutzFormData[K]
  ) {
    setData((prev) => ({ ...prev, [key]: value }));
    setStatus("idle");
  }

  function handleSave() {
    startTransition(async () => {
      const result = await saveDatenschutz(data);
      if (result.ok) {
        setStatus("saved");
      } else {
        setStatus("error");
        setErrorMsg(result.error);
      }
    });
  }

  return (
    <div className="space-y-6">
      {/* Hosting */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h2 className="font-semibold text-gray-900">Hosting</h2>
        <Field label="Hosting-Anbieter">
          <input
            type="text"
            value={data.hostingAnbieter}
            onChange={(e) => setField("hostingAnbieter", e.target.value)}
            placeholder="z.B. Vercel Inc., Hetzner Online GmbH"
            className={inputCls}
          />
        </Field>
        <Field label="Serverstandort">
          <input
            type="text"
            value={data.hostingStandort}
            onChange={(e) => setField("hostingStandort", e.target.value)}
            placeholder="z.B. Frankfurt am Main (EU)"
            className={inputCls}
          />
        </Field>
      </div>

      {/* E-Mail */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h2 className="font-semibold text-gray-900">E-Mail-Versand</h2>
        <Field label="SMTP-Anbieter">
          <input
            type="text"
            value={data.smtpAnbieter}
            onChange={(e) => setField("smtpAnbieter", e.target.value)}
            placeholder="z.B. IONOS SE, mailbox.org, Microsoft Exchange"
            className={inputCls}
          />
        </Field>
      </div>

      {/* Features */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h2 className="font-semibold text-gray-900">Funktionen</h2>
        <Toggle
          id="rezeptUploadAktiv"
          label="Rezept-Upload aktiv"
          description="Abschnitt zum Dateiupload in der Datenschutzerklärung anzeigen."
          checked={data.rezeptUploadAktiv}
          onChange={(v) => setField("rezeptUploadAktiv", v)}
        />
      </div>

      {/* Datenschutzbeauftragter */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h2 className="font-semibold text-gray-900">Datenschutzbeauftragter</h2>
        <Toggle
          id="datenschutzbeauftragterAktiv"
          label="Datenschutzbeauftragter vorhanden"
          description="Abschnitt zum Datenschutzbeauftragten in der Datenschutzerklärung anzeigen."
          checked={data.datenschutzbeauftragterAktiv}
          onChange={(v) => setField("datenschutzbeauftragterAktiv", v)}
        />
        {data.datenschutzbeauftragterAktiv && (
          <>
            <Field label="Name">
              <input
                type="text"
                value={data.datenschutzbeauftragterName}
                onChange={(e) => setField("datenschutzbeauftragterName", e.target.value)}
                placeholder="Max Mustermann"
                className={inputCls}
              />
            </Field>
            <Field label="E-Mail">
              <input
                type="email"
                value={data.datenschutzbeauftragterEmail}
                onChange={(e) => setField("datenschutzbeauftragterEmail", e.target.value)}
                placeholder="datenschutz@example.de"
                className={inputCls}
              />
            </Field>
          </>
        )}
      </div>

      {/* Stand */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h2 className="font-semibold text-gray-900">Letztes Update</h2>
        <Field label="Stand (Datum)">
          <input
            type="date"
            value={data.letzteAktualisierung}
            onChange={(e) => setField("letzteAktualisierung", e.target.value)}
            className={inputCls + " max-w-xs"}
          />
          <p className="mt-1 text-xs text-gray-500">
            Erscheint als „Stand: …" auf der Datenschutzseite.
          </p>
        </Field>
      </div>

      <div className="flex items-center justify-between gap-3">
        <div className="text-sm">
          {status === "saved" && (
            <span className="text-emerald-600 font-medium">Gespeichert.</span>
          )}
          {status === "error" && <span className="text-red-600">{errorMsg}</span>}
        </div>
        <button
          onClick={handleSave}
          disabled={isPending}
          className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors"
        >
          {isPending ? "Speichern…" : "Datenschutz speichern"}
        </button>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      {children}
    </div>
  );
}

function Toggle({
  id,
  label,
  description,
  checked,
  onChange,
}: {
  id: string;
  label: string;
  description: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-start gap-3">
      <button
        type="button"
        role="switch"
        id={id}
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 ${
          checked ? "bg-emerald-600" : "bg-gray-200"
        }`}
      >
        <span
          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition-transform ${
            checked ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </button>
      <div>
        <label htmlFor={id} className="text-sm font-medium text-gray-900 cursor-pointer">
          {label}
        </label>
        <p className="text-xs text-gray-500 mt-0.5">{description}</p>
      </div>
    </div>
  );
}

const inputCls =
  "w-full border border-gray-300 bg-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500";
