import { getAllLocations } from "@/lib/content";
import { Section } from "@/components/ui/Section";
import { LocationCard } from "@/components/location/LocationCard";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Standorte",
  description: "Sanitätshaus Mielke Standorte in Hessen: Witzenhausen, Hessisch Lichtenau, Großalmerode, Kaufungen, Bad Sooden-Allendorf. Orthopädietechnik, Rehatechnik und Orthopädieschuhtechnik in Ihrer Nähe.",
  keywords: [
    "Sanitätshaus Mielke Standorte",
    "Orthopädietechnik Witzenhausen",
    "Rehatechnik Hessisch Lichtenau",
    "Sanitätshaus Großalmerode",
    "Orthopädieschuhtechnik Kaufungen",
    "Bad Sooden-Allendorf Sanitätshaus",
    "Hessen Orthopädietechnik",
    "Nordhessen Rehatechnik"
  ],
  openGraph: {
    title: "Sanitätshaus Mielke Standorte in Hessen",
    description: "5 Standorte in Hessen für Orthopädietechnik, Rehatechnik und Orthopädieschuhtechnik. Finden Sie Ihren nächstgelegenen Standort.",
  },
  alternates: {
    canonical: "/standorte",
  },
};

export default async function LocationsPage() {
  const locations = await getAllLocations();
  return (
    <Section title="Standorte">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {locations.map((l) => <LocationCard key={l.slug} location={l} />)}
      </div>
    </Section>
  );
}

