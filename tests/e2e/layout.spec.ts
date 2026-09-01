import { test, expect } from '@playwright/test';

const ROTAS = ['/areas', '/diagnostico', '/contato', '/modelos'];

test('nenhum hero interno deixa metade da largura vazia em desktop', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  for (const rota of ROTAS) {
    await page.goto(rota);
    const hero = page.locator('.page-hero .container').first();
    const caixa = await hero.boundingBox();
    const conteudo = await hero.evaluate((el) => {
      let direita = 0;
      for (const filho of el.querySelectorAll('h1, p, nav, .hero-aside')) {
        const r = filho.getBoundingClientRect();
        direita = Math.max(direita, r.right);
      }
      return direita;
    });
    const usado = (conteudo - (caixa?.x ?? 0)) / (caixa?.width ?? 1);
    expect(usado, `${rota} usa só ${(usado * 100).toFixed(0)}% da largura`).toBeGreaterThan(0.6);
  }
});

test('o WhatsApp do cartão de contexto leva mensagem da página', async ({ page }) => {
  await page.goto('/areas');
  const href = await page.locator('.hero-aside a[href*="wa.me"]').getAttribute('href');
  expect(href).toContain('text=');
  expect(decodeURIComponent(href ?? '')).toMatch(/áreas de atuação/i);
});
