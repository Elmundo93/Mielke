"use client";

import { AboutUsContent } from "@/lib/content";
import Link from "next/link";

interface AboutUsProps {
  content: AboutUsContent;
}

export function AboutUs({ content }: AboutUsProps) {
  return (
    <div className="max-w-4xl mx-auto space-y-16">
      {/* Hero Section */}
      <section className="text-center space-y-8">
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white leading-tight">
          {content.title}
        </h1>
        
        <div className="space-y-6">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-emerald-600 dark:text-emerald-400 leading-relaxed">
            {content.hero.headline}
          </h2>
          
          <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 leading-relaxed max-w-3xl mx-auto">
            {content.hero.intro}
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-t border-b border-gray-200 dark:border-gray-700 py-12">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
          {content.stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-emerald-600 dark:text-emerald-400 mb-2">
                {stat.number}
              </div>
              <div className="text-sm md:text-base text-gray-600 dark:text-gray-400 font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Main Content Sections */}
      <section className="space-y-12">
        <div className="prose prose-lg prose-gray dark:prose-invert max-w-none">
          <p className="text-xl leading-relaxed text-gray-800 dark:text-gray-200">
            {content.mainContent.section1}
          </p>
        </div>

        <div className="prose prose-lg prose-gray dark:prose-invert max-w-none">
          <p className="text-xl leading-relaxed text-gray-800 dark:text-gray-200">
            {content.mainContent.section2}
          </p>
        </div>

        <div className="bg-emerald-50 dark:bg-emerald-950/20 rounded-2xl p-8 md:p-12 border border-emerald-200 dark:border-emerald-800">
          <div className="prose prose-lg prose-gray dark:prose-invert max-w-none">
            <p className="text-xl leading-relaxed text-gray-800 dark:text-gray-200 mb-0">
              {content.mainContent.section3}
            </p>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="space-y-8">
        <div className="text-center">
          <h3 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Unsere Spezialisierungen
          </h3>
          <div className="w-24 h-1 bg-emerald-500 mx-auto rounded-full"></div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          {content.services.map((service, index) => (
            <div key={index} className="group">
              <div className="flex items-center space-x-4 p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-emerald-300 dark:hover:border-emerald-600 transition-colors duration-300">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900 rounded-lg flex items-center justify-center group-hover:bg-emerald-200 dark:group-hover:bg-emerald-800 transition-colors duration-300">
                    <div className="text-emerald-600 dark:text-emerald-400 text-xl font-semibold">
                      {index === 0 && "🏥"}
                      {index === 1 && "♿"}
                      {index === 2 && "🔬"}
                      {index === 3 && "👟"}
                    </div>
                  </div>
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors duration-300">
                    {service}
                  </h4>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="text-center py-16 bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-950/20 dark:to-green-950/20 rounded-2xl border border-emerald-200 dark:border-emerald-800">
        <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Ihr vertrauensvoller Partner in der Orthopädietechnik
        </h3>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
          Besuchen Sie uns in einem unserer fünf Standorte für eine persönliche Beratung.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href="/standorte" 
            className="inline-flex items-center px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition-colors duration-300"
          >
            Standorte anzeigen
          </Link>
          <Link 
            href="/kontakt" 
            className="inline-flex items-center px-8 py-3 border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-600 hover:text-white font-semibold rounded-lg transition-colors duration-300"
          >
            Kontakt aufnehmen
          </Link>
        </div>
      </section>
    </div>
  );
}
