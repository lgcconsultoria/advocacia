import { test, expect } from '@playwright/test';

test('nenhuma imagem é servida com mais que o dobro do tamanho exibido', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/', { waitUntil: 'networkidle' });

  const excessivas = await page.evaluate(() =>
    Array.from(document.images)
      .filter((img) => img.naturalWidth > 0)
      .map((img) => ({
        src: img.currentSrc,
        natural: img.naturalWidth,
        exibido: Math.round(img.getBoundingClientRect().width * window.devicePixelRatio),
      }))
      .filter((i) => i.exibido > 0 && i.natural > i.exibido * 2.2)
  );
  expect(excessivas, JSON.stringify(excessivas, null, 2)).toEqual([]);
});

test('toda imagem tem alt e dimensões explícitas', async ({ page }) => {
  await page.goto('/');
  const problemas = await page.evaluate(() =>
    Array.from(document.images)
      .filter((img) => !img.hasAttribute('alt') || !img.width || !img.height)
      .map((img) => img.currentSrc)
  );
  expect(problemas).toEqual([]);
});
