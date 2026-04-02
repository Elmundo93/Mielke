import fs from "node:fs/promises";
import path from "node:path";

export type Location = {
  slug: string;
  name: string;
  address: string;
  postalCode: string;
  city: string;
  phone?: string;
  email?: string;
  lat?: number; 
  lon?: number;
  openingHours?: { day: string; opens: string; closes: string; pause?: { from: string; to: string } }[];
  services: string[];
  accessibility?: string[];
  heroImage?: string;
  introText?: string;
  diashowImages?: string[];
};

export type Service = {
  slug: "sanitaetshaus" | "rehatechnik" | "orthopaedietechnik" | "orthopaedieschuhtechnik";
  title: string;
  intro: string;
  benefits: string[];
  content?: string;
  categories?: {
    title: string;
    items: string[];
  }[];
  note?: string;
  steps?: { title: string; text: string }[];
  faqs?: { q: string; a: string }[];
  heroImage?: string;
};

export type Job = {
  id: string;
  active: boolean;
  category: string;
  title: string;
  location: string;
  type: string;
  start: string;
  summary: string;
  tasks: string[];
  requirements: string[];
  offer: string[];
};

export type AboutUsContent = {
  title: string;
  hero: {
    headline: string;
    intro: string;
  };
  mainContent: {
    section1: string;
    section2: string;
    section3: string;
  };
  stats: {
    number: string;
    label: string;
  }[];
  services: string[];
};

const CONTENT_DIR = path.join(process.cwd(), "src", "content");

/** In Listen zuerst; übrige Standorte alphabetisch nach Anzeigename. */
const PRIMARY_LOCATION_SLUG = "witzenhausen";

export async function getAllLocations(): Promise<Location[]> {
  try {
    const dir = path.join(CONTENT_DIR, "locations");
    const files = await fs.readdir(dir);
    const items = await Promise.all(
      files
        .filter(f => f.endsWith(".json"))
        .map(async (f) => {
          try {
            const raw = await fs.readFile(path.join(dir, f), "utf8");
            // Slug wird aus dem Dateinamen abgeleitet – unabhängig vom JSON-Inhalt.
            // Das ist wichtig, damit Keystatic den slug-Eintrag nicht im JSON
            // speichern muss und trotzdem alles korrekt funktioniert.
            const slug = f.replace(/\.json$/, "");
            return { ...JSON.parse(raw), slug } as Location;
          } catch (err) {
            console.error(`Error reading location file ${f}:`, err);
            return null;
          }
        })
    );
    const filtered = items.filter((item): item is Location => item !== null);
    return filtered.sort((a, b) => {
      if (a.slug === PRIMARY_LOCATION_SLUG) return -1;
      if (b.slug === PRIMARY_LOCATION_SLUG) return 1;
      return a.name.localeCompare(b.name, "de");
    });
  } catch (err) {
    console.error("Error loading locations:", err);
    return [];
  }
}

export async function getLocation(slug: string): Promise<Location | null> {
  try {
    const p = path.join(CONTENT_DIR, "locations", `${slug}.json`);
    const raw = await fs.readFile(p, "utf8");
    return { ...JSON.parse(raw), slug } as Location;
  } catch {
    return null;
  }
}

// Für Services im MVP: als JSON oder MDX hier zeigen wir JSON-Variante:
export async function getAllServices(): Promise<Service[]> {
  try {
    const dir = path.join(CONTENT_DIR, "services");
    const files = await fs.readdir(dir);
    const items = await Promise.all(
      files
        .filter(f => f.endsWith(".json"))
        .map(async (f) => {
          try {
            const raw = await fs.readFile(path.join(dir, f), "utf8");
            return JSON.parse(raw) as Service;
          } catch (err) {
            console.error(`Error reading service file ${f}:`, err);
            return null;
          }
        })
    );
    return items.filter((item): item is Service => item !== null).sort((a, b) => a.title.localeCompare(b.title));
  } catch (err) {
    console.error("Error loading services:", err);
    return [];
  }
}

export async function getService(slug: Service["slug"]): Promise<Service | null> {
  const all = await getAllServices();
  return all.find(s => s.slug === slug) ?? null;
}

export async function getJobs(): Promise<Job[]> {
  try {
    const p = path.join(CONTENT_DIR, "karriere", "jobs.json");
    const raw = await fs.readFile(p, "utf8");
    return JSON.parse(raw) as Job[];
  } catch (err) {
    console.error("Error loading jobs:", err);
    return [];
  }
}

export async function getAboutUsContent(): Promise<AboutUsContent | null> {
  try {
    const dir = path.join(CONTENT_DIR, "about-us");
    const files = await fs.readdir(dir);
    const items = await Promise.all(files.filter(f => f.endsWith(".json")).map(async (f) => {
      const raw = await fs.readFile(path.join(dir, f), "utf8");
      return JSON.parse(raw) as AboutUsContent;
    }));
    return items[0];
  } catch {
    return null;
  }
}

