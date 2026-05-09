import type { Metadata } from "next";
import { getImpressumContent, getDatenschutzContent } from "@/lib/content";

export const metadata: Metadata = {
  title: "Datenschutzerklärung | Sanitätshaus Mielke",
  description: "Informationen zur Verarbeitung personenbezogener Daten gemäß DSGVO.",
  alternates: { canonical: "/datenschutz" },
  robots: { index: false },
};

export default async function DatenschutzPage() {
  const [imp, ds] = await Promise.all([getImpressumContent(), getDatenschutzContent()]);

  const verantwortlicher = [imp.companyName, imp.ownerName].filter(Boolean).join(", ");
  const adresse = [imp.address, `${imp.postalCode} ${imp.city}`.trim()].filter(Boolean).join(", ");

  // Sequential section counter
  let n = 0;
  const N = () => ++n;

  const nVerantwortlicher = N();
  const nBeauftragter = ds.datenschutzbeauftragterAktiv ? N() : 0;
  const nHosting = N();
  const nKontakt = N();
  const nGesundheit = N();
  const nUpload = ds.rezeptUploadAktiv ? N() : 0;
  const nSmtp = N();
  const nRechte = N();
  const nWeitergabe = N();
  const nTracking = N();

  return (
    <div className="bg-white dark:bg-gray-950 min-h-screen">
      <div className="max-w-2xl mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Datenschutzerklärung</h1>
        {ds.letzteAktualisierung && (
          <p className="text-sm text-gray-400 mb-10">
            Stand:{" "}
            {new Date(ds.letzteAktualisierung).toLocaleDateString("de-DE", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            })}
          </p>
        )}

        {/* Verantwortlicher */}
        <Section title={`${nVerantwortlicher}. Verantwortlicher`}>
          <p>Verantwortlicher im Sinne der DSGVO ist:</p>
          <div className="mt-2 space-y-0.5">
            {verantwortlicher && <p className="font-medium">{verantwortlicher}</p>}
            {adresse && <p>{adresse}</p>}
            {imp.phone && <p>Tel.: {imp.phone}</p>}
            {imp.email && (
              <p>
                E-Mail:{" "}
                <a href={`mailto:${imp.email}`} className="text-emerald-600 hover:underline">
                  {imp.email}
                </a>
              </p>
            )}
          </div>
        </Section>

        {/* Datenschutzbeauftragter (optional) */}
        {ds.datenschutzbeauftragterAktiv && ds.datenschutzbeauftragterName && (
          <Section title={`${nBeauftragter}. Datenschutzbeauftragter`}>
            <p>
              Unser Datenschutzbeauftragter ist:{" "}
              <span className="font-medium">{ds.datenschutzbeauftragterName}</span>
              {ds.datenschutzbeauftragterEmail && (
                <>
                  {" · "}
                  <a
                    href={`mailto:${ds.datenschutzbeauftragterEmail}`}
                    className="text-emerald-600 hover:underline"
                  >
                    {ds.datenschutzbeauftragterEmail}
                  </a>
                </>
              )}
            </p>
          </Section>
        )}

        {/* Hosting */}
        <Section title={`${nHosting}. Hosting`}>
          <p>
            Diese Website wird bei{" "}
            <span className="font-medium">{ds.hostingAnbieter || "einem externen Anbieter"}</span>
            {ds.hostingStandort && (
              <>
                {" "}mit Serverstandort in{" "}
                <span className="font-medium">{ds.hostingStandort}</span>
              </>
            )}{" "}
            gehostet. Beim Aufruf der Website werden serverseitig Zugriffsdaten erhoben
            (IP-Adresse, Datum/Uhrzeit, aufgerufene Seite, Referrer-URL, Browser-Typ). Diese
            Daten dienen ausschließlich dem technischen Betrieb und der Sicherheit der Website.
            Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse am sicheren
            Betrieb).
          </p>
        </Section>

        {/* Kontaktformular */}
        <Section title={`${nKontakt}. Kontaktformular`}>
          <p>
            Bei der Nutzung unseres Kontaktformulars verarbeiten wir folgende Daten zur
            Bearbeitung Ihrer Anfrage:
          </p>
          <ul className="mt-2 list-disc list-inside space-y-1">
            <li>Name, Vorname</li>
            <li>E-Mail-Adresse und/oder Telefonnummer</li>
            <li>Anschrift (optional)</li>
            <li>Gewähltes Anliegen und Nachrichtentext</li>
            <li>Gewünschter Standort</li>
          </ul>
          <p className="mt-3">
            Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO (Vertragsanbahnung) bzw. Art. 6 Abs. 1
            lit. f DSGVO (berechtigtes Interesse an der Beantwortung von Anfragen). Die
            übermittelten Daten werden ausschließlich zur Beantwortung Ihrer Anfrage verwendet und
            nicht dauerhaft in einer Datenbank gespeichert.
          </p>
        </Section>

        {/* Gesundheitsdaten */}
        <Section
          title={`${nGesundheit}. Besondere Kategorien personenbezogener Daten (Art. 9 DSGVO)`}
        >
          <p>
            Für Anfragen zu Rezepteinreichungen und Hilfsmittelversorgungen können Sie freiwillig
            Versicherungsdaten (Krankenkasse, Versichertenart, Versicherungsnummer, Geburtsdatum)
            übermitteln. Diese Daten stellen besondere Kategorien personenbezogener Daten gemäß{" "}
            <span className="font-medium">Art. 9 Abs. 1 DSGVO</span> dar.
          </p>
          <p className="mt-2">
            Die Verarbeitung erfolgt ausschließlich auf Grundlage Ihrer ausdrücklichen Einwilligung
            gemäß <span className="font-medium">Art. 9 Abs. 2 lit. a DSGVO</span>, die Sie im
            Formular erteilen. Sie können diese Einwilligung jederzeit widerrufen; die
            Rechtmäßigkeit der bis zum Widerruf erfolgten Verarbeitung bleibt davon unberührt.
          </p>
          <p className="mt-2">
            Wir bitten ausdrücklich darum, im Freitextfeld des Formulars{" "}
            <strong>keine Diagnosen, Medikamentennamen oder sonstigen medizinischen Informationen</strong>{" "}
            einzugeben, die über die abgefragten Versicherungsangaben hinausgehen.
          </p>
        </Section>

        {/* Dateiupload (optional) */}
        {ds.rezeptUploadAktiv && (
          <Section title={`${nUpload}. Dateiupload (Rezeptservice)`}>
            <p>
              Über unseren Rezeptservice können Sie Dokumente (PDF, JPG, PNG, WebP; max. 5 MB
              pro Datei, max. 5 Dateien) hochladen. Diese Dateien werden ausschließlich als
              E-Mail-Anhang an die zuständige Filiale weitergeleitet und{" "}
              <strong>nicht dauerhaft gespeichert</strong>. Eine Speicherung auf Servern oder
              Cloudspeichern findet nicht statt. Zulässige Dateitypen werden serverseitig auf
              Typ und Inhalt geprüft.
            </p>
          </Section>
        )}

        {/* E-Mail-Versand */}
        <Section title={`${nSmtp}. E-Mail-Versand`}>
          <p>
            Für den Versand von Kontaktbestätigungen nutzen wir{" "}
            {ds.smtpAnbieter ? (
              <>
                den SMTP-Dienst von{" "}
                <span className="font-medium">{ds.smtpAnbieter}</span>.
              </>
            ) : (
              "einen externen SMTP-Dienst."
            )}{" "}
            Die Übertragung erfolgt verschlüsselt (TLS/STARTTLS). Rechtsgrundlage ist Art. 6
            Abs. 1 lit. b bzw. f DSGVO.
          </p>
        </Section>

        {/* Betroffenenrechte */}
        <Section title={`${nRechte}. Ihre Rechte als betroffene Person`}>
          <p>Sie haben nach der DSGVO folgende Rechte:</p>
          <ul className="mt-2 list-disc list-inside space-y-1">
            <li>
              <strong>Auskunft</strong> (Art. 15): Auskunft über Ihre gespeicherten Daten.
            </li>
            <li>
              <strong>Berichtigung</strong> (Art. 16): Berichtigung unrichtiger Daten.
            </li>
            <li>
              <strong>Löschung</strong> (Art. 17): Löschung, soweit keine Aufbewahrungspflichten
              entgegenstehen.
            </li>
            <li>
              <strong>Einschränkung der Verarbeitung</strong> (Art. 18).
            </li>
            <li>
              <strong>Datenübertragbarkeit</strong> (Art. 20).
            </li>
            <li>
              <strong>Widerspruch</strong> (Art. 21): gegen Verarbeitung auf Basis berechtigter
              Interessen.
            </li>
            <li>
              <strong>Widerruf einer Einwilligung</strong> (Art. 7 Abs. 3): jederzeit für die
              Zukunft.
            </li>
          </ul>
          <p className="mt-3">
            Zur Geltendmachung Ihrer Rechte wenden Sie sich an die oben genannte Kontaktadresse.
            Sie haben zudem das Recht, sich bei der zuständigen Datenschutzaufsichtsbehörde zu
            beschweren.
          </p>
        </Section>

        {/* Keine Weitergabe */}
        <Section title={`${nWeitergabe}. Keine Weitergabe an Dritte`}>
          <p>
            Ihre personenbezogenen Daten werden nicht an Dritte weitergegeben, soweit dies nicht
            zur Vertragserfüllung, aufgrund gesetzlicher Verpflichtung oder mit Ihrer
            ausdrücklichen Einwilligung erforderlich ist. Auftragsverarbeiter (Hosting,
            E-Mail-Versand) sind vertraglich zur Einhaltung der DSGVO verpflichtet.
          </p>
        </Section>

        {/* Keine Tracking-/Analyse-Dienste */}
        <Section title={`${nTracking}. Keine Analyse- oder Tracking-Dienste`}>
          <p>
            Diese Website verwendet keine Analyse- oder Tracking-Werkzeuge (z.&nbsp;B. Google
            Analytics, Meta-Pixel oder ähnliche Dienste). Es werden keine Cookies zu Werbe- oder
            Analysezwecken gesetzt. Kartendarstellungen erfolgen über OpenStreetMap (Leaflet) —
            dabei werden keine Daten an Google oder andere kommerzielle Kartendienste übertragen.
          </p>
        </Section>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-8">
      <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
        {title}
      </h2>
      <div className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed space-y-2">
        {children}
      </div>
    </section>
  );
}
