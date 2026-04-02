import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Sanitätshaus Mielke - Orthopädietechnik & Rehatechnik',
    short_name: 'Sanitätshaus Mielke',
    description: 'Ihr Spezialist für Orthopädietechnik, Rehatechnik und Orthopädieschuhtechnik seit 1989. 5 Standorte in Hessen.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#059669', // emerald-600
    icons: [
      {
        src: '/Mielke_Logo_b.webp',
        sizes: '192x192',
        type: 'image/webp',
      },
    ],
  }
}

