import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  /* config options here */
  images: {
    domains: ["i.imgur.com", "via.placeholder.com", "your-image-host.com"], // Adicione domínios confiáveis
  },
};

export default nextConfig;
