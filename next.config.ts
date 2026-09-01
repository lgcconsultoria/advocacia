import type { NextConfig } from 'next';
import { SECURITY_HEADERS } from './lib/csp';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  async headers() {
    return [
      {
        // Os headers que não variam por requisição. O CSP NÃO está aqui:
        // ele carrega o nonce e por isso sai do middleware.
        source: '/((?!keystatic|api/keystatic).*)',
        headers: SECURITY_HEADERS,
      },
      {
        // O que pode ser cacheado sem nonce. O HTML não pode: ver spec §5.4.
        source: '/:arquivo(feed.xml|sitemap.xml|robots.txt|bootstrap.js)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, s-maxage=3600, stale-while-revalidate=86400',
          },
        ],
      },
      {
        source: '/assets/:caminho*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, s-maxage=86400, stale-while-revalidate=604800',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
