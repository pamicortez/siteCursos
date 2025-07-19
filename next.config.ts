import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: ["i.imgur.com", "via.placeholder.com", "your-image-host.com"], // Adicione domínios confiáveis
  },
};

export default nextConfig;
