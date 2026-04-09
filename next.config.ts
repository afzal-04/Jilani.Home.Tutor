import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/hometutor",  
  assetPrefix: "/hometutor/", 
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
