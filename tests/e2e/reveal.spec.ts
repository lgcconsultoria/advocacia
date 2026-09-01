import { test, expect } from '@playwright/test';

test('sem JavaScript, /areas mostra os 14 cards', async ({ browser }) => {
  const ctx = await browser.newContext({ javaScriptEnabled: false });
  const page = await ctx.newPage();
  await page.goto('/areas');

  const cards = page.locator('a.area-card');
  await expect(cards).toHaveCount(14);

  // Não basta existir no DOM: precisa estar visível e opaco.
  const opacities = await cards.evaluateAll((els) =>
    els.map((el) => getComputedStyle(el).opacity)
  );
  expect(opacities.every((o) => Number(o) === 1)).toBe(true);
  await ctx.close();
});

test('sem JavaScript, a home mostra o corpo das seções', async ({ browser }) => {
  const ctx = await browser.newContext({ javaScriptEnabled: false });
  const page = await ctx.newPage();
  await page.goto('/');
  await expect(
    page.getByRole('heading', { name: /escritório-boutique com raiz/i })
  ).toBeVisible();
  await ctx.close();
});

test('com JavaScript, nada fica invisível depois de entrar no viewport', async ({ page }) => {
  await page.goto('/areas');
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(400);

  const hidden = await page.evaluate(() =>
    Array.from(document.querySelectorAll('.reveal')).filter((el) => {
      const r = el.getBoundingClientRect();
      const dentro = r.top < window.innerHeight && r.bottom > 0;
      return dentro && Number(getComputedStyle(el).opacity) < 1;
    }).length
  );
  expect(hidden).toBe(0);
});

test('o CSS órfão que apagava elementos não existe mais', async ({ page }) => {
  await page.goto('/');
  const marcado = await page.evaluate(() => {
    const el = document.createElement('div');
    el.setAttribute('data-reveal', '');
    el.textContent = 'teste';
    document.body.appendChild(el);
    const o = getComputedStyle(el).opacity;
    el.remove();
    return o;
  });
  expect(Number(marcado)).toBe(1);
});
