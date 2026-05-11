import Link from "next/link";
import { Section } from "@/components/ui/Section";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pflegehilfsmittel zum Verbrauch – kostenlos beantragen",
  description:
    "Pflegebedürftige erhalten bis zu 42 € monatlich kostenlos für Desinfektionsmittel, Schutzhandschuhe, Mundschutz und mehr. Wir übernehmen die Beantragung bei Ihrer Pflegekasse.",
  alternates: { canonical: "/leistungen/pflegehilfsmittel" },
};

const PRODUCTS = [
  { label: "Händedesinfektionsmittel", icon: "🧴" },
  { label: "Händedesinfektionstücher", icon: "🧻" },
  { label: "Flächendesinfektionsmittel", icon: "🧹" },
  { label: "Flächendesinfektionstücher", icon: "🧻" },
  { label: "Einmalhandschuhe", icon: "🧤" },
  { label: "Medizinischer Mundschutz", icon: "😷" },
  { label: "FFP2-Masken", icon: "😷" },
  { label: "Bettschutzeinlagen (Einmal)", icon: "🛏️" },
  { label: "Bettschutzeinlagen (wiederverwendbar)", icon: "🛏️" },
  { label: "Schutzschürzen (Einmal)", icon: "🥼" },
  { label: "Schutzschürzen (wiederverwendbar)", icon: "🥼" },
  { label: "Schutzservietten (Einmal)", icon: "🧻" },
  { label: "Fingerlinge", icon: "🩺" },
];


export default function PflegehilfsmittelPage() {
  return (
    <>
      {/* Hero */}
      <Section>
        <div className="max-w-3xl mx-auto text-center">
          <span className="inline-block text-xs font-semibold text-emerald-600 uppercase tracking-widest mb-4">
            Kostenlose Leistung der Pflegeversicherung
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
            Pflegehilfsmittel zum Verbrauch –{" "}
            <span className="text-emerald-600 dark:text-emerald-400">
              bis zu 42 € monatlich kostenlos
            </span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed mb-8">
            Wer zu Hause gepflegt wird und einen anerkannten Pflegegrad hat, hat Anspruch auf
            kostenlose Pflegehilfsmittel. Die Pflegekasse übernimmt die Kosten – wir übernehmen die
            Beantragung für Sie.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/kontaktform"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-colors text-base"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
              </svg>
              Jetzt kostenlos beantragen
            </Link>
            <a
              href="#produkte"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-emerald-400 hover:text-emerald-700 font-semibold rounded-xl transition-colors text-base"
            >
              Produkte ansehen
            </a>
          </div>
        </div>

        {/* Key facts */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl mx-auto mt-16">
          {[
            { value: "bis zu 42€", label: "monatlich kostenlos", sub: "übernimmt die Pflegekasse" },
            { value: "Pflegegrad", valueNumber: "1–5", label: "anspruchsberechtigt", sub: "häusliche Pflege erforderlich" },
            { value: "Kein Rezept", label: "notwendig", sub: "wir regeln die Beantragung" },
          ].map(({ value, valueNumber, label, sub }) => (
            <div key={label} className="text-center bg-emerald-50 dark:bg-emerald-950/30 rounded-2xl px-6 py-6">
              <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mb-1">{value}</div>
              {valueNumber && <div className="text-2xl font-bold text-emerald-600 dark:text-white">{valueNumber}</div>}
              <div className="text-sm font-semibold text-gray-900 dark:text-white">{label}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{sub}</div>
            </div>
          ))}
        </div>
      </Section>

      {/* Produkte */}
      <Section title="Aus diesen Produkten können Sie wählen" subdued id="produkte">
        <p className="text-center text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-2xl mx-auto">
          Sie stellen monatlich Ihre persönliche Box aus dem verfügbaren Sortiment zusammen –
          ganz nach Ihrem Bedarf.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-w-4xl mx-auto">
          {PRODUCTS.map(({ label, icon }) => (
            <div
              key={label}
              className="flex items-center gap-3 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl px-4 py-3.5 shadow-sm"
            >
              <span className="text-xl shrink-0" aria-hidden="true">{icon}</span>
              <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{label}</span>
            </div>
          ))}
        </div>
      </Section>

    
      {/* Kostenübernahme */}
      <Section title="Wer trägt die Kosten?" subdued>
        <div className="max-w-3xl mx-auto space-y-6">
          <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
            Die Pflegeversicherung übernimmt die Kosten für Pflegehilfsmittel zum Verbrauch, sofern der
            Hilfsbedarf nachgewiesen ist und ein anerkannter Pflegegrad vorliegt. Weder ein Arztrezept noch
            ein Kostenvoranschlag sind erforderlich – wir regeln die Beantragung direkt mit Ihrer Pflegekasse.
          </p>
          <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
            
          </p>

          <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900 rounded-2xl px-6 py-5">

            <p className="text-lg text-gray-600 dark:text-gray-300">
            Voraussetzung ist, dass die Pflege <strong className="text-gray-900 dark:text-white">zu Hause</strong> stattfindet –
            entweder durch Angehörige oder ambulante Pflegedienste. Im stationären Bereich (Pflegeheim) sind
            diese Leistungen bereits im Heimsatz enthalten.
            </p>
          </div>
        </div>
      </Section>

    

      {/* CTA */}
      <Section subdued>
        <div className="max-w-2xl mx-auto text-center bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-3xl px-8 py-12 shadow-xl">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
            Jetzt Pflegehilfsmittelbox beantragen
          </h2>
          <p className="text-emerald-100 mb-8 text-base leading-relaxed">
            Füllen Sie unser Kontaktformular aus – wir melden uns zeitnah und übernehmen die
            komplette Beantragung bei Ihrer Pflegekasse. Kostenlos und ohne Aufwand für Sie.
          </p>
          <Link
            href="/kontaktform"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-emerald-700 hover:bg-emerald-50 font-bold rounded-xl transition-colors text-base shadow-sm"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
            </svg>
            Zum Kontaktformular
          </Link>
          <p className="text-emerald-200 text-xs mt-4">Kein Rezept erforderlich · kostenlos für Pflegebedürftige</p>
        </div>
      </Section>
    </>
  );
}
