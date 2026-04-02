import { getAllServices } from "@/lib/content";
import { Section } from "@/components/ui/Section";
import { ServiceCard } from "@/components/service/ServiceCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Leistungen",
  description: "Sanitätshaus Mielke Leistungen: Orthopädietechnik, Rehatechnik, Orthopädieschuhtechnik und Sanitätshaus. Individuelle Versorgung mit Prothesen, Orthesen, Einlagen und Maßschuhen.",
  keywords: [
    "Sanitätshaus Mielke Leistungen",
    "Orthopädietechnik",
    "Rehatechnik",
    "Orthopädieschuhtechnik",
    "Prothesen",
    "Orthesen",
    "Einlagen",
    "Maßschuhe",
    "Hilfsmittelversorgung",
    "Medizinprodukte"
  ],
  openGraph: {
    title: "Sanitätshaus Mielke Leistungen - Orthopädietechnik & Rehatechnik",
    description: "Umfassendes Leistungsspektrum in Orthopädietechnik, Rehatechnik und Orthopädieschuhtechnik. Über 35 Jahre Erfahrung.",
  },
  alternates: {
    canonical: "/leistungen",
  },
};

export default async function ServicesPage() {
  const services = await getAllServices();
  
  return (
    <>
      {/* Hero Section */}
      <Section>
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Unsere <span className="text-emerald-600 dark:text-emerald-400">Leistungen</span>
          </h1>
          <p className="text-xl text-gray-700 dark:text-gray-300 leading-relaxed mb-8">
            Das Sanitätshaus Mielke ist Ihr kompetenter Fachhandel für Orthopädietechnik und Rehatechnik im Werra-Meißner-Kreis. 
            Seit drei Jahrzehnten beraten wir Sie fachgerecht, zuvorkommend und professionell.
          </p>
          
          {/* Key Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto mb-12">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-emerald-600 dark:text-emerald-400 mb-2">4</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Spezialisierungen</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-emerald-600 dark:text-emerald-400 mb-2">35+</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Jahre Erfahrung</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-emerald-600 dark:text-emerald-400 mb-2">5</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Standorte</div>
            </div>
          </div>
        </div>
      </Section>

      {/* Services Overview */}
      <Section title="Unser Leistungsspektrum" subdued>
        <div className="text-center max-w-3xl mx-auto mb-12">
          <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
            Wir bieten Ihnen ein umfassendes Spektrum an medizinischen Hilfsmitteln und orthopädischen Lösungen. 
            Jeder Service wird von unseren erfahrenen Experten mit höchster Sorgfalt und Präzision durchgeführt.
          </p>
        </div>
        
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {services.map(s => <ServiceCard key={s.slug} service={s} />)}
        </div>
      </Section>

      {/* Service Highlights */}
      <Section title="Warum Sanitätshaus MIELKE?">
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <CardTitle className="text-xl">Qualität & Expertise</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-300">
                Über 35 Jahre Erfahrung in der Orthopädietechnik mit kontinuierlicher Weiterbildung unserer Mitarbeiter.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <CardTitle className="text-xl">Persönlicher Service</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-300">
                Individuelle Beratung und maßgeschneiderte Lösungen für Ihre spezifischen Bedürfnisse.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <CardTitle className="text-xl">Moderne Technik</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-300">
                Einsatz modernster Technologien und hochwertiger Materialien für optimale Ergebnisse.
              </p>
            </CardContent>
          </Card>
        </div>
      </Section>

      {/* Process Overview */}
      <Section title="Unser Vorgehen" subdued>
        <div className="grid md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <div className="text-white font-bold text-xl">1</div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Beratung</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              Ausführliche Beratung und Analyse Ihrer individuellen Bedürfnisse
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <div className="text-white font-bold text-xl">2</div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Vermessung</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              Präzise Vermessung und digitale Erfassung für optimale Passform
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <div className="text-white font-bold text-xl">3</div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Anfertigung</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              Maßgefertigte Anfertigung mit höchster Qualität und Präzision
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <div className="text-white font-bold text-xl">4</div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Nachsorge</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              Kontinuierliche Betreuung und Anpassung bei Bedarf
            </p>
          </div>
        </div>
      </Section>
    </>
  );
}

