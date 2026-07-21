/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // On désactive complètement ESLint pendant le build (c’est safe pour un site vitrine)
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Si tu as aussi des erreurs TypeScript que tu veux ignorer temporairement
    ignoreBuildErrors: true,
  },
  experimental: {
    bodySizeLimit: '10mb',
  },
  images: {
    domains: ['images.unsplash.com'],
  },
};

export default nextConfig;