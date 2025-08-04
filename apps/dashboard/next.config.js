/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  compress: true,
  poweredByHeader: false,
  generateEtags: false,
  
  // Otimizações para produção
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  // Headers para CORS e segurança
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ]
  },
  
  // Configurações experimentais
  experimental: {
    esmExternals: true,
    optimizeCss: true,
  },
  
  // Configurações de imagem
  images: {
    domains: [],
    formats: ['image/webp', 'image/avif'],
  },
  
  // Configurações de build
  output: 'standalone',
}

module.exports = nextConfig
