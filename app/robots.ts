import type { MetadataRoute } from 'next';

const BASE = 'https://www.senturiaoadv.com.br';

/** Áreas que nenhum rastreador deve visitar (admin do CMS, API, propostas privadas, portal demo). */
const BLOQUEADOS = ['/keystatic', '/api/', '/clientes/', '/entrar', '/sistema', '/cliente'];

/**
 * Política declarada para os rastreadores de IA (decisão provisória de 27/10/2026,
 * pendente de confirmação do Douglas: llm-seo/TODO-DOUGLAS.md): o conteúdo do site
 * é informativo e público, e queremos ser lidos e citados. Por isso todos os bots
 * abaixo são permitidos de forma explícita, e não só por herdarem o `*`.
 *
 * Cada grupo repete os bloqueios porque, no robots.txt, o rastreador que tem grupo
 * próprio ignora o grupo `*`.
 *
 * - Busca e resposta ao usuário (é o que gera citação): OAI-SearchBot, ChatGPT-User,
 *   Claude-SearchBot, Claude-User, PerplexityBot, Perplexity-User.
 * - Treino de modelos: GPTBot, ClaudeBot, Google-Extended, Applebot-Extended.
 * - CCBot (Common Crawl) fica de fora de propósito: herda o `*` e continua
 *   permitido, mas é um repositório genérico de dados, que não decide citação
 *   em nenhum dos assistentes; declará-lo seria ruído. Para vetar o treino, é só
 *   trocar o grupo dos bots de treino por `disallow: '/'`.
 */
const BOTS_DE_IA = [
  'GPTBot',
  'OAI-SearchBot',
  'ChatGPT-User',
  'ClaudeBot',
  'Claude-SearchBot',
  'Claude-User',
  'PerplexityBot',
  'Perplexity-User',
  'Google-Extended',
  'Applebot-Extended',
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: BLOQUEADOS },
      ...BOTS_DE_IA.map((userAgent) => ({ userAgent, allow: '/', disallow: BLOQUEADOS })),
    ],
    sitemap: `${BASE}/sitemap.xml`,
    host: BASE,
  };
}
