import { readContentDirEntries, readContentFile } from "@/lib/storage";

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
  links?: {
    label: string;
    url: string;
  }[];
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

const PRIMARY_LOCATION_SLUG = "witzenhausen";

const EMPTY_LOCATION: Location = {
  slug: "",
  name: "",
  address: "",
  postalCode: "",
  city: "",
  services: [],
};

export async function getAllLocations(): Promise<Location[]> {
  try {
    const entries = await readContentDirEntries("locations");
    const items = entries.map((entry) => {
      const slug = entry.filename.replace(/\.json$/, "");
      return { ...JSON.parse(entry.content), slug } as Location;
    });

    return items.sort((a, b) => {
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
    const location = await readContentFile<Location>(`locations/${slug}.json`, {
      ...EMPTY_LOCATION,
      slug,
    });
    return location.name ? { ...location, slug } : null;
  } catch (err) {
    console.error(`Error loading location ${slug}:`, err);
    return null;
  }
}

export async function getAllServices(): Promise<Service[]> {
  try {
    const entries = await readContentDirEntries("services");
    return entries
      .map((entry) => JSON.parse(entry.content) as Service)
      .sort((a, b) => a.title.localeCompare(b.title, "de"));
  } catch (err) {
    console.error("Error loading services:", err);
    return [];
  }
}

export async function getService(slug: Service["slug"]): Promise<Service | null> {
  const service = await readContentFile<Service | null>(`services/${slug}.json`, null);
  return service;
}

export async function getJobs(): Promise<Job[]> {
  try {
    return await readContentFile<Job[]>("karriere/jobs.json", []);
  } catch (err) {
    console.error("Error loading jobs:", err);
    return [];
  }
}

export async function getAboutUsContent(): Promise<AboutUsContent | null> {
  try {
    const entries = await readContentDirEntries("about-us");
    const first = entries[0];
    return first ? (JSON.parse(first.content) as AboutUsContent) : null;
  } catch (err) {
    console.error("Error loading about-us content:", err);
    return null;
  }
}
