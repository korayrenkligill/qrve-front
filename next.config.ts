import type { NextConfig } from "next";

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
const nextConfig: NextConfig = {
  env: {
    API_BASE_URL: "https://localhost:44327",
  },
};

export default nextConfig;
