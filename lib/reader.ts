import { createReader } from '@keystatic/core/reader';
import keystaticConfig from '@/keystatic.config';

export const reader = createReader(process.cwd(), keystaticConfig);

export type AreaEntry = Awaited<
  ReturnType<typeof reader.collections.areas.read>
> & { slug: string };

export type PostEntry = Awaited<
  ReturnType<typeof reader.collections.posts.read>
> & { slug: string };

export async function getSettings() {
  const settings = await reader.singletons.settings.read();
  return (
    settings ?? {
      firmName: 'Douglas Senturião Advocacia',
      lawyerName: 'Douglas Senturião',
      oab: 'OAB/SC nº 73.764',
      phone: '(67) 99167-5629',
      whatsapp: '5567991675629',
      email: 'douglas@senturiaoadv.com.br',
      instagram: 'douglassadvogado',
      address: 'Av. Brigadeiro Faria Lima, 1768 — São Paulo/SP — CEP 01451-001',
    }
  );
}

export async function getAreas() {
  const slugs = await reader.collections.areas.list();
  const entries = await Promise.all(
    slugs.map(async (slug) => {
      const data = await reader.collections.areas.read(slug);
      return data ? { ...data, slug } : null;
    })
  );
  return entries
    .filter((e): e is NonNullable<typeof e> => e !== null)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}

export async function getArea(slug: string) {
  const data = await reader.collections.areas.read(slug);
  return data ? { ...data, slug } : null;
}

export async function getPosts() {
  const slugs = await reader.collections.posts.list();
  const entries = await Promise.all(
    slugs.map(async (slug) => {
      const data = await reader.collections.posts.read(slug);
      return data ? { ...data, slug } : null;
    })
  );
  return entries
    .filter((e): e is NonNullable<typeof e> => e !== null)
    .sort((a, b) =>
      (b.publishedDate ?? '').localeCompare(a.publishedDate ?? '')
    );
}

export async function getPost(slug: string) {
  const data = await reader.collections.posts.read(slug);
  return data ? { ...data, slug } : null;
}
