import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/",
        destination: "/Pages/Home",
        permanent: true,
      },
    ];
  },
  
};

export default nextConfig;
