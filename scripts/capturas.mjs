// Capturas de tela do site para conferência visual (QA local; não roda no deploy).
// Uso: node scripts/capturas.mjs <base> <pasta-de-saida> [rota1 rota2 ...]
import puppeteer from 'puppeteer-core';
import { mkdirSync } from 'node:fs';

const [base = 'http://localhost:3000', saida = './capturas', ...rotas] = process.argv.slice(2);
const ROTAS = rotas.length ? rotas : ['/'];
const LARGURAS = [
  ['desk', 1440, 900],
  ['cel', 400, 860],
];
mkdirSync(saida, { recursive: true });

const browser = await puppeteer.launch({
  executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  headless: true,
  args: ['--hide-scrollbars', '--autoplay-policy=no-user-gesture-required'],
});
const problemas = [];
for (const rota of ROTAS) {
  for (const [nome, w, h] of LARGURAS) {
    const page = await browser.newPage();
    page.on('pageerror', (e) => problemas.push(`${rota} ${nome} pageerror: ${e.message}`));
    page.on('console', (m) => m.type() === 'error' && problemas.push(`${rota} ${nome} console: ${m.text()}`));
    await page.setViewport({ width: w, height: h, deviceScaleFactor: 1 });
    const r = await page.goto(base + rota, { waitUntil: 'networkidle2', timeout: 60000 });
    // rola até o fim para disparar as revelações e voltar ao topo
    await page.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 500) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 120));
      }
      window.scrollTo(0, 0);
      await new Promise((r) => setTimeout(r, 800));
    });
    const sw = await page.evaluate(() => document.documentElement.scrollWidth);
    if (sw > w) problemas.push(`${rota} ${nome}: rolagem horizontal (${sw}px > ${w}px)`);
    const arq = `${saida}/${nome}-${rota === '/' ? 'home' : rota.replace(/^\//, '').replace(/\//g, '_')}.png`;
    await page.screenshot({ path: arq, fullPage: true });
    if (process.env.PARTES) {
      // fatias da página inteira, para ler os detalhes sem reduzir a imagem
      const alt = await page.evaluate(() => document.documentElement.scrollHeight);
      const passo = w > 600 ? 1100 : 1400;
      for (let y = 0, k = 0; y < alt; y += passo, k++) {
        await page.screenshot({
          path: arq.replace(/\.png$/, `-p${String(k).padStart(2, '0')}.png`),
          clip: { x: 0, y, width: w, height: Math.min(passo, alt - y) },
          captureBeyondViewport: true,
        });
      }
    }
    console.log(r?.status(), arq);
    await page.close();
  }
}
await browser.close();
console.log(problemas.length ? problemas.join('\n') : 'sem problemas');
