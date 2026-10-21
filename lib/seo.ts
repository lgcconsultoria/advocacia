import type { Metadata } from 'next';

/**
 * Peças de SEO compartilhadas pelas páginas públicas.
 *
 * O `openGraph` e o `twitter` de uma página SUBSTITUEM os do layout (o Next não
 * mescla campo a campo), então cada página que define título/descrição sociais
 * precisa repetir a imagem, o nome do site e o idioma. `metaSocial()` monta os
 * dois blocos de uma vez.
 */

export const SITE = 'https://www.senturiaoadv.com.br';
export const NOME_SITE = 'Douglas Senturião Advocacia';

export const OG_IMAGEM = {
  url: '/assets/img/og-image.png',
  width: 1200,
  height: 630,
  alt: 'Douglas Senturião Advocacia — Direito Tributário e Público para empresas',
};

export function metaSocial({
  titulo,
  descricao,
  caminho,
  tipo = 'website',
  publicadoEm,
  modificadoEm,
}: {
  titulo: string;
  descricao: string;
  caminho: string;
  tipo?: 'website' | 'article';
  publicadoEm?: string | null;
  modificadoEm?: string | null;
}): Pick<Metadata, 'openGraph' | 'twitter'> {
  const base = {
    title: titulo,
    description: descricao,
    url: caminho,
    siteName: NOME_SITE,
    locale: 'pt_BR',
    images: [OG_IMAGEM],
  };
  return {
    openGraph:
      tipo === 'article'
        ? {
            ...base,
            type: 'article',
            publishedTime: publicadoEm ?? undefined,
            modifiedTime: modificadoEm ?? publicadoEm ?? undefined,
          }
        : { ...base, type: 'website' },
    twitter: {
      card: 'summary_large_image',
      title: titulo,
      description: descricao,
      images: [OG_IMAGEM.url],
    },
  };
}

/**
 * Data da última mudança de conteúdo de cada página estática, para o `lastmod`
 * do sitemap. Atualize a linha da página quando mudar o conteúdo dela (não vale
 * a data do build: o Google ignora `lastmod` que muda a cada deploy).
 */
export const ATUALIZADO_EM: Record<string, string> = {
  '': '2026-10-16',
  '/sobre': '2026-10-07',
  '/areas': '2026-10-07',
  '/tributario': '2026-10-07',
  '/licitacoes': '2026-10-16',
  '/licitacoes/mandado-de-seguranca': '2026-10-21',
  '/blog': '2026-10-07',
  '/diagnostico': '2026-10-07',
  '/modelos': '2026-10-07',
  '/contato': '2026-10-07',
  '/politica-de-privacidade': '2026-10-07',
  '/exclusao-de-dados': '2026-10-07',
  '/aviso-publicidade': '2026-10-07',
};

/** Conteúdo das áreas (content/areas/*.mdoc). */
export const AREAS_ATUALIZADAS_EM = '2026-09-01';
/** Catálogo de materiais (vem do senturiao-os). */
export const MODELOS_ATUALIZADOS_EM = '2026-10-07';
/** Para qualquer página sem data própria. */
export const ATUALIZACAO_PADRAO = '2026-10-07';
