import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The package generator reads the logo off disk at request time, so make
  // sure serverless bundlers trace it into the function.
  outputFileTracingIncludes: {
    "/api/submittals/[id]/package": ["./public/pps-logo.png"],
  },
};

export default nextConfig;
