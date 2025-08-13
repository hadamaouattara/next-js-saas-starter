/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuration minimale pour compatibilité Vercel maximale
  reactStrictMode: true,
  swcMinify: true,
  
  // Images configuration
  images: {
    domains: ['vercel.com'],
  },
  
  // Headers pour CORS
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
  
  // Redirections simples
  async redirects() {
    return [
      {
        source: '/dashboard',
        destination: '/quantum',
        permanent: false,
      },
    ];
  },
};

module.exports = nextConfig;
