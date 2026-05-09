"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// SVG pin icon — avoids the default marker image path issue with webpack
const createPinIcon = () =>
  L.divIcon({
    className: "",
    iconSize: [36, 44],
    iconAnchor: [18, 44],
    popupAnchor: [0, -46],
    html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 44" fill="none">
      <path fill="#059669" d="M18 0C8.06 0 0 8.06 0 18c0 13.5 18 26 18 26S36 31.5 36 18C36 8.06 27.94 0 18 0z"/>
      <circle cx="18" cy="18" r="7" fill="white"/>
    </svg>`,
  });

interface Props {
  lat: number;
  lon: number;
  title: string;
}

export default function LeafletMapInner({ lat, lon, title }: Props) {
  useEffect(() => {
    // Fix Leaflet's internal icon URL detection when bundled
    delete (L.Icon.Default.prototype as { _getIconUrl?: unknown })._getIconUrl;
  }, []);

  const icon = createPinIcon();

  return (
    <MapContainer
      center={[lat, lon]}
      zoom={17}
      scrollWheelZoom={false}
      className="h-full w-full rounded-2xl"
      style={{ zIndex: 0 }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a>-Mitwirkende'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[lat, lon]} icon={icon}>
        <Popup>
          <strong>{title}</strong>
        </Popup>
      </Marker>
    </MapContainer>
  );
}
