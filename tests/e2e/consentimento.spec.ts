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

// Teste-espelho do anterior: sem ele, o teste acima poderia estar passando
// por vacuidade — por exemplo se as variáveis NEXT_PUBLIC_GA_ID/CLARITY_ID/
// META_PIXEL_ID que env-gateiam components/analytics.tsx não estivessem
// definidas no ambiente (é o caso do CI antes desta correção: nada as
// exportava, então nenhum vendor carregaria nem SOB consentimento — e
// "nenhum script solicitado" seria verdade por um motivo errado). Este
// teste falha se o gate de consentimento quebrar, se as variáveis de
// ambiente sumirem, ou se anexar() parar de disparar o script do vendor.
test('com consentimento de análise, o vendor de analytics É solicitado', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Aceitar todos' }).click();
  const requisicao = await page.waitForRequest(
    (r) => /googletagmanager|clarity\.ms/.test(r.url()),
    { timeout: 10_000 },
  );
  expect(requisicao.url()).toMatch(/googletagmanager|clarity\.ms/);
});
