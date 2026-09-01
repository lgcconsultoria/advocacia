import { test, expect } from '@playwright/test';

test('a home cabe em 900 KB e nenhum asset passa de 600 KB', async ({ page }) => {
  const porUrl = new Map<string, number>();

  page.on('response', async (res) => {
    const url = res.url();
    // Não fixar a porta: o filtro precisa acompanhar o baseURL da config.
    // Um número de porta desatualizado aqui faria o teste passar por acidente,
    // porque `porUrl` ficaria vazio e o total daria zero.
    if (!url.startsWith('http://localhost:')) return;
    try {
      const buf = await res.body();
      porUrl.set(url, buf.length);
    } catch {
      /* respostas sem corpo (redirects, 304) */
    }
  });

  await page.goto('/', { waitUntil: 'networkidle' });

  const total = [...porUrl.values()].reduce((a, b) => a + b, 0);
  const [maiorUrl, maiorBytes] = [...porUrl.entries()].sort((a, b) => b[1] - a[1])[0] ?? ['nenhum', 0];

  expect(
    total,
    `total ${(total / 1024).toFixed(0)} KB; maior: ${maiorUrl} (${(maiorBytes / 1024).toFixed(0)} KB)`
  ).toBeLessThanOrEqual(900 * 1024);

  for (const [url, bytes] of porUrl) {
    expect(bytes, `${url} tem ${(bytes / 1024).toFixed(0)} KB`).toBeLessThanOrEqual(600 * 1024);
  }
});

test('o vídeo do hero cabe em 600 KB', async ({ request }) => {
  for (const arquivo of ['/assets/video/hero.webm', '/assets/video/hero.mp4']) {
    const res = await request.get(arquivo);
    expect(res.status()).toBe(200);
    const bytes = (await res.body()).length;
    expect(bytes, `${arquivo} tem ${(bytes / 1024).toFixed(0)} KB`).toBeLessThanOrEqual(600 * 1024);
  }
});
