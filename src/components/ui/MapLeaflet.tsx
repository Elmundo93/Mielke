"use client";
import { useEffect, useState } from "react";

export function MapLeaflet({ lat, lon, title }: { lat: number; lon: number; title: string }) {
  const [enabled, setEnabled] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const c = localStorage.getItem("consent");
    if (c === "all") setEnabled(true);
  }, []);

  // Prevent hydration mismatch by not rendering until client-side
  if (!isClient) {
    return (
      <div className="flex h-64 items-center justify-center rounded-2xl border">
        <div className="text-sm text-muted-foreground">Karte wird geladen...</div>
      </div>
    );
  }

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

