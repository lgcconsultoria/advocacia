import { NextResponse, type NextRequest } from 'next/server';
import { buildCsp } from '@/lib/csp';

export function middleware(request: NextRequest) {
  const nonce = crypto.randomUUID().replace(/-/g, '');
  const csp = buildCsp(nonce);

  // O Next lê o nonce do CSP da REQUISIÇÃO para aplicá-lo aos scripts
  // inline que ele mesmo emite (o payload RSC). Sem isto, a política
  // sai correta mas o Next não sabe que nonce usar.
  const headers = new Headers(request.headers);
  headers.set('x-nonce', nonce);
  headers.set('Content-Security-Policy', csp);

  const response = NextResponse.next({ request: { headers } });
  response.headers.set('Content-Security-Policy', csp);
  return response;
}

export const config = {
  matcher: [
    /*
     * Tudo, exceto:
     * - o CMS Keystatic e a API dele, que usam recursos que a política
     *   estrita do site público quebraria
     * - assets de build, que não executam script
     */
    {
      source:
        '/((?!keystatic|api/keystatic|_next/static|_next/image|favicon.ico).*)',
      missing: [
        { type: 'header', key: 'next-router-prefetch' },
        { type: 'header', key: 'purpose', value: 'prefetch' },
      ],
    },
  ],
};
