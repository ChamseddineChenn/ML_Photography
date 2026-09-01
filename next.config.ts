import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Parent lockfile outside this app confuses Turbopack; pin the root.
  turbopack: {
    root: path.join(__dirname),
  },
  // Playwright and some clients hit 127.0.0.1 while Next serves as localhost.
  allowedDevOrigins: ["127.0.0.1", "localhost"],
};

export default nextConfig;
