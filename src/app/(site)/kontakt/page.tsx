import { getAllLocations } from "@/lib/content";
import { Section } from "@/components/ui/Section";
import { LocationContactCard } from "@/components/contact/LocationContactCard";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Kontakt",
  description: "Kontakt zu Sanitätshaus Mielke – Rezept einreichen, Hilfsmittel anfragen oder Termin vereinbaren. 5 Standorte in Nordhessen.",
  keywords: [
    "Sanitätshaus Mielke Kontakt",
    "Rezept einreichen",
    "Hilfsmittelanfrage",
    "Orthopädietechnik Beratung",
    "Rehatechnik Termin",
    "Sanitätshaus Mielke Telefon",
  ],
  openGraph: {
    title: "Kontakt zu Sanitätshaus Mielke – Rezept, Hilfsmittel, Termin",
    description: "Kontaktieren Sie uns für eine persönliche Beratung in Orthopädietechnik, Rehatechnik und Orthopädieschuhtechnik.",
  },
  alternates: {
    canonical: "/kontakt",
  },
};

const SERVICE_CARDS = [
  {
    href: "/rezept",
    title: "Rezept einreichen",
    desc: "Kassenrezept, Privatrezept oder Verordnung einfach online hochladen.",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
      </svg>
    ),
  },
  {
    href: "/hilfsmittel",
    title: "Hilfsmittelanfrage",
    desc: "Hilfsmittelversorgung und Beratung – wir melden uns telefonisch bei Ihnen.",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
      </svg>
    ),
  },
  {
    href: "/kontaktform",
    title: "Allgemeine Anfrage",
    desc: "Termin anfragen, Reparatur beauftragen oder eine allgemeine Frage stellen.",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
      </svg>
    ),
  },
];

export default async function ContactPage() {
  const locations = await getAllLocations();

  return (
    <>
      <Section title="Kontakt & Online-Services">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Wählen Sie Ihr Anliegen – wir leiten Sie direkt zum richtigen Formular.
          </p>
        </div>

        <div className="grid sm:grid-cols-3 gap-5 max-w-4xl mx-auto mb-16">
          {SERVICE_CARDS.map((card) => (
            <Link key={card.href} href={card.href}
              className="group flex flex-col items-center text-center p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-md border border-gray-100 dark:border-gray-800 hover:border-emerald-400 hover:shadow-lg transition-all">
              <div className="w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center text-emerald-600 mb-4 group-hover:bg-emerald-100 transition-colors">
                {card.icon}
              </div>
              <h2 className="font-semibold text-gray-900 dark:text-white mb-2">{card.title}</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{card.desc}</p>
            </Link>
          ))}
        </div>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">Unsere Standorte</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {locations.map((location) => (
            <LocationContactCard key={location.slug} location={location} />
          ))}
        </div>
      </Section>
    </>
  );
}
