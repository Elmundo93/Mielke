# Sanitätshaus Website

Eine moderne, zeitgemäße Website für ein Sanitätshaus mit Next.js 15, TypeScript und Tailwind CSS.

## Features

- **Responsive Design**: Optimiert für alle Geräte
- **SEO-optimiert**: Mit Sitemap, JSON-LD Schema und Meta-Tags
- **Datenschutz-konform**: Cookie-Consent-Management
- **Moderne UI**: Mit shadcn/ui Komponenten
- **TypeScript**: Vollständig typisiert für bessere Entwicklererfahrung
- **Content-Management**: JSON-basiertes Content-System

## Struktur

```
src/
├── app/
│   ├── (site)/                 # Hauptseiten
│   │   ├── layout.tsx         # Layout mit Header/Footer
│   │   ├── page.tsx           # Homepage
│   │   ├── standorte/         # Standorte-Übersicht und Details
│   │   ├── leistungen/        # Leistungen-Übersicht und Details
│   │   ├── ueber-uns/         # Über uns
│   │   └── kontakt/           # Kontaktformular
│   ├── api/kontakt/           # API für Kontaktformular
│   ├── sitemap.ts             # Automatische Sitemap-Generierung
│   └── robots.txt             # Robots.txt
├── components/
│   ├── layout/                # Header, Footer, Consent
│   ├── ui/                    # Basis-UI-Komponenten
│   ├── location/              # Standort-spezifische Komponenten
│   └── service/               # Leistungs-spezifische Komponenten
├── lib/                       # Utilities, Content-Loader, Validatoren
└── content/
    └── locations/             # Standort-Daten als JSON
```

## Entwicklung

```bash
# Dependencies installieren
yarn install

# Entwicklungsserver starten
yarn dev

# Build für Produktion
yarn build

# Produktionsserver starten
yarn start
```

## Content-Management

### Standorte hinzufügen

Neue Standorte als JSON-Datei in `src/content/locations/` erstellen:

```json
{
  "slug": "neuer-standort",
  "name": "Neuer Standort",
  "address": "Straße 123",
  "postalCode": "12345",
  "city": "Stadt",
  "phone": "+49 123 456789",
  "email": "standort@example.de",
  "lat": 51.1234,
  "lon": 9.5678,
  "openingHours": [
    { "day": "Montag", "opens": "09:00", "closes": "18:00" }
  ],
  "services": ["sanitaetshaus", "rehatechnik"],
  "accessibility": ["Barrierefrei"]
}
```

### Leistungen anpassen

Leistungen werden aktuell in `src/lib/content.ts` verwaltet und können später auf MDX-Dateien umgestellt werden.

## Anpassungen

- **Styling**: Tailwind CSS mit Design System
- **Farben**: Über CSS-Variablen anpassbar
- **Komponenten**: Erweiterbar über shadcn/ui
- **SEO**: JSON-LD Schema für bessere Suchmaschinenoptimierung

## Deployment

Die Anwendung ist bereit für Deployment auf Vercel, Netlify oder anderen Next.js-kompatiblen Plattformen.

## Nächste Schritte

- [ ] E-Mail-Integration für Kontaktformular (SMTP/Brevo)
- [ ] Leaflet-Karten-Integration
- [ ] Bild-Upload für Standorte und Leistungen
- [ ] CMS-Integration (Contentful, Sanity, etc.)
- [ ] Mehrsprachigkeit
- [ ] Analytics-Integration