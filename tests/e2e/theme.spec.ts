import { test, expect } from '@playwright/test';

test('respeita o tema escuro do sistema sem escolha explícita', async ({ browser }) => {
  const ctx = await browser.newContext({ colorScheme: 'dark' });
  const page = await ctx.newPage();
  await page.goto('/');
  const bg = await page.evaluate(() =>
    getComputedStyle(document.body).backgroundColor
  );
  // #101016
  expect(bg).toBe('rgb(16, 16, 22)');
  await ctx.close();
});

test('o toggle sobrepõe o sistema e persiste entre navegações', async ({ browser }) => {
  const ctx = await browser.newContext({ colorScheme: 'dark' });
  const page = await ctx.newPage();
  await page.goto('/');
  await page.getByRole('button', { name: /tema/i }).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');

  await page.goto('/areas');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
});

test('aplica o tema antes do primeiro paint (sem FOUC)', async ({ browser }) => {
  const ctx = await browser.newContext({ colorScheme: 'light' });
  const page = await ctx.newPage();
  await page.addInitScript(() => {
    try { localStorage.setItem('dsa-theme', 'dark'); } catch {}
  });
  await page.goto('/', { waitUntil: 'commit' });
  // Já no primeiro documento, antes de qualquer hidratação.
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await ctx.close();
});
