import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
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
