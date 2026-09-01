import { test, expect } from '@playwright/test';

test('o mapa não carrega antes do clique e não causa deslocamento', async ({ page }) => {
  await page.goto('/contato');

  await expect(page.locator('.map-embed iframe')).toHaveCount(0);

  const antes = await page.locator('.map-embed').boundingBox();
  await page.getByRole('button', { name: /ver no mapa/i }).click();
  await expect(page.locator('.map-embed iframe')).toHaveCount(1);
  const depois = await page.locator('.map-embed').boundingBox();

  expect(Math.abs((antes?.height ?? 0) - (depois?.height ?? 0))).toBeLessThan(2);
});

test('sem JavaScript, há um link funcional para o Google Maps', async ({ browser }) => {
  const ctx = await browser.newContext({ javaScriptEnabled: false });
  const page = await ctx.newPage();
  await page.goto('/contato');
  const link = page.locator('.map-embed a[href*="google.com/maps"]');
  await expect(link).toBeVisible();
  await ctx.close();
});
