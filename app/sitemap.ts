import type { MetadataRoute } from 'next';
import { getAreas, getPosts } from '@/lib/reader';
import { getModelos } from '@/lib/modelos';
import { PAGINA_PRINCIPAL } from '@/lib/areas';
import {
  ATUALIZACAO_PADRAO,
  ATUALIZADO_EM,
  AREAS_ATUALIZADAS_EM,
  MODELOS_ATUALIZADOS_EM,
  SITE as BASE,
} from '@/lib/seo';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [areas, posts, modelos] = await Promise.all([getAreas(), getPosts(), getModelos()]);

  const staticRoutes = [
    '',
    '/sobre',
    '/areas',
    '/tributario',
    '/licitacoes',
    '/licitacoes/mandado-de-seguranca',
    '/blog',
    '/diagnostico',
    '/modelos',
    '/contato',
    '/politica-de-privacidade',
    '/exclusao-de-dados',
    '/aviso-publicidade',
  ].map((path) => ({
    url: `${BASE}${path}`,
    lastModified: ATUALIZADO_EM[path] ?? ATUALIZACAO_PADRAO,
    changeFrequency: 'monthly' as const,
    priority:
      path === ''
        ? 1
        : path === '/tributario' || path.startsWith('/licitacoes')
          ? 0.9
          : 0.7,
  }));

  // /areas/tributario e /areas/licitacoes fazem 301 para as páginas principais.
  const areaRoutes = areas
    .filter((a) => !PAGINA_PRINCIPAL[a.slug])
    .map((a) => ({
      url: `${BASE}/areas/${a.slug}`,
      lastModified: AREAS_ATUALIZADAS_EM,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    }));

  const postRoutes = posts.map((p) => ({
    url: `${BASE}/blog/${p.slug}`,
    lastModified: p.updatedDate ?? p.publishedDate ?? ATUALIZACAO_PADRAO,
    changeFrequency: 'yearly' as const,
    priority: 0.6,
  }));

  const modeloRoutes = modelos.map((m) => ({
    url: `${BASE}/modelos/${m.slug}`,
    lastModified: MODELOS_ATUALIZADOS_EM,
    changeFrequency: 'monthly' as const,
    priority: 0.9,
  }));

  return [...staticRoutes, ...areaRoutes, ...postRoutes, ...modeloRoutes];
}
