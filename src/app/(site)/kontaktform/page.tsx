import { PublicContactForm } from "@/components/forms/PublicContactForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kontaktformular",
  description:
    "Terminanfrage, Reparatur oder allgemeine Anfrage – schnell und einfach online an Sanitätshaus Mielke.",
};

export default function ContactFormPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <p className="text-sm font-semibold text-emerald-600 uppercase tracking-wider mb-2">Online-Service</p>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Ihr Anliegen in wenigen Schritten</h1>
          <p className="mt-3 text-gray-500 dark:text-gray-400">
            Termin vereinbaren, Reparatur anfragen oder eine allgemeine Frage stellen.
          </p>
        </div>
        <PublicContactForm />
      </div>
    </div>
  );
}
