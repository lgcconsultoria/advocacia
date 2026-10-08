import type { NextConfig } from 'next';
import { SECURITY_HEADERS } from './lib/csp';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  // A Tarefa 9 (CSP com nonce por requisição) tirou as rotas de conteúdo
  // do modo estático: o middleware roda em toda página pública e força
  // renderização dinâmica (o Next precisa do nonce a cada requisição).
  // Isso move a leitura de content/**/*.mdoc, feita por lib/reader.ts via
  // createReader do Keystatic, do momento do build (onde content/ existe
  // no disco) para dentro da função serverless da Vercel — cujo pacote é
  // decidido pelo rastreamento de arquivos do Next. Como nenhum `import`
  // aponta para content/ (a leitura é via fs em runtime), o rastreamento
  // não inclui os .mdoc por conta própria, e a função sobe sem eles:
  // zero áreas, zero posts, 404 nas páginas de área.
  //
  // A correção é dizer explicitamente ao Next quais rotas precisam do
  // diretório inteiro. Cobre toda página sob app/(site) — todas herdam
  // getAreas()/getSettings() de app/(site)/layout.tsx, mesmo as que não
  // importam lib/reader diretamente (ex.: /modelos, que só lê a API
  // externa em lib/modelos.ts) — mais a 404 (app/not-found.tsx chama o
  // reader por fora do grupo (site)), o feed e o sitemap. app/manifest.ts
  // fica de fora: não importa lib/reader, é 100% estático.
  outputFileTracingIncludes: {
    '/': ['./content/**'],
    '/areas': ['./content/**'],
    '/areas/[slug]': ['./content/**'],
    '/blog': ['./content/**'],
    '/blog/[slug]': ['./content/**'],
    '/sobre': ['./content/**'],
    '/contato': ['./content/**'],
    '/diagnostico': ['./content/**'],
    '/modelos': ['./content/**'],
    '/modelos/[slug]': ['./content/**'],
    '/aviso-publicidade': ['./content/**'],
    '/politica-de-privacidade': ['./content/**'],
    '/_not-found': ['./content/**'],
    '/feed.xml': ['./content/**'],
    '/sitemap.xml': ['./content/**'],
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
