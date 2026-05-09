import { z } from "zod";

export const PublicContactSchema = z.object({
  hp: z.string().optional(),
  ts: z.string().optional(),

  anliegen: z.enum(["termin", "reparatur", "allgemein"]),

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

export type PublicContactInput = z.infer<typeof PublicContactSchema>;
