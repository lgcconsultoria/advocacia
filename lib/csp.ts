/**
 * CSP com nonce por requisição, sem `unsafe-inline` em script-src.
 *
 * Por que nonce e não `script-src 'self'`: o runtime do App Router emite
 * scripts inline `self.__next_f.push(...)` para transmitir o payload RSC.
 * Eles não são removíveis sem desligar o streaming, e sob uma política sem
 * nonce seriam bloqueados — a hidratação quebraria. Quando o middleware põe
 * `'nonce-<valor>'` no header, o Next propaga esse nonce para os próprios
 * scripts inline dele.
 *
 * `'strict-dynamic'` faz os navegadores modernos confiarem no que um script
 * já confiável carregar em cadeia; os hosts explícitos continuam na lista
 * como degradação para navegadores que não implementam strict-dynamic.
 *
 * Custo assumido: a página passa a ser renderizada por requisição e o HTML
 * deixa de ser cacheável publicamente — um nonce em página cacheada é um
 * nonce público. Ver spec §5.1 e §5.4.
 *
 * JSON-LD permanece inline: `type="application/ld+json"` não é executável
 * e não é governado por script-src.
 */
function directives(nonce: string): Record<string, string[]> {
  return {
    'default-src': ["'self'"],
    'script-src': [
      "'self'",
      `'nonce-${nonce}'`,
      "'strict-dynamic'",
      'https://www.googletagmanager.com',
      'https://connect.facebook.net',
      'https://www.clarity.ms',
      'https://va.vercel-scripts.com',
    ],
    // Decisão registrada no spec §5.2: o Next injeta estilos inline para
    // next/font e para o CSS crítico do App Router. Risco muito menor que
    // o equivalente em script-src, e documentado como escolha.
    'style-src': ["'self'", "'unsafe-inline'"],
    'img-src': [
      "'self'",
      'data:',
      'blob:',
      'https://www.google-analytics.com',
      'https://www.facebook.com',
      'https://*.clarity.ms',
      'https://maps.gstatic.com',
      'https://*.googleapis.com',
    ],
    'font-src': ["'self'", 'data:'],
    'media-src': ["'self'"],
    'connect-src': [
      "'self'",
      'https://*.google-analytics.com',
      'https://*.analytics.google.com',
      'https://*.googletagmanager.com',
      'https://*.clarity.ms',
      // Endpoint atual do formulário de diagnóstico. Sai quando o Sprint 2
      // mover o envio para uma Server Action.
      'https://webhook.licitacaogc.com.br',
      'https://va.vercel-scripts.com',
    ],
    'frame-src': ['https://www.google.com', 'https://maps.google.com'],
    'object-src': ["'none'"],
    'base-uri': ["'self'"],
    'form-action': ["'self'"],
    'frame-ancestors': ["'none'"],
  };
}

export function buildCsp(nonce: string): string {
  const partes = Object.entries(directives(nonce)).map(
    ([nome, valores]) => `${nome} ${valores.join(' ')}`
  );
  partes.push('upgrade-insecure-requests');
  return partes.join('; ');
}

/** Extrai os valores de uma diretiva. Usado nos testes. */
export function getDirective(policy: string, name: string): string[] {
  const parte = policy
    .split(';')
    .map((p) => p.trim())
    .find((p) => p === name || p.startsWith(name + ' '));
  if (!parte) return [];
  return parte.split(/\s+/).slice(1);
}

/** Headers que não variam por requisição. O CSP não está aqui — vem do middleware. */
export const SECURITY_HEADERS: { key: string; value: string }[] = [
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=()',
  },
  { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
];
