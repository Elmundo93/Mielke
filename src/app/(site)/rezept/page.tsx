import { HealthcareRequestForm } from "@/components/forms/HealthcareRequestForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Rezept einreichen",
  description: "Kassenrezept, Privatrezept oder Verordnung online an Sanitätshaus Mielke übermitteln. Sicher, schnell und DSGVO-konform.",
  alternates: { canonical: "/rezept" },
};

export default function RezeptPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <p className="text-sm font-semibold text-emerald-600 uppercase tracking-wider mb-2">Online-Service</p>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Rezept einreichen</h1>
          <p className="mt-3 text-gray-500 dark:text-gray-400">
            Laden Sie Ihr Kassenrezept, Privatrezept oder Ihre Verordnung sicher hoch – wir melden uns zeitnah bei Ihnen.
          </p>
        </div>
        <HealthcareRequestForm type="rezept" />
      </div>
    </div>
  );
}
