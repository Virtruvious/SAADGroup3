import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  env: {
    NEXTAUTH_SECRET: "wygHYW#4*6dnaKCZQD",
    NEXTAUTH_URL: "http://localhost:3000",
  },
};

export default nextConfig;
