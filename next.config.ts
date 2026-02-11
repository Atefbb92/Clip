import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    optimizePackageImports: ["lucide-react"]
  },
  images: {
    domains: ['firebasestorage.googleapis.com']
  }
};

export default nextConfig;
