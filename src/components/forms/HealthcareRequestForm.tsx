"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Step = 1 | 2 | 3;

interface FormData {
  anrede: string;
  vorname: string;
  nachname: string;
  telefon: string;
  email: string;
  standort: string;
  message: string;
  gesundheitsdatenConsent: boolean;
  datenschutz: boolean;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const MAX_FILES = 5;
const ALLOWED_TYPES = ["application/pdf", "image/jpeg", "image/png", "image/webp"];
const ALLOWED_EXTENSIONS = ".pdf,.jpg,.jpeg,.png,.webp";

function FieldLabel({ htmlFor, children, required }: { htmlFor: string; children: React.ReactNode; required?: boolean }) {
  return (
    <label htmlFor={htmlFor} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
      {children}{required && <span className="text-emerald-600 ml-1">*</span>}
    </label>
  );
}

function ProgressBar({ step }: { step: Step }) {
  const labels = ["Einwilligung", "Ihre Daten", "Unterlagen"];
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

interface Props {
  type: "rezept" | "hilfsmittel";
}

export function HealthcareRequestForm({ type }: Props) {
  const [step, setStep] = useState<Step>(1);
  const [ok, setOk] = useState<boolean | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [fileError, setFileError] = useState<string | null>(null);
  const tsRef = useRef(Date.now().toString());

  const [data, setData] = useState<FormData>({
    anrede: "", vorname: "", nachname: "",
    telefon: "", email: "", standort: "", message: "",
    gesundheitsdatenConsent: false, datenschutz: false,
  });

  const set = (field: keyof FormData, value: string | boolean) =>
    setData((prev) => ({ ...prev, [field]: value }));

  const canStep1 = data.gesundheitsdatenConsent;
  const canStep2 = data.vorname.trim().length >= 2 && data.nachname.trim().length >= 2 &&
    (data.email.includes("@") || data.telefon.trim().length >= 6);
  const canSubmit = data.datenschutz && fileError === null;

  const handleFiles = (incoming: FileList | null) => {
    if (!incoming) return;
    const next = [...files];
    let err: string | null = null;
    for (const f of Array.from(incoming)) {
      if (next.length >= MAX_FILES) { err = `Maximal ${MAX_FILES} Dateien erlaubt.`; break; }
      if (f.size > MAX_FILE_SIZE) { err = `"${f.name}" überschreitet 5 MB.`; break; }
      if (!ALLOWED_TYPES.includes(f.type)) { err = `Dateityp nicht erlaubt: ${f.type || "unbekannt"}`; break; }
      next.push(f);
    }
    setFileError(err);
    if (!err) setFiles(next);
  };

  const removeFile = (i: number) => {
    setFiles((prev) => prev.filter((_, idx) => idx !== i));
    setFileError(null);
  };

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setIsSubmitting(true);
    const fd = new globalThis.FormData();
    fd.append("hp", ""); fd.append("ts", tsRef.current);
    fd.append("type", type);
    fd.append("gesundheitsdatenConsent", "true");
    fd.append("anrede", data.anrede);
    fd.append("vorname", data.vorname); fd.append("nachname", data.nachname);
    fd.append("telefon", data.telefon); fd.append("email", data.email);
    fd.append("standort", data.standort); fd.append("message", data.message);
    for (const f of files) fd.append("dokument", f);
    try {
      const res = await fetch("/api/healthcare", { method: "POST", body: fd });
      setOk(res.ok);
    } catch { setOk(false); } finally { setIsSubmitting(false); }
  };

  const title = type === "rezept" ? "Rezept einreichen" : "Hilfsmittelanfrage";
  const subtitle = type === "rezept"
    ? "Kassenrezept, Privatrezept oder Verordnung"
    : "Hilfsmittelversorgung & Beratung";

  if (ok === true) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 px-8 py-6">
          <h2 className="text-2xl font-bold text-white">{title}</h2>
        </div>
        <div className="px-8 py-12 text-center">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Vielen Dank!</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            {type === "rezept"
              ? "Ihr Rezept ist bei uns eingegangen. Wir melden uns zeitnah bei Ihnen."
              : "Ihre Hilfsmittelanfrage ist eingegangen. Wir melden uns zeitnah bei Ihnen."}
          </p>
          <div className="flex gap-3 p-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-xl text-sm text-amber-800 dark:text-amber-200 text-left">
            <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg>
            <p>Bitte senden Sie <strong>keine weiteren Gesundheitsdaten per E-Mail</strong> an uns. Bei dringenden Anliegen erreichen Sie uns telefonisch unter <strong>+49 5542 910112</strong>.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl overflow-hidden">
      <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 px-8 py-6">
        <h2 className="text-2xl font-bold text-white">{title}</h2>
        <p className="text-emerald-100 mt-1 text-sm">{subtitle}</p>
      </div>

      <div className="px-8 pt-8 pb-2"><ProgressBar step={step} /></div>

      <div className="px-8 pb-8">

        {/* Step 1: Art. 9 DSGVO consent */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="flex gap-3 p-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-xl text-sm text-amber-800 dark:text-amber-200">
              <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg>
              <div>
                <strong className="block mb-1">Verarbeitung von Gesundheitsdaten</strong>
                Zur Bearbeitung {type === "rezept" ? "Ihrer Rezept-Einreichung" : "Ihrer Hilfsmittelanfrage"} verarbeiten wir Ihre Angaben gemäß Art. 9 Abs. 2 lit. a DSGVO. Diese Daten werden ausschließlich für die Bearbeitung Ihres Anliegens verwendet, nicht an Dritte weitergegeben und nach Abschluss gelöscht.
              </div>
            </div>

            <div className="p-5 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
              <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-3">Welche Daten werden verarbeitet?</h3>
              <ul className="space-y-1.5 text-sm text-gray-600 dark:text-gray-400">
                <li className="flex items-start gap-2"><svg className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>Name und Kontaktdaten (E-Mail / Telefon)</li>
                {type === "rezept" && <li className="flex items-start gap-2"><svg className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>Hochgeladene Rezepte / Verordnungen</li>}
                <li className="flex items-start gap-2"><svg className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>Ihre Nachricht und Beschreibung des Anliegens</li>
              </ul>
              <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
                Weitere Informationen finden Sie in unserer <a href="/datenschutz" className="text-emerald-600 hover:underline">Datenschutzerklärung</a>.
              </p>
            </div>

            <div className="flex gap-3 p-4 bg-white dark:bg-gray-900 rounded-xl border-2 border-gray-200 dark:border-gray-700 cursor-pointer hover:border-emerald-400 transition-colors"
              onClick={() => set("gesundheitsdatenConsent", !data.gesundheitsdatenConsent)}>
              <input id="gesundheitsdatenConsent" type="checkbox" checked={data.gesundheitsdatenConsent}
                onChange={(e) => set("gesundheitsdatenConsent", e.target.checked)}
                className="mt-0.5 h-5 w-5 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer shrink-0"
                onClick={(e) => e.stopPropagation()} />
              <label htmlFor="gesundheitsdatenConsent" className="text-sm text-gray-700 dark:text-gray-300 cursor-pointer leading-relaxed">
                <strong>Ich willige ausdrücklich ein</strong>, dass Sanitätshaus Mielke meine oben genannten Angaben einschließlich etwaiger Gesundheitsdaten zum Zweck der Bearbeitung {type === "rezept" ? "meiner Rezept-Einreichung" : "meiner Hilfsmittelanfrage"} gemäß Art. 9 Abs. 2 lit. a DSGVO verarbeitet. Diese Einwilligung kann ich jederzeit widerrufen. <span className="text-emerald-600">*</span>
              </label>
            </div>
          </div>
        )}

        {/* Step 2: Contact data */}
        {step === 2 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Ihre Kontaktdaten</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 -mt-1">Wir benötigen nur Ihren Namen und eine Kontaktmöglichkeit.</p>
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

        {/* Step 3: Type-specific */}
        {step === 3 && (
          <div className="space-y-5">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
              {type === "rezept" ? "Rezept hochladen" : "Anliegen beschreiben"}
            </h3>

            {type === "rezept" && (
              <div>
                <FieldLabel htmlFor="fileInput">
                  Rezept / Verordnung <span className="text-xs text-gray-400 font-normal">(optional, max. {MAX_FILES} Dateien, je 5 MB)</span>
                </FieldLabel>
                <label htmlFor="fileInput"
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl cursor-pointer hover:border-emerald-400 hover:bg-emerald-50/50 dark:hover:bg-emerald-900/10 transition-all">
                  <svg className="w-8 h-8 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" /></svg>
                  <span className="text-sm text-gray-500">Dateien auswählen oder hierher ziehen</span>
                  <span className="text-xs text-gray-400 mt-1">PDF, JPG, PNG, WebP</span>
                  <input id="fileInput" type="file" className="hidden" multiple accept={ALLOWED_EXTENSIONS}
                    onChange={(e) => handleFiles(e.target.files)} />
                </label>
                <p className="mt-2 text-xs text-gray-400 flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                  Erlaubt: PDF, JPG, PNG, WebP · max. 5 MB · wird nicht dauerhaft gespeichert
                </p>
                {fileError && (
                  <p role="alert" className="mt-2 text-sm text-red-600">{fileError}</p>
                )}
                {files.length > 0 && (
                  <ul className="mt-3 space-y-2">
                    {files.map((f, i) => (
                      <li key={i} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg text-sm">
                        <svg className="w-5 h-5 text-emerald-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>
                        <span className="flex-1 truncate text-gray-700 dark:text-gray-300">{f.name}</span>
                        <span className="text-gray-400 text-xs shrink-0">{(f.size / 1024 / 1024).toFixed(2)} MB</span>
                        <button type="button" onClick={() => removeFile(i)}
                          className="text-gray-400 hover:text-red-500 transition-colors">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            <div>
              <FieldLabel htmlFor="message">
                {type === "rezept" ? "Hinweise zum Rezept" : "Beschreibung des Anliegens"}
                <span className="text-xs text-gray-400 font-normal ml-1">(optional)</span>
              </FieldLabel>
              <textarea id="message" rows={type === "rezept" ? 4 : 7} value={data.message} onChange={(e) => set("message", e.target.value)}
                placeholder={type === "rezept" ? "z. B. gewünschter Abholtermin, besondere Hinweise …" : "Beschreiben Sie kurz, welches Hilfsmittel Sie benötigen oder worüber Sie beraten werden möchten …"}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-800 dark:text-white resize-none" />
            </div>

            {type === "hilfsmittel" && (
              <div className="flex gap-3 p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-xl text-sm text-blue-800 dark:text-blue-200">
                <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <p>Versicherungsnummer und Arztdaten werden bei der telefonischen Rücksprache aufgenommen — bitte geben Sie diese hier nicht ein.</p>
              </div>
            )}

            <div className="flex gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
              <input id="datenschutz" type="checkbox" checked={data.datenschutz} onChange={(e) => set("datenschutz", e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer" />
              <label htmlFor="datenschutz" className="text-sm text-gray-600 dark:text-gray-400 cursor-pointer">
                Ich habe die <a href="/datenschutz" className="text-emerald-600 hover:underline">Datenschutzerklärung</a> gelesen und bestätige meine zuvor erteilte Einwilligung zur Verarbeitung meiner Gesundheitsdaten. <span className="text-emerald-600">*</span>
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
            <Button type="button" onClick={handleSubmit} disabled={isSubmitting || !canSubmit}
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
