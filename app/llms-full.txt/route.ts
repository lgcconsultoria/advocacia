import { textoLlmsFull } from '@/lib/llms';

// Conteúdo integral em texto para IAs (llmstxt.org), gerado a cada build.
export const dynamic = 'force-static';
export const revalidate = 3600;

export async function GET() {
  return new Response(await textoLlmsFull(), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
