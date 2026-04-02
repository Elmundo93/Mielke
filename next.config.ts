import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      // Datei-Uploads über das Kontaktformular (max. 5 × 10 MB)
      bodySizeLimit: "52mb",
    },
  },
};

export default nextConfig;
