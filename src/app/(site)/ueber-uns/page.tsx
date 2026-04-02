import { Section } from "@/components/ui/Section";
import { getAboutUsContent } from "@/lib/content";
import { AboutUs } from "@/components/about/AboutUs";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Über uns",
  description: "Über Sanitätshaus Mielke - Ihr Spezialist für Orthopädietechnik seit 1989. 35+ Jahre Erfahrung, 5 Standorte in Hessen. Geschichte, Team und Kompetenzen.",
  keywords: [
    "Sanitätshaus Mielke Geschichte",
    "Orthopädietechnik seit 1989",
    "Sanitätshaus Mielke Team",
    "Orthopädiemechanikermeister",
    "35 Jahre Erfahrung",
    "Hessen Orthopädietechnik",
    "Witzenhausen Sanitätshaus"
  ],
  openGraph: {
    title: "Über Sanitätshaus Mielke - 35+ Jahre Orthopädietechnik",
    description: "Seit 1989 Ihr kompetenter Partner für Orthopädietechnik, Rehatechnik und Orthopädieschuhtechnik in Hessen.",
  },
  alternates: {
    canonical: "/ueber-uns",
  },
};

export default async function AboutPage() {
  const aboutUs = await getAboutUsContent();

  if (!aboutUs) {
    return (
      <Section>
        <div className="text-center py-12">
          <h1 className="text-3xl font-semibold mb-4">Über uns</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Inhalte werden geladen...
          </p>
        </div>
      </Section>
    );
  }

  return (
    <Section>
      <AboutUs content={aboutUs} />
    </Section>
  );
}

