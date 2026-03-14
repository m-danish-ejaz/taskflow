import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/",
        destination: "/Pages/Auth",
        permanent: false,
      },
    ];
  },
  
};

export default nextConfig;
