import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  output: "standalone",
  async redirects() {
    return [
      // Banners saved in admin may still point at the old "/products" listing.
      { source: "/products", destination: "/shop", permanent: false },
    ];
  },
  turbopack: {
    root: path.resolve(__dirname),
  },
  images: {
    qualities: [75],
    remotePatterns: process.env.R2_PUBLIC_URL
      ? [
          {
            protocol: "https",
            hostname: new URL(process.env.R2_PUBLIC_URL).hostname,
            pathname: "/**",
          },
        ]
      : [],
  },
};

export default nextConfig;
