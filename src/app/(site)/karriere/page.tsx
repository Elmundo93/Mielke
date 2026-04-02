import type { Metadata } from "next";
import Link from "next/link";
import { getJobs } from "@/lib/content";

export const metadata: Metadata = {
  title: "Karriere | Sanitätshaus Mielke",
  description:
    "Stellen Sie sich vor, jeden Tag Menschen zu helfen – werden Sie Teil des Teams von Sanitätshaus Mielke. Offene Stellen in Außendienst, Sanitätshaus und Büro.",
  keywords: [
    "Sanitätshaus Mielke Karriere",
    "Jobs Sanitätshaus Hessen",
    "Stellenangebote Orthopädietechnik",
    "Rehadienstleistungen Außendienst",
    "Sanitätshausfachkraft",
    "Bürojob Gesundheitswesen",
  ],
  openGraph: {
    title: "Karriere bei Sanitätshaus Mielke",
    description: "Offene Stellen in Außendienst, Sanitätshaus und Büro.",
  },
  alternates: {
    canonical: "/karriere",
  },
};

const CATEGORY_COLORS: Record<string, string> = {
  "Außendienst": "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  "Sanitätshaus": "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  "Büro & Verwaltung": "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400",
};

// ─── Seite ────────────────────────────────────────────────────────────────────

export default async function KarrierePage() {
  const allJobs = await getJobs();
  const jobs = allJobs.filter((j) => j.active);

  return (
    <div className="bg-white dark:bg-gray-950 min-h-screen">
      {/* Hero */}
      <div className="bg-gradient-to-br from-emerald-700 to-emerald-900 text-white">
        <div className="max-w-5xl mx-auto px-4 py-20 text-center">
          <p className="text-emerald-300 text-sm font-semibold uppercase tracking-widest mb-4">Karriere bei Sanitätshaus Mielke</p>
          <h1 className="text-4xl sm:text-5xl font-bold mb-5 leading-tight">
            Werden Sie Teil unseres Teams
          </h1>
          <p className="text-emerald-100 text-lg max-w-2xl mx-auto">
            Seit über 35 Jahren helfen wir Menschen in Nordhessen – mit Herz, Fachkompetenz und Engagement.
            Wachsen Sie mit uns und gestalten Sie Ihre Karriere in einem sinnvollen Umfeld.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-emerald-200">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              4 Standorte in Nordhessen
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              Familiäres Unternehmen
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              Sicherer Arbeitsplatz
            </div>
          </div>
        </div>
      </div>

      {/* Stellenanzahl-Banner */}
      <div className="bg-emerald-50 dark:bg-emerald-950/30 border-b border-emerald-100 dark:border-emerald-900">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-2 text-sm text-emerald-800 dark:text-emerald-300">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
          </svg>
          <span className="font-semibold">{jobs.length} offene Stellen</span> – Wir freuen uns auf Ihre Bewerbung!
        </div>
      </div>

      {/* Stellenanzeigen */}
      <div className="max-w-5xl mx-auto px-4 py-14 space-y-10">
        {jobs.map((job) => (
          <article
            key={job.id}
            id={job.id}
            className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden"
          >
            {/* Kopfzeile */}
            <div className="px-8 pt-7 pb-5 border-b border-gray-100 dark:border-gray-800">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <span className={`inline-block text-xs font-semibold px-3 py-1 rounded-full mb-3 ${CATEGORY_COLORS[job.category] ?? "bg-gray-100 text-gray-700"}`}>
                    {job.category}
                  </span>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white leading-snug">
                    {job.title}
                  </h2>
                  <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-500 dark:text-gray-400">
                    <span className="flex items-center gap-1.5">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {job.location}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {job.type}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Eintritt: {job.start}
                    </span>
                  </div>
                </div>
                <Link
                  href={`/kontakt?stelle=${job.id}`}
                  className="shrink-0 inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors"
                >
                  Jetzt bewerben
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
              <p className="mt-4 text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{job.summary}</p>
            </div>

            {/* Body */}
            <div className="px-8 py-6 grid sm:grid-cols-3 gap-8">
              {/* Aufgaben */}
              <div className="sm:col-span-1">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wide mb-3">
                  Ihre Aufgaben
                </h3>
                <ul className="space-y-2">
                  {job.tasks.map((t, i) => (
                    <li key={i} className="flex gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <svg className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                      {t}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Anforderungen */}
              <div className="sm:col-span-1">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wide mb-3">
                  Ihr Profil
                </h3>
                <ul className="space-y-2">
                  {job.requirements.map((r, i) => (
                    <li key={i} className="flex gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <svg className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      {r}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Was wir bieten */}
              <div className="sm:col-span-1">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wide mb-3">
                  Wir bieten
                </h3>
                <ul className="space-y-2">
                  {job.offer.map((o, i) => (
                    <li key={i} className="flex gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <svg className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      {o}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Footer der Karte */}
            <div className="px-8 py-4 bg-gray-50 dark:bg-gray-800/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Fragen zur Stelle?{" "}
                <Link href="/kontakt" className="text-emerald-600 hover:underline">
                  Kontaktieren Sie uns direkt.
                </Link>
              </p>
              <Link
                href={`/kontakt?stelle=${job.id}`}
                className="inline-flex items-center gap-2 text-sm font-medium text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 transition-colors"
              >
                Zur Bewerbung
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </article>
        ))}

        {/* Spontanbewerbung */}
        <div className="rounded-2xl border-2 border-dashed border-emerald-200 dark:border-emerald-800 p-10 text-center bg-emerald-50/50 dark:bg-emerald-950/10">
          <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-7 h-7 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Keine passende Stelle dabei?</h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm max-w-md mx-auto mb-5">
            Wir freuen uns jederzeit über Initiativbewerbungen. Schicken Sie uns Ihre Unterlagen –
            wir melden uns, sobald eine passende Stelle frei wird.
          </p>
          <Link
            href="/kontakt"
            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors text-sm"
          >
            Initiativbewerbung senden
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
