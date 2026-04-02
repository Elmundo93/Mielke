import Link from "next/link";
import type { Location } from "@/lib/content";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface LocationContactCardProps {
  location: Location;
}

export function LocationContactCard({ location }: LocationContactCardProps) {
  return (
    <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
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
      <CardHeader>
        <CardTitle className="text-xl text-gray-900 dark:text-white">
          {location.name}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Address */}
        <div className="space-y-1">
          <div className="text-gray-700 dark:text-gray-300">
            {location.address}
          </div>
          <div className="text-gray-700 dark:text-gray-300">
            {location.postalCode} {location.city}
          </div>
        </div>
        
        {/* Contact Info */}
        <div className="space-y-2">
          {location.phone && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-emerald-100 dark:bg-emerald-900 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Telefon</div>
                <a 
                  href={`tel:${location.phone}`} 
                  className="text-gray-900 dark:text-white hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                >
                  {location.phone}
                </a>
              </div>
            </div>
          )}
          
          {location.email && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-emerald-100 dark:bg-emerald-900 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <div className="text-sm text-gray-500 dark:text-gray-400">E-Mail</div>
                <a 
                  href={`mailto:${location.email}`} 
                  className="text-gray-900 dark:text-white hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                >
                  {location.email}
                </a>
              </div>
            </div>
          )}
        </div>
        
        {/* Opening Hours Preview */}
        {location.openingHours && location.openingHours.length > 0 && (
          <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">Öffnungszeiten</div>
            <div className="text-sm text-gray-700 dark:text-gray-300">
              {location.openingHours[0].day}: {location.openingHours[0].opens} - {location.openingHours[0].closes}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              +{location.openingHours.length - 1} weitere Tage
            </div>
          </div>
        )}
        
        {/* Action Buttons */}
        <div className="flex gap-2 pt-4">
          <Button asChild size="sm" className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white">
            <Link href={`/standorte/${location.slug}`}>
              Details anzeigen
            </Link>
          </Button>
          {location.phone && (
            <Button asChild variant="outline" size="sm" className="border-emerald-600 text-emerald-600 hover:bg-emerald-600 hover:text-white">
              <a href={`tel:${location.phone}`}>
                Anrufen
              </a>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
