import { test, expect } from '@playwright/test';

test('as 14 áreas renderizam sem erro mesmo sem os campos novos', async ({ page, request }) => {
  const sitemap = await (await request.get('/sitemap.xml')).text();
  const slugs = [...sitemap.matchAll(/\/areas\/([a-z0-9-]+)</g)].map((m) => m[1]);
  expect(slugs.length).toBe(14);

  for (const slug of slugs) {
    const res = await page.goto(`/areas/${slug}`);
    expect(res?.status(), `/areas/${slug}`).toBe(200);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  }
});

test('a área de referência mostra o bloco de prazo e o que decide o caso', async ({ page }) => {
  await page.goto('/areas/mandado-de-seguranca');
  // Nome exato: a própria página tem outro H2 que também contém "prazo" no
  // CTA final ("O prazo de 120 dias já está correndo?"), conteúdo existente.
  await expect(page.getByRole('heading', { name: 'O prazo', exact: true })).toBeVisible();
  await expect(page.locator('.deadline-item')).not.toHaveCount(0);
  await expect(page.getByRole('heading', { name: /costuma decidir/i })).toBeVisible();
});

test('a área lista artigos relacionados da mesma taxonomia', async ({ page }) => {
  await page.goto('/areas/mandado-de-seguranca');
  const relacionados = page.locator('.related-posts a');
  await expect(relacionados).not.toHaveCount(0);
  const hrefs = await relacionados.evaluateAll((els) =>
    els.map((e) => e.getAttribute('href') ?? '')
  );
  expect(hrefs.every((h) => h.startsWith('/blog/'))).toBe(true);
});

test('o schema FAQPage está presente onde há FAQ', async ({ page }) => {
  await page.goto('/areas/mandado-de-seguranca');
  const tipos = await page.evaluate(() =>
    Array.from(document.querySelectorAll('script[type="application/ld+json"]'))
      .map((s) => JSON.parse(s.textContent ?? '{}')['@type'])
  );
  expect(tipos).toContain('FAQPage');
});
