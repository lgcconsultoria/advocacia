import { test, expect } from '@playwright/test';

test('os links "Ver área" alinham na mesma linha do grid', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto('/areas');

  const tops = await page.locator('a.area-card .card-link').evaluateAll((els) =>
    els.map((el) => Math.round(el.getBoundingClientRect().top))
  );

  // Agrupa por linha do grid: cards da mesma linha têm o mesmo topo de card.
  const cardTops = await page.locator('a.area-card').evaluateAll((els) =>
    els.map((el) => Math.round(el.getBoundingClientRect().top))
  );

  const porLinha = new Map<number, number[]>();
  cardTops.forEach((t, i) => {
    const chave = [...porLinha.keys()].find((k) => Math.abs(k - t) < 8) ?? t;
    porLinha.set(chave, [...(porLinha.get(chave) ?? []), tops[i]]);
  });

  for (const [linha, linksDaLinha] of porLinha) {
    const min = Math.min(...linksDaLinha);
    const max = Math.max(...linksDaLinha);
    expect(max - min, `linha ${linha} desalinhada em ${max - min}px`).toBeLessThanOrEqual(2);
  }
});

test('os ícones de área têm tamanho uniforme', async ({ page }) => {
  await page.goto('/areas');
  const tamanhos = await page.locator('a.area-card .card-icon').evaluateAll((els) =>
    els.map((el) => {
      const r = el.getBoundingClientRect();
      return `${Math.round(r.width)}x${Math.round(r.height)}`;
    })
  );
  expect(new Set(tamanhos).size).toBe(1);
  expect(tamanhos[0]).toBe('48x48');
});
