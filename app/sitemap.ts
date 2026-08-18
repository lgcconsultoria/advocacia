import type { MetadataRoute } from 'next';
import { getAreas, getPosts } from '@/lib/reader';
import { getModelos } from '@/lib/modelos';

const BASE = 'https://www.senturiaoadv.com.br';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [areas, posts, modelos] = await Promise.all([getAreas(), getPosts(), getModelos()]);

  const staticRoutes = [
    '',
    '/sobre',
    '/areas',
    '/blog',
    '/diagnostico',
    '/modelos',
    '/contato',
    '/politica-de-privacidade',
    '/aviso-publicidade',
  ].map((path) => ({
    url: `${BASE}${path}`,
    changeFrequency: 'monthly' as const,
    priority: path === '' ? 1 : 0.7,
  }));

  const areaRoutes = areas.map((a) => ({
    url: `${BASE}/areas/${a.slug}`,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  const postRoutes = posts.map((p) => ({
    url: `${BASE}/blog/${p.slug}`,
    lastModified: p.publishedDate ?? undefined,
    changeFrequency: 'yearly' as const,
    priority: 0.6,
  }));

  const modeloRoutes = modelos.map((m) => ({
    url: `${BASE}/modelos/${m.slug}`,
    changeFrequency: 'monthly' as const,
    priority: 0.9,
  }));

  return [...staticRoutes, ...areaRoutes, ...postRoutes, ...modeloRoutes];
}
