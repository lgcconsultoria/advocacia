import { test, expect } from '@playwright/test';

test('o banner aparece na primeira visita', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('dialog', { name: /privacidade/i })).toBeVisible();
});

test('"Recusar" e "Aceitar" têm o mesmo peso visual', async ({ page }) => {
  await page.goto('/');
  const aceitar = page.getByRole('button', { name: 'Aceitar todos' });
  const recusar = page.getByRole('button', { name: 'Recusar todos' });

  const [ca, cr] = await Promise.all([
    aceitar.evaluate((el) => {
      const s = getComputedStyle(el);
      return { fs: s.fontSize, fw: s.fontWeight, p: s.padding };
    }),
    recusar.evaluate((el) => {
      const s = getComputedStyle(el);
      return { fs: s.fontSize, fw: s.fontWeight, p: s.padding };
    }),
  ]);
  expect(ca).toEqual(cr);

  const [ba, br] = await Promise.all([
    aceitar.boundingBox(),
    recusar.boundingBox(),
  ]);
  expect(Math.abs((ba?.height ?? 0) - (br?.height ?? 0))).toBeLessThan(2);
});

test('a escolha persiste e o banner não volta', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Recusar todos' }).click();
  await expect(page.getByRole('dialog', { name: /privacidade/i })).toBeHidden();

  await page.goto('/areas');
  await expect(page.getByRole('dialog', { name: /privacidade/i })).toBeHidden();
});

test('sem consentimento, nenhum script de terceiro é solicitado', async ({ page }) => {
  const terceiros: string[] = [];
  page.on('request', (r) => {
    const u = r.url();
    if (/googletagmanager|google-analytics|clarity\.ms|facebook\.(net|com)/.test(u)) {
      terceiros.push(u);
    }
  });
  await page.goto('/', { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: 'Recusar todos' }).click();
  await page.waitForTimeout(500);
  expect(terceiros).toEqual([]);
});
