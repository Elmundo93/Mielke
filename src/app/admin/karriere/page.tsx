import Link from "next/link";
import { getJobs } from "@/lib/content";
import JobList from "./JobList";

export default async function KarriereAdminPage() {
  const jobs = await getJobs();

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
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
          <h1 className="text-xl font-bold text-gray-900">Karriere</h1>
        </div>

        <p className="text-sm text-gray-500 mb-4">
          Schalten Sie Stellen über den Toggle ein oder aus. Klicken Sie auf das Stift-Symbol zum Bearbeiten.
        </p>

        <JobList jobs={jobs} />
      </div>
    </div>
  );
}
