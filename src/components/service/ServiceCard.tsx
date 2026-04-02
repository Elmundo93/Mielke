import Link from "next/link";
import type { Service } from "@/lib/content";
import Image from "next/image";

const serviceIcons: Record<string, string> = {
  sanitaetshaus: "🏥",
  rehatechnik: "♿",
  orthopaedietechnik: "🔬",
  orthopaedieschuhtechnik: "👟"
};

export function ServiceCard({ service }: { service: Service }) {
  const icon = serviceIcons[service.slug] || "🏥";
  
  return (
    <Link href={`/leistungen/${service.slug}`} className="group block">
      <div className="rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden bg-white dark:bg-gray-800 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
        {/* Image */}
        {service.heroImage && (
          <div className="aspect-video relative overflow-hidden">
            <Image 
              src={service.heroImage} 
              alt={service.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            <div className="absolute top-4 right-4 w-12 h-12 bg-emerald-600 rounded-lg flex items-center justify-center">
              <div className="text-white text-xl">{icon}</div>
            </div>
          </div>
        )}
        
        {/* Content */}
        <div className="p-6">
          <div className="flex items-center gap-3 mb-3">
            {!service.heroImage && (
              <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900 rounded-lg flex items-center justify-center">
                <div className="text-emerald-600 dark:text-emerald-400 text-xl">{icon}</div>
              </div>
            )}
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
              {service.title}
            </h3>
          </div>
          
          {service.intro && (
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4 line-clamp-3">
              {service.intro}
            </p>
          )}
          
          <div className="flex items-center text-emerald-600 dark:text-emerald-400 font-medium">
            Mehr erfahren
            <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
}

