import type { Location } from "./content";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "https://sanitaetshaus-mielke.de";

export function LocalBusinessBranchJsonLd({ location }: { location: Location }) {
  const json = {
    "@context": "https://schema.org",
    "@type": "MedicalBusiness",
    "name": `Sanitätshaus Mielke – ${location.name}`,
    "alternateName": `Sanitätshaus Mielke ${location.city}`,
    "description": `Sanitätshaus Mielke in ${location.city} - Ihr Spezialist für Orthopädietechnik, Rehatechnik und Orthopädieschuhtechnik seit 1989.`,
    "url": `${BASE_URL}/standorte/${location.slug}`,
    "logo": `${BASE_URL}/Mielke_Logo_b.webp`,
    ...(location.heroImage ? { "image": `${BASE_URL}${location.heroImage}` } : {}),
    "address": {
      "@type": "PostalAddress",
      "streetAddress": location.address,
      "postalCode": location.postalCode,
      "addressLocality": location.city,
      "addressRegion": "Hessen",
      "addressCountry": "DE"
    },
    ...(location.lat && location.lon ? {
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": location.lat,
        "longitude": location.lon
      },
      "areaServed": {
        "@type": "GeoCircle",
        "geoMidpoint": {
          "@type": "GeoCoordinates",
          "latitude": location.lat,
          "longitude": location.lon
        },
        "geoRadius": "50000"
      }
    } : {}),
    ...(location.phone ? { "telephone": location.phone } : {}),
    ...(location.email ? { "email": location.email } : {}),
    ...(location.openingHours?.length ? {
      "openingHoursSpecification": location.openingHours.map(hours => ({
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": hours.day,
        "opens": hours.opens,
        "closes": hours.closes
      }))
    } : {}),
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Medizinische Dienstleistungen",
      "itemListElement": [
        { "@type": "Offer", "itemOffered": { "@type": "MedicalProcedure", "name": "Orthopädietechnik" } },
        { "@type": "Offer", "itemOffered": { "@type": "MedicalProcedure", "name": "Rehatechnik" } },
        { "@type": "Offer", "itemOffered": { "@type": "MedicalProcedure", "name": "Orthopädieschuhtechnik" } },
        { "@type": "Offer", "itemOffered": { "@type": "MedicalProcedure", "name": "Sanitätshaus" } }
      ]
    },
    "medicalSpecialty": ["Orthopädietechnik", "Rehatechnik", "Orthopädieschuhtechnik", "Hilfsmittelversorgung"],
    "parentOrganization": {
      "@type": "Organization",
      "name": "Sanitätshaus Mielke",
      "url": BASE_URL,
      "logo": `${BASE_URL}/Mielke_Logo_b.webp`,
      "foundingDate": "1989"
    },
    "priceRange": "€€",
    "paymentAccepted": ["Cash", "Credit Card", "Insurance"],
    "currenciesAccepted": "EUR"
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }} />;
}

export function OrganizationJsonLd() {
  const json = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Sanitätshaus Mielke",
    "alternateName": "Sanitätshaus Mielke Orthopädietechnik",
    "description": "Sanitätshaus Mielke - Ihr Spezialist für Orthopädietechnik, Rehatechnik und Orthopädieschuhtechnik seit 1989. 5 Standorte in Hessen.",
    "url": BASE_URL,
    "logo": `${BASE_URL}/Mielke_Logo_b.webp`,
    "image": `${BASE_URL}/LadenWitzenhausen.jpg`,
    "foundingDate": "1989",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Ermschwerder Straße 23",
      "postalCode": "37213",
      "addressLocality": "Witzenhausen",
      "addressRegion": "Hessen",
      "addressCountry": "DE"
    },
    "contactPoint": [
      {
        "@type": "ContactPoint",
        "telephone": "+49-5542-910112",
        "contactType": "customer service",
        "areaServed": "DE",
        "availableLanguage": "German"
      }
    ],
    "sameAs": [],
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Medizinische Dienstleistungen",
      "itemListElement": [
        { "@type": "Offer", "itemOffered": { "@type": "MedicalProcedure", "name": "Orthopädietechnik", "description": "Maßgefertigte Orthesen und Prothesen" } },
        { "@type": "Offer", "itemOffered": { "@type": "MedicalProcedure", "name": "Rehatechnik", "description": "Mobilitätshilfen und Rehabilitationsgeräte" } },
        { "@type": "Offer", "itemOffered": { "@type": "MedicalProcedure", "name": "Orthopädieschuhtechnik", "description": "Einlagen und Maßschuhe" } },
        { "@type": "Offer", "itemOffered": { "@type": "MedicalProcedure", "name": "Sanitätshaus", "description": "Hilfsmittelversorgung und Medizinprodukte" } }
      ]
    },
    "medicalSpecialty": ["Orthopädietechnik", "Rehatechnik", "Orthopädieschuhtechnik", "Hilfsmittelversorgung"]
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }} />;
}

export function ServiceJsonLd({
  name,
  description,
  slug,
  image,
}: {
  name: string;
  description: string;
  slug: string;
  image?: string;
}) {
  const json = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": name,
    "description": description,
    "url": `${BASE_URL}/leistungen/${slug}`,
    ...(image ? { "image": `${BASE_URL}${image}` } : {}),
    "provider": {
      "@type": "MedicalBusiness",
      "name": "Sanitätshaus Mielke",
      "url": BASE_URL,
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Ermschwerder Straße 23",
        "postalCode": "37213",
        "addressLocality": "Witzenhausen",
        "addressRegion": "Hessen",
        "addressCountry": "DE"
      }
    },
    "areaServed": [
      { "@type": "City", "name": "Witzenhausen" },
      { "@type": "City", "name": "Hessisch Lichtenau" },
      { "@type": "City", "name": "Großalmerode" },
      { "@type": "City", "name": "Kaufungen" },
      { "@type": "City", "name": "Bad Sooden-Allendorf" }
    ],
    "serviceType": "Medizinische Versorgung"
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }} />;
}

export function FAQPageJsonLd({ faqs }: { faqs: Array<{ q: string; a: string }> }) {
  const json = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(({ q, a }) => ({
      "@type": "Question",
      "name": q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": a
      }
    }))
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }} />;
}

export function BreadcrumbListJsonLd({ items }: { items: Array<{ name: string; url: string }> }) {
  const json = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": `${BASE_URL}${item.url}`
    }))
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }} />;
}
