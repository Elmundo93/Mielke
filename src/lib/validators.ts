import { z } from "zod";

const HEALTH_DATA_ANLIEGEN = ["rezept", "hilfsmittel"] as const;

export const ContactSchema = z.object({
  // Spam-Schutz
  hp: z.string().optional(),
  ts: z.string().optional(),

  // Anliegen
  anliegen: z.string().min(1),

  // Persönliche Daten
  anrede: z.string().optional(),
  vorname: z.string().min(2),
  nachname: z.string().min(2),
  name: z.string().optional(),
  geburtsdatum: z.string().optional(),
  strasse: z.string().optional(),
  plz: z.string().optional(),
  ort: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  telefon: z.string().optional(),

  // Versicherung
  krankenkasse: z.string().optional(),
  versichertenart: z.string().optional(),
  versicherungsnummer: z.string().optional(),

  // Art. 9 DSGVO — Einwilligung Gesundheitsdaten
  gesundheitsdatenConsent: z.string().optional(),

  // Nachricht
  standort: z.string().optional(),
  message: z.string().optional(),
}).refine(
  (d) => (d.email && d.email.length > 0) || (d.telefon && d.telefon.length >= 6),
  { message: "E-Mail oder Telefonnummer erforderlich", path: ["email"] }
).refine(
  (d) => {
    const needsConsent = (HEALTH_DATA_ANLIEGEN as readonly string[]).includes(d.anliegen);
    return !needsConsent || d.gesundheitsdatenConsent === "true";
  },
  { message: "Einwilligung zur Verarbeitung von Gesundheitsdaten erforderlich", path: ["gesundheitsdatenConsent"] }
);

export type ContactInput = z.infer<typeof ContactSchema>;
