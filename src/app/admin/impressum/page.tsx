import Link from "next/link";
import { getImpressumContent } from "@/lib/content";
import ImpressumEditForm from "./ImpressumEditForm";

export default async function ImpressumAdminPage() {
  const content = await getImpressumContent();

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-xl mx-auto">
        <div className="mb-6 flex items-center gap-3">
          <Link
            href="/admin"
            className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Admin
          </Link>
          <span className="text-gray-300">/</span>
          <span className="text-sm text-gray-700 font-medium">Impressum</span>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-1">Impressum</h1>
        <p className="text-sm text-gray-500 mb-6">
          Pflichtangaben gemäß § 5 TMG und § 18 Abs. 2 MStV bearbeiten.
        </p>

        <ImpressumEditForm initialValues={content} />
      </div>
    </div>
  );
}
