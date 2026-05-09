import { z } from "zod";

// Minimal data collection: name + contact only.
// NO Versicherungsnummer, Geburtsdatum, Adresse, Krankenkasse — collected later by phone.
export const HealthcareRequestSchema = z.object({
  hp: z.string().optional(),
  ts: z.string().optional(),

  type: z.enum(["rezept", "hilfsmittel"]),

  gesundheitsdatenConsent: z.literal("true", {
    error: "Einwilligung zur Verarbeitung von Gesundheitsdaten erforderlich.",
  }),

  anrede: z.string().optional(),
  vorname: z.string().min(2),
  nachname: z.string().min(2),
  email: z.string().email().optional().or(z.literal("")),
  telefon: z.string().optional(),

  standort: z.string().optional(),
  message: z.string().optional(),
}).refine(
  (d) => (d.email && d.email.length > 0) || (d.telefon && d.telefon.length >= 6),
  { message: "E-Mail oder Telefonnummer erforderlich", path: ["email"] }
);

export type HealthcareRequestInput = z.infer<typeof HealthcareRequestSchema>;
