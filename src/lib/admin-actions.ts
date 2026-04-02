"use server";

import fs from "node:fs/promises";
import path from "node:path";
import { z } from "zod";

const OpeningHourSchema = z.object({
  day: z.string(),
  opens: z.string(),
  closes: z.string(),
  pause: z.object({ from: z.string(), to: z.string() }).optional(),
});

const LocationSchema = z.object({
  name: z.string().min(1),
  phone: z.string(),
  email: z.string(),
  address: z.string(),
  postalCode: z.string(),
  city: z.string(),
  introText: z.string(),
  heroImage: z.string(),
  lat: z.number(),
  lon: z.number(),
  services: z.array(z.string()),
  accessibility: z.array(z.string()),
  openingHours: z.array(OpeningHourSchema),
  diashowImages: z.array(z.string()),
});

export type LocationFormData = z.infer<typeof LocationSchema>;

export async function saveLocation(
  slug: string,
  data: LocationFormData
): Promise<{ ok: true } | { ok: false; error: string }> {
  const parsed = LocationSchema.safeParse(data);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.message };
  }

  const filePath = path.join(
    process.cwd(),
    "src",
    "content",
    "locations",
    `${slug}.json`
  );

  try {
    await fs.writeFile(filePath, JSON.stringify(parsed.data, null, 2), "utf8");
    return { ok: true };
  } catch (err) {
    console.error("saveLocation error:", err);
    return { ok: false, error: "Datei konnte nicht gespeichert werden." };
  }
}
