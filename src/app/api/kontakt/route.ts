import { NextResponse } from "next/server";
import { ContactSchema } from "@/lib/validators";
import { sendContactMail } from "@/lib/mail";

// Maximale Request-Größe für Datei-Uploads (5 Dateien à 10 MB)
export const maxDuration = 30; // Sekunden (Vercel Hobby: max 10s, Pro: 300s)

export async function POST(req: Request) {
  const form = await req.formData();

  // Textfelder extrahieren
  const data: Record<string, string> = {};
  for (const [key, value] of form.entries()) {
    if (typeof value === "string") {
      data[key] = value;
    }
  }

  // Spam-Heuristik: Honeypot oder <2s Ausfüllzeit
  const tooFast = data.ts && Date.now() - Number(data.ts) < 2000;
  if ((data.hp && data.hp.length > 0) || tooFast) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const parsed = ContactSchema.safeParse(data);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, errors: parsed.error.flatten() }, { status: 400 });
  }

  const files = form.getAll("rezept") as File[];

  try {
    await sendContactMail({ ...parsed.data, files });
  } catch (err) {
    console.error("[kontakt] Mail-Versand fehlgeschlagen:", err);
    // Fehler loggen, aber nicht als Hard-Failure behandeln –
    // der Kunde hat die Anfrage korrekt abgeschickt.
    return NextResponse.json({ ok: false, error: "mail_failed" }, { status: 500 });
  }

  return NextResponse.json({ ok: true }, { status: 200 });
}
