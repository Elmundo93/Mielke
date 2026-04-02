import type { Metadata } from "next";

export const defaultMetadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://sanitaetshaus-mielke.de'),
  robots: { 
    index: true, 
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_VERIFICATION_ID,
  },
};

export const organizationData = {
  name: "Sanitätshaus Mielke",
  url: "https://sanitaetshaus-mielke.de",
  logo: "https://sanitaetshaus-mielke.de/Mielke_Logo_b.webp",
  foundingDate: "1989",
  address: {
    streetAddress: "Ermschwerder Straße 23",
    postalCode: "37213",
    addressLocality: "Witzenhausen",
    addressRegion: "Hessen",
    addressCountry: "DE"
  },
  phone: "+49-5542-910112",
  email: "info@sanitaetshaus-mielke.de"
};

export const seoKeywords = {
  primary: [
    "Sanitätshaus",
    "Orthopädietechnik",
    "Rehatechnik", 
    "Orthopädieschuhtechnik",
    "Hilfsmittel",
    "Prothesen",
    "Orthesen",
    "Einlagen",
    "Maßschuhe"
  ],
  locations: [
    "Witzenhausen",
    "Hessisch Lichtenau", 
    "Großalmerode",
    "Kaufungen",
    "Bad Sooden-Allendorf",
    "Hessen",
    "Nordhessen",
    "Werra-Meißner-Kreis"
  ],
  services: {
    sanitaetshaus: ["Sanitätshaus", "Hilfsmittel", "Medizinprodukte", "Kompressionsstrümpfe", "Rollstuhl"],
    rehatechnik: ["Rehatechnik", "Rollstuhl", "Gehhilfen", "Mobilitätshilfen", "Rehabilitation"],
    orthopaedietechnik: ["Orthopädietechnik", "Prothesen", "Orthesen", "Schienen", "Bandagen"],
    orthopaedieschuhtechnik: ["Orthopädieschuhtechnik", "Einlagen", "Maßschuhe", "Fußorthopädie", "Diabetikerschuhe"]
  }
};

export function generatePageMetadata({
  title,
  description,
  keywords = [],
  path = "/",
  images = [],
  noindex = false
}: {
  title: string;
  description: string;
  keywords?: string[];
  path?: string;
  images?: Array<{ url: string; width: number; height: number; alt: string }>;
  noindex?: boolean;
}): Metadata {
  const fullTitle = title.includes("Sanitätshaus Mielke") ? title : `${title} | Sanitätshaus Mielke`;
  const canonicalUrl = `https://sanitaetshaus-mielke.de${path}`;
  
  return {
    title: fullTitle,
    description,
    keywords: [...seoKeywords.primary, ...seoKeywords.locations, ...keywords],
    robots: noindex ? { index: false, follow: false } : defaultMetadata.robots,
    openGraph: {
      type: "website",
      locale: "de_DE",
      url: canonicalUrl,
      siteName: "Sanitätshaus Mielke",
      title: fullTitle,
      description,
      images: images.length > 0 ? images : [
        {
          url: "/Mielke_Logo_b.webp",
          width: 1200,
          height: 630,
          alt: "Sanitätshaus Mielke Logo",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: images.length > 0 ? [images[0].url] : ["/Mielke_Logo_b.webp"],
    },
    alternates: {
      canonical: canonicalUrl,
    },
  };
}

export function generateLocationMetadata(location: {
  name: string;
  city: string;
  slug: string;
  address: string;
  postalCode: string;
  phone: string;
  heroImage: string;
}) {
  return generatePageMetadata({
    title: `Sanitätshaus Mielke ${location.name}`,
    description: `Sanitätshaus Mielke in ${location.city} - ${location.address}, ${location.postalCode} ${location.city}. Orthopädietechnik, Rehatechnik und Orthopädieschuhtechnik. Telefon: ${location.phone}.`,
    keywords: [
      `Sanitätshaus ${location.city}`,
      `Orthopädietechnik ${location.city}`,
      `Rehatechnik ${location.city}`,
      location.address,
      location.city
    ],
    path: `/standorte/${location.slug}`,
    images: [{
      url: location.heroImage,
      width: 1200,
      height: 630,
      alt: `Sanitätshaus Mielke ${location.name}`,
    }]
  });
}

export function generateServiceMetadata(service: {
  title: string;
  slug: string;
  intro: string;
  heroImage?: string;
}) {
  const keywords = seoKeywords.services[service.slug as keyof typeof seoKeywords.services] || [];
  
  return generatePageMetadata({
    title: `${service.title} - Sanitätshaus Mielke`,
    description: `${service.title} bei Sanitätshaus Mielke: ${service.intro} Individuelle Beratung und Versorgung in 5 Standorten in Hessen.`,
    keywords: [...keywords, "Beratung", "Versorgung"],
    path: `/leistungen/${service.slug}`,
    images: service.heroImage ? [{
      url: service.heroImage,
      width: 1200,
      height: 630,
      alt: `${service.title} - Sanitätshaus Mielke`,
    }] : []
  });
}

