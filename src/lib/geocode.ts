export interface GeoCoords {
  lat: number;
  lon: number;
}

export async function geocodeAddress(query: string): Promise<GeoCoords | null> {
  try {
    const params = new URLSearchParams({
      q: query,
      format: "json",
      limit: "1",
      countrycodes: "de",
    });

    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?${params}`,
      {
        headers: {
          "User-Agent": "SanitaetshausMielke/1.0 (post@ot-mielke.de)",
          "Accept-Language": "de",
        },
        next: { revalidate: 86400 }, // cache 24 h, revalidiert täglich
      }
    );

    if (!res.ok) return null;

    const data: { lat: string; lon: string }[] = await res.json();
    if (!Array.isArray(data) || data.length === 0) return null;

    return { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon) };
  } catch {
    return null;
  }
}
