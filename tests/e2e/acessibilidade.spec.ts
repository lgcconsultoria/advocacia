import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const ROTAS = [
  '/', '/sobre', '/areas', '/areas/mandado-de-seguranca',
  '/blog', '/modelos', '/diagnostico', '/contato',
  '/politica-de-privacidade', '/aviso-publicidade',
];

for (const rota of ROTAS) {
  test(`axe-core sem violação séria ou crítica em ${rota}`, async ({ page }) => {
    await page.goto(rota);
    // Fecha o banner de consentimento para auditar a página, não o overlay.
    const recusar = page.getByRole('button', { name: 'Recusar todos' });
    if (await recusar.isVisible().catch(() => false)) await recusar.click();

    const r = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
      .analyze();

    const graves = r.violations.filter((v) =>
      v.impact === 'serious' || v.impact === 'critical'
    );
    expect(
      graves,
      graves.map((v) => `${v.id}: ${v.nodes.length} nó(s) — ${v.help}`).join('\n')
    ).toEqual([]);
  });
}

test('o site é operável só pelo teclado, da home ao envio do diagnóstico', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: /ir para o conteúdo/i })).toBeFocused();

  // Chega ao CTA principal só com Tab. `.first()` porque o mesmo texto de
  // CTA se repete mais abaixo na home (seção "para quem"); sem isto,
  // `getByRole` resolve para 2 elementos e `.evaluate()` falha em modo
  // estrito — erro que o `.catch` abaixo mascararia como "ainda não
  // encontrado", fazendo o loop esgotar mesmo com o foco correto.
  let achou = false;
  for (let i = 0; i < 40 && !achou; i++) {
    await page.keyboard.press('Tab');
    achou = await page
      .getByRole('link', { name: /solicitar diagnóstico inicial/i })
      .first()
      .evaluate((el) => el === document.activeElement)
      .catch(() => false);
  }
  expect(achou, 'o CTA principal não foi alcançado por teclado').toBe(true);
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/\/diagnostico/);
});

test('o menu mobile fecha com Esc e devolve o foco ao botão', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const botao = page.getByRole('button', { name: /menu de navegação/i });
  await botao.click();
  await expect(botao).toHaveAttribute('aria-expanded', 'true');
  await page.keyboard.press('Escape');
  await expect(botao).toHaveAttribute('aria-expanded', 'false');
  await expect(botao).toBeFocused();
});

test('os avisos da OAB estão em todas as páginas', async ({ page }) => {
  for (const rota of ROTAS) {
    await page.goto(rota);
    await expect(
      page.getByText(/Provimento/i).first(),
      `${rota} sem aviso de publicidade`
    ).toBeVisible();
  }
});
