import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true, // Needed for static export if using <Image />
  },
};

export default nextConfig;