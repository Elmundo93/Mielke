"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { saveJob, type JobFormData } from "@/lib/admin-actions";
import type { Job } from "@/lib/content";

const CATEGORY_OPTIONS = [
  "Außendienst",
  "Sanitätshaus",
  "Büro & Verwaltung",
  "Werkstatt",
  "Sonstiges",
];

type ArrayField = "tasks" | "requirements" | "offer";

export default function JobEditForm({ job }: { job: Job }) {
  const [data, setData] = useState<JobFormData>({ ...job });
  const [status, setStatus] = useState<"idle" | "saved" | "error">("idle");
  const [isPending, startTransition] = useTransition();

  function setField<K extends keyof JobFormData>(key: K, value: JobFormData[K]) {
    setData((prev) => ({ ...prev, [key]: value }));
    setStatus("idle");
  }

  function updateArrayItem(key: ArrayField, idx: number, value: string) {
    const next = (data[key] as string[]).map((v, i) => (i === idx ? value : v));
    setField(key, next);
  }

  function addArrayItem(key: ArrayField) {
    setField(key, [...(data[key] as string[]), ""]);
  }

  function removeArrayItem(key: ArrayField, idx: number) {
    setField(key, (data[key] as string[]).filter((_, i) => i !== idx));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      const result = await saveJob(job.id, data);
      setStatus(result.ok ? "saved" : "error");
    });
  }

  const inputCls =
    "w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500";
  const labelCls = "block text-sm font-medium text-gray-700 mb-1";
  const sectionCls = "bg-white rounded-xl border border-gray-200 p-5 space-y-4";

  function ArraySection({
    label,
    field,
    placeholder,
    addLabel,
  }: {
    label: string;
    field: ArrayField;
    placeholder?: string;
    addLabel: string;
  }) {
    return (
      <section className={sectionCls}>
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">{label}</h2>
        <div className="space-y-2">
          {(data[field] as string[]).map((item, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <input
                className={inputCls + " flex-1"}
                value={item}
                placeholder={placeholder}
                onChange={(e) => updateArrayItem(field, idx, e.target.value)}
              />
              <button
                type="button"
                onClick={() => removeArrayItem(field, idx)}
                className="text-gray-400 hover:text-red-500 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() => addArrayItem(field)}
          className="text-sm text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          {addLabel}
        </button>
      </section>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Link
            href="/admin/karriere"
            className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Alle Stellen
          </Link>
          <span className="text-gray-300">/</span>
          <h1 className="text-xl font-bold text-gray-900 truncate">{job.title}</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basisdaten */}
          <section className={sectionCls}>
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Basisdaten</h2>

            <div>
              <label className={labelCls}>ID <span className="text-gray-400 font-normal">(nicht änderbar)</span></label>
              <input className={inputCls + " bg-gray-50 text-gray-400 cursor-not-allowed"} value={data.id} readOnly />
            </div>

            <div className="flex items-center gap-3">
              <label className="text-sm font-medium text-gray-700">Stelle aktiv</label>
              <button
                type="button"
                onClick={() => setField("active", !data.active)}
                className={`relative inline-flex h-5 w-9 rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                  data.active ? "bg-emerald-500" : "bg-gray-200"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition duration-200 ${
                    data.active ? "translate-x-4" : "translate-x-0"
                  }`}
                />
              </button>
              <span className="text-sm text-gray-500">{data.active ? "Sichtbar auf der Website" : "Ausgeblendet"}</span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Kategorie</label>
                <select
                  className={inputCls}
                  value={data.category}
                  onChange={(e) => setField("category", e.target.value)}
                >
                  {CATEGORY_OPTIONS.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelCls}>Beschäftigungsart</label>
                <input
                  className={inputCls}
                  value={data.type}
                  placeholder="z. B. Vollzeit"
                  onChange={(e) => setField("type", e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className={labelCls}>Stellentitel</label>
              <input
                className={inputCls}
                value={data.title}
                onChange={(e) => setField("title", e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Einsatzort</label>
                <input
                  className={inputCls}
                  value={data.location}
                  placeholder="z. B. Witzenhausen"
                  onChange={(e) => setField("location", e.target.value)}
                />
              </div>
              <div>
                <label className={labelCls}>Eintrittsdatum</label>
                <input
                  className={inputCls}
                  value={data.start}
                  placeholder="z. B. Ab sofort"
                  onChange={(e) => setField("start", e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className={labelCls}>Kurzbeschreibung</label>
              <textarea
                className={inputCls + " resize-y min-h-[80px]"}
                value={data.summary}
                onChange={(e) => setField("summary", e.target.value)}
              />
            </div>
          </section>

          <ArraySection
            label="Aufgaben"
            field="tasks"
            placeholder="Aufgabe beschreiben …"
            addLabel="Aufgabe hinzufügen"
          />

          <ArraySection
            label="Anforderungen (Ihr Profil)"
            field="requirements"
            placeholder="Anforderung beschreiben …"
            addLabel="Anforderung hinzufügen"
          />

          <ArraySection
            label="Was wir bieten"
            field="offer"
            placeholder="Benefit beschreiben …"
            addLabel="Benefit hinzufügen"
          />

          {/* Submit */}
          <div className="flex items-center gap-4">
            <button
              type="submit"
              disabled={isPending}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {isPending ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Speichern …
                </>
              ) : (
                "Speichern"
              )}
            </button>

            {status === "saved" && (
              <p className="text-sm text-emerald-600 flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Gespeichert
              </p>
            )}
            {status === "error" && (
              <p className="text-sm text-red-600">Fehler beim Speichern.</p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
