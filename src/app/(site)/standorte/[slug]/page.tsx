import { notFound } from "next/navigation";
import { getLocation } from "@/lib/content";
import { Section } from "@/components/ui/Section";
import { HoursTable } from "@/components/location/HoursTable";
import { LocalBusinessBranchJsonLd } from "@/lib/schema";
import Image from "next/image";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const location = await getLocation(slug);
  
  if (!location) {
    return {
      title: "Standort nicht gefunden",
    };
  }

  return {
    title: `Sanitätshaus Mielke ${location.name}`,
    description: `Sanitätshaus Mielke in ${location.city} - ${location.address}, ${location.postalCode} ${location.city}. Orthopädietechnik, Rehatechnik und Orthopädieschuhtechnik. Telefon: ${location.phone}. Öffnungszeiten und Serviceleistungen.`,
    keywords: [
      `Sanitätshaus ${location.city}`,
      `Orthopädietechnik ${location.city}`,
      `Rehatechnik ${location.city}`,
      `Orthopädieschuhtechnik ${location.city}`,
      location.address,
      location.city,
      "Hilfsmittelversorgung",
      "Prothesen",
      "Orthesen",
      "Einlagen"
    ],
    openGraph: {
      title: `Sanitätshaus Mielke ${location.name}`,
      description: `Sanitätshaus Mielke in ${location.city} - Orthopädietechnik, Rehatechnik und Orthopädieschuhtechnik. ${location.address}, ${location.postalCode} ${location.city}.`,
      images: location.heroImage ? [
        {
          url: location.heroImage,
          width: 1200,
          height: 630,
          alt: `Sanitätshaus Mielke ${location.name}`,
        },
      ] : undefined,
    },
    alternates: {
      canonical: `/standorte/${location.slug}`,
    },
  };
}

export default async function LocationDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const loc = await getLocation(slug);
  if (!loc) return notFound();

  return (
    <>
      {LocalBusinessBranchJsonLd({ location: loc })}
      
      {/* Hero Section */}
      <Section>
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900 rounded-2xl flex items-center justify-center">
                <svg className="w-8 h-8 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
                {loc.name}
              </h1>
            </div>
            
            <div className="space-y-4">
              <div className="text-lg text-gray-700 dark:text-gray-300">
                {loc.address}
              </div>
              <div className="text-lg text-gray-700 dark:text-gray-300">
                {loc.postalCode} {loc.city}
              </div>
              <div className="space-y-2">
                {loc.phone && (
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span className="text-gray-700 dark:text-gray-300">{loc.phone}</span>
                  </div>
                )}
                {loc.email && (
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span className="text-gray-700 dark:text-gray-300">{loc.email}</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white">
                <Link href="/kontakt">Termin vereinbaren</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-emerald-600 text-emerald-600 hover:bg-emerald-600 hover:text-white">
                <Link href="/leistungen">Leistungen ansehen</Link>
              </Button>
            </div>
          </div>
          
          {loc.heroImage && (
            <div className="relative">
              <div className="aspect-[4/3] relative rounded-2xl overflow-hidden shadow-2xl">
                <Image 
                  src={loc.heroImage} 
                  alt={`Sanitätshaus Mielke ${loc.name}`}
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
            </div>
          )}
        </div>
      </Section>

      {/* Services Section */}
      {loc.services?.length ? (
        <Section title="Verfügbare Leistungen" subdued>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {loc.services.map((service) => (
              <Card key={service} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <div className="text-emerald-600 dark:text-emerald-400 text-xl">
                      {service === "sanitaetshaus" && "🏥"}
                      {service === "rehatechnik" && "♿"}
                      {service === "orthopaedietechnik" && "🔬"}
                      {service === "orthopaedieschuhtechnik" && "👟"}
                    </div>
                  </div>
                  <CardTitle className="text-lg capitalize">
                    {service.replace(/([A-Z])/g, ' $1').trim()}
                  </CardTitle>
                </CardHeader>
              </Card>
            ))}
          </div>
        </Section>
      ) : null}

      {/* Opening Hours */}
      {loc.openingHours && (
        <Section title="Öffnungszeiten">
          <HoursTable openingHours={loc.openingHours} />
        </Section>
      )}

      {/* Accessibility */}
      {loc.accessibility?.length ? (
        <Section title="Barrierefreiheit" subdued>
          <div className="grid md:grid-cols-2 gap-4">
            {loc.accessibility.map((a, index) => (
              <div key={index} className="flex items-center gap-3 p-4 bg-emerald-50 dark:bg-emerald-950/20 rounded-lg">
                <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-gray-700 dark:text-gray-300">{a}</span>
              </div>
            ))}
          </div>
        </Section>
      ) : null}
    </>
  );
}

