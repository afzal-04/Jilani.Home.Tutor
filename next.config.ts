import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/hometutor",  
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
