import nodemailer from "nodemailer";
import type SMTPTransport from "nodemailer/lib/smtp-transport";
import { getLocation } from "@/lib/content";
import { readSmtpSettings, resolveSmtpConfig } from "@/lib/settings";

const ANLIEGEN_LABELS: Record<string, string> = {
  rezept: "Rezept einsenden",
  hilfsmittel: "Hilfsmittelanfrage",
  termin: "Terminanfrage",
  reparatur: "Reparatur & Abholung",
  allgemein: "Allgemeine Anfrage",
};

export interface HealthcareMailPayload {
  type: "rezept" | "hilfsmittel";
  anrede?: string;
  vorname: string;
  nachname: string;
  email?: string;
  telefon?: string;
  standort?: string;
  message?: string;
  consentTimestamp: string;
  files: File[];
}

export interface MailPayload {
  anliegen: string;
  anrede?: string;
  vorname: string;
  nachname: string;
  email?: string;
  telefon?: string;
  standort?: string;
  message?: string;
  files: File[];
}

type MailAttachment = {
  filename: string;
  content: Buffer;
  contentType?: string;
};

async function createTransporter() {
  const stored = await readSmtpSettings();
  const config = resolveSmtpConfig(stored);

  if (!config.host || !config.user || !config.pass) {
    throw new Error(
      "[mail] SMTP nicht konfiguriert. Bitte unter Admin → E-Mail-Einstellungen einrichten."
    );
  }

  if (!Number.isInteger(config.port) || config.port <= 0) {
    throw new Error("[mail] SMTP_PORT muss eine gültige Portnummer sein.");
  }

  const options: SMTPTransport.Options = {
    host: config.host,
    port: config.port,
    secure: config.secure,
    auth: { user: config.user, pass: config.pass },
    requireTLS: config.port === 587,
  };

  return { transporter: nodemailer.createTransport(options), config };
}

export async function sendContactMail(payload: MailPayload): Promise<void> {
  const [location, { transporter, config }] = await Promise.all([
    payload.standort ? getLocation(payload.standort) : Promise.resolve(null),
    createTransporter(),
  ]);

  const recipient = location?.email || config.fallbackTo;
  const anliegenLabel = ANLIEGEN_LABELS[payload.anliegen] ?? payload.anliegen;
  const fullName = [payload.anrede, payload.vorname, payload.nachname].filter(Boolean).join(" ");

  const attachments: MailAttachment[] = await Promise.all(
    payload.files
      .filter((file) => file.size > 0)
      .map(async (file) => ({
        filename: file.name,
        content: Buffer.from(await file.arrayBuffer()),
        contentType: file.type || undefined,
      }))
  );

  await transporter.sendMail({
    from: config.from,
    to: recipient,
    replyTo: payload.email || undefined,
    subject: `Neue Anfrage: ${anliegenLabel} – ${fullName}`,
    html: internalTemplate({ payload, anliegenLabel, fullName, locationName: location?.name }),
    attachments: attachments.length > 0 ? attachments : undefined,
  });

  if (payload.email) {
    await transporter.sendMail({
      from: config.from,
      to: payload.email,
      subject: `Ihre Anfrage bei Sanitätshaus Mielke – ${anliegenLabel}`,
      html: confirmationTemplate({ payload, anliegenLabel, fullName, locationName: location?.name }),
    });
  }
}

export async function sendHealthcareMail(payload: HealthcareMailPayload): Promise<void> {
  const typeLabel = payload.type === "rezept" ? "Rezept einsenden" : "Hilfsmittelanfrage";
  const fullName = [payload.anrede, payload.vorname, payload.nachname].filter(Boolean).join(" ");

  const [location, { transporter, config }] = await Promise.all([
    payload.standort ? getLocation(payload.standort) : Promise.resolve(null),
    createTransporter(),
  ]);

  const recipient = location?.email || config.fallbackTo;

  const attachments: MailAttachment[] = await Promise.all(
    payload.files
      .filter((f) => f.size > 0)
      .map(async (f) => ({
        filename: f.name,
        content: Buffer.from(await f.arrayBuffer()),
        contentType: f.type || undefined,
      }))
  );

  const internalHtml = `<!DOCTYPE html>
<html lang="de"><head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <div style="max-width:600px;margin:32px auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,.1);">
    <div style="background:linear-gradient(135deg,#059669,#047857);padding:28px 32px;">
      <p style="margin:0;color:#a7f3d0;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:.08em;">Neue Anfrage</p>
      <h1 style="margin:6px 0 0;color:#fff;font-size:22px;font-weight:700;">${escapeHtml(typeLabel)}</h1>
    </div>
    <div style="padding:28px 32px;">
      <table style="border-collapse:collapse;width:100%;margin-bottom:20px;">
        ${row("Name", fullName)}
        ${row("Telefon", payload.telefon)}
        ${row("E-Mail", payload.email)}
        ${row("Standort", location?.name ?? payload.standort)}
      </table>
      ${payload.message ? `<div style="background:#f0fdf4;border-left:4px solid #059669;border-radius:0 8px 8px 0;padding:16px 20px;margin-bottom:20px;">
        <p style="margin:0 0 4px;font-size:12px;font-weight:600;color:#059669;text-transform:uppercase;letter-spacing:.06em;">Nachricht</p>
        <p style="margin:0;font-size:13px;color:#374151;white-space:pre-wrap;">${escapeHtml(payload.message)}</p>
      </div>` : ""}
      <p style="margin:0;font-size:11px;color:#9ca3af;">Einwilligung (Art. 9 Abs. 2 lit. a DSGVO) erteilt: ${escapeHtml(payload.consentTimestamp)}</p>
      ${attachments.length > 0 ? `<p style="margin:8px 0 0;font-size:12px;color:#059669;font-weight:600;">${attachments.length} Anhang/Anhänge</p>` : ""}
    </div>
    <div style="background:#f9fafb;border-top:1px solid #e5e7eb;padding:16px 32px;text-align:center;">
      <p style="margin:0;font-size:12px;color:#9ca3af;">Automatisch über das Webformular auf sanitaetshaus-mielke.de gesendet.</p>
    </div>
  </div>
</body></html>`;

  await transporter.sendMail({
    from: config.from,
    to: recipient,
    replyTo: payload.email || undefined,
    subject: `Neue Anfrage: ${typeLabel} – ${fullName}`,
    html: internalHtml,
    attachments: attachments.length > 0 ? attachments : undefined,
  });

  if (payload.email) {
    const confirmHtml = `<!DOCTYPE html>
<html lang="de"><head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <div style="max-width:600px;margin:32px auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,.1);">
    <div style="background:linear-gradient(135deg,#059669,#047857);padding:28px 32px;">
      <h1 style="margin:0;color:#fff;font-size:22px;font-weight:700;">Vielen Dank, ${escapeHtml(payload.vorname)}!</h1>
      <p style="margin:6px 0 0;color:#d1fae5;font-size:14px;">Wir haben Ihre Anfrage erhalten und melden uns zeitnah bei Ihnen.</p>
    </div>
    <div style="padding:28px 32px;">
      <p style="font-size:15px;color:#374151;">Ihre Anfrage <strong>${escapeHtml(typeLabel)}</strong> wurde erfolgreich an ${escapeHtml(location?.name ?? payload.standort ?? "unser Team")} weitergeleitet.</p>
      <p style="font-size:14px;color:#6b7280;">Für dringende Rückfragen: <strong>+49 5542 910112</strong></p>
    </div>
    <div style="background:#f9fafb;border-top:1px solid #e5e7eb;padding:16px 32px;text-align:center;">
      <p style="margin:0;font-size:12px;color:#9ca3af;">Sanitätshaus Mielke · Ermschwerder Straße 23 · 37213 Witzenhausen</p>
    </div>
  </div>
</body></html>`;

    await transporter.sendMail({
      from: config.from,
      to: payload.email,
      subject: `Ihre ${typeLabel} bei Sanitätshaus Mielke`,
      html: confirmHtml,
    });
  }
}

function escapeHtml(value: string | undefined): string {
  if (!value) return "";
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function row(label: string, value: string | undefined) {
  if (!value) return "";
  return `
    <tr>
      <td style="padding:6px 12px 6px 0;color:#6b7280;font-size:13px;white-space:nowrap;vertical-align:top;">${escapeHtml(label)}</td>
      <td style="padding:6px 0;color:#111827;font-size:13px;">${escapeHtml(value)}</td>
    </tr>`;
}

function section(title: string, content: string) {
  return `
    <div style="margin-bottom:24px;">
      <div style="font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.08em;
                  color:#059669;border-bottom:1px solid #d1fae5;padding-bottom:6px;margin-bottom:12px;">
        ${escapeHtml(title)}
      </div>
      <table style="border-collapse:collapse;width:100%;">${content}</table>
    </div>`;
}

function internalTemplate({
  payload, anliegenLabel, fullName, locationName,
}: { payload: MailPayload; anliegenLabel: string; fullName: string; locationName?: string }) {
  return `<!DOCTYPE html>
<html lang="de">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <div style="max-width:600px;margin:32px auto;background:#fff;border-radius:12px;overflow:hidden;
              box-shadow:0 1px 3px rgba(0,0,0,.1);">
    <div style="background:linear-gradient(135deg,#059669,#047857);padding:28px 32px;">
      <p style="margin:0;color:#a7f3d0;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:.08em;">Neue Kontaktanfrage</p>
      <h1 style="margin:6px 0 0;color:#fff;font-size:22px;font-weight:700;">${escapeHtml(anliegenLabel)}</h1>
      <p style="margin:4px 0 0;color:#d1fae5;font-size:13px;">Standort: ${escapeHtml(locationName ?? payload.standort)}</p>
    </div>

    <div style="padding:28px 32px;">
      ${section("Kontaktdaten",
        row("Name", fullName) +
        row("Telefon", payload.telefon) +
        row("E-Mail", payload.email)
      )}

      ${payload.message ? section("Nachricht",
        `<tr><td colspan="2" style="font-size:13px;color:#374151;line-height:1.6;white-space:pre-wrap;">${escapeHtml(payload.message)}</td></tr>`
      ) : ""}
    </div>

    <div style="background:#f9fafb;border-top:1px solid #e5e7eb;padding:16px 32px;text-align:center;">
      <p style="margin:0;font-size:12px;color:#9ca3af;">Diese E-Mail wurde automatisch über das Kontaktformular auf sanitaetshaus-mielke.de gesendet.</p>
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
    <div style="background:linear-gradient(135deg,#059669,#047857);padding:28px 32px;">
      <h1 style="margin:0;color:#fff;font-size:22px;font-weight:700;">Vielen Dank, ${escapeHtml(payload.vorname)}!</h1>
      <p style="margin:6px 0 0;color:#d1fae5;font-size:14px;">Wir haben Ihre Anfrage erhalten und melden uns zeitnah.</p>
    </div>

    <div style="padding:28px 32px;">
      <p style="margin:0 0 20px;font-size:15px;color:#374151;line-height:1.6;">
        Ihre Anfrage vom Typ <strong>${escapeHtml(anliegenLabel)}</strong> wurde erfolgreich an unsere
        Filiale <strong>${escapeHtml(locationName ?? payload.standort)}</strong> weitergeleitet.
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

      <p style="margin:0 0 8px;font-size:14px;color:#6b7280;">Sollten Sie dringende Rückfragen haben, erreichen Sie uns auch telefonisch:</p>
      <p style="margin:0;font-size:14px;color:#374151;"><strong>Hauptfiliale Witzenhausen:</strong> +49 5542 910112</p>
    </div>

    <div style="background:#f9fafb;border-top:1px solid #e5e7eb;padding:16px 32px;text-align:center;">
      <p style="margin:0 0 4px;font-size:12px;color:#9ca3af;">Sanitätshaus Mielke · Ermschwerder Straße 23 · 37213 Witzenhausen</p>
      <p style="margin:0;font-size:11px;color:#d1d5db;">Diese Nachricht wurde automatisch erstellt. Bitte antworten Sie nicht auf diese E-Mail.</p>
    </div>
  </div>
</body>
</html>`;
}
