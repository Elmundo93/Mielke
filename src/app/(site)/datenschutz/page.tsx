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

  const verantwortlicher = [imp.companyName, imp.rechtsform].filter(Boolean).join(" ");
  const inhaber = imp.ownerName;
  const adresse = [imp.address, `${imp.postalCode} ${imp.city}`.trim()].filter(Boolean).join(", ");

  const s = ds.sections;

  // Sequential section counter
  let n = 0;
  const N = () => ++n;

  const nVerantwortlicher = N();
  const nBeauftragter = ds.datenschutzbeauftragter.aktiv ? N() : 0;
  const nHosting = s.hosting.enabled ? N() : 0;
  const nKontakt = s.kontaktformular.enabled ? N() : 0;
  const nGesundheit = s.gesundheitsdaten.enabled ? N() : 0;
  const nUpload = s.dateiupload.enabled ? N() : 0;
  const nSmtp = s.smtp.enabled ? N() : 0;
  const nLogs = s.logs.enabled ? N() : 0;
  const nCookies = s.cookies.enabled ? N() : 0;
  const nKarten = s.karten.enabled ? N() : 0;
  const nRechte = s.betroffenenrechte.enabled ? N() : 0;
  const nWeitergabe = s.weitergabe.enabled ? N() : 0;
  const nTracking = s.tracking.enabled ? N() : 0;

  return (
    <div className="bg-white dark:bg-gray-950 min-h-screen">
      <div className="max-w-2xl mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Datenschutzerklärung</h1>
        {ds.letzteAktualisierung && (
          <p className="text-sm text-gray-400 mb-10">
            Stand:{" "}
            {new Date(ds.letzteAktualisierung).toLocaleDateString("de-DE", {
              day: "2-digit", month: "long", year: "numeric",
            })}
          </p>
        )}

        {/* 1. Verantwortlicher — always shown */}
        <DsSection title={`${nVerantwortlicher}. Verantwortlicher`}>
          <p>Verantwortlicher im Sinne der DSGVO ist:</p>
          <div className="mt-2 space-y-0.5">
            {verantwortlicher && <p className="font-medium">{verantwortlicher}</p>}
            {inhaber && <p>{inhaber}</p>}
            {adresse && <p>{adresse}</p>}
            {imp.phone && <p>Tel.: {imp.phone}</p>}
            {imp.email && (
              <p>E-Mail:{" "}
                <a href={`mailto:${imp.email}`} className="text-emerald-600 hover:underline">{imp.email}</a>
              </p>
            )}
          </div>
        </DsSection>

        {/* Datenschutzbeauftragter (optional) */}
        {ds.datenschutzbeauftragter.aktiv && ds.datenschutzbeauftragter.name && (
          <DsSection title={`${nBeauftragter}. Datenschutzbeauftragter`}>
            <p>
              Unser Datenschutzbeauftragter ist:{" "}
              <span className="font-medium">{ds.datenschutzbeauftragter.name}</span>
              {ds.datenschutzbeauftragter.email && (
                <>{" · "}<a href={`mailto:${ds.datenschutzbeauftragter.email}`} className="text-emerald-600 hover:underline">{ds.datenschutzbeauftragter.email}</a></>
              )}
            </p>
          </DsSection>
        )}

        {/* Hosting */}
        {s.hosting.enabled && (
          <DsSection title={`${nHosting}. Hosting`}>
            <p>
              Diese Website wird bei{" "}
              <span className="font-medium">{s.hosting.anbieter || "einem externen Anbieter"}</span>
              {s.hosting.standort && (
                <> mit Serverstandort in <span className="font-medium">{s.hosting.standort}</span></>
              )}{" "}
              gehostet. Beim Aufruf der Website werden serverseitig Zugriffsdaten erhoben (IP-Adresse,
              Datum/Uhrzeit, aufgerufene Seite, Referrer-URL, Browser-Typ). Diese Daten dienen
              ausschließlich dem technischen Betrieb und der Sicherheit der Website. Rechtsgrundlage
              ist Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse am sicheren Betrieb).
            </p>
          </DsSection>
        )}

        {/* Kontaktformular */}
        {s.kontaktformular.enabled && (
          <DsSection title={`${nKontakt}. Kontaktformular`}>
            <p>
              Bei der Nutzung unseres Kontaktformulars verarbeiten wir folgende Daten zur Bearbeitung
              Ihrer Anfrage:
            </p>
            <ul className="mt-2 list-disc list-inside space-y-1">
              <li>Name, Vorname</li>
              <li>E-Mail-Adresse und/oder Telefonnummer</li>
              <li>Gewähltes Anliegen und Nachrichtentext</li>
              <li>Gewünschter Standort</li>
            </ul>
            <p className="mt-3">
              Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO (Vertragsanbahnung) bzw. Art. 6 Abs. 1
              lit. f DSGVO (berechtigtes Interesse an der Beantwortung von Anfragen). Die übermittelten
              Daten werden ausschließlich zur Beantwortung Ihrer Anfrage verwendet und nicht dauerhaft
              in einer Datenbank gespeichert.
            </p>
          </DsSection>
        )}

        {/* Gesundheitsdaten */}
        {s.gesundheitsdaten.enabled && (
          <DsSection title={`${nGesundheit}. Besondere Kategorien personenbezogener Daten (Art. 9 DSGVO)`}>
            <p>
              Für Rezepteinreichungen und Hilfsmittelanfragen verarbeiten wir auf Grundlage Ihrer
              ausdrücklichen Einwilligung gemäß{" "}
              <span className="font-medium">Art. 9 Abs. 2 lit. a DSGVO</span> die übermittelten
              Angaben (Name, Kontaktdaten, Nachricht, ggf. hochgeladene Dokumente). Diese Daten
              werden ausschließlich zur Bearbeitung Ihres Anliegens genutzt.
            </p>
            <p className="mt-2">
              Die Einwilligung wird im Formular vor der Dateneingabe eingeholt. Sie können diese
              jederzeit widerrufen; die Rechtmäßigkeit der bis zum Widerruf erfolgten Verarbeitung
              bleibt davon unberührt.
            </p>
            <p className="mt-2">
              Wir bitten ausdrücklich darum, im Freitextfeld{" "}
              <strong>keine Diagnosen, Medikamentennamen oder weiteren medizinischen Informationen</strong>{" "}
              einzugeben. Versicherungs- und Arztdaten werden bei der telefonischen Rücksprache aufgenommen.
            </p>
          </DsSection>
        )}

        {/* Dateiupload */}
        {s.dateiupload.enabled && (
          <DsSection title={`${nUpload}. Dateiupload (Rezeptservice)`}>
            <p>
              Über unseren Rezeptservice können Sie Dokumente (PDF, JPG, PNG, WebP; max. 5 MB pro
              Datei, max. 5 Dateien) hochladen. Diese Dateien werden ausschließlich als E-Mail-Anhang
              an die zuständige Filiale weitergeleitet und{" "}
              <strong>nicht dauerhaft gespeichert</strong>. Eine Speicherung auf Servern oder
              Cloudspeichern findet nicht statt. Zulässige Dateitypen werden serverseitig auf Typ und
              Inhalt geprüft.
            </p>
          </DsSection>
        )}

        {/* SMTP */}
        {s.smtp.enabled && (
          <DsSection title={`${nSmtp}. E-Mail-Versand`}>
            <p>
              Für den Versand von Kontaktbestätigungen nutzen wir{" "}
              {s.smtp.anbieter
                ? <span>den SMTP-Dienst von <span className="font-medium">{s.smtp.anbieter}</span></span>
                : "einen externen SMTP-Dienst"
              }. Die Übertragung erfolgt verschlüsselt (TLS/STARTTLS). Rechtsgrundlage ist
              Art. 6 Abs. 1 lit. b bzw. f DSGVO.
            </p>
          </DsSection>
        )}

        {/* Server-Logs */}
        {s.logs.enabled && (
          <DsSection title={`${nLogs}. Server-Logs`}>
            <p>
              Unser Hosting-Anbieter erhebt und speichert automatisch Informationen in Server-Log-Dateien,
              die Ihr Browser übermittelt. Dies umfasst insbesondere IP-Adresse, Datum und Uhrzeit des
              Abrufs, übertragene Datenmenge und den anfragenden Provider. Diese Daten werden nicht mit
              anderen Datenquellen zusammengeführt. Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO.
            </p>
          </DsSection>
        )}

        {/* Cookies */}
        {s.cookies.enabled && (
          <DsSection title={`${nCookies}. Cookies`}>
            <p>
              Diese Website verwendet Cookies. Cookies sind kleine Textdateien, die auf Ihrem Endgerät
              gespeichert werden und die Ihr Browser an uns übermittelt, wenn Sie unsere Website besuchen.
            </p>
            {s.cookies.details && <p className="mt-2">{s.cookies.details}</p>}
          </DsSection>
        )}

        {/* Karten */}
        {s.karten.enabled && (
          <DsSection title={`${nKarten}. Kartendienste`}>
            <p>
              Diese Website nutzt {s.karten.anbieter || "einen externen Kartendienst"} zur Darstellung
              von Standortkarten. Beim Laden einer Karte wird eine Verbindung zu den Servern des
              Anbieters hergestellt, wobei Ihre IP-Adresse übertragen werden kann. Wir verwenden
              datenschutzfreundliche Einbindungen ohne automatische Datenübertragung an kommerzielle
              Kartendienste. Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO.
            </p>
          </DsSection>
        )}

        {/* Betroffenenrechte */}
        {s.betroffenenrechte.enabled && (
          <DsSection title={`${nRechte}. Ihre Rechte als betroffene Person`}>
            <p>Sie haben nach der DSGVO folgende Rechte:</p>
            <ul className="mt-2 list-disc list-inside space-y-1">
              <li><strong>Auskunft</strong> (Art. 15): Auskunft über Ihre gespeicherten Daten.</li>
              <li><strong>Berichtigung</strong> (Art. 16): Berichtigung unrichtiger Daten.</li>
              <li><strong>Löschung</strong> (Art. 17): Löschung, soweit keine Aufbewahrungspflichten entgegenstehen.</li>
              <li><strong>Einschränkung der Verarbeitung</strong> (Art. 18).</li>
              <li><strong>Datenübertragbarkeit</strong> (Art. 20).</li>
              <li><strong>Widerspruch</strong> (Art. 21): gegen Verarbeitung auf Basis berechtigter Interessen.</li>
              <li><strong>Widerruf einer Einwilligung</strong> (Art. 7 Abs. 3): jederzeit für die Zukunft.</li>
            </ul>
            <p className="mt-3">
              Zur Geltendmachung Ihrer Rechte wenden Sie sich an die oben genannte Kontaktadresse.
              Sie haben zudem das Recht, sich bei der zuständigen Datenschutzaufsichtsbehörde zu beschweren.
            </p>
          </DsSection>
        )}

        {/* Keine Weitergabe */}
        {s.weitergabe.enabled && (
          <DsSection title={`${nWeitergabe}. Keine Weitergabe an Dritte`}>
            <p>
              Ihre personenbezogenen Daten werden nicht an Dritte weitergegeben, soweit dies nicht zur
              Vertragserfüllung, aufgrund gesetzlicher Verpflichtung oder mit Ihrer ausdrücklichen
              Einwilligung erforderlich ist. Auftragsverarbeiter (Hosting, E-Mail-Versand) sind
              vertraglich zur Einhaltung der DSGVO verpflichtet.
            </p>
          </DsSection>
        )}

        {/* Kein Tracking */}
        {s.tracking.enabled && (
          <DsSection title={`${nTracking}. Keine Analyse- oder Tracking-Dienste`}>
            <p>
              Diese Website verwendet keine Analyse- oder Tracking-Werkzeuge (z.&nbsp;B. Google
              Analytics, Meta-Pixel oder ähnliche Dienste). Es werden keine Cookies zu Werbe- oder
              Analysezwecken gesetzt.
            </p>
          </DsSection>
        )}
      </div>
    </div>
  );
}

function DsSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-8">
      <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">{title}</h2>
      <div className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed space-y-2">
        {children}
      </div>
    </section>
  );
}
