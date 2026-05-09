import type { Metadata } from "next";
import { getImpressumContent } from "@/lib/content";

export const metadata: Metadata = {
  title: "Impressum | Sanitätshaus Mielke",
  description: "Impressum und Anbieterkennzeichnung gemäß § 5 DDG für Sanitätshaus Mielke.",
  alternates: { canonical: "/impressum" },
  robots: { index: false },
};

function ImpSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-8">
      <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">{title}</h2>
      <div className="text-gray-700 dark:text-gray-300 space-y-0.5 text-sm leading-relaxed">
        {children}
      </div>
    </section>
  );
}

export default async function ImpressumPage() {
  const imp = await getImpressumContent();

  const hasRegister = imp.registerGericht || imp.registerNummer;
  const hasBerufsangaben = imp.beruf || imp.kammer || imp.berufsordnung;
  const hasResponsible = imp.responsibleName || imp.responsibleAddress;

  return (
    <div className="bg-white dark:bg-gray-950 min-h-screen">
      <div className="max-w-2xl mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-10">Impressum</h1>

        {/* Angaben gemäß § 5 DDG */}
        <ImpSection title="Angaben gemäß § 5 DDG">
          {imp.companyName && <p className="font-semibold text-gray-900 dark:text-white">{imp.companyName}</p>}
          {imp.rechtsform && <p>{imp.rechtsform}</p>}
          {imp.ownerName && <p>{imp.ownerName}</p>}
          {imp.address && <p>{imp.address}</p>}
          {(imp.postalCode || imp.city) && <p>{imp.postalCode} {imp.city}</p>}
        </ImpSection>

        {/* Kontakt */}
        <ImpSection title="Kontakt">
          {imp.phone && (
            <p>Telefon:{" "}
              <a href={`tel:${imp.phone.replace(/\s/g, "")}`} className="text-emerald-600 dark:text-emerald-400 hover:underline">{imp.phone}</a>
            </p>
          )}
          {imp.email && (
            <p>E-Mail:{" "}
              <a href={`mailto:${imp.email}`} className="text-emerald-600 dark:text-emerald-400 hover:underline">{imp.email}</a>
            </p>
          )}
          {imp.website && <p>Web: {imp.website}</p>}
        </ImpSection>

        {/* Handelsregister */}
        {hasRegister && (
          <ImpSection title="Handelsregister">
            {imp.registerGericht && <p>Amtsgericht: {imp.registerGericht}</p>}
            {imp.registerNummer && <p>Registernummer: {imp.registerNummer}</p>}
          </ImpSection>
        )}

        {/* USt-ID */}
        {imp.ustIdNr && (
          <ImpSection title="Umsatzsteuer-ID">
            <p>Umsatzsteuer-Identifikationsnummer gemäß § 27a UStG:{" "}
              <span className="font-medium text-gray-900 dark:text-white">{imp.ustIdNr}</span>
            </p>
          </ImpSection>
        )}

        {/* Aufsicht */}
        {imp.aufsichtsbehoerde && (
          <ImpSection title="Aufsichtsbehörde">
            <p>{imp.aufsichtsbehoerde}</p>
          </ImpSection>
        )}

        {/* Berufsangaben */}
        {hasBerufsangaben && (
          <ImpSection title="Berufsbezeichnung und berufsrechtliche Regelungen">
            {imp.beruf && <p>Berufsbezeichnung: {imp.beruf}</p>}
            {imp.kammer && <p>Zuständige Kammer: {imp.kammer}</p>}
            {imp.berufsordnung && (
              <p>Berufsordnung:{" "}
                {imp.berufsordnung.startsWith("http")
                  ? <a href={imp.berufsordnung} target="_blank" rel="noopener noreferrer" className="text-emerald-600 dark:text-emerald-400 hover:underline">{imp.berufsordnung}</a>
                  : imp.berufsordnung}
              </p>
            )}
          </ImpSection>
        )}

        {/* Verantwortlicher */}
        {hasResponsible && (
          <ImpSection title="Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV">
            {imp.responsibleName && <p>{imp.responsibleName}</p>}
            {imp.responsibleAddress && <p>{imp.responsibleAddress}</p>}
            {(imp.responsiblePostalCode || imp.responsibleCity) && (
              <p>{imp.responsiblePostalCode} {imp.responsibleCity}</p>
            )}
          </ImpSection>
        )}

        {/* Streitschlichtung */}
        <ImpSection title="Streitschlichtung">
          <p>
            Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:{" "}
            <a href="https://ec.europa.eu/consumers/odr/" target="_blank" rel="noopener noreferrer"
              className="text-emerald-600 dark:text-emerald-400 hover:underline">
              https://ec.europa.eu/consumers/odr/
            </a>
          </p>
          <p className="mt-2">
            Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer
            Verbraucherschlichtungsstelle teilzunehmen.
          </p>
        </ImpSection>

        {/* Haftung für Inhalte */}
        <ImpSection title="Haftung für Inhalte">
          <p>
            Als Diensteanbieter sind wir gemäß § 7 Abs. 1 DDG für eigene Inhalte auf diesen Seiten nach
            den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 DDG sind wir als Diensteanbieter
            jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen
            oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen.
            Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach den allgemeinen
            Gesetzen bleiben hiervon unberührt. Eine diesbezügliche Haftung ist jedoch erst ab dem Zeitpunkt
            der Kenntnis einer konkreten Rechtsverletzung möglich. Bei Bekanntwerden von entsprechenden
            Rechtsverletzungen werden wir diese Inhalte umgehend entfernen.
          </p>
        </ImpSection>

        {/* Haftung für Links */}
        <ImpSection title="Haftung für Links">
          <p>
            Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss
            haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte
            der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich.
            Die verlinkten Seiten wurden zum Zeitpunkt der Verlinkung auf mögliche Rechtsverstöße überprüft.
            Rechtswidrige Inhalte waren zum Zeitpunkt der Verlinkung nicht erkennbar. Eine permanente
            inhaltliche Kontrolle der verlinkten Seiten ist jedoch ohne konkrete Anhaltspunkte einer
            Rechtsverletzung nicht zumutbar. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige
            Links umgehend entfernen.
          </p>
        </ImpSection>
      </div>
    </div>
  );
}
