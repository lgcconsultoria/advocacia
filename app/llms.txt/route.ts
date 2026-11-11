import { textoLlms } from '@/lib/llms';

// Índice para IAs (llmstxt.org), gerado do conteúdo do site a cada build.
export const dynamic = 'force-static';
export const revalidate = 3600;

export async function GET() {
  return new Response(await textoLlms(), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
