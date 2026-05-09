"use client";

import { useState, useTransition } from "react";
import { saveImpressum, type ImpressumFormData } from "@/lib/admin-actions";

export default function ImpressumEditForm({ initialValues }: { initialValues: ImpressumFormData }) {
  const [data, setData] = useState<ImpressumFormData>(initialValues);
  const [status, setStatus] = useState<"idle" | "saved" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [isPending, startTransition] = useTransition();

  function setField<K extends keyof ImpressumFormData>(key: K, value: ImpressumFormData[K]) {
    setData((prev) => ({ ...prev, [key]: value }));
    setStatus("idle");
  }

  function handleSave() {
    startTransition(async () => {
      const result = await saveImpressum(data);
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
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h2 className="font-semibold text-gray-900">Angaben gemäß § 5 TMG</h2>
        <Field label="Unternehmensname">
          <input
            type="text"
            value={data.companyName}
            onChange={(e) => setField("companyName", e.target.value)}
            placeholder="Sanitätshaus Mielke"
            className={inputCls}
          />
        </Field>
        <Field label="Inhaber / Geschäftsführer">
          <input
            type="text"
            value={data.ownerName}
            onChange={(e) => setField("ownerName", e.target.value)}
            placeholder="Helmut Mielke"
            className={inputCls}
          />
        </Field>
        <Field label="Straße und Hausnummer">
          <input
            type="text"
            value={data.address}
            onChange={(e) => setField("address", e.target.value)}
            placeholder="Ermschwerder Straße 23"
            className={inputCls}
          />
        </Field>
        <div className="grid grid-cols-3 gap-3">
          <Field label="PLZ">
            <input
              type="text"
              value={data.postalCode}
              onChange={(e) => setField("postalCode", e.target.value)}
              placeholder="37213"
              className={inputCls}
            />
          </Field>
          <div className="col-span-2">
            <Field label="Ort">
              <input
                type="text"
                value={data.city}
                onChange={(e) => setField("city", e.target.value)}
                placeholder="Witzenhausen"
                className={inputCls}
              />
            </Field>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h2 className="font-semibold text-gray-900">Kontakt</h2>
        <Field label="Telefon">
          <input
            type="text"
            value={data.phone}
            onChange={(e) => setField("phone", e.target.value)}
            placeholder="+49 5542 910112"
            className={inputCls}
          />
        </Field>
        <Field label="E-Mail">
          <input
            type="email"
            value={data.email}
            onChange={(e) => setField("email", e.target.value)}
            placeholder="post@ot-mielke.de"
            className={inputCls}
          />
        </Field>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h2 className="font-semibold text-gray-900">Steuer</h2>
        <Field label="Umsatzsteuer-ID (USt-IdNr.)">
          <input
            type="text"
            value={data.ustIdNr}
            onChange={(e) => setField("ustIdNr", e.target.value)}
            placeholder="DE123456789"
            className={inputCls}
          />
          <p className="mt-1 text-xs text-gray-500">
            Leer lassen, wenn keine Umsatzsteuer-ID vorhanden.
          </p>
        </Field>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h2 className="font-semibold text-gray-900">Berufsbezeichnung</h2>
        <Field label="Berufsbezeichnung">
          <input
            type="text"
            value={data.beruf}
            onChange={(e) => setField("beruf", e.target.value)}
            placeholder="Orthopädiemechanikermeister"
            className={inputCls}
          />
        </Field>
        <Field label="Zuständige Kammer">
          <input
            type="text"
            value={data.kammer}
            onChange={(e) => setField("kammer", e.target.value)}
            placeholder="Handwerkskammer Kassel"
            className={inputCls}
          />
        </Field>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h2 className="font-semibold text-gray-900">Verantwortlich für den Inhalt (§ 18 Abs. 2 MStV)</h2>
        <Field label="Name">
          <input
            type="text"
            value={data.responsibleName}
            onChange={(e) => setField("responsibleName", e.target.value)}
            placeholder="Helmut Mielke"
            className={inputCls}
          />
        </Field>
        <Field label="Straße und Hausnummer">
          <input
            type="text"
            value={data.responsibleAddress}
            onChange={(e) => setField("responsibleAddress", e.target.value)}
            placeholder="Ermschwerder Straße 23"
            className={inputCls}
          />
        </Field>
        <div className="grid grid-cols-3 gap-3">
          <Field label="PLZ">
            <input
              type="text"
              value={data.responsiblePostalCode}
              onChange={(e) => setField("responsiblePostalCode", e.target.value)}
              placeholder="37213"
              className={inputCls}
            />
          </Field>
          <div className="col-span-2">
            <Field label="Ort">
              <input
                type="text"
                value={data.responsibleCity}
                onChange={(e) => setField("responsibleCity", e.target.value)}
                placeholder="Witzenhausen"
                className={inputCls}
              />
            </Field>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3">
        <div className="text-sm">
          {status === "saved" && (
            <span className="text-emerald-600 font-medium">Gespeichert.</span>
          )}
          {status === "error" && (
            <span className="text-red-600">{errorMsg}</span>
          )}
        </div>
        <button
          onClick={handleSave}
          disabled={isPending}
          className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors"
        >
          {isPending ? "Speichern…" : "Impressum speichern"}
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

const inputCls =
  "w-full border border-gray-300 bg-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500";
