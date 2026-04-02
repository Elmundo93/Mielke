import { z } from "zod";

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
  name: z.string().optional(), // kombiniert für Kompatibilität
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

  // Standort & Nachricht
  standort: z.string().min(1),
  message: z.string().optional(),
}).refine(
  (d) => (d.email && d.email.length > 0) || (d.telefon && d.telefon.length >= 6),
  { message: "E-Mail oder Telefonnummer erforderlich", path: ["email"] }
);

export type ContactInput = z.infer<typeof ContactSchema>;
