"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

const STORAGE_KEY = "flyer_seen";

export function FlyerPopup() {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem(STORAGE_KEY)) return;
    const show = setTimeout(() => setMounted(true), 800);
    return () => clearTimeout(show);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const animate = setTimeout(() => setVisible(true), 10);
    return () => clearTimeout(animate);
  }, [mounted]);

  function close() {
    setVisible(false);
    sessionStorage.setItem(STORAGE_KEY, "1");
    setTimeout(() => setMounted(false), 300);
  }

  if (!mounted) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Aktuelles Angebot"
      onClick={(e) => e.target === e.currentTarget && close()}
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-[background-color,backdrop-filter] duration-300 ${
        visible
          ? "bg-black/60 backdrop-blur-sm"
          : "bg-black/0 backdrop-blur-none pointer-events-none"
      }`}
    >
      <div
        className={`relative flex flex-col rounded-2xl shadow-2xl overflow-hidden transition-[opacity,transform] duration-300 ${
          visible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-4 scale-95"
        }`}
        /* A4-Verhältnis 595:842 — Breite begrenzt, Höhe folgt */
        style={{ width: "min(92vw, calc(90dvh * 595 / 842))" }}
      >
        {/* Flyer */}
        <div className="relative w-full" style={{ aspectRatio: "595 / 842" }}>
          <Image
            src="/Flyer/pflegehilfsmittel-flyer.jpg"
            alt="Pflegehilfsmittel zum Verbrauch – Flyer Sanitätshaus Mielke"
            fill
            className="object-contain"
            priority
          />
        </div>

        {/* CTA */}
        <div className="bg-white px-5 py-4 flex items-center justify-between gap-4">
          <p className="text-sm text-gray-600 leading-snug">
            Neugierig geworden?<br />
            <span className="text-gray-400 text-xs">Entdecken Sie unser Leistungsangebot.</span>
          </p>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={close}
              className="text-sm text-gray-400 hover:text-gray-600 transition-colors px-2 py-1.5 rounded-lg hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-300"
            >
              Später
            </button>
            <Link
              href="/leistungen/pflegehilfsmittel"
              onClick={close}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
            >
              Mehr erfahren
            </Link>
          </div>
        </div>

        {/* Schließen-Button */}
        <button
          onClick={close}
          aria-label="Schließen"
          className="absolute top-2.5 right-2.5 w-8 h-8 flex items-center justify-center rounded-full bg-black/40 hover:bg-black/60 text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
