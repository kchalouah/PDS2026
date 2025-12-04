/** @type {import('next').NextConfig} */
const basePath = "";

const nextConfig = {
  // Use Node runtime for a dynamic app (SSR/ISR capable)
  output: "standalone",
  basePath: basePath || undefined,
  assetPrefix: basePath || undefined,
  images: {
    unoptimized: true,
  },
  // Speed up CI/container builds: do not block on ESLint or TS type errors
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
};

export default nextConfig;
