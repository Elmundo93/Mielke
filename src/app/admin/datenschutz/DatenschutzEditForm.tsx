"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { saveDatenschutz, type DatenschutzFormData } from "@/lib/admin-actions";
import type { DatenschutzContent, ImpressumContent } from "@/lib/content";

const inputCls =
  "w-full border border-gray-300 bg-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500";

type Sections = DatenschutzContent["sections"];
type SectionKey = keyof Sections;

function ToggleSwitch({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button type="button" role="switch" aria-checked={checked} onClick={() => onChange(!checked)}
      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 ${checked ? "bg-emerald-600" : "bg-gray-200"}`}>
      <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${checked ? "translate-x-4" : "translate-x-0"}`} />
    </button>
  );
}

function SectionCard({
  title, description, enabled, onToggle, warn, children,
}: {
  title: string;
  description: string;
  enabled: boolean;
  onToggle: (v: boolean) => void;
  warn?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className={`rounded-xl border-2 transition-colors ${enabled ? "border-emerald-200 bg-white" : "border-gray-100 bg-gray-50"}`}>
      <div className="flex items-start gap-3 p-4 cursor-pointer" onClick={() => onToggle(!enabled)}>
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-semibold ${enabled ? "text-gray-900" : "text-gray-500"}`}>{title}</p>
          <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">{description}</p>
        </div>
        <div className="shrink-0 mt-0.5" onClick={(e) => e.stopPropagation()}>
          <ToggleSwitch checked={enabled} onChange={onToggle} />
        </div>
      </div>
      {!enabled && warn && (
        <div className="mx-4 mb-4 flex gap-2 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
          <span>⚠</span> {warn}
        </div>
      )}
      {enabled && children && (
        <div className="border-t border-emerald-100 px-4 pb-4 pt-3 space-y-3">
          {children}
        </div>
      )}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
      {children}
    </div>
  );
}

export default function DatenschutzEditForm({
  initialValues,
  impressum,
}: {
  initialValues: DatenschutzFormData;
  impressum: ImpressumContent;
}) {
  const [data, setData] = useState<DatenschutzFormData>(initialValues);
  const [status, setStatus] = useState<"idle" | "saved" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [isPending, startTransition] = useTransition();

  function setSection<K extends SectionKey>(key: K, patch: Partial<Sections[K]>) {
    setData((prev) => ({
      ...prev,
      sections: {
        ...prev.sections,
        [key]: { ...prev.sections[key], ...patch },
      },
    }));
    setStatus("idle");
  }

  function setDsb(patch: Partial<DatenschutzContent["datenschutzbeauftragter"]>) {
    setData((prev) => ({
      ...prev,
      datenschutzbeauftragter: { ...prev.datenschutzbeauftragter, ...patch },
    }));
    setStatus("idle");
  }

  function toggleSection(key: SectionKey, enabled: boolean) {
    setSection(key, { enabled } as Partial<Sections[SectionKey]>);
  }

  function handleSave() {
    startTransition(async () => {
      const result = await saveDatenschutz(data);
      if (result.ok) setStatus("saved");
      else { setStatus("error"); setErrorMsg(result.error); }
    });
  }

  const s = data.sections;

  const verantwortlicher = [impressum.companyName, impressum.rechtsform].filter(Boolean).join(" ");
  const adresse = [impressum.address, `${impressum.postalCode} ${impressum.city}`.trim()].filter(Boolean).join(", ");

  return (
    <div className="space-y-6">

      {/* Verantwortlicher — aus dem Impressum */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-gray-900">Verantwortlicher (DSGVO)</p>
            <p className="text-xs text-gray-500 mt-0.5">
              Diese Angaben stammen aus dem Impressum und erscheinen im ersten Abschnitt der Datenschutzerklärung.
            </p>
          </div>
          <Link
            href="/admin/impressum"
            className="shrink-0 text-xs font-medium text-emerald-600 hover:text-emerald-700 border border-emerald-200 hover:border-emerald-400 rounded-lg px-3 py-1.5 transition-colors"
          >
            Im Impressum bearbeiten →
          </Link>
        </div>
        <div className="border-t border-gray-100 pt-3 grid grid-cols-1 gap-1.5 text-sm">
          {verantwortlicher && (
            <div className="flex gap-2">
              <span className="w-28 shrink-0 text-xs text-gray-400">Unternehmen</span>
              <span className="text-gray-700 font-medium">{verantwortlicher}</span>
            </div>
          )}
          {impressum.ownerName && (
            <div className="flex gap-2">
              <span className="w-28 shrink-0 text-xs text-gray-400">Inhaber</span>
              <span className="text-gray-700">{impressum.ownerName}</span>
            </div>
          )}
          {adresse && (
            <div className="flex gap-2">
              <span className="w-28 shrink-0 text-xs text-gray-400">Adresse</span>
              <span className="text-gray-700">{adresse}</span>
            </div>
          )}
          {impressum.phone && (
            <div className="flex gap-2">
              <span className="w-28 shrink-0 text-xs text-gray-400">Telefon</span>
              <span className="text-gray-700">{impressum.phone}</span>
            </div>
          )}
          {impressum.email && (
            <div className="flex gap-2">
              <span className="w-28 shrink-0 text-xs text-gray-400">E-Mail</span>
              <span className="text-gray-700">{impressum.email}</span>
            </div>
          )}
          {!verantwortlicher && !impressum.ownerName && !adresse && !impressum.phone && !impressum.email && (
            <p className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
              ⚠ Noch keine Impressum-Daten hinterlegt. Bitte zuerst das Impressum ausfüllen.
            </p>
          )}
        </div>
      </div>

      {/* Modular sections */}
      <div>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Abschnitte der Datenschutzerklärung</p>
        <div className="space-y-2">

          <SectionCard
            title="Hosting"
            description="Welcher Anbieter hostet die Website und wo stehen die Server?"
            enabled={s.hosting.enabled}
            onToggle={(v) => toggleSection("hosting", v)}>
            <Field label="Hosting-Anbieter">
              <input type="text" value={s.hosting.anbieter}
                onChange={(e) => setSection("hosting", { anbieter: e.target.value })}
                placeholder="Vercel Inc." className={inputCls} />
            </Field>
            <Field label="Serverstandort">
              <input type="text" value={s.hosting.standort}
                onChange={(e) => setSection("hosting", { standort: e.target.value })}
                placeholder="Frankfurt am Main (EU)" className={inputCls} />
            </Field>
          </SectionCard>

          <SectionCard
            title="Kontaktformular"
            description="Verarbeitung von Name, Kontaktdaten und Nachrichten aus dem Kontaktformular."
            enabled={s.kontaktformular.enabled}
            onToggle={(v) => toggleSection("kontaktformular", v)}
            warn="Dieser Abschnitt ist für Websites mit Kontaktformular gesetzlich erforderlich." />

          <SectionCard
            title="Gesundheitsdaten (Art. 9 DSGVO)"
            description="Einwilligungs- und Verarbeitungshinweis für Rezept- und Hilfsmittelanfragen."
            enabled={s.gesundheitsdaten.enabled}
            onToggle={(v) => toggleSection("gesundheitsdaten", v)}
            warn="Aktivieren, wenn Rezept- oder Hilfsmittelformulare angeboten werden." />

          <SectionCard
            title="Dateiupload / Rezeptservice"
            description="Hinweis, dass hochgeladene Dateien per E-Mail weitergeleitet und nicht dauerhaft gespeichert werden."
            enabled={s.dateiupload.enabled}
            onToggle={(v) => toggleSection("dateiupload", v)} />

          <SectionCard
            title="E-Mail-Versand"
            description="Welcher SMTP-Anbieter wird für ausgehende E-Mails genutzt?"
            enabled={s.smtp.enabled}
            onToggle={(v) => toggleSection("smtp", v)}>
            <Field label="SMTP-Anbieter">
              <input type="text" value={s.smtp.anbieter}
                onChange={(e) => setSection("smtp", { anbieter: e.target.value })}
                placeholder="IONOS SE, mailbox.org, Microsoft Exchange …" className={inputCls} />
            </Field>
          </SectionCard>

          <SectionCard
            title="Server-Logs"
            description="Protokollierung von IP-Adressen und Zugriffen durch den Hosting-Anbieter."
            enabled={s.logs.enabled}
            onToggle={(v) => toggleSection("logs", v)} />

          <SectionCard
            title="Cookies"
            description="Nur aktivieren, wenn die Website eigene Cookies (außer technisch notwendigen) setzt."
            enabled={s.cookies.enabled}
            onToggle={(v) => toggleSection("cookies", v)}>
            <Field label="Beschreibung (optional)">
              <textarea rows={3} value={s.cookies.details}
                onChange={(e) => setSection("cookies", { details: e.target.value })}
                placeholder="Beschreibung der genutzten Cookies …"
                className={inputCls + " resize-none"} />
            </Field>
          </SectionCard>

          <SectionCard
            title="Kartendienste"
            description="Einbindung von Karten (OpenStreetMap, Google Maps etc.) und damit verbundene Datenübertragung."
            enabled={s.karten.enabled}
            onToggle={(v) => toggleSection("karten", v)}>
            <Field label="Kartendienst">
              <input type="text" value={s.karten.anbieter}
                onChange={(e) => setSection("karten", { anbieter: e.target.value })}
                placeholder="OpenStreetMap" className={inputCls} />
            </Field>
          </SectionCard>

          <SectionCard
            title="Betroffenenrechte"
            description="DSGVO-Rechte der Nutzer: Auskunft, Löschung, Widerruf, Beschwerde."
            enabled={s.betroffenenrechte.enabled}
            onToggle={(v) => toggleSection("betroffenenrechte", v)}
            warn="Empfohlen: Dieser Abschnitt ist gesetzlich vorgeschrieben." />

          <SectionCard
            title="Keine Datenweitergabe an Dritte"
            description="Klarstellung, dass Daten nicht an unbeteiligte Dritte verkauft oder weitergegeben werden."
            enabled={s.weitergabe.enabled}
            onToggle={(v) => toggleSection("weitergabe", v)} />

          <SectionCard
            title="Kein Tracking / keine Analyse"
            description="Bestätigung, dass keine Analytics-Dienste (Google Analytics, Meta-Pixel etc.) eingesetzt werden."
            enabled={s.tracking.enabled}
            onToggle={(v) => toggleSection("tracking", v)} />

        </div>
      </div>

      {/* Datenschutzbeauftragter */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-gray-900">Datenschutzbeauftragter</p>
            <p className="text-xs text-gray-500 mt-0.5">Nur relevant, wenn ein externer oder interner DSB bestellt wurde.</p>
          </div>
          <ToggleSwitch
            checked={data.datenschutzbeauftragter.aktiv}
            onChange={(v) => setDsb({ aktiv: v })} />
        </div>
        {data.datenschutzbeauftragter.aktiv && (
          <div className="space-y-3 pt-1 border-t border-gray-100">
            <Field label="Name">
              <input type="text" value={data.datenschutzbeauftragter.name}
                onChange={(e) => setDsb({ name: e.target.value })}
                placeholder="Max Mustermann" className={inputCls} />
            </Field>
            <Field label="E-Mail">
              <input type="email" value={data.datenschutzbeauftragter.email}
                onChange={(e) => setDsb({ email: e.target.value })}
                placeholder="datenschutz@example.de" className={inputCls} />
            </Field>
          </div>
        )}
      </div>

      {/* Stand */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <label className="block text-sm font-semibold text-gray-900 mb-1">Stand (Datum)</label>
        <input type="date" value={data.letzteAktualisierung}
          onChange={(e) => { setData((p) => ({ ...p, letzteAktualisierung: e.target.value })); setStatus("idle"); }}
          className={inputCls + " max-w-xs"} />
        <p className="mt-1 text-xs text-gray-500">
          Erscheint als &bdquo;Stand: …&ldquo; auf der Datenschutzseite.
        </p>
      </div>

      {/* Save */}
      <div className="flex items-center justify-between gap-3">
        <div className="text-sm">
          {status === "saved" && <span className="text-emerald-600 font-medium">Gespeichert.</span>}
          {status === "error" && <span className="text-red-600">{errorMsg}</span>}
        </div>
        <button onClick={handleSave} disabled={isPending}
          className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors">
          {isPending ? "Speichern…" : "Datenschutz speichern"}
        </button>
      </div>
    </div>
  );
}
