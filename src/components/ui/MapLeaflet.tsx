"use client";

import dynamic from "next/dynamic";
import { useConsent } from "@/hooks/useConsent";

const LeafletMapInner = dynamic(() => import("./LeafletMapInner"), {
  ssr: false,
  loading: () => <MapSkeleton />,
});

interface Props {
  lat: number;
  lon: number;
  title: string;
  height?: string;
}

export function MapLeaflet({ lat, lon, title, height = "h-72" }: Props) {
  const { level, requestConsent } = useConsent();

  // level === null means not yet hydrated — show neutral skeleton to avoid flash
  if (level === null) {
    return <div className={`${height} rounded-2xl bg-gray-100 dark:bg-gray-800 animate-pulse`} />;
  }

  if (level !== "all") {
    return (
      <div className={`${height} rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center gap-3 bg-gray-50 dark:bg-gray-900 px-6 text-center`}>
        <svg className="w-8 h-8 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20.25H5.25A2.25 2.25 0 013 18V5.25A2.25 2.25 0 015.25 3H15a2.25 2.25 0 012.25 2.25V9M9 20.25l3-3m0 0l3 3m-3-3v7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Karte nicht geladen — OpenStreetMap-Tiles würden eine Verbindung zu externen Servern herstellen.
        </p>
        <button
          type="button"
          onClick={requestConsent}
          className="text-sm font-medium text-emerald-600 hover:text-emerald-700 underline underline-offset-2"
        >
          Datenschutzeinstellungen anpassen
        </button>
      </div>
    );
  }

  return (
    <div className={`${height} rounded-2xl overflow-hidden shadow-md`}>
      <LeafletMapInner lat={lat} lon={lon} title={title} />
    </div>
  );
}

function MapSkeleton() {
  return <div className="h-full w-full bg-gray-100 dark:bg-gray-800 animate-pulse" />;
}
