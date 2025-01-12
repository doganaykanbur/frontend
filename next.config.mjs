// next.config.mjs

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
	     turbo: false,
    jsxTransform: true, // JSX dönüşümünü etkinleştirir
  },
};

export default nextConfig;
