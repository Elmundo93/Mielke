import Link from "next/link";
import type { Location } from "@/lib/content";
import Image from "next/image";

export function LocationCard({ location }: { location: Location }) {
  return (
    <Link href={`/standorte/${location.slug}`} className="group block">
      <div className="rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden bg-white dark:bg-gray-800 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
        {/* Image */}
        {location.heroImage && (
          <div className="aspect-video relative overflow-hidden">
            <Image 
              src={location.heroImage} 
              alt={location.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
            <div className="absolute top-4 right-4 w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
          </div>
        )}
        
        {/* Content */}
        <div className="p-6">
          <div className="flex items-center gap-3 mb-3">
            {!location.heroImage && (
              <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
            )}
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
              {location.name}
            </h3>
          </div>
          
          <div className="space-y-2 mb-4">
            <div className="text-gray-600 dark:text-gray-300">
              {location.address}
            </div>
            <div className="text-gray-600 dark:text-gray-300">
              {location.postalCode} {location.city}
            </div>
            {location.phone && (
              <div className="text-gray-600 dark:text-gray-300">
                Tel.: {location.phone}
              </div>
            )}
          </div>
          
          <div className="flex items-center text-emerald-600 dark:text-emerald-400 font-medium">
            Details & Öffnungszeiten
            <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
}

