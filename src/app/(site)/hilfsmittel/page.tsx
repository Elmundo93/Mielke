import { HealthcareRequestForm } from "@/components/forms/HealthcareRequestForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hilfsmittelanfrage",
  description: "Hilfsmittelversorgung und Beratung bei Sanitätshaus Mielke – Anfrage online stellen, wir rufen zurück.",
  alternates: { canonical: "/hilfsmittel" },
};

export default function HilfsmittelPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <p className="text-sm font-semibold text-emerald-600 uppercase tracking-wider mb-2">Online-Service</p>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Hilfsmittelanfrage</h1>
          <p className="mt-3 text-gray-500 dark:text-gray-400">
            Beschreiben Sie kurz Ihr Anliegen – wir klären den Rest telefonisch mit Ihnen.
          </p>
        </div>
        <HealthcareRequestForm type="hilfsmittel" />
      </div>
    </div>
  );
}
