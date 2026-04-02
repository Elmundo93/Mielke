"use server";

import fs from "node:fs/promises";
import path from "node:path";
import { z } from "zod";
import type { Job } from "@/lib/content";

// ── Jobs ───────────────────────────────────────────────────────────────────────

const JOBS_PATH = path.join(process.cwd(), "src", "content", "karriere", "jobs.json");

const JobSchema = z.object({
  id: z.string().min(1),
  active: z.boolean(),
  category: z.string().min(1),
  title: z.string().min(1),
  location: z.string(),
  type: z.string(),
  start: z.string(),
  summary: z.string(),
  tasks: z.array(z.string()),
  requirements: z.array(z.string()),
  offer: z.array(z.string()),
});

export type JobFormData = z.infer<typeof JobSchema>;

async function readJobs(): Promise<Job[]> {
  const raw = await fs.readFile(JOBS_PATH, "utf8");
  return JSON.parse(raw) as Job[];
}

async function writeJobs(jobs: Job[]): Promise<void> {
  await fs.writeFile(JOBS_PATH, JSON.stringify(jobs, null, 2), "utf8");
}

export async function toggleJob(
  id: string,
  active: boolean
): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    const jobs = await readJobs();
    const next = jobs.map((j) => (j.id === id ? { ...j, active } : j));
    await writeJobs(next);
    return { ok: true };
  } catch (err) {
    console.error("toggleJob error:", err);
    return { ok: false, error: "Konnte nicht gespeichert werden." };
  }
}

export async function saveJob(
  id: string,
  data: JobFormData
): Promise<{ ok: true } | { ok: false; error: string }> {
  const parsed = JobSchema.safeParse(data);
  if (!parsed.success) return { ok: false, error: parsed.error.message };

  try {
    const jobs = await readJobs();
    const idx = jobs.findIndex((j) => j.id === id);
    if (idx === -1) return { ok: false, error: "Stelle nicht gefunden." };
    jobs[idx] = parsed.data;
    await writeJobs(jobs);
    return { ok: true };
  } catch (err) {
    console.error("saveJob error:", err);
    return { ok: false, error: "Datei konnte nicht gespeichert werden." };
  }
}



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
