/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configurações para melhorar performance e evitar recarregamentos
  experimental: {
    // Habilita otimizações de renderização
    optimizeCss: true,
    // Melhora o cache de páginas
    scrollRestoration: true,
  },
  // Configurações de cache
  onDemandEntries: {
    // Tempo que uma página fica em cache (em segundos)
    maxInactiveAge: 25 * 1000,
    // Número de páginas que podem ser mantidas em cache
    pagesBufferLength: 2,
  },
  // Configurações de compressão
  compress: true,
  // Configurações de otimização de imagens
  images: {
    domains: ['localhost'],
  },
  // Configurações de webpack para melhor performance
  webpack: (config, { dev, isServer }) => {
    // Otimizações para desenvolvimento
    if (dev && !isServer) {
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
      }
    }
    return config
  },
};

module.exports = nextConfig;