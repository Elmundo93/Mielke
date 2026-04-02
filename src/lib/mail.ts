import { Resend } from "resend";
import { getLocation } from "@/lib/content";

const resend = new Resend(process.env.RESEND_API_KEY);

// Absender-Adresse – muss zur verifizierten Domain in Resend passen
const FROM = process.env.MAIL_FROM ?? "Sanitätshaus Mielke <kontakt@sanitaetshaus-mielke.de>";

// Fallback-Empfänger falls Standort keine E-Mail hat
const FALLBACK_TO = process.env.MAIL_FALLBACK_TO ?? "info@sanitaetshaus-mielke.de";

const ANLIEGEN_LABELS: Record<string, string> = {
  rezept:      "Rezept einsenden",
  hilfsmittel: "Hilfsmittelversorgung",
  termin:      "Terminanfrage",
  reparatur:   "Reparatur & Abholung",
  allgemein:   "Allgemeine Anfrage",
};

// ─── Typen ────────────────────────────────────────────────────────────────────

export interface MailPayload {
  anliegen:          string;
  anrede?:           string;
  vorname:           string;
  nachname:          string;
  geburtsdatum?:     string;
  strasse?:          string;
  plz?:              string;
  ort?:              string;
  email?:            string;
  telefon?:          string;
  krankenkasse?:     string;
  versichertenart?:  string;
  versicherungsnummer?: string;
  standort:          string;
  message?:          string;
  files:             File[];
}

// ─── Hauptfunktion ────────────────────────────────────────────────────────────

export async function sendContactMail(payload: MailPayload): Promise<void> {
  const location = await getLocation(payload.standort);
  const recipient = location?.email ?? FALLBACK_TO;
  const anliegenLabel = ANLIEGEN_LABELS[payload.anliegen] ?? payload.anliegen;
  const fullName = [payload.anrede, payload.vorname, payload.nachname].filter(Boolean).join(" ");

  // Dateianhänge konvertieren (File → Base64)
  const attachments = await Promise.all(
    payload.files.map(async (file) => ({
      filename: file.name,
      content: Buffer.from(await file.arrayBuffer()),
    }))
  );

  // 1 ── Interne Benachrichtigung an den Standort
  await resend.emails.send({
    from:        FROM,
    to:          recipient,
    replyTo:     payload.email || undefined,
    subject:     `Neue Anfrage: ${anliegenLabel} – ${fullName}`,
    html:        internalTemplate({ payload, anliegenLabel, fullName, locationName: location?.name }),
    attachments: attachments.length > 0 ? attachments : undefined,
  });

  // 2 ── Bestätigungs-E-Mail an den Kunden (nur wenn E-Mail angegeben)
  if (payload.email) {
    await resend.emails.send({
      from:    FROM,
      to:      payload.email,
      subject: `Ihre Anfrage bei Sanitätshaus Mielke – ${anliegenLabel}`,
      html:    confirmationTemplate({ payload, anliegenLabel, fullName, locationName: location?.name }),
    });
  }
}

// ─── HTML-Templates ───────────────────────────────────────────────────────────

function row(label: string, value: string | undefined) {
  if (!value) return "";
  return `
    <tr>
      <td style="padding:6px 12px 6px 0;color:#6b7280;font-size:13px;white-space:nowrap;vertical-align:top;">${label}</td>
      <td style="padding:6px 0;color:#111827;font-size:13px;">${value}</td>
    </tr>`;
}

function section(title: string, content: string) {
  return `
    <div style="margin-bottom:24px;">
      <div style="font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.08em;
                  color:#059669;border-bottom:1px solid #d1fae5;padding-bottom:6px;margin-bottom:12px;">
        ${title}
      </div>
      <table style="border-collapse:collapse;width:100%;">${content}</table>
    </div>`;
}

function internalTemplate({
  payload, anliegenLabel, fullName, locationName,
}: { payload: MailPayload; anliegenLabel: string; fullName: string; locationName?: string }) {
  const hasInsurance = payload.krankenkasse || payload.versichertenart || payload.versicherungsnummer;
  const adresse = [payload.strasse, [payload.plz, payload.ort].filter(Boolean).join(" ")]
    .filter(Boolean).join(", ");

  return `<!DOCTYPE html>
<html lang="de">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <div style="max-width:600px;margin:32px auto;background:#fff;border-radius:12px;overflow:hidden;
              box-shadow:0 1px 3px rgba(0,0,0,.1);">

    <!-- Header -->
    <div style="background:linear-gradient(135deg,#059669,#047857);padding:28px 32px;">
      <p style="margin:0;color:#a7f3d0;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:.08em;">
        Neue Kontaktanfrage
      </p>
      <h1 style="margin:6px 0 0;color:#fff;font-size:22px;font-weight:700;">${anliegenLabel}</h1>
      <p style="margin:4px 0 0;color:#d1fae5;font-size:13px;">
        Standort: ${locationName ?? payload.standort}
      </p>
    </div>

    <!-- Body -->
    <div style="padding:28px 32px;">

      ${section("Kontaktdaten",
        row("Name", fullName) +
        row("Geburtsdatum", payload.geburtsdatum) +
        row("Adresse", adresse) +
        row("Telefon", payload.telefon) +
        row("E-Mail", payload.email)
      )}

      ${hasInsurance ? section("Versicherung",
        row("Krankenkasse", payload.krankenkasse) +
        row("Versichertenart", payload.versichertenart) +
        row("Versicherungsnummer", payload.versicherungsnummer)
      ) : ""}

      ${payload.message ? section("Nachricht",
        `<tr><td colspan="2" style="font-size:13px;color:#374151;line-height:1.6;white-space:pre-wrap;">${payload.message}</td></tr>`
      ) : ""}

      ${payload.files.length > 0 ? `
        <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:12px 16px;">
          <p style="margin:0 0 6px;font-size:12px;font-weight:600;color:#059669;text-transform:uppercase;letter-spacing:.05em;">
            Anhänge (${payload.files.length})
          </p>
          ${payload.files.map(f => `<p style="margin:2px 0;font-size:13px;color:#374151;">📎 ${f.name}</p>`).join("")}
        </div>
      ` : ""}

    </div>

    <!-- Footer -->
    <div style="background:#f9fafb;border-top:1px solid #e5e7eb;padding:16px 32px;text-align:center;">
      <p style="margin:0;font-size:12px;color:#9ca3af;">
        Diese E-Mail wurde automatisch über das Kontaktformular auf sanitaetshaus-mielke.de gesendet.
      </p>
    </div>
  </div>
</body>
</html>`;
}

function confirmationTemplate({
  payload, anliegenLabel, fullName, locationName,
}: { payload: MailPayload; anliegenLabel: string; fullName: string; locationName?: string }) {
  return `<!DOCTYPE html>
<html lang="de">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <div style="max-width:600px;margin:32px auto;background:#fff;border-radius:12px;overflow:hidden;
              box-shadow:0 1px 3px rgba(0,0,0,.1);">

    <!-- Header -->
    <div style="background:linear-gradient(135deg,#059669,#047857);padding:28px 32px;">
      <h1 style="margin:0;color:#fff;font-size:22px;font-weight:700;">Vielen Dank, ${payload.vorname}!</h1>
      <p style="margin:6px 0 0;color:#d1fae5;font-size:14px;">
        Wir haben Ihre Anfrage erhalten und melden uns zeitnah.
      </p>
    </div>

    <!-- Body -->
    <div style="padding:28px 32px;">
      <p style="margin:0 0 20px;font-size:15px;color:#374151;line-height:1.6;">
        Ihre Anfrage vom Typ <strong>${anliegenLabel}</strong> wurde erfolgreich an unsere
        Filiale <strong>${locationName ?? payload.standort}</strong> weitergeleitet.
      </p>

      <div style="background:#f0fdf4;border-left:4px solid #059669;border-radius:0 8px 8px 0;
                  padding:16px 20px;margin-bottom:24px;">
        <p style="margin:0 0 4px;font-size:12px;font-weight:600;color:#059669;text-transform:uppercase;
                  letter-spacing:.06em;">Ihre Angaben</p>
        <table style="border-collapse:collapse;width:100%;margin-top:8px;">
          ${row("Anliegen", anliegenLabel)}
          ${row("Name", fullName)}
          ${row("Standort", locationName ?? payload.standort)}
        </table>
      </div>

      <p style="margin:0 0 8px;font-size:14px;color:#6b7280;">
        Sollten Sie dringende Rückfragen haben, erreichen Sie uns auch telefonisch:
      </p>
      <p style="margin:0;font-size:14px;color:#374151;">
        <strong>Hauptfiliale Witzenhausen:</strong> +49 5542 910112
      </p>
    </div>

    <!-- Footer -->
    <div style="background:#f9fafb;border-top:1px solid #e5e7eb;padding:16px 32px;text-align:center;">
      <p style="margin:0 0 4px;font-size:12px;color:#9ca3af;">
        Sanitätshaus Mielke · Ermschwerder Straße 23 · 37213 Witzenhausen
      </p>
      <p style="margin:0;font-size:11px;color:#d1d5db;">
        Diese Nachricht wurde automatisch erstellt. Bitte antworten Sie nicht auf diese E-Mail.
      </p>
    </div>
  </div>
</body>
</html>`;
}
