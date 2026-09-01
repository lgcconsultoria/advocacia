import { test, expect } from '@playwright/test';

const EXIGIDOS = [
  'content-security-policy',
  'strict-transport-security',
  'x-content-type-options',
  'x-frame-options',
  'referrer-policy',
  'permissions-policy',
  'cross-origin-opener-policy',
];

test('as páginas do site trazem os sete headers', async ({ request }) => {
  for (const rota of ['/', '/areas', '/blog', '/contato', '/diagnostico']) {
    const res = await request.get(rota);
    const h = res.headers();
    for (const nome of EXIGIDOS) {
      expect(h[nome], `${rota} não tem ${nome}`).toBeTruthy();
    }
  }
});

test('o CSP tem nonce e não tem unsafe-inline em script-src', async ({ request }) => {
  const res = await request.get('/');
  const csp = res.headers()['content-security-policy'] ?? '';
  const scriptSrc = csp
    .split(';')
    .map((p) => p.trim())
    .find((p) => p.startsWith('script-src ')) ?? '';

  expect(scriptSrc).toMatch(/'nonce-[A-Za-z0-9+/=_-]+'/);
  expect(scriptSrc).not.toContain("'unsafe-inline'");
  expect(scriptSrc).not.toContain("'unsafe-eval'");
});

test('o nonce muda a cada requisição', async ({ request }) => {
  const pega = async () => {
    const csp = (await request.get('/')).headers()['content-security-policy'] ?? '';
    return csp.match(/'nonce-([A-Za-z0-9+/=_-]+)'/)?.[1] ?? '';
  };
  const [a, b] = [await pega(), await pega()];
  expect(a).not.toBe('');
  expect(a).not.toBe(b);
});

test('todo script inline do HTML carrega o nonce da resposta', async ({ page }) => {
  const resposta = await page.goto('/');
  const csp = resposta?.headers()['content-security-policy'] ?? '';
  const nonce = csp.match(/'nonce-([A-Za-z0-9+/=_-]+)'/)?.[1] ?? '';
  expect(nonce).not.toBe('');

  // JSON-LD não é executável e não precisa de nonce. Qualquer outro
  // script inline sem o nonce seria bloqueado pelo navegador.
  const semNonce = await page.evaluate((n) =>
    Array.from(document.querySelectorAll('script'))
      .filter((s) => !s.src)
      .filter((s) => (s.getAttribute('type') || '').toLowerCase() !== 'application/ld+json')
      .filter((s) => s.nonce !== n && s.getAttribute('nonce') !== n)
      .map((s) => (s.textContent ?? '').slice(0, 80)),
  nonce);

  expect(semNonce).toEqual([]);
});

test('nenhuma violação de CSP é registrada na navegação principal', async ({ page }) => {
  const violacoes: string[] = [];
  page.on('console', (msg) => {
    if (/Content Security Policy/i.test(msg.text())) violacoes.push(msg.text());
  });
  page.on('pageerror', (err) => violacoes.push(String(err)));

  for (const rota of ['/', '/areas', '/sobre', '/blog', '/contato']) {
    await page.goto(rota, { waitUntil: 'networkidle' });
  }
  expect(violacoes).toEqual([]);
});

test('a página hidrata sob o CSP — o alternador de tema responde', async ({ page }) => {
  // Prova funcional de que os scripts do Next não foram bloqueados:
  // se a hidratação falhasse, o clique não faria efeito.
  await page.goto('/');
  await page.getByRole('button', { name: /tema/i }).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', /light|dark/);
});
