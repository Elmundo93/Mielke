"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { saveLocation, type LocationFormData } from "@/lib/admin-actions";
import type { Location } from "@/lib/content";

const SERVICE_OPTIONS = [
  { label: "Sanitätshaus", value: "sanitaetshaus" },
  { label: "Rehatechnik", value: "rehatechnik" },
  { label: "Orthopädietechnik", value: "orthopaedietechnik" },
  { label: "Orthopädieschuhtechnik", value: "orthopaedieschuhtechnik" },
];

type OpeningHour = {
  day: string;
  opens: string;
  closes: string;
  pause: { from: string; to: string };
};

function toFormData(location: Location): LocationFormData {
  return {
    name: location.name,
    phone: location.phone ?? "",
    email: location.email ?? "",
    address: location.address,
    postalCode: location.postalCode,
    city: location.city,
    introText: location.introText ?? "",
    heroImage: location.heroImage ?? "",
    lat: location.lat ?? 0,
    lon: location.lon ?? 0,
    services: location.services ?? [],
    accessibility: location.accessibility ?? [],
    openingHours: (location.openingHours ?? []).map((h) => ({
      day: h.day,
      opens: h.opens,
      closes: h.closes,
      pause: { from: h.pause?.from ?? "", to: h.pause?.to ?? "" },
    })),
    diashowImages: location.diashowImages ?? [],
  };
}

export default function LocationEditForm({
  slug,
  location,
}: {
  slug: string;
  location: Location;
}) {
  const [data, setData] = useState<LocationFormData>(() =>
    toFormData(location)
  );
  const [status, setStatus] = useState<"idle" | "saved" | "error">("idle");
  const [isPending, startTransition] = useTransition();

  function setField<K extends keyof LocationFormData>(
    key: K,
    value: LocationFormData[K]
  ) {
    setData((prev) => ({ ...prev, [key]: value }));
    setStatus("idle");
  }

  // ── Opening Hours helpers ──────────────────────────────────────────────────
  const hours: OpeningHour[] = data.openingHours as OpeningHour[];

  function updateHour(
    idx: number,
    field: keyof Omit<OpeningHour, "pause">,
    value: string
  ) {
    const next = hours.map((h, i) => (i === idx ? { ...h, [field]: value } : h));
    setField("openingHours", next);
  }

  function updatePause(idx: number, field: "from" | "to", value: string) {
    const next = hours.map((h, i) =>
      i === idx ? { ...h, pause: { ...h.pause, [field]: value } } : h
    );
    setField("openingHours", next);
  }

  function addHour() {
    setField("openingHours", [
      ...hours,
      { day: "", opens: "", closes: "", pause: { from: "", to: "" } },
    ]);
  }

  function removeHour(idx: number) {
    setField(
      "openingHours",
      hours.filter((_, i) => i !== idx)
    );
  }

  // ── Array helpers (accessibility, diashowImages) ───────────────────────────
  function updateArrayItem(
    key: "accessibility" | "diashowImages",
    idx: number,
    value: string
  ) {
    const next = (data[key] as string[]).map((v, i) => (i === idx ? value : v));
    setField(key, next);
  }

  function addArrayItem(key: "accessibility" | "diashowImages") {
    setField(key, [...(data[key] as string[]), ""]);
  }

  function removeArrayItem(key: "accessibility" | "diashowImages", idx: number) {
    setField(
      key,
      (data[key] as string[]).filter((_, i) => i !== idx)
    );
  }

  // ── Submit ─────────────────────────────────────────────────────────────────
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      const result = await saveLocation(slug, data);
      setStatus(result.ok ? "saved" : "error");
    });
  }

  // ── Styles ─────────────────────────────────────────────────────────────────
  const inputCls =
    "w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500";
  const labelCls = "block text-sm font-medium text-gray-700 mb-1";
  const sectionCls = "bg-white rounded-xl border border-gray-200 p-5 space-y-4";

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Link
            href="/admin/standorte"
            className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Alle Standorte
          </Link>
          <span className="text-gray-300">/</span>
          <h1 className="text-xl font-bold text-gray-900">{location.name}</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Kontakt */}
          <section className={sectionCls}>
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Kontakt</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Telefon</label>
                <input className={inputCls} value={data.phone} onChange={(e) => setField("phone", e.target.value)} />
              </div>
              <div>
                <label className={labelCls}>E-Mail</label>
                <input className={inputCls} type="email" value={data.email} onChange={(e) => setField("email", e.target.value)} />
              </div>
            </div>
          </section>

          {/* Adresse */}
          <section className={sectionCls}>
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Adresse</h2>
            <div>
              <label className={labelCls}>Straße & Hausnummer</label>
              <input className={inputCls} value={data.address} onChange={(e) => setField("address", e.target.value)} />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className={labelCls}>PLZ</label>
                <input className={inputCls} value={data.postalCode} onChange={(e) => setField("postalCode", e.target.value)} />
              </div>
              <div className="col-span-2">
                <label className={labelCls}>Ort</label>
                <input className={inputCls} value={data.city} onChange={(e) => setField("city", e.target.value)} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Breitengrad (lat)</label>
                <input className={inputCls} type="number" step="any" value={data.lat} onChange={(e) => setField("lat", parseFloat(e.target.value) || 0)} />
              </div>
              <div>
                <label className={labelCls}>Längengrad (lon)</label>
                <input className={inputCls} type="number" step="any" value={data.lon} onChange={(e) => setField("lon", parseFloat(e.target.value) || 0)} />
              </div>
            </div>
          </section>

          {/* Inhalte */}
          <section className={sectionCls}>
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Inhalte</h2>
            <div>
              <label className={labelCls}>Einleitungstext</label>
              <textarea
                className={inputCls + " resize-y min-h-[80px]"}
                value={data.introText}
                onChange={(e) => setField("introText", e.target.value)}
              />
            </div>
            <div>
              <label className={labelCls}>Titelbild (Dateipfad)</label>
              <input className={inputCls} placeholder="/beispiel.jpg" value={data.heroImage} onChange={(e) => setField("heroImage", e.target.value)} />
            </div>
          </section>

          {/* Öffnungszeiten */}
          <section className={sectionCls}>
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Öffnungszeiten</h2>
            <div className="space-y-3">
              {hours.map((h, idx) => (
                <div key={idx} className="border border-gray-100 rounded-lg p-3 space-y-2">
                  <div className="flex items-center gap-2">
                    <input
                      className={inputCls + " flex-1"}
                      placeholder="Tag (z.B. Montag)"
                      value={h.day}
                      onChange={(e) => updateHour(idx, "day", e.target.value)}
                    />
                    <input
                      className={inputCls + " w-24"}
                      placeholder="09:00"
                      value={h.opens}
                      onChange={(e) => updateHour(idx, "opens", e.target.value)}
                    />
                    <span className="text-gray-400 text-sm">–</span>
                    <input
                      className={inputCls + " w-24"}
                      placeholder="18:00"
                      value={h.closes}
                      onChange={(e) => updateHour(idx, "closes", e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => removeHour(idx)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  <div className="flex items-center gap-2 pl-1">
                    <span className="text-xs text-gray-400 w-16 shrink-0">Pause:</span>
                    <input
                      className={inputCls + " w-24"}
                      placeholder="13:00"
                      value={h.pause.from}
                      onChange={(e) => updatePause(idx, "from", e.target.value)}
                    />
                    <span className="text-gray-400 text-sm">–</span>
                    <input
                      className={inputCls + " w-24"}
                      placeholder="14:00"
                      value={h.pause.to}
                      onChange={(e) => updatePause(idx, "to", e.target.value)}
                    />
                  </div>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={addHour}
              className="text-sm text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Zeile hinzufügen
            </button>
          </section>

          {/* Leistungen */}
          <section className={sectionCls}>
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Leistungen</h2>
            <div className="grid grid-cols-2 gap-2">
              {SERVICE_OPTIONS.map((opt) => (
                <label key={opt.value} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={data.services.includes(opt.value)}
                    onChange={(e) => {
                      const next = e.target.checked
                        ? [...data.services, opt.value]
                        : data.services.filter((s) => s !== opt.value);
                      setField("services", next);
                    }}
                    className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="text-sm text-gray-700">{opt.label}</span>
                </label>
              ))}
            </div>
          </section>

          {/* Barrierefreiheit */}
          <section className={sectionCls}>
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Barrierefreiheit</h2>
            <div className="space-y-2">
              {data.accessibility.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    className={inputCls + " flex-1"}
                    value={item}
                    onChange={(e) => updateArrayItem("accessibility", idx, e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => removeArrayItem("accessibility", idx)}
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
              onClick={() => addArrayItem("accessibility")}
              className="text-sm text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Merkmal hinzufügen
            </button>
          </section>

          {/* Diashow */}
          <section className={sectionCls}>
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Diashow-Bilder</h2>
            <div className="space-y-2">
              {data.diashowImages.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    className={inputCls + " flex-1"}
                    placeholder="/bild.jpg"
                    value={item}
                    onChange={(e) => updateArrayItem("diashowImages", idx, e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => removeArrayItem("diashowImages", idx)}
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
              onClick={() => addArrayItem("diashowImages")}
              className="text-sm text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Bild hinzufügen
            </button>
          </section>

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
