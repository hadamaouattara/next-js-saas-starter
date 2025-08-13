import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Configuration pour Vercel déploiement
  output: 'standalone',
  
  // Optimisations pour performance
  swcMinify: true,
  
  // Gestion des images optimisée
  images: {
    domains: ['vercel.com'],
    formats: ['image/webp', 'image/avif'],
  },
  
  // Configuration API routes
  api: {
    bodyParser: {
      sizeLimit: '1mb',
    },
    responseLimit: '8mb',
  },
  
  // Headers sécurité et CORS
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET, POST, PUT, DELETE, OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
        ],
      },
    ];
  },
  
  // Redirections
  async redirects() {
    return [
      {
        source: '/dashboard',
        destination: '/quantum',
        permanent: true,
      },
    ];
  },
  
  // Variables d'environnement publiques
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
  
  // Webpack configuration pour build optimization
  webpack: (config, { buildId, dev, isServer, defaultLoaders, nextRuntime, webpack }) => {
    // Configuration personnalisée si nécessaire
    return config;
  },
  
  // Experimental features (désactivées pour stabilité Vercel)
  experimental: {
    // Fonctionnalités expérimentales désactivées pour éviter les erreurs build
    // ppr: false,
    // clientSegmentCache: false,
    // nodeMiddleware: false
  }
};

export default nextConfig;
