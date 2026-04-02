"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Location } from "@/lib/content";

// ─── Typen ────────────────────────────────────────────────────────────────────

type Step = 1 | 2 | 3 | 4;

interface FormData {
  // Step 1
  anliegen: string;
  // Step 2
  anrede: string;
  vorname: string;
  nachname: string;
  geburtsdatum: string;
  strasse: string;
  plz: string;
  ort: string;
  telefon: string;
  email: string;
  // Step 3
  krankenkasse: string;
  versichertenart: string;
  versicherungsnummer: string;
  rezeptFiles: File[];
  // Step 4
  standort: string;
  nachricht: string;
  datenschutz: boolean;
}

// ─── Konfiguration ────────────────────────────────────────────────────────────

const ANLIEGEN_OPTIONS = [
  {
    id: "rezept",
    label: "Rezept einsenden",
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    desc: "Kassenrezept oder Privatrezept einreichen",
    needsInsurance: true,
  },
  {
    id: "hilfsmittel",
    label: "Hilfsmittelversorgung",
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.5 12a7.5 7.5 0 0015 0m-15 0a7.5 7.5 0 1115 0m-15 0H3m16.5 0H21m-1.5 0H12m-8.457 3.077l1.41-.513m14.095-5.13l1.41-.513M5.106 17.785l1.15-.964m11.49-9.642l1.149-.964M7.501 19.795l.75-1.3m7.5-12.99l.75-1.3m-6.063 16.658l.26-1.477m2.605-14.772l.26-1.477m0 17.726l-.26-1.477M10.698 4.614l-.26-1.477M16.5 19.794l-.75-1.299M7.5 4.205L12 12m6.894 5.785l-1.149-.964M6.256 7.178l-1.15-.964m15.352 8.864l-1.41-.513M4.954 9.435l-1.41-.514M12.002 12l-3.75 6.495" />
      </svg>
    ),
    desc: "Versorgung mit Hilfsmitteln anfragen",
    needsInsurance: true,
  },
  {
    id: "termin",
    label: "Terminanfrage",
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
      </svg>
    ),
    desc: "Beratungstermin vereinbaren",
    needsInsurance: false,
  },
  {
    id: "reparatur",
    label: "Reparatur & Abholung",
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z" />
      </svg>
    ),
    desc: "Reparatur oder Abholung beauftragen",
    needsInsurance: false,
  },
  {
    id: "allgemein",
    label: "Allgemeine Anfrage",
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
      </svg>
    ),
    desc: "Sonstiges Anliegen",
    needsInsurance: false,
  },
];

const VERSICHERTENARTEN = ["Mitglied", "Familienversicherter", "Rentner"];

// ─── Hilfs-Komponenten ────────────────────────────────────────────────────────

function FieldLabel({ htmlFor, children, required }: { htmlFor: string; children: React.ReactNode; required?: boolean }) {
  return (
    <label htmlFor={htmlFor} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
      {children}
      {required && <span className="text-emerald-600 ml-1">*</span>}
    </label>
  );
}

function StepIndicator({ current, total, labels }: { current: Step; total: number; labels: string[] }) {
  return (
    <div className="mb-8">
      {/* Progress bar */}
      <div className="relative h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full mb-6">
        <div
          className="absolute h-full bg-emerald-600 rounded-full transition-all duration-500"
          style={{ width: `${((current - 1) / (total - 1)) * 100}%` }}
        />
      </div>
      {/* Step dots */}
      <div className="flex justify-between">
        {labels.map((label, i) => {
          const stepNum = (i + 1) as Step;
          const isDone = stepNum < current;
          const isActive = stepNum === current;
          return (
            <div key={i} className="flex flex-col items-center gap-1.5" style={{ width: `${100 / total}%` }}>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                  isDone
                    ? "bg-emerald-600 text-white"
                    : isActive
                    ? "bg-emerald-600 text-white ring-4 ring-emerald-100 dark:ring-emerald-900"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                }`}
              >
                {isDone ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  stepNum
                )}
              </div>
              <span className={`text-xs text-center hidden sm:block ${isActive ? "text-emerald-700 dark:text-emerald-400 font-medium" : "text-gray-500 dark:text-gray-400"}`}>
                {label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Haupt-Komponente ─────────────────────────────────────────────────────────

export function ContactForm({ locations }: { locations: Location[] }) {
  const [step, setStep] = useState<Step>(1);
  const [ok, setOk] = useState<boolean | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const tsRef = useRef(Date.now().toString());

  const [data, setData] = useState<FormData>({
    anliegen: "",
    anrede: "",
    vorname: "",
    nachname: "",
    geburtsdatum: "",
    strasse: "",
    plz: "",
    ort: "",
    telefon: "",
    email: "",
    krankenkasse: "",
    versichertenart: "",
    versicherungsnummer: "",
    rezeptFiles: [],
    standort: "",
    nachricht: "",
    datenschutz: false,
  });

  const set = (field: keyof FormData, value: string | boolean | File[]) =>
    setData((prev) => ({ ...prev, [field]: value }));

  const selectedAnliegen = ANLIEGEN_OPTIONS.find((a) => a.id === data.anliegen);
  const needsInsurance = selectedAnliegen?.needsInsurance ?? false;

  // Gesamtschritte: 4 wenn Versicherung nötig, sonst 3 (Schritt 3 überspringen)
  const totalSteps = 4;
  const stepLabels = ["Anliegen", "Ihre Daten", "Versicherung", "Abschluss"];

  const canAdvanceStep1 = data.anliegen !== "";
  const canAdvanceStep2 =
    data.vorname.trim().length >= 2 &&
    data.nachname.trim().length >= 2 &&
    (data.email.includes("@") || data.telefon.trim().length >= 6);

  const nextStep = () => {
    if (step === 2 && !needsInsurance) {
      setStep(4);
    } else if (step < 4) {
      setStep((step + 1) as Step);
    }
  };

  const prevStep = () => {
    if (step === 4 && !needsInsurance) {
      setStep(2);
    } else if (step > 1) {
      setStep((step - 1) as Step);
    }
  };

  const addFiles = (files: FileList | File[]) => {
    const allowed = ["application/pdf", "image/jpeg", "image/png", "image/webp", "image/heic"];
    const valid = Array.from(files).filter((f) => allowed.includes(f.type) && f.size <= 10 * 1024 * 1024);
    set("rezeptFiles", [...data.rezeptFiles, ...valid].slice(0, 5));
  };

  const removeFile = (index: number) => {
    const updated = data.rezeptFiles.filter((_, i) => i !== index);
    set("rezeptFiles", updated);
  };

  const handleSubmit = async () => {
    if (!data.datenschutz || !data.standort) return;
    setIsSubmitting(true);

    const formData = new globalThis.FormData();
    formData.append("hp", "");
    formData.append("ts", tsRef.current);
    formData.append("anliegen", data.anliegen);
    formData.append("anrede", data.anrede);
    formData.append("vorname", data.vorname);
    formData.append("nachname", data.nachname);
    formData.append("name", `${data.vorname} ${data.nachname}`);
    formData.append("geburtsdatum", data.geburtsdatum);
    formData.append("strasse", data.strasse);
    formData.append("plz", data.plz);
    formData.append("ort", data.ort);
    formData.append("telefon", data.telefon);
    formData.append("email", data.email);
    formData.append("krankenkasse", data.krankenkasse);
    formData.append("versichertenart", data.versichertenart);
    formData.append("versicherungsnummer", data.versicherungsnummer);
    formData.append("standort", data.standort);
    formData.append("message", data.nachricht);
    data.rezeptFiles.forEach((f) => formData.append("rezept", f));

    try {
      const res = await fetch("/api/kontakt", { method: "POST", body: formData });
      setOk(res.ok);
    } catch {
      setOk(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Erfolg ──
  if (ok === true) {
    return (
      <div className="text-center py-16 px-8">
        <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Vielen Dank!</h3>
        <p className="text-gray-600 dark:text-gray-300 text-lg">
          Ihre Anfrage ist bei uns eingegangen. Wir melden uns so schnell wie möglich bei Ihnen.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl overflow-hidden">
      <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 px-8 py-6">
        <h2 className="text-2xl font-bold text-white">Kontaktformular</h2>
        <p className="text-emerald-100 mt-1 text-sm">
          {selectedAnliegen ? selectedAnliegen.label : "Wie können wir Ihnen helfen?"}
        </p>
      </div>

      <div className="px-8 pt-8 pb-2">
        <StepIndicator current={step} total={totalSteps} labels={stepLabels} />
      </div>

      <div className="px-8 pb-8">
        {/* ── Schritt 1: Anliegen ── */}
        {step === 1 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Was ist Ihr Anliegen?</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">Bitte wählen Sie den passenden Grund für Ihre Kontaktaufnahme.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {ANLIEGEN_OPTIONS.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => set("anliegen", option.id)}
                  className={`relative text-left p-4 rounded-xl border-2 transition-all duration-200 group ${
                    data.anliegen === option.id
                      ? "border-emerald-600 bg-emerald-50 dark:bg-emerald-900/20"
                      : "border-gray-200 dark:border-gray-700 hover:border-emerald-300 dark:hover:border-emerald-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                  }`}
                >
                  {data.anliegen === option.id && (
                    <div className="absolute top-3 right-3 w-5 h-5 bg-emerald-600 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                  <div className={`mb-2 transition-colors ${data.anliegen === option.id ? "text-emerald-600" : "text-gray-400 group-hover:text-emerald-500"}`}>
                    {option.icon}
                  </div>
                  <div className={`font-semibold text-sm ${data.anliegen === option.id ? "text-emerald-700 dark:text-emerald-400" : "text-gray-900 dark:text-white"}`}>
                    {option.label}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{option.desc}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── Schritt 2: Persönliche Daten ── */}
        {step === 2 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Ihre persönlichen Daten</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">Pflichtfelder sind mit <span className="text-emerald-600">*</span> markiert.</p>

            <div className="space-y-4">
              {/* Anrede */}
              <div>
                <FieldLabel htmlFor="anrede">Anrede</FieldLabel>
                <div className="flex gap-2">
                  {["Herr", "Frau", "Divers"].map((a) => (
                    <button
                      key={a}
                      type="button"
                      onClick={() => set("anrede", a)}
                      className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all ${
                        data.anrede === a
                          ? "border-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400"
                          : "border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-emerald-400"
                      }`}
                    >
                      {a}
                    </button>
                  ))}
                </div>
              </div>

              {/* Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <FieldLabel htmlFor="vorname" required>Vorname</FieldLabel>
                  <Input id="vorname" value={data.vorname} onChange={(e) => set("vorname", e.target.value)}
                    placeholder="Max" className="focus:ring-emerald-500 focus:border-emerald-500" />
                </div>
                <div>
                  <FieldLabel htmlFor="nachname" required>Nachname</FieldLabel>
                  <Input id="nachname" value={data.nachname} onChange={(e) => set("nachname", e.target.value)}
                    placeholder="Mustermann" className="focus:ring-emerald-500 focus:border-emerald-500" />
                </div>
              </div>

              {/* Geburtsdatum */}
              <div>
                <FieldLabel htmlFor="geburtsdatum">Geburtsdatum</FieldLabel>
                <Input id="geburtsdatum" type="date" value={data.geburtsdatum} onChange={(e) => set("geburtsdatum", e.target.value)}
                  className="focus:ring-emerald-500 focus:border-emerald-500 max-w-xs" />
              </div>

              {/* Adresse */}
              <div>
                <FieldLabel htmlFor="strasse">Straße & Hausnummer</FieldLabel>
                <Input id="strasse" value={data.strasse} onChange={(e) => set("strasse", e.target.value)}
                  placeholder="Musterstraße 1" className="focus:ring-emerald-500 focus:border-emerald-500" />
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div>
                  <FieldLabel htmlFor="plz">PLZ</FieldLabel>
                  <Input id="plz" value={data.plz} onChange={(e) => set("plz", e.target.value)}
                    placeholder="37213" maxLength={5} className="focus:ring-emerald-500 focus:border-emerald-500" />
                </div>
                <div className="col-span-1 sm:col-span-2">
                  <FieldLabel htmlFor="ort">Ort</FieldLabel>
                  <Input id="ort" value={data.ort} onChange={(e) => set("ort", e.target.value)}
                    placeholder="Witzenhausen" className="focus:ring-emerald-500 focus:border-emerald-500" />
                </div>
              </div>

              {/* Kontakt */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <FieldLabel htmlFor="email" required={!data.telefon}>E-Mail-Adresse {!data.telefon && <span className="text-xs text-gray-400 font-normal">(oder Telefon)</span>}</FieldLabel>
                  <Input id="email" type="email" value={data.email} onChange={(e) => set("email", e.target.value)}
                    placeholder="max@beispiel.de" className="focus:ring-emerald-500 focus:border-emerald-500" />
                </div>
                <div>
                  <FieldLabel htmlFor="telefon" required={!data.email}>Telefonnummer {!data.email && <span className="text-xs text-gray-400 font-normal">(oder E-Mail)</span>}</FieldLabel>
                  <Input id="telefon" type="tel" value={data.telefon} onChange={(e) => set("telefon", e.target.value)}
                    placeholder="+49 5542 123456" className="focus:ring-emerald-500 focus:border-emerald-500" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Schritt 3: Versicherung & Rezept ── */}
        {step === 3 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Versicherung & Dokumente</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">
              Bitte geben Sie Ihre Versicherungsdaten an und laden Sie ggf. Ihr Rezept hoch.
            </p>

            <div className="space-y-4">
              {/* Krankenkasse */}
              <div>
                <FieldLabel htmlFor="krankenkasse">Krankenkasse</FieldLabel>
                <Input id="krankenkasse" value={data.krankenkasse} onChange={(e) => set("krankenkasse", e.target.value)}
                  placeholder="z.B. AOK, TK, Barmer ..." className="focus:ring-emerald-500 focus:border-emerald-500" />
              </div>

              {/* Versichertenart */}
              <div>
                <FieldLabel htmlFor="versichertenart">Versichertenart</FieldLabel>
                <div className="flex flex-wrap gap-2">
                  {VERSICHERTENARTEN.map((v) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => set("versichertenart", v)}
                      className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all ${
                        data.versichertenart === v
                          ? "border-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400"
                          : "border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-emerald-400"
                      }`}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>

              {/* Versicherungsnummer */}
              <div>
                <FieldLabel htmlFor="versicherungsnummer">Versicherungsnummer</FieldLabel>
                <Input id="versicherungsnummer" value={data.versicherungsnummer} onChange={(e) => set("versicherungsnummer", e.target.value)}
                  placeholder="A123456789" className="focus:ring-emerald-500 focus:border-emerald-500 max-w-xs" />
              </div>

              {/* Datei-Upload */}
              <div>
                <FieldLabel htmlFor="rezept-upload">Rezept / Dokumente hochladen</FieldLabel>
                <div
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={(e) => { e.preventDefault(); setDragOver(false); addFiles(e.dataTransfer.files); }}
                  onClick={() => fileInputRef.current?.click()}
                  className={`cursor-pointer rounded-xl border-2 border-dashed p-8 text-center transition-all ${
                    dragOver
                      ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20"
                      : "border-gray-300 dark:border-gray-600 hover:border-emerald-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    id="rezept-upload"
                    type="file"
                    multiple
                    accept=".pdf,.jpg,.jpeg,.png,.webp,.heic"
                    className="hidden"
                    onChange={(e) => e.target.files && addFiles(e.target.files)}
                  />
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                      <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                      </svg>
                    </div>
                    <div>
                      <span className="text-emerald-600 font-medium">Dateien auswählen</span>
                      <span className="text-gray-500 dark:text-gray-400"> oder hierher ziehen</span>
                    </div>
                    <p className="text-xs text-gray-400">PDF, JPG, PNG, HEIC bis 10 MB • max. 5 Dateien</p>
                  </div>
                </div>

                {/* Hochgeladene Dateien */}
                {data.rezeptFiles.length > 0 && (
                  <ul className="mt-3 space-y-2">
                    {data.rezeptFiles.map((file, i) => (
                      <li key={i} className="flex items-center justify-between gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="flex items-center gap-2 min-w-0">
                          <svg className="w-5 h-5 text-emerald-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                          </svg>
                          <span className="text-sm text-gray-700 dark:text-gray-300 truncate">{file.name}</span>
                          <span className="text-xs text-gray-400 shrink-0">({(file.size / 1024).toFixed(0)} KB)</span>
                        </div>
                        <button type="button" onClick={() => removeFile(i)} className="text-gray-400 hover:text-red-500 transition-colors shrink-0">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── Schritt 4: Standort & Abschluss ── */}
        {step === 4 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Standort & Nachricht</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">Wählen Sie Ihren gewünschten Standort und hinterlassen Sie uns eine Nachricht.</p>

            <div className="space-y-5">
              {/* Standort-Auswahl */}
              <div>
                <FieldLabel htmlFor="standort" required>Gewünschter Standort</FieldLabel>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {locations.map((loc) => (
                    <button
                      key={loc.slug}
                      type="button"
                      onClick={() => set("standort", loc.slug)}
                      className={`text-left p-4 rounded-xl border-2 transition-all ${
                        data.standort === loc.slug
                          ? "border-emerald-600 bg-emerald-50 dark:bg-emerald-900/20"
                          : "border-gray-200 dark:border-gray-700 hover:border-emerald-300 dark:hover:border-emerald-700"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className={`font-semibold text-sm ${data.standort === loc.slug ? "text-emerald-700 dark:text-emerald-400" : "text-gray-900 dark:text-white"}`}>
                            {loc.name}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                            {loc.address}, {loc.postalCode} {loc.city}
                          </div>
                          {loc.phone && (
                            <div className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{loc.phone}</div>
                          )}
                        </div>
                        {data.standort === loc.slug && (
                          <div className="w-5 h-5 bg-emerald-600 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Nachricht */}
              <div>
                <FieldLabel htmlFor="nachricht">Ihre Nachricht</FieldLabel>
                <textarea
                  id="nachricht"
                  rows={4}
                  value={data.nachricht}
                  onChange={(e) => set("nachricht", e.target.value)}
                  placeholder="Beschreiben Sie Ihr Anliegen genauer (optional) ..."
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-800 dark:text-white text-sm"
                />
              </div>

              {/* Datenschutz */}
              <div className="flex gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                <input
                  id="datenschutz"
                  type="checkbox"
                  checked={data.datenschutz}
                  onChange={(e) => set("datenschutz", e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                />
                <label htmlFor="datenschutz" className="text-sm text-gray-600 dark:text-gray-400 cursor-pointer">
                  Ich habe die{" "}
                  <a href="/datenschutz" className="text-emerald-600 hover:underline">Datenschutzerklärung</a>{" "}
                  gelesen und bin damit einverstanden, dass meine Daten zur Bearbeitung dieser Anfrage verwendet werden. <span className="text-emerald-600">*</span>
                </label>
              </div>

              {/* Fehler-Hinweis */}
              {ok === false && (
                <div className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-xl">
                  <div className="w-8 h-8 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center shrink-0">
                    <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-medium text-red-800 dark:text-red-200 text-sm">Fehler beim Senden</div>
                    <div className="text-xs text-red-700 dark:text-red-300">Bitte versuchen Sie es erneut oder kontaktieren Sie uns telefonisch.</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── Navigation ── */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-100 dark:border-gray-800">
          {step > 1 ? (
            <button
              type="button"
              onClick={prevStep}
              className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Zurück
            </button>
          ) : (
            <div />
          )}

          {step < 4 ? (
            <Button
              type="button"
              onClick={nextStep}
              disabled={step === 1 ? !canAdvanceStep1 : step === 2 ? !canAdvanceStep2 : false}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 flex items-center gap-2 disabled:opacity-40"
            >
              Weiter
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Button>
          ) : (
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting || !data.datenschutz || !data.standort}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-2.5 text-base font-semibold disabled:opacity-40 flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Wird gesendet ...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                  </svg>
                  Anfrage absenden
                </>
              )}
            </Button>
          )}
        </div>
      </div>

      {/* Spam-Schutz */}
      <input type="text" name="hp" className="hidden" tabIndex={-1} aria-hidden="true" readOnly value="" />
    </div>
  );
}
