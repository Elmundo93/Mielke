import { notFound } from "next/navigation";
import { getService, type Service } from "@/lib/content";
import { Section } from "@/components/ui/Section";
import { FAQ } from "@/components/service/FAQ";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import type { Metadata } from "next";

const serviceIcons: Record<string, string> = {
  sanitaetshaus: "🏥",
  rehatechnik: "♿",
  orthopaedietechnik: "🔬",
  orthopaedieschuhtechnik: "👟"
};

const serviceKeywords: Record<string, string[]> = {
  sanitaetshaus: ["Sanitätshaus", "Hilfsmittel", "Medizinprodukte", "Kompressionsstrümpfe", "Rollstuhl"],
  rehatechnik: ["Rehatechnik", "Rollstuhl", "Gehhilfen", "Mobilitätshilfen", "Rehabilitation"],
  orthopaedietechnik: ["Orthopädietechnik", "Prothesen", "Orthesen", "Schienen", "Bandagen"],
  orthopaedieschuhtechnik: ["Orthopädieschuhtechnik", "Einlagen", "Maßschuhe", "Fußorthopädie", "Diabetikerschuhe"]
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const service = await getService(slug as Service["slug"]);
  
  if (!service) {
    return {
      title: "Leistung nicht gefunden",
    };
  }

  const keywords = serviceKeywords[service.slug] || [];

  return {
    title: `${service.title} - Sanitätshaus Mielke`,
    description: `${service.title} bei Sanitätshaus Mielke: ${service.intro} Individuelle Beratung und Versorgung in 5 Standorten in Hessen. Terminvereinbarung möglich.`,
    keywords: [
      ...keywords,
      "Sanitätshaus Mielke",
      "Hessen",
      "Nordhessen",
      "Witzenhausen",
      "Hessisch Lichtenau",
      "Großalmerode",
      "Kaufungen",
      "Bad Sooden-Allendorf",
      "Beratung",
      "Versorgung"
    ],
    openGraph: {
      title: `${service.title} - Sanitätshaus Mielke`,
      description: `${service.intro} Professionelle Beratung und individuelle Versorgung in 5 Standorten in Hessen.`,
      images: service.heroImage ? [
        {
          url: service.heroImage,
          width: 1000,
          height: 630,
          alt: `${service.title} - Sanitätshaus Mielke`,
        },
      ] : undefined,
    },
    alternates: {
      canonical: `/leistungen/${service.slug}`,
    },
  };
}

export default async function ServiceDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const s = await getService(slug as Service["slug"]);
  if (!s) return notFound();

  const icon = serviceIcons[s.slug] || "🏥";

  return (
    <>
      {/* Hero Section */}
      <Section>
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900 rounded-2xl flex items-center justify-center">
                <div className="text-3xl">{icon}</div>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
                {s.title}
              </h1>
            </div>
            
            <div className="prose prose-lg prose-gray dark:prose-invert max-w-none">
              <p className="text-xl leading-relaxed text-gray-700 dark:text-gray-300">
                {s.intro}
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white">
                <Link href="/kontakt">Beratung anfragen</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-emerald-600 text-emerald-600 hover:bg-emerald-600 hover:text-white">
                <Link href="/standorte">Standorte anzeigen</Link>
              </Button>
            </div>
          </div>
          
          {s.heroImage && (
            <div className="relative">
              <div className="aspect-[4/3] relative rounded-2xl overflow-hidden shadow-2xl xl:ml-12">
                <Image 
                  src={s.heroImage} 
                  alt={s.title}
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
            </div>
          )}
        </div>
      </Section>

      {/* Main Content */}
      {s.content && (
        <Section title="Über diesen Service" subdued>
          <div className="prose prose-lg prose-gray dark:prose-invert max-w-none">
            <p className="text-xl leading-relaxed text-gray-700 dark:text-gray-300 whitespace-pre-line">
              {s.content}
            </p>
          </div>
        </Section>
      )}

      {/* Service Categories */}
      {s.categories?.length ? (
        <Section title="Unsere Leistungen">
          <div className="grid md:grid-cols-2 gap-8">
            {s.categories.map((category, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900 rounded-lg flex items-center justify-center">
                      <div className="text-emerald-600 dark:text-emerald-400 font-bold text-lg">
                        {index + 1}
                      </div>
                    </div>
                    <CardTitle className="text-2xl text-gray-900 dark:text-white">
                      {category.title}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {category.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-gray-700 dark:text-gray-300">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </Section>
      ) : null}

      {/* Process Section */}
      {s.steps?.length ? (
        <Section title="Unser Ablauf">
          <div className="space-y-8">
            {s.steps.map((step, index) => (
              <div key={index} className="flex gap-6">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-emerald-600 rounded-full flex items-center justify-center text-white font-bold">
                    {index + 1}
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {step.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Section>
      ) : null}

      {/* Important Note */}
      {s.note && (
        <Section title="Wichtiger Hinweis" subdued>
          <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 rounded-2xl p-6 md:p-8">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-emerald-800 dark:text-emerald-200 mb-2">
                  Wichtige Information
                </h3>
                <p className="text-emerald-700 dark:text-emerald-300 leading-relaxed">
                  {s.note}
                </p>
              </div>
            </div>
          </div>
        </Section>
      )}

      {/* FAQ Section */}
      {s.faqs?.length ? (
        <Section title="Häufige Fragen" subdued>
          <FAQ faqs={s.faqs} />
        </Section>
      ) : null}

      {/* Contact CTA */}
      <Section title="Beratung gewünscht?">
        <div className="text-center max-w-3xl mx-auto">
          <p className="text-xl text-gray-700 dark:text-gray-300 mb-8">
            Haben Sie Fragen zu {s.title.toLowerCase()} oder benötigen Sie eine persönliche Beratung? 
            Wir sind gerne für Sie da!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white">
              <Link href="/kontakt">Beratung anfragen</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-emerald-600 text-emerald-600 hover:bg-emerald-600 hover:text-white">
              <Link href="/standorte">Standorte anzeigen</Link>
            </Button>
          </div>
        </div>
      </Section>
    </>
  );
}

