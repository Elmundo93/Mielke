import type { Metadata } from "next";
import { getImpressumContent } from "@/lib/content";

export const metadata: Metadata = {
  title: "Impressum | Sanitätshaus Mielke",
  description: "Impressum und Anbieterkennzeichnung gemäß § 5 TMG für Sanitätshaus Mielke.",
  alternates: {
    canonical: "/impressum",
  },
  robots: {
    index: false,
  },
};

export default async function ImpressumPage() {
  const imp = await getImpressumContent();

  return (
    <div className="bg-white dark:bg-gray-950 min-h-screen">
      <div className="max-w-2xl mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-10">Impressum</h1>

        {/* Angaben gemäß § 5 TMG */}
        <section className="mb-8">
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
            Angaben gemäß § 5 TMG
          </h2>
          <div className="text-gray-700 dark:text-gray-300 space-y-0.5">
            {imp.companyName && (
              <p className="font-semibold text-gray-900 dark:text-white">{imp.companyName}</p>
            )}
            {imp.ownerName && <p>{imp.ownerName}</p>}
            {imp.address && <p>{imp.address}</p>}
            {(imp.postalCode || imp.city) && (
              <p>
                {imp.postalCode} {imp.city}
              </p>
            )}
          </div>
        </section>

        {/* Kontakt */}
        <section className="mb-8">
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
            Kontakt
          </h2>
          <div className="text-gray-700 dark:text-gray-300 space-y-1">
            {imp.phone && (
              <p>
                Telefon:{" "}
                <a
                  href={`tel:${imp.phone.replace(/\s/g, "")}`}
                  className="text-emerald-600 dark:text-emerald-400 hover:underline"
                >
                  {imp.phone}
                </a>
              </p>
            )}
            {imp.email && (
              <p>
                E-Mail:{" "}
                <a
                  href={`mailto:${imp.email}`}
                  className="text-emerald-600 dark:text-emerald-400 hover:underline"
                >
                  {imp.email}
                </a>
              </p>
            )}
          </div>
        </section>

        {/* Umsatzsteuer */}
        {imp.ustIdNr && (
          <section className="mb-8">
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
              Umsatzsteuer-ID
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              Umsatzsteuer-Identifikationsnummer gemäß § 27a Umsatzsteuergesetz:{" "}
              <span className="font-medium text-gray-900 dark:text-white">{imp.ustIdNr}</span>
            </p>
          </section>
        )}

        {/* Berufsbezeichnung */}
        {(imp.beruf || imp.kammer) && (
          <section className="mb-8">
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
              Berufsbezeichnung und berufsrechtliche Regelungen
            </h2>
            <div className="text-gray-700 dark:text-gray-300 space-y-1">
              {imp.beruf && <p>Berufsbezeichnung: {imp.beruf}</p>}
              {imp.kammer && <p>Zuständige Kammer: {imp.kammer}</p>}
            </div>
          </section>
        )}

        {/* Verantwortlich für den Inhalt */}
        {(imp.responsibleName || imp.responsibleAddress) && (
          <section className="mb-8">
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
              Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV
            </h2>
            <div className="text-gray-700 dark:text-gray-300 space-y-0.5">
              {imp.responsibleName && <p>{imp.responsibleName}</p>}
              {imp.responsibleAddress && <p>{imp.responsibleAddress}</p>}
              {(imp.responsiblePostalCode || imp.responsibleCity) && (
                <p>
                  {imp.responsiblePostalCode} {imp.responsibleCity}
                </p>
              )}
            </div>
          </section>
        )}

        {/* Streitschlichtung */}
        <section className="mb-8">
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
            Streitschlichtung
          </h2>
          <div className="text-gray-700 dark:text-gray-300 space-y-3 text-sm leading-relaxed">
            <p>
              Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:{" "}
              <a
                href="https://ec.europa.eu/consumers/odr/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-600 dark:text-emerald-400 hover:underline"
              >
                https://ec.europa.eu/consumers/odr/
              </a>
            </p>
            <p>
              Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer
              Verbraucherschlichtungsstelle teilzunehmen.
            </p>
          </div>
        </section>

        {/* Haftung für Inhalte */}
        <section className="mb-8">
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
            Haftung für Inhalte
          </h2>
          <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
            Als Diensteanbieter sind wir gemäß § 7 Abs. 1 TMG für eigene Inhalte auf diesen Seiten
            nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als
            Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde
            Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige
            Tätigkeit hinweisen. Verpflichtungen zur Entfernung oder Sperrung der Nutzung von
            Informationen nach den allgemeinen Gesetzen bleiben hiervon unberührt. Eine
            diesbezügliche Haftung ist jedoch erst ab dem Zeitpunkt der Kenntnis einer konkreten
            Rechtsverletzung möglich. Bei Bekanntwerden von entsprechenden Rechtsverletzungen werden
            wir diese Inhalte umgehend entfernen.
          </p>
        </section>

        {/* Haftung für Links */}
        <section>
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
            Haftung für Links
          </h2>
          <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
            Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen
            Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr
            übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder
            Betreiber der Seiten verantwortlich. Die verlinkten Seiten wurden zum Zeitpunkt der
            Verlinkung auf mögliche Rechtsverstöße überprüft. Rechtswidrige Inhalte waren zum
            Zeitpunkt der Verlinkung nicht erkennbar. Eine permanente inhaltliche Kontrolle der
            verlinkten Seiten ist jedoch ohne konkrete Anhaltspunkte einer Rechtsverletzung nicht
            zumutbar. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Links umgehend
            entfernen.
          </p>
        </section>
      </div>
    </div>
  );
}
