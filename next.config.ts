import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  trailingSlash: true,
  // Specialità «consulenza»: la pagina della specialità è anche la scheda della visita (URL canonico), l'altro va in 301
  async redirects() {
    return [
      { source: "/prestazioni/visita-cardiochirurgica/", destination: "/specialita/cardiochirurgia/", permanent: true },
      { source: "/prestazioni/visita-chirurgia-vascolare/", destination: "/specialita/chirurgia-vascolare/", permanent: true },
      { source: "/prestazioni/visita-dietologica/", destination: "/specialita/dietologia/", permanent: true },
    ];
  },
};

export default nextConfig;
