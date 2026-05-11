"use client";

import { useState, useTransition } from "react";
import { saveImpressum, type ImpressumFormData } from "@/lib/admin-actions";

const inputCls =
  "w-full border border-gray-300 bg-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500";

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      {children}
      {hint && <p className="mt-1 text-xs text-gray-500">{hint}</p>}
    </div>
  );
}

function SectionCard({ title, optional, children }: { title: string; optional?: boolean; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
      <div className="flex items-center gap-2">
        <h2 className="font-semibold text-gray-900">{title}</h2>
        {optional && (
          <span className="text-xs bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded font-medium">
            optional
          </span>
        )}
      </div>
      {children}
    </div>
  );
}

export default function ImpressumEditForm({ initialValues }: { initialValues: ImpressumFormData }) {
  const [data, setData] = useState<ImpressumFormData>(initialValues);
  const [status, setStatus] = useState<"idle" | "saved" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [isPending, startTransition] = useTransition();

  function set<K extends keyof ImpressumFormData>(key: K, value: ImpressumFormData[K]) {
    setData((prev) => ({ ...prev, [key]: value }));
    setStatus("idle");
  }

  function handleSave() {
    startTransition(async () => {
      const result = await saveImpressum(data);
      if (result.ok) setStatus("saved");
      else { setStatus("error"); setErrorMsg(result.error); }
    });
  }

  return (
    <div className="space-y-5">

      {/* Unternehmen */}
      <SectionCard title="Unternehmen">
        <Field label="Unternehmensname">
          <input type="text" value={data.companyName}
            onChange={(e) => set("companyName", e.target.value)}
            placeholder="Sanitätshaus Mielke" className={inputCls} />
        </Field>
        <Field label="Rechtsform" hint="z.B. e.K., GmbH, GbR, UG (haftungsbeschränkt)">
          <input type="text" value={data.rechtsform}
            onChange={(e) => set("rechtsform", e.target.value)}
            placeholder="e.K." className={inputCls} />
        </Field>
        <Field label="Inhaber / Geschäftsführer">
          <input type="text" value={data.ownerName}
            onChange={(e) => set("ownerName", e.target.value)}
            placeholder="Carsten Mielke" className={inputCls} />
        </Field>
      </SectionCard>

      {/* Adresse */}
      <SectionCard title="Anschrift">
        <Field label="Straße und Hausnummer">
          <input type="text" value={data.address}
            onChange={(e) => set("address", e.target.value)}
            placeholder="Ermschwerder Straße 23" className={inputCls} />
        </Field>
        <div className="grid grid-cols-3 gap-3">
          <Field label="PLZ">
            <input type="text" value={data.postalCode}
              onChange={(e) => set("postalCode", e.target.value)}
              placeholder="37213" className={inputCls} />
          </Field>
          <div className="col-span-2">
            <Field label="Ort">
              <input type="text" value={data.city}
                onChange={(e) => set("city", e.target.value)}
                placeholder="Witzenhausen" className={inputCls} />
            </Field>
          </div>
        </div>
      </SectionCard>

      {/* Kontakt */}
      <SectionCard title="Kontakt">
        <Field label="Telefon">
          <input type="text" value={data.phone}
            onChange={(e) => set("phone", e.target.value)}
            placeholder="+49 5542 910112" className={inputCls} />
        </Field>
        <Field label="E-Mail">
          <input type="email" value={data.email}
            onChange={(e) => set("email", e.target.value)}
            placeholder="post@ot-mielke.de" className={inputCls} />
        </Field>
        <Field label="Website" hint="Leer lassen, wenn keine separate Domain angegeben werden soll.">
          <input type="text" value={data.website}
            onChange={(e) => set("website", e.target.value)}
            placeholder="www.sanitaetshaus-mielke.de" className={inputCls} />
        </Field>
      </SectionCard>

      {/* Handelsregister */}
      <SectionCard title="Handelsregister" optional>
        <p className="text-xs text-gray-500 -mt-2">Nur ausfüllen, wenn im Handelsregister eingetragen (GmbH, AG etc.).</p>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Amtsgericht">
            <input type="text" value={data.registerGericht}
              onChange={(e) => set("registerGericht", e.target.value)}
              placeholder="Amtsgericht Kassel" className={inputCls} />
          </Field>
          <Field label="Registernummer">
            <input type="text" value={data.registerNummer}
              onChange={(e) => set("registerNummer", e.target.value)}
              placeholder="HRB 12345" className={inputCls} />
          </Field>
        </div>
      </SectionCard>

      {/* Steuer */}
      <SectionCard title="Steuer">
        <Field label="Umsatzsteuer-ID" hint="Leer lassen, wenn keine Umsatzsteuer-ID vorhanden (z.B. Kleinunternehmer).">
          <input type="text" value={data.ustIdNr}
            onChange={(e) => set("ustIdNr", e.target.value)}
            placeholder="DE123456789" className={inputCls} />
        </Field>
      </SectionCard>

      {/* Aufsicht */}
      <SectionCard title="Aufsichtsbehörde" optional>
        <p className="text-xs text-gray-500 -mt-2">Nur bei behördlich überwachten Tätigkeiten (z.B. Apotheken, Medizinprodukte).</p>
        <Field label="Zuständige Aufsichtsbehörde">
          <input type="text" value={data.aufsichtsbehoerde}
            onChange={(e) => set("aufsichtsbehoerde", e.target.value)}
            placeholder="Regierungspräsidium Kassel" className={inputCls} />
        </Field>
      </SectionCard>

      {/* Berufsangaben */}
      <SectionCard title="Berufsangaben">
        <Field label="Berufsbezeichnung">
          <input type="text" value={data.beruf}
            onChange={(e) => set("beruf", e.target.value)}
            placeholder="Orthopädiemechanikermeister" className={inputCls} />
        </Field>
        <Field label="Zuständige Kammer / Verband">
          <input type="text" value={data.kammer}
            onChange={(e) => set("kammer", e.target.value)}
            placeholder="Handwerkskammer Kassel" className={inputCls} />
        </Field>
        <Field label="Berufsordnung" hint="URL oder Bezeichnung. Leer lassen, wenn nicht anwendbar.">
          <input type="text" value={data.berufsordnung}
            onChange={(e) => set("berufsordnung", e.target.value)}
            placeholder="https://www.hwk-kassel.de/..." className={inputCls} />
        </Field>
      </SectionCard>

      {/* Verantwortlicher */}
      <SectionCard title="Verantwortlich für den Inhalt (§ 18 Abs. 2 MStV)">
        <Field label="Name">
          <input type="text" value={data.responsibleName}
            onChange={(e) => set("responsibleName", e.target.value)}
            placeholder="Helmut Mielke" className={inputCls} />
        </Field>
        <Field label="Straße und Hausnummer">
          <input type="text" value={data.responsibleAddress}
            onChange={(e) => set("responsibleAddress", e.target.value)}
            placeholder="Ermschwerder Straße 23" className={inputCls} />
        </Field>
        <div className="grid grid-cols-3 gap-3">
          <Field label="PLZ">
            <input type="text" value={data.responsiblePostalCode}
              onChange={(e) => set("responsiblePostalCode", e.target.value)}
              placeholder="37213" className={inputCls} />
          </Field>
          <div className="col-span-2">
            <Field label="Ort">
              <input type="text" value={data.responsibleCity}
                onChange={(e) => set("responsibleCity", e.target.value)}
                placeholder="Witzenhausen" className={inputCls} />
            </Field>
          </div>
        </div>
      </SectionCard>

      {/* Save */}
      <div className="flex items-center justify-between gap-3">
        <div className="text-sm">
          {status === "saved" && <span className="text-emerald-600 font-medium">Gespeichert.</span>}
          {status === "error" && <span className="text-red-600">{errorMsg}</span>}
        </div>
        <button onClick={handleSave} disabled={isPending}
          className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors">
          {isPending ? "Speichern…" : "Impressum speichern"}
        </button>
      </div>
    </div>
  );
}
