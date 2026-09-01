import { getPosts, getSettings } from '@/lib/reader';

const BASE = 'https://www.senturiaoadv.com.br';

// XML exige escapar estes cinco caracteres em texto/atributos; um título
// de artigo com "&" (comum em referências a leis, ex.: "Lei X & Y")
// quebraria o parser sem isso.
function escapar(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export async function GET() {
  const [posts, settings] = await Promise.all([getPosts(), getSettings()]);
  const atualizado =
    posts[0]?.publishedDate
      ? new Date(posts[0].publishedDate).toISOString()
      : new Date().toISOString();

  const entries = posts
    .map((p) => {
      const url = `${BASE}/blog/${p.slug}`;
      // publishedDate pode ser nulo em rascunhos — sem esse fallback,
      // `new Date(null)` gera "Invalid Date" e quebra o XML do feed.
      const data = p.publishedDate
        ? new Date(p.publishedDate).toISOString()
        : atualizado;
      return `  <entry>
    <title>${escapar(p.title)}</title>
    <link href="${url}"/>
    <id>${url}</id>
    <updated>${data}</updated>
    <summary>${escapar(p.description ?? '')}</summary>
    <category term="${escapar(p.area ?? '')}"/>
  </entry>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>${escapar(settings.firmName)} — Conteúdo técnico</title>
  <link href="${BASE}/blog"/>
  <link rel="self" href="${BASE}/feed.xml"/>
  <id>${BASE}/</id>
  <updated>${atualizado}</updated>
  <author><name>${escapar(settings.lawyerName)}</name></author>
${entries}
</feed>`;

  // O Cache-Control não é definido aqui de propósito: next.config.ts já
  // aplica 'public, s-maxage=3600, stale-while-revalidate=86400' a
  // /feed.xml via headers() (Tarefa 9). Repeti-lo aqui duplicaria o
  // cabeçalho na resposta (dois valores de Cache-Control), que é
  // tecnicamente inválido em HTTP — ver validação no relatório.
  return new Response(xml, {
    headers: {
      'Content-Type': 'application/atom+xml; charset=utf-8',
    },
  });
}
