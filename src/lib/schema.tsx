import type { Location } from "./content";

export function LocalBusinessBranchJsonLd({ location }: { location: Location }) {
  const json = {
    "@context": "https://schema.org",
    "@type": "MedicalBusiness",
    "name": `Sanitätshaus Mielke – ${location.name}`,
    "alternateName": `Sanitätshaus Mielke ${location.city}`,
    "description": `Sanitätshaus Mielke in ${location.city} - Ihr Spezialist für Orthopädietechnik, Rehatechnik und Orthopädieschuhtechnik seit 1989.`,
    "url": `https://sanitaetshaus-mielke.de/standorte/${location.slug}`,
    "logo": "https://sanitaetshaus-mielke.de/Mielke_Logo_b.webp",
    "image": `https://sanitaetshaus-mielke.de${location.heroImage}`,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": location.address,
      "postalCode": location.postalCode,
      "addressLocality": location.city,
      "addressRegion": "Hessen",
      "addressCountry": "DE"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": location.lat,
      "longitude": location.lon
    },
    "telephone": location.phone,
    "email": location.email,
    "openingHoursSpecification": location.openingHours?.map(hours => ({
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": hours.day,
      "opens": hours.opens,
      "closes": hours.closes
    })),
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Medizinische Dienstleistungen",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "MedicalProcedure",
            "name": "Orthopädietechnik"
          }
        },
        {
          "@type": "Offer", 
          "itemOffered": {
            "@type": "MedicalProcedure",
            "name": "Rehatechnik"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "MedicalProcedure", 
            "name": "Orthopädieschuhtechnik"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "MedicalProcedure",
            "name": "Sanitätshaus"
          }
        }
      ]
    },
    "medicalSpecialty": [
      "Orthopädietechnik",
      "Rehatechnik", 
      "Orthopädieschuhtechnik",
      "Hilfsmittelversorgung"
    ],
    "parentOrganization": {
      "@type": "Organization",
      "name": "Sanitätshaus Mielke",
      "url": "https://sanitaetshaus-mielke.de",
      "logo": "https://sanitaetshaus-mielke.de/Mielke_Logo_b.webp",
      "foundingDate": "1989",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Ermschwerder Straße 23",
        "postalCode": "37213",
        "addressLocality": "Witzenhausen",
        "addressRegion": "Hessen",
        "addressCountry": "DE"
      }
    },
    "areaServed": {
      "@type": "GeoCircle",
      "geoMidpoint": {
        "@type": "GeoCoordinates",
        "latitude": location.lat,
        "longitude": location.lon
      },
      "geoRadius": "50000"
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
    "url": "https://sanitaetshaus-mielke.de",
    "logo": "https://sanitaetshaus-mielke.de/Mielke_Logo_b.webp",
    "image": "https://sanitaetshaus-mielke.de/LadenWitzenhausen.jpg",
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
    "sameAs": [
      // Add social media URLs when available
    ],
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Medizinische Dienstleistungen",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "MedicalProcedure",
            "name": "Orthopädietechnik",
            "description": "Maßgefertigte Orthesen und Prothesen"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "MedicalProcedure",
            "name": "Rehatechnik", 
            "description": "Mobilitätshilfen und Rehabilitationsgeräte"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "MedicalProcedure",
            "name": "Orthopädieschuhtechnik",
            "description": "Einlagen und Maßschuhe"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "MedicalProcedure",
            "name": "Sanitätshaus",
            "description": "Hilfsmittelversorgung und Medizinprodukte"
          }
        }
      ]
    },
    "medicalSpecialty": [
      "Orthopädietechnik",
      "Rehatechnik",
      "Orthopädieschuhtechnik", 
      "Hilfsmittelversorgung"
    ]
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
      "item": `https://sanitaetshaus-mielke.de${item.url}`
    }))
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }} />;
}

