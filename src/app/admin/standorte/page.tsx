import Link from "next/link";
import { getAllLocations } from "@/lib/content";

export default async function StandortListPage() {
  const locations = await getAllLocations();

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Standorte</h1>
          <p className="text-sm text-gray-500 mt-1">Sanitätshaus Mielke – Admin</p>
        </div>

        <ul className="space-y-2">
          {locations.map((loc) => (
            <li key={loc.slug}>
              <Link
                href={`/admin/standorte/${loc.slug}`}
                className="flex items-center justify-between bg-white rounded-xl border border-gray-200 px-5 py-4 hover:border-emerald-400 hover:shadow-sm transition-all"
              >
                <div>
                  <p className="font-medium text-gray-900">{loc.name}</p>
                  <p className="text-sm text-gray-500">
                    {loc.address}, {loc.postalCode} {loc.city}
                  </p>
                </div>
                <svg
                  className="w-5 h-5 text-gray-400 shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
