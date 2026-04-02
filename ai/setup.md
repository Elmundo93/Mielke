Projektstruktur (MVP)
app/
  (site)/
    layout.tsx
    page.tsx
    ueber-uns/page.tsx
    kontakt/page.tsx
    kontakt/success/page.tsx
    leistungen/page.tsx
    leistungen/[slug]/page.tsx
    standorte/page.tsx
    standorte/[slug]/page.tsx
  api/
    kontakt/route.ts
  sitemap.ts
  robots.txt
components/
  layout/Header.tsx
  layout/Footer.tsx
  layout/Consent.tsx
  location/LocationCard.tsx
  location/HoursTable.tsx
  service/ServiceCard.tsx
  service/FAQ.tsx
  ui/Section.tsx
  ui/Prose.tsx
  ui/MapLeaflet.tsx
content/
  locations/witzenhausen.json
  services/rehatechnik.mdx
lib/
  content.ts
  schema.ts
  validators.ts
  mail.ts       # später befüllen, z. B. SMTP/Brevo

  1) Layout, Header, Footer

app/(site)/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Consent } from "@/components/layout/Consent";

export const metadata: Metadata = {
  title: "Sanitätshaus – Ihre Versorgung vor Ort",
  description: "Sanitätshaus, Rehatechnik, Orthopädietechnik, Orthopädieschuhtechnik.",
  robots: { index: true, follow: true },
};

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <body className="min-h-screen antialiased">
        <Header />
        <main className="min-h-[70vh]">{children}</main>
        <Footer />
        <Consent />
      </body>
    </html>
  );
}

components/layout/Header.tsx
"use client";

import Link from "next/link";
import { NavigationMenu, NavigationMenuItem, NavigationMenuList, NavigationMenuTrigger, NavigationMenuContent } from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-lg font-semibold">Sanitätshaus</Link>

        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <Link href="/standorte" className="px-3 py-2">Standorte</Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Leistungen</NavigationMenuTrigger>
              <NavigationMenuContent className="p-3">
                <div className="grid min-w-[320px] gap-2 sm:min-w-[420px] sm:grid-cols-2">
                  <Link className="px-3 py-2 rounded hover:bg-accent" href="/leistungen/sanitaetshaus">Sanitätshaus</Link>
                  <Link className="px-3 py-2 rounded hover:bg-accent" href="/leistungen/rehatechnik">Rehatechnik</Link>
                  <Link className="px-3 py-2 rounded hover:bg-accent" href="/leistungen/orthopaedietechnik">Orthopädietechnik</Link>
                  <Link className="px-3 py-2 rounded hover:bg-accent" href="/leistungen/orthopaedieschuhtechnik">Orthopädieschuhtechnik</Link>
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/ueber-uns" className="px-3 py-2">Über uns</Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/kontakt" className="px-3 py-2">Kontakt</Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        <Button asChild size="sm">
          <Link href="/kontakt">Termin anfragen</Link>
        </Button>
      </div>
    </header>
  );
}

components/layout/Footer.tsx

import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-12 border-t">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:grid-cols-3">
        <div>
          <div className="text-lg font-semibold">Sanitätshaus</div>
          <p className="mt-2 text-sm text-muted-foreground">Individuelle Versorgung in Ihrer Region.</p>
        </div>
        <div>
          <div className="font-medium">Navigation</div>
          <ul className="mt-2 space-y-1 text-sm">
            <li><Link href="/standorte" className="hover:underline">Standorte</Link></li>
            <li><Link href="/leistungen" className="hover:underline">Leistungen</Link></li>
            <li><Link href="/ueber-uns" className="hover:underline">Über uns</Link></li>
            <li><Link href="/kontakt" className="hover:underline">Kontakt</Link></li>
          </ul>
        </div>
        <div>
          <div className="font-medium">Rechtliches</div>
          <ul className="mt-2 space-y-1 text-sm">
            <li><Link href="/impressum" className="hover:underline">Impressum</Link></li>
            <li><Link href="/datenschutz" className="hover:underline">Datenschutz</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t py-4">
        <div className="mx-auto max-w-6xl px-4 text-xs text-muted-foreground">
          © {new Date().getFullYear()} Sanitätshaus – Alle Rechte vorbehalten.
        </div>
      </div>
    </footer>
  );
}

components/layout/Consent.tsx

"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export function Consent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const v = localStorage.getItem("consent");
    if (!v) setVisible(true);
  }, []);

  if (!visible) return null;
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t bg-background/95">
      <div className="mx-auto max-w-6xl px-4 py-4 text-sm">
        <p>
          Wir verwenden technisch notwendige Cookies. Externe Inhalte (z. B. Karten) werden erst nach Ihrer Zustimmung geladen.
        </p>
        <div className="mt-3 flex gap-2">
          <Button size="sm" onClick={() => { localStorage.setItem("consent","all"); setVisible(false); }}>
            Einverstanden
          </Button>
          <Button variant="secondary" size="sm" onClick={() => { localStorage.setItem("consent","necessary"); setVisible(false); }}>
            Nur notwendig
          </Button>
        </div>
      </div>
    </div>
  );
}

2) Sektionen & Cards

components/ui/Section.tsx

export function Section({ title, children, subdued = false }: { title?: string; children: React.ReactNode; subdued?: boolean }) {
  return (
    <section className={subdued ? "bg-muted/40" : ""}>
      <div className="mx-auto max-w-6xl px-6 py-12">
        {title ? <h2 className="text-2xl font-semibold">{title}</h2> : null}
        <div className={title ? "mt-6" : ""}>{children}</div>
      </div>
    </section>
  );
}

components/ui/Prose.tsx

export function Prose({ children }: { children: React.ReactNode }) {
  return <div className="prose prose-gray max-w-none dark:prose-invert">{children}</div>;
}

components/location/LocationCard.tsx

import Link from "next/link";
import type { Location } from "@/lib/content";

export function LocationCard({ location }: { location: Location }) {
  return (
    <div className="rounded-2xl border p-4">
      <div className="text-lg font-medium">{location.name}</div>
      <div className="mt-2 text-sm text-muted-foreground">
        {location.address}, {location.postalCode} {location.city}
      </div>
      {location.phone && <div className="mt-1 text-sm">Tel.: {location.phone}</div>}
      <Link className="mt-4 inline-block text-sm underline underline-offset-4" href={`/standorte/${location.slug}`}>
        Details & Öffnungszeiten
      </Link>
    </div>
  );
}

components/location/HoursTable.tsx

import type { Location } from "@/lib/content";

export function HoursTable({ openingHours }: { openingHours: NonNullable<Location["openingHours"]> }) {
  return (
    <table className="w-full text-sm">
      <tbody>
        {openingHours.map((h) => (
          <tr key={h.day} className="border-b last:border-0">
            <td className="py-2 font-medium">{h.day}</td>
            <td className="py-2">{h.opens} – {h.closes}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

components/service/ServiceCard.tsx

import Link from "next/link";
import type { Service } from "@/lib/content";

export function ServiceCard({ service }: { service: Service }) {
  return (
    <div className="rounded-2xl border p-4">
      <div className="text-lg font-medium">{service.title}</div>
      {service.intro && <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{service.intro}</p>}
      <Link className="mt-4 inline-block text-sm underline underline-offset-4" href={`/leistungen/${service.slug}`}>
        Mehr erfahren
      </Link>
    </div>
  );
}

components/service/FAQ.tsx

"use client";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import type { Service } from "@/lib/content";

export function FAQ({ faqs }: { faqs: NonNullable<Service["faqs"]> }) {
  if (!faqs.length) return null;
  return (
    <Accordion type="single" collapsible className="w-full">
      {faqs.map((f, i) => (
        <AccordionItem key={i} value={`item-${i}`}>
          <AccordionTrigger>{f.q}</AccordionTrigger>
          <AccordionContent>{f.a}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

3) Content-Types & Loader

lib/content.ts

import fs from "node:fs/promises";
import path from "node:path";

export type Location = {
  slug: string;
  name: string;
  address: string;
  postalCode: string;
  city: string;
  phone?: string;
  email?: string;
  lat?: number; lon?: number;
  openingHours?: { day: string; opens: string; closes: string }[];
  services: string[];
  accessibility?: string[];
  heroImage?: string;
};

export type Service = {
  slug: "sanitaetshaus" | "rehatechnik" | "orthopaedietechnik" | "orthopaedieschuhtechnik";
  title: string;
  intro: string;
  benefits: string[];
  steps?: { title: string; text: string }[];
  faqs?: { q: string; a: string }[];
  heroImage?: string;
};

const CONTENT_DIR = path.join(process.cwd(), "content");

export async function getAllLocations(): Promise<Location[]> {
  const dir = path.join(CONTENT_DIR, "locations");
  const files = await fs.readdir(dir);
  const items = await Promise.all(files.filter(f => f.endsWith(".json")).map(async (f) => {
    const raw = await fs.readFile(path.join(dir, f), "utf8");
    return JSON.parse(raw) as Location;
  }));
  return items.sort((a, b) => a.name.localeCompare(b.name));
}

export async function getLocation(slug: string): Promise<Location | null> {
  try {
    const p = path.join(CONTENT_DIR, "locations", `${slug}.json`);
    const raw = await fs.readFile(p, "utf8");
    return JSON.parse(raw) as Location;
  } catch {
    return null;
  }
}

// Für Services im MVP: als JSON oder MDX; hier zeigen wir JSON-Variante:
export async function getAllServices(): Promise<Service[]> {
  // Einfachheit: vier statische Services, ggf. später aus Dateien/MDX laden
  const list: Service[] = [
    { slug: "sanitaetshaus", title: "Sanitätshaus", intro: "Individuelle Hilfsmittelversorgung.", benefits: [] },
    { slug: "rehatechnik", title: "Rehatechnik", intro: "Mobilität und Selbstständigkeit fördern.", benefits: [] },
    { slug: "orthopaedietechnik", title: "Orthopädietechnik", intro: "Maßgefertigte Orthesen und Prothesen.", benefits: [] },
    { slug: "orthopaedieschuhtechnik", title: "Orthopädieschuhtechnik", intro: "Einlagen und Maßschuhe.", benefits: [] },
  ];
  return list;
}

export async function getService(slug: Service["slug"]): Promise<Service | null> {
  const all = await getAllServices();
  return all.find(s => s.slug === slug) ?? null;
}

4) Seiten

app/(site)/page.tsx (Home)
import Link from "next/link";
import { getAllLocations, getAllServices } from "@/lib/content";
import { Section } from "@/components/ui/Section";
import { LocationCard } from "@/components/location/LocationCard";
import { ServiceCard } from "@/components/service/ServiceCard";

export default async function HomePage() {
  const [locations, services] = await Promise.all([getAllLocations(), getAllServices()]);
  return (
    <>
      <Section>
        <div className="max-w-3xl">
          <h1 className="text-4xl font-semibold tracking-tight">Ihr Sanitätshaus in der Region</h1>
          <p className="mt-4 text-muted-foreground">
            Sanitätshaus, Rehatechnik, Orthopädietechnik und Orthopädieschuhtechnik – persönlich, nah, kompetent.
          </p>
          <div className="mt-6 flex gap-3">
            <Link className="underline underline-offset-4" href="/standorte">Standorte</Link>
            <Link className="underline underline-offset-4" href="/leistungen">Leistungen</Link>
          </div>
        </div>
      </Section>

      <Section title="Unsere Standorte">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {locations.map((l) => <LocationCard key={l.slug} location={l} />)}
        </div>
      </Section>

      <Section subdued title="Unsere Leistungen">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((s) => <ServiceCard key={s.slug} service={s} />)}
        </div>
      </Section>
    </>
  );
}

app/(site)/standorte/page.tsx (Übersicht)
import { getAllLocations } from "@/lib/content";
import { Section } from "@/components/ui/Section";
import { LocationCard } from "@/components/location/LocationCard";

export default async function LocationsPage() {
  const locations = await getAllLocations();
  return (
    <Section title="Standorte">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {locations.map((l) => <LocationCard key={l.slug} location={l} />)}
      </div>
    </Section>
  );
}

app/(site)/standorte/[slug]/page.tsx (Detail)

import { notFound } from "next/navigation";
import { getLocation } from "@/lib/content";
import { Section } from "@/components/ui/Section";
import { HoursTable } from "@/components/location/HoursTable";
import { LocalBusinessBranchJsonLd } from "@/lib/schema";

export default async function LocationDetail({ params }: { params: { slug: string } }) {
  const loc = await getLocation(params.slug);
  if (!loc) return notFound();

  return (
    <>
      {LocalBusinessBranchJsonLd({ location: loc })}
      <Section>
        <h1 className="text-3xl font-semibold">{loc.name}</h1>
        <div className="mt-4 text-muted-foreground">
          {loc.address}, {loc.postalCode} {loc.city}
        </div>
        <div className="mt-2 space-x-6 text-sm">
          {loc.phone && <span>Tel.: {loc.phone}</span>}
          {loc.email && <span>E-Mail: {loc.email}</span>}
        </div>
      </Section>

      {loc.openingHours && (
        <Section title="Öffnungszeiten" subdued>
          <HoursTable openingHours={loc.openingHours} />
        </Section>
      )}

      {loc.accessibility?.length ? (
        <Section title="Barrierefreiheit">
          <ul className="list-disc pl-6">
            {loc.accessibility.map((a) => <li key={a}>{a}</li>)}
          </ul>
        </Section>
      ) : null}
    </>
  );
}

app/(site)/leistungen/page.tsx (Übersicht)

import { getAllServices } from "@/lib/content";
import { Section } from "@/components/ui/Section";
import { ServiceCard } from "@/components/service/ServiceCard";

export default async function ServicesPage() {
  const services = await getAllServices();
  return (
    <Section title="Leistungen">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {services.map(s => <ServiceCard key={s.slug} service={s} />)}
      </div>
    </Section>
  );
}

app/(site)/leistungen/[slug]/page.tsx (Detail)
import { notFound } from "next/navigation";
import { getService } from "@/lib/content";
import { Section } from "@/components/ui/Section";
import { Prose } from "@/components/ui/Prose";
import { FAQ } from "@/components/service/FAQ";

export default async function ServiceDetail({ params }: { params: { slug: string } }) {
  const s = await getService(params.slug as any);
  if (!s) return notFound();

  return (
    <>
      <Section>
        <h1 className="text-3xl font-semibold">{s.title}</h1>
        <Prose>
          <p className="mt-4">{s.intro}</p>
          {s.benefits?.length ? (
            <>
              <h2>Vorteile</h2>
              <ul>{s.benefits.map(b => <li key={b}>{b}</li>)}</ul>
            </>
          ) : null}
          {s.steps?.length ? (
            <>
              <h2>Ablauf</h2>
              <ol>{s.steps.map(st => <li key={st.title}><strong>{st.title}:</strong> {st.text}</li>)}</ol>
            </>
          ) : null}
        </Prose>
      </Section>

      {s.faqs?.length ? (
        <Section subdued title="FAQ">
          <FAQ faqs={s.faqs} />
        </Section>
      ) : null}
    </>
  );
}

app/(site)/ueber-uns/page.tsx
import { Section } from "@/components/ui/Section";
import { Prose } from "@/components/ui/Prose";

export default function AboutPage() {
  return (
    <Section>
      <h1 className="text-3xl font-semibold">Über uns</h1>
      <Prose>
        <p className="mt-4">Kurzvorstellung, Historie, Werte. Eigene Texte, keine 1:1-Übernahmen.</p>
      </Prose>
    </Section>
  );
}

lib/validators.ts

import { z } from "zod";

export const ContactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  message: z.string().min(10),
  hp: z.string().optional(),        // Honeypot
  ts: z.string().optional(),        // Timestamp
});
export type ContactInput = z.infer<typeof ContactSchema>;

app/(site)/kontakt/page.tsx

"use client";

import { useState } from "react";

export default function ContactPage() {
  const [ok, setOk] = useState<boolean | null>(null);

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <h1 className="text-3xl font-semibold">Kontakt</h1>
      <form
        className="mt-6 space-y-4"
        action="/api/kontakt"
        method="post"
        onSubmit={(e) => {
          // optional client-logic
        }}
      >
        <input type="text" name="hp" className="hidden" tabIndex={-1} aria-hidden="true" />
        <input type="hidden" name="ts" value={Date.now().toString()} />
        <div>
          <label className="block text-sm font-medium">Name</label>
          <input name="name" required className="mt-1 w-full rounded-md border px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium">E-Mail</label>
          <input name="email" type="email" required className="mt-1 w-full rounded-md border px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium">Nachricht</label>
          <textarea name="message" rows={6} required className="mt-1 w-full rounded-md border px-3 py-2" />
        </div>
        <button className="rounded-md bg-primary px-4 py-2 text-primary-foreground">Senden</button>
        {ok === true && <p className="text-sm text-green-700">Danke! Wir melden uns zeitnah.</p>}
        {ok === false && <p className="text-sm text-red-700">Senden fehlgeschlagen.</p>}
      </form>
    </div>
  );
}

app/api/kontakt/route.ts

import { NextResponse } from "next/server";
import { ContactSchema } from "@/lib/validators";

export async function POST(req: Request) {
  const form = await req.formData();
  const data = Object.fromEntries(form) as Record<string, string>;
  const parsed = ContactSchema.safeParse(data);

  // Spam-Heuristik: Honeypot oder <2s Ausfüllzeit
  const tooFast = data.ts && Date.now() - Number(data.ts) < 2000;
  if (!parsed.success || (data.hp && data.hp.length > 0) || tooFast) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  // TODO: E-Mail versenden (SMTP/Brevo) – lib/mail.ts
  // await sendContactMail(parsed.data)

  return NextResponse.json({ ok: true }, { status: 200 });
}


app/(site)/kontakt/success/page.tsx
export default function ContactSuccess() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <h1 className="text-2xl font-semibold">Vielen Dank</h1>
      <p className="mt-3 text-muted-foreground">Ihre Nachricht wurde übermittelt.</p>
    </div>
  );
}

5) JSON-LD & SEO-Hilfen

import type { Location } from "./content";

export function LocalBusinessBranchJsonLd({ location }: { location: Location }) {
  const json = {
    "@context": "https://schema.org",
    "@type": "MedicalBusiness",
    "name": `Sanitätshaus – ${location.name}`,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": location.address,
      "postalCode": location.postalCode,
      "addressLocality": location.city,
      "addressCountry": "DE"
    },
    "telephone": location.phone,
    "email": location.email,
    "parentOrganization": { "@type": "Organization", "name": "Sanitätshaus" }
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }} />;
}

app/sitemap.ts

import { MetadataRoute } from "next";
import { getAllLocations, getAllServices } from "@/lib/content";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_BASE_URL ?? "https://example.com";
  const entries: MetadataRoute.Sitemap = [
    { url: `${base}/`, changefreq: "weekly", priority: 1.0 },
    { url: `${base}/standorte`, changefreq: "monthly" },
    { url: `${base}/leistungen`, changefreq: "monthly" },
    { url: `${base}/ueber-uns`, changefreq: "yearly" },
    { url: `${base}/kontakt`, changefreq: "yearly" },
  ];
  const [locs, svcs] = await Promise.all([getAllLocations(), getAllServices()]);
  locs.forEach(l => entries.push({ url: `${base}/standorte/${l.slug}`, changefreq: "yearly" }));
  svcs.forEach(s => entries.push({ url: `${base}/leistungen/${s.slug}`, changefreq: "yearly" }));
  return entries;
}

app/robots.txt
User-agent: *
Allow: /
Sitemap: https://example.com/sitemap.xml

6) Beispiel-Content (startklar)

content/locations/witzenhausen.json

{
  "slug": "witzenhausen",
  "name": "Witzenhausen",
  "address": "Beispielstraße 1",
  "postalCode": "37213",
  "city": "Witzenhausen",
  "phone": "+49 5542 12345",
  "email": "witzenhausen@example.de",
  "lat": 51.3401,
  "lon": 9.8552,
  "openingHours": [
    { "day": "Montag", "opens": "09:00", "closes": "18:00" },
    { "day": "Dienstag", "opens": "09:00", "closes": "18:00" },
    { "day": "Mittwoch", "opens": "09:00", "closes": "18:00" },
    { "day": "Donnerstag", "opens": "09:00", "closes": "18:00" },
    { "day": "Freitag", "opens": "09:00", "closes": "16:00" }
  ],
  "services": ["sanitaetshaus","rehatechnik","orthopaedietechnik","orthopaedieschuhtechnik"],
  "accessibility": ["Stufenloser Zugang", "Parkplätze vor Ort"]
}

7) Map (datensparsam, erst nach Consent)

components/ui/MapLeaflet.tsx (Placeholder)

"use client";
import { useEffect, useState } from "react";

export function MapLeaflet({ lat, lon, title }: { lat: number; lon: number; title: string }) {
  const [enabled, setEnabled] = useState(false);
  useEffect(() => {
    const c = localStorage.getItem("consent");
    if (c === "all") setEnabled(true);
  }, []);
  if (!enabled) {
    return (
      <div className="flex h-64 items-center justify-center rounded-2xl border">
        <button className="underline" onClick={() => { localStorage.setItem("consent","all"); location.reload(); }}>
          Karte laden (Zustimmung erteilen)
        </button>
      </div>
    );
  }
  return (
    <div className="h-64 rounded-2xl border">
      {/* TODO: Leaflet einbinden; hier nur Platzhalter */}
      <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
        Karte: {title} ({lat}, {lon})
      </div>
    </div>
  );
}

