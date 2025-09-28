import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: ["i.imgur.com", "via.placeholder.com", "your-image-host.com"],
  },
  // IMPORTANTE: Para Docker funcionar
  output: 'standalone',
  
  // Configuração para tracing de arquivos (corrigida)
  outputFileTracingRoot: process.cwd(),
};

export default nextConfig;