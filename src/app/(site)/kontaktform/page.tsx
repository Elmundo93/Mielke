import { getAllLocations } from "@/lib/content";
import { ContactForm } from "@/components/contact/ContactForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kontaktformular",
  description:
    "Kontaktformular zu Sanitätshaus Mielke – Rezept einsenden, Termin vereinbaren oder allgemeine Anfragen stellen.",
};

export default async function ContactFormPage() {
  const locations = await getAllLocations();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <p className="text-sm font-semibold text-emerald-600 uppercase tracking-wider mb-2">Online-Service</p>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Ihr Anliegen in wenigen Schritten</h1>
          <p className="mt-3 text-gray-500 dark:text-gray-400">
            Rezept einsenden, Termin anfragen oder Hilfsmittel bestellen – schnell und einfach online.
          </p>
        </div>
        <ContactForm locations={locations} />
      </div>
    </div>
  );
}
