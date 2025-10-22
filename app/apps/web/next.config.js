/** @type {import('next').NextConfig} */
import { PrismaPlugin } from "@prisma/nextjs-monorepo-workaround-plugin";

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pub-*.r2.dev", // ✅ wildcard subdomains allowed here
      },
      {
        protocol: "https",
        hostname: "r2-us-west.photoai.com",
      },
      {
        protocol: "https",
        hostname: "v3b.fal.media",
        pathname: "/**",
      },
    ],
  },
  experimental: {
    serverActions: true,
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.plugins = [...config.plugins, new PrismaPlugin()];
    }
    return config;
  },
};

export default nextConfig;
