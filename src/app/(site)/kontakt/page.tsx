import { getAllLocations } from "@/lib/content";
import { Section } from "@/components/ui/Section";
import { ContactForm } from "@/components/contact/ContactForm";
import { LocationContactCard } from "@/components/contact/LocationContactCard";
import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Kontakt",
  description: "Kontakt zu Sanitätshaus Mielke - 5 Standorte in Hessen. Orthopädietechnik, Rehatechnik und Orthopädieschuhtechnik. Beratung und Terminvereinbarung.",
  keywords: [
    "Sanitätshaus Mielke Kontakt",
    "Orthopädietechnik Beratung",
    "Rehatechnik Termin",
    "Sanitätshaus Mielke Telefon",
    "Hilfsmittelversorgung Beratung",
    "Prothesen Beratung",
    "Orthesen Termin"
  ],
  openGraph: {
    title: "Kontakt zu Sanitätshaus Mielke - Beratung & Termine",
    description: "Kontaktieren Sie uns für eine persönliche Beratung in Orthopädietechnik, Rehatechnik und Orthopädieschuhtechnik.",
  },
  alternates: {
    canonical: "/kontakt",
  },
};

export default async function ContactPage() {
  const locations = await getAllLocations();

  return (
    <>
      {/* Hero Section */}
    
      <Section title="Kontaktieren Sie uns!">
        <div className="text-center max-w-3xl mx-auto mb-12">
        <p className="text-lg text-gray-700 dark:text-gray-300">
              Haben Sie Fragen zu unseren Leistungen oder möchten ein Rezept einsenden?
              Füllen Sie einfach unser Kontaktformular aus.
            </p>
            <Button asChild size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white">
                <Link href="/kontaktform">zum Kontaktformular</Link>
              </Button>
        
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {locations.map((location) => (
            <LocationContactCard key={location.slug} location={location} />
          ))}
        </div>
      </Section>

      {/* Contact Form */}
    
    </>
  );
}
