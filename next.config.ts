import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "vnnldpmfchczfiuygdos.supabase.co",
        pathname: "/storage/v1/object/public/product-image/**",
      },
    ],
  },
};

export default nextConfig;
