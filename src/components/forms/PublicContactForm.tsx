"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Step = 1 | 2 | 3;

interface FormData {
  anliegen: string;
  anrede: string;
  vorname: string;
  nachname: string;
  telefon: string;
  email: string;
  standort: string;
  nachricht: string;
  datenschutz: boolean;
}

const ANLIEGEN_OPTIONS = [
  {
    id: "termin",
    label: "Terminanfrage",
    desc: "Beratungstermin vereinbaren",
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
      </svg>
    ),
  },
  {
    id: "reparatur",
    label: "Reparatur & Abholung",
    desc: "Reparatur oder Abholung beauftragen",
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z" />
      </svg>
    ),
  },
  {
    id: "allgemein",
    label: "Allgemeine Anfrage",
    desc: "Sonstige Fragen & Anliegen",
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
      </svg>
    ),
  },
];

function FieldLabel({ htmlFor, children, required }: { htmlFor: string; children: React.ReactNode; required?: boolean }) {
  return (
    <label htmlFor={htmlFor} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
      {children}{required && <span className="text-emerald-600 ml-1">*</span>}
    </label>
  );
}

function ProgressBar({ step }: { step: Step }) {
  const labels = ["Anliegen", "Ihre Daten", "Nachricht"];
  return (
    <div className="mb-8">
      <div className="relative h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full mb-6">
        <div className="absolute h-full bg-emerald-600 rounded-full transition-all duration-500" style={{ width: `${((step - 1) / 2) * 100}%` }} />
      </div>
      <div className="flex justify-between">
        {labels.map((label, i) => {
          const n = (i + 1) as Step;
          return (
            <div key={i} className="flex flex-col items-center gap-1.5" style={{ width: "33.33%" }}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${n < step ? "bg-emerald-600 text-white" : n === step ? "bg-emerald-600 text-white ring-4 ring-emerald-100 dark:ring-emerald-900" : "bg-gray-200 dark:bg-gray-700 text-gray-500"}`}>
                {n < step ? <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg> : n}
              </div>
              <span className={`text-xs text-center hidden sm:block ${n === step ? "text-emerald-700 font-medium" : "text-gray-500"}`}>{label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function PublicContactForm() {
  const [step, setStep] = useState<Step>(1);
  const [ok, setOk] = useState<boolean | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const tsRef = useRef(Date.now().toString());

  const [data, setData] = useState<FormData>({
    anliegen: "", anrede: "", vorname: "", nachname: "",
    telefon: "", email: "", standort: "", nachricht: "", datenschutz: false,
  });

  const set = (field: keyof FormData, value: string | boolean) =>
    setData((prev) => ({ ...prev, [field]: value }));

  const canStep1 = data.anliegen !== "";
  const canStep2 = data.vorname.trim().length >= 2 && data.nachname.trim().length >= 2 &&
    (data.email.includes("@") || data.telefon.trim().length >= 6);

  const handleSubmit = async () => {
    if (!data.datenschutz) return;
    setIsSubmitting(true);
    const fd = new globalThis.FormData();
    fd.append("hp", ""); fd.append("ts", tsRef.current);
    fd.append("anliegen", data.anliegen); fd.append("anrede", data.anrede);
    fd.append("vorname", data.vorname); fd.append("nachname", data.nachname);
    fd.append("name", `${data.vorname} ${data.nachname}`);
    fd.append("telefon", data.telefon); fd.append("email", data.email);
    fd.append("standort", data.standort); fd.append("message", data.nachricht);
    try {
      const res = await fetch("/api/kontakt", { method: "POST", body: fd });
      setOk(res.ok);
    } catch { setOk(false); } finally { setIsSubmitting(false); }
  };

  if (ok === true) {
    return (
      <div className="text-center py-16 px-8">
        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
        </div>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Vielen Dank!</h3>
        <p className="text-gray-600 dark:text-gray-300">Wir melden uns so schnell wie möglich bei Ihnen.</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl overflow-hidden">
      <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 px-8 py-6">
        <h2 className="text-2xl font-bold text-white">Kontaktformular</h2>
        <p className="text-emerald-100 mt-1 text-sm">Termin, Reparatur oder allgemeine Anfrage</p>
      </div>

      {/* Hinweis: keine Gesundheitsdaten */}
      <div className="mx-8 mt-6 flex gap-3 p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-xl text-sm text-blue-800 dark:text-blue-200">
        <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        <p>Für <strong>Rezept-Einreichungen</strong> und <strong>Hilfsmittelanfragen</strong> nutzen Sie bitte unsere <a href="/rezept" className="underline font-medium">Rezept-Seite</a> bzw. <a href="/hilfsmittel" className="underline font-medium">Hilfsmittel-Seite</a>. Bitte geben Sie hier keine Diagnosen oder Gesundheitsdaten ein.</p>
      </div>

      <div className="px-8 pt-8 pb-2"><ProgressBar step={step} /></div>

      <div className="px-8 pb-8">
        {step === 1 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Was ist Ihr Anliegen?</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {ANLIEGEN_OPTIONS.map((opt) => (
                <button key={opt.id} type="button" onClick={() => set("anliegen", opt.id)}
                  className={`text-left p-4 rounded-xl border-2 transition-all ${data.anliegen === opt.id ? "border-emerald-600 bg-emerald-50 dark:bg-emerald-900/20" : "border-gray-200 dark:border-gray-700 hover:border-emerald-300"}`}>
                  <div className={`mb-2 ${data.anliegen === opt.id ? "text-emerald-600" : "text-gray-400"}`}>{opt.icon}</div>
                  <div className={`font-semibold text-sm ${data.anliegen === opt.id ? "text-emerald-700" : "text-gray-900 dark:text-white"}`}>{opt.label}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{opt.desc}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Ihre Daten</h3>
            <div className="flex gap-2">
              {["Herr", "Frau", "Divers"].map((a) => (
                <button key={a} type="button" onClick={() => set("anrede", a)}
                  className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all ${data.anrede === a ? "border-emerald-600 bg-emerald-50 text-emerald-700" : "border-gray-300 text-gray-700 hover:border-emerald-400"}`}>{a}</button>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><FieldLabel htmlFor="vorname" required>Vorname</FieldLabel><Input id="vorname" value={data.vorname} onChange={(e) => set("vorname", e.target.value)} placeholder="Max" autoComplete="given-name" /></div>
              <div><FieldLabel htmlFor="nachname" required>Nachname</FieldLabel><Input id="nachname" value={data.nachname} onChange={(e) => set("nachname", e.target.value)} placeholder="Mustermann" autoComplete="family-name" /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><FieldLabel htmlFor="email" required={!data.telefon}>E-Mail {!data.telefon && <span className="text-xs text-gray-400">(oder Tel.)</span>}</FieldLabel><Input id="email" type="email" value={data.email} onChange={(e) => set("email", e.target.value)} placeholder="max@beispiel.de" autoComplete="email" /></div>
              <div><FieldLabel htmlFor="telefon" required={!data.email}>Telefon {!data.email && <span className="text-xs text-gray-400">(oder E-Mail)</span>}</FieldLabel><Input id="telefon" type="tel" value={data.telefon} onChange={(e) => set("telefon", e.target.value)} placeholder="+49 5542 …" autoComplete="tel" /></div>
            </div>
            <div>
              <FieldLabel htmlFor="standort">Gewünschter Standort</FieldLabel>
              <select id="standort" value={data.standort} onChange={(e) => set("standort", e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-white">
                <option value="">Bitte wählen …</option>
                <option value="witzenhausen">Witzenhausen</option>
                <option value="grossalmerode">Großalmerode</option>
                <option value="hessisch-lichtenau">Hessisch Lichtenau</option>
                <option value="kaufungen">Kaufungen</option>
              </select>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-5">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Ihre Nachricht</h3>
            <div>
              <FieldLabel htmlFor="nachricht">Nachricht <span className="text-xs text-gray-400 font-normal">(optional)</span></FieldLabel>
              <textarea id="nachricht" rows={7} value={data.nachricht} onChange={(e) => set("nachricht", e.target.value)}
                placeholder="Beschreiben Sie Ihr Anliegen kurz …"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-800 dark:text-white resize-none" />
            </div>
            <div className="flex gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
              <input id="datenschutz" type="checkbox" checked={data.datenschutz} onChange={(e) => set("datenschutz", e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer" />
              <label htmlFor="datenschutz" className="text-sm text-gray-600 dark:text-gray-400 cursor-pointer">
                Ich habe die <a href="/datenschutz" className="text-emerald-600 hover:underline">Datenschutzerklärung</a> gelesen und stimme der Verarbeitung meiner Daten zur Bearbeitung dieser Anfrage zu. <span className="text-emerald-600">*</span>
              </label>
            </div>
            {ok === false && (
              <div role="alert" className="p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-800">
                Fehler beim Senden. Bitte erneut versuchen oder telefonisch Kontakt aufnehmen.
              </div>
            )}
          </div>
        )}

        <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-100 dark:border-gray-800">
          {step > 1 ? (
            <button type="button" onClick={() => setStep((step - 1) as Step)}
              className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 px-4 py-2 rounded-lg hover:bg-gray-100">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
              Zurück
            </button>
          ) : <div />}

          {step < 3 ? (
            <Button type="button" onClick={() => setStep((step + 1) as Step)}
              disabled={step === 1 ? !canStep1 : !canStep2}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 flex items-center gap-2 disabled:opacity-40">
              Weiter
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </Button>
          ) : (
            <Button type="button" onClick={handleSubmit} disabled={isSubmitting || !data.datenschutz}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-2.5 font-semibold disabled:opacity-40 flex items-center gap-2">
              {isSubmitting ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Wird gesendet …</> : <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" /></svg>
                Absenden
              </>}
            </Button>
          )}
        </div>
      </div>
      <input type="text" name="hp" className="hidden" tabIndex={-1} aria-hidden="true" readOnly value="" />
    </div>
  );
}
