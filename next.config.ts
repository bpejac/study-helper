import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  // output: 'export' removed - we now need dynamic features for admin editing
};

export default nextConfig;
