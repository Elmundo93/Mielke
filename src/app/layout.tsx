import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://sanitaetshaus-mielke.de'),
  title: {
    default: "Sanitätshaus Mielke – Orthopädietechnik & Rehatechnik in Hessen",
    template: "%s | Sanitätshaus Mielke"
  },
  description: "Sanitätshaus Mielke: Ihr Spezialist für Orthopädietechnik, Rehatechnik und Orthopädieschuhtechnik seit 1989. 5 Standorte in Hessen - Witzenhausen, Hessisch Lichtenau, Großalmerode, Kaufungen, Bad Sooden-Allendorf.",
  icons: {
    icon: '/favicon.ico',
  },
  keywords: [
    "Sanitätshaus",
    "Orthopädietechnik", 
    "Rehatechnik",
    "Orthopädieschuhtechnik",
    "Hilfsmittel",
    "Prothesen",
    "Orthesen",
    "Einlagen",
    "Maßschuhe",
    "Witzenhausen",
    "Hessisch Lichtenau",
    "Großalmerode",
    "Kaufungen",
    "Bad Sooden-Allendorf",
    "Hessen",
    "Nordhessen"
  ],
  authors: [{ name: "Sanitätshaus Mielke" }],
  creator: "Sanitätshaus Mielke",
  publisher: "Sanitätshaus Mielke",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  robots: { 
    index: true, 
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "de_DE",
    url: "/",
    siteName: "Sanitätshaus Mielke",
    title: "Sanitätshaus Mielke – Orthopädietechnik & Rehatechnik in Hessen",
    description: "Ihr Spezialist für Orthopädietechnik, Rehatechnik und Orthopädieschuhtechnik seit 1989. 5 Standorte in Hessen.",
    images: [
      {
        url: "/Mielke_Logo_b.webp",
        width: 1200,
        height: 630,
        alt: "Sanitätshaus Mielke Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sanitätshaus Mielke – Orthopädietechnik & Rehatechnik in Hessen",
    description: "Ihr Spezialist für Orthopädietechnik, Rehatechnik und Orthopädieschuhtechnik seit 1989.",
    images: ["/Mielke_Logo_b.webp"],
  },
  verification: {
    google: process.env.GOOGLE_VERIFICATION_ID,
  },
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}