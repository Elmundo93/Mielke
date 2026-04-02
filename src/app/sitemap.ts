import { MetadataRoute } from "next";
import { getAllLocations, getAllServices } from "@/lib/content";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_BASE_URL ?? "https://sanitaetshaus-mielke.de";
  const entries: MetadataRoute.Sitemap = [
    { 
      url: `${base}/`, 
      lastModified: new Date(),
      changeFrequency: "weekly", 
      priority: 1.0 
    },
    { 
      url: `${base}/standorte`, 
      lastModified: new Date(),
      changeFrequency: "monthly", 
      priority: 0.9 
    },
    { 
      url: `${base}/leistungen`, 
      lastModified: new Date(),
      changeFrequency: "monthly", 
      priority: 0.9 
    },
    { 
      url: `${base}/ueber-uns`, 
      lastModified: new Date(),
      changeFrequency: "yearly", 
      priority: 0.7 
    },
    { 
      url: `${base}/kontakt`, 
      lastModified: new Date(),
      changeFrequency: "monthly", 
      priority: 0.8 
    },
  ];
  
  const [locs, svcs] = await Promise.all([getAllLocations(), getAllServices()]);
  
  // Location pages - high priority for local SEO
  locs.forEach(loc => {
    entries.push({ 
      url: `${base}/standorte/${loc.slug}`, 
      lastModified: new Date(),
      changeFrequency: "monthly", 
      priority: 0.8 
    });
  });
  
  // Service pages - medium priority
  svcs.forEach(svc => {
    entries.push({ 
      url: `${base}/leistungen/${svc.slug}`, 
      lastModified: new Date(),
      changeFrequency: "monthly", 
      priority: 0.7 
    });
  });
  
  return entries;
}

