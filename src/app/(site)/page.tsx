import Link from "next/link";
import { getAllLocations, getAllServices } from "@/lib/content";
import { Section } from "@/components/ui/Section";
import { LocationCard } from "@/components/location/LocationCard";
import { ServiceCard } from "@/components/service/ServiceCard";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import type { Metadata } from "next";
import { OrganizationJsonLd } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Startseite",
  description: "Sanitätshaus Mielke - Ihr Spezialist für Orthopädietechnik und Rehatechnik seit 1989. 5 Standorte in Hessen: Witzenhausen, Hessisch Lichtenau, Großalmerode, Kaufungen, Bad Sooden-Allendorf. Individuelle Versorgung mit Prothesen, Orthesen, Einlagen und Maßschuhen.",
  keywords: [
    "Sanitätshaus Mielke",
    "Orthopädietechnik Witzenhausen",
    "Rehatechnik Hessen",
    "Orthopädieschuhtechnik",
    "Prothesen",
    "Orthesen",
    "Einlagen",
    "Maßschuhe",
    "Hilfsmittelversorgung",
    "Nordhessen"
  ],
  openGraph: {
    title: "Sanitätshaus Mielke - Orthopädietechnik & Rehatechnik seit 1989",
    description: "Ihr Spezialist für Orthopädietechnik, Rehatechnik und Orthopädieschuhtechnik. 5 Standorte in Hessen mit individueller Versorgung.",
    images: [
      {
        url: "/LadenWitzenhausen.jpg",
        width: 1200,
        height: 630,
        alt: "Sanitätshaus Mielke Hauptfiliale in Witzenhausen",
      },
    ],
  },
  alternates: {
    canonical: "/",
  },
};

export default async function HomePage() {
  const [locations, services] = await Promise.all([getAllLocations(), getAllServices()]);
  
  return (
    <>
      <OrganizationJsonLd />
      {/* Hero Section with Background Image */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image 
            src="/LadenWitzenhausen.jpg" 
            alt="Sanitätshaus Mielke Hauptfiliale"
            fill
            className="object-cover"
            priority
          />
          {/* Dark overlay for better text readability */}
          <div className="absolute inset-0 bg-black/50"></div>
          {/* Gradient overlay for depth */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/40"></div>
        </div>
        
        {/* Content */}
        <div className="relative z-10 text-center text-white px-6 max-w-6xl mx-auto">
          <div className="space-y-8">
            {/* Main Headline */}
            <div className="space-y-6">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
                Ihr <span className="text-emerald-400">Sanitätshaus</span>
                <br />
                in der Region
              </h1>
              
              <p className="text-xl md:text-2xl lg:text-3xl font-light leading-relaxed max-w-4xl mx-auto">
                Sanitätshaus, Rehatechnik, Orthopädietechnik und Orthopädieschuhtechnik – 
                <span className="text-emerald-400 font-medium"> persönlich, nah, kompetent</span>
              </p>
            </div>
            
            {/* Statistics */}
            <div className="grid grid-cols-2 gap-8 max-w-2xl mx-auto py-8">
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-emerald-400 mb-2">35+</div>
                <div className="text-lg text-gray-200">Jahre Erfahrung</div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-emerald-400 mb-2">4</div>
                <div className="text-lg text-gray-200">Standorte</div>
              </div>
            
            </div>
            
            {/* Call to Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Button asChild size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 text-lg font-semibold">
                <Link href="/standorte">Standorte anzeigen</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-2 border-white text-black hover:bg-white hover:text-gray-900 px-8 py-4 text-lg font-semibold">
                <Link href="/kontakt">Kontakt aufnehmen</Link>
              </Button>
            </div>
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
          <div className="animate-bounce">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>
      </section>

      {/* Services Preview Section */}
      <Section subdued>

        <div className="text-center max-w-4xl mx-auto mb-12">
          <h2 className="text-3xl font-semibold text-center">Unsere Leistungen</h2>
          <div className="mt-6"></div>
          <p className="text-xl text-gray-700 dark:text-gray-300 leading-relaxed">
            Das Sanitätshaus Mielke ist Ihr kompetenter Fachhandel für Orthopädietechnik und Rehatechnik im Werra-Meißner-Kreis. 
            Seit drei Jahrzehnten beraten wir Sie fachgerecht, zuvorkommend und professionell.
          </p>
          <div className="mt-8 p-6 bg-emerald-50 dark:bg-emerald-950/20 rounded-2xl border border-emerald-200 dark:border-emerald-800">
            <p className="text-lg text-gray-700 dark:text-gray-300">
              <strong className="text-emerald-600 dark:text-emerald-400">Service, Freundlichkeit und Kundenzufriedenheit</strong> stehen bei uns an höchster Stelle. 
              Ob Mobilitätshilfen, Gangoptimierung oder Schmerzbekämpfung – wir helfen Ihnen genau da, wo sprichwörtlich &ldquo;der Schuh drückt&rdquo;.
            </p>
          </div>
        </div>
        
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((s) => <ServiceCard key={s.slug} service={s} />)}
        </div>
      </Section>

      {/* Locations Section */}
      <Section subdued>
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl font-semibold text-center">Unsere Standorte</h2>
          <div className="mt-6"></div>
          <p className="text-xl text-gray-700 dark:text-gray-300 leading-relaxed">
            An fünf Standorten in der Region sind wir für Sie da und mit unseren freundlichen und hilfsbereiten Mitarbeitern 
            stets bestrebt Ihre Anforderungen und Ansprüche zu Ihrer vollsten Zufriedenheit zu erfüllen.
          </p>
        </div>
        
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {locations.map((l) => <LocationCard key={l.slug} location={l} />)}
        </div>
      </Section>

      {/* Work Gallery Preview */}
      <Section subdued>
        
        <div className="text-center max-w-3xl mx-auto mb-12">
        <h2 className="text-3xl font-semibold text-center">Einblicke in unsere Arbeit</h2>
        <div className="mt-6"></div>
          <p className="text-lg text-gray-700 dark:text-gray-300">
            Entdecken Sie unsere modernen Werkstätten und die fachgerechte Arbeit unserer Experten
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="aspect-square relative rounded-xl overflow-hidden group">
            <Image 
              src="/Diashow_Arbeit-g-1.jpg" 
              alt="Orthopädietechnik Arbeit" 
              fill 
              className="object-cover group-hover:scale-105 transition-transform duration-300" 
            />
          </div>
          <div className="aspect-square relative rounded-xl overflow-hidden group">
            <Image 
              src="/Diashow_Arbeit-g-2.jpg" 
              alt="Rehatechnik Arbeit" 
              fill 
              className="object-cover group-hover:scale-105 transition-transform duration-300" 
            />
          </div>
          <div className="aspect-square relative rounded-xl overflow-hidden group">
            <Image 
              src="/Diashow_Arbeit-g-3.jpg" 
              alt="Schuhtechnik Werkstatt" 
              fill 
              className="object-cover group-hover:scale-105 transition-transform duration-300" 
            />
          </div>
          <div className="aspect-square relative rounded-xl overflow-hidden group">
            <Image 
              src="/Diashow_Arbeit-g-6.jpg" 
              alt="Medizintechnik Beratung" 
              fill 
              className="object-cover group-hover:scale-105 transition-transform duration-300" 
            />
          </div>
        </div>
      </Section>

    
    
    </>
  );
}

