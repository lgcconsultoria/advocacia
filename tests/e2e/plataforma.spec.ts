import { test, expect } from '@playwright/test';

test('o manifest existe e é válido', async ({ request }) => {
  const res = await request.get('/manifest.webmanifest');
  expect(res.status()).toBe(200);
  const m = await res.json();
  expect(m.name).toContain('Senturião');
  expect(Array.isArray(m.icons)).toBe(true);
  expect(m.icons.some((i: { purpose?: string }) => i.purpose?.includes('maskable'))).toBe(true);
});

test('o feed do blog existe e lista artigos', async ({ request }) => {
  const res = await request.get('/feed.xml');
  expect(res.status()).toBe(200);
  expect(res.headers()['content-type']).toContain('xml');
  const xml = await res.text();
  expect(xml).toContain('<feed');
  expect((xml.match(/<entry>/g) ?? []).length).toBeGreaterThanOrEqual(10);
});

test('a 404 é desenhada e oferece caminhos', async ({ page }) => {
  const res = await page.goto('/rota-que-nao-existe');
  expect(res?.status()).toBe(404);
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await expect(page.getByRole('link', { name: /áreas de atuação/i })).toBeVisible();
});
