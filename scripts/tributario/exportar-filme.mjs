// Exporta o filme da fatura (components/tributario/fatura-filme.tsx) em MP4, quadro a
// quadro: o filme é função pura do tempo, então cada quadro é exato (sem screencast
// tremido). Usa o Chrome do sistema (puppeteer-core) e o ffmpeg.
//
//   node scripts/tributario/harness.mjs <rascunho> && (cd <rascunho> && npx next dev -p 3123)
//   node scripts/tributario/exportar-filme.mjs [--url http://localhost:3123] [--fps 30] [--so paisagem|retrato]
//
// Saída: public/assets/video/fatura-simples-hibrido.mp4 (1920×1080), o pôster .jpg e
// fatura-simples-hibrido-vertical.mp4 (1080×1920).
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer-core';

const raiz = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const arg = (nome, padrao) => {
  const i = process.argv.indexOf(`--${nome}`);
  return i > 0 ? process.argv[i + 1] : padrao;
};
const URL_BASE = arg('url', 'http://localhost:3123');
const FPS = Number(arg('fps', '30'));
const SO = arg('so', '');
const DURACAO = 44500; // DURACAO_FILME em fatura-filme.tsx
const POSTER_MS = 31500; // capítulo "A conta", com as barras cheias
const CHROME = process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const SAIDA = join(raiz, 'public/assets/video');

const formatos = [
  { nome: 'paisagem', w: 1920, h: 1080, arquivo: 'fatura-simples-hibrido.mp4', poster: 'fatura-simples-hibrido.jpg' },
  { nome: 'retrato', w: 1080, h: 1920, arquivo: 'fatura-simples-hibrido-vertical.mp4' },
].filter((f) => !SO || f.nome === SO);

mkdirSync(SAIDA, { recursive: true });
const navegador = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  args: ['--hide-scrollbars', '--force-color-profile=srgb', '--disable-lcd-text', '--font-render-hinting=none'],
});

try {
  for (const f of formatos) {
    const pagina = await navegador.newPage();
    await pagina.setViewport({ width: f.w, height: f.h, deviceScaleFactor: 1 });
    await pagina.goto(`${URL_BASE}/filme?formato=${f.nome}`, { waitUntil: 'networkidle0', timeout: 120_000 });
    await pagina.waitForFunction('window.__pronto === true && typeof window.__irPara === "function"', { timeout: 60_000 });
    const cdp = await pagina.createCDPSession();
    const quadro = async (ms, qualidade = 94) => {
      await pagina.evaluate((x) => window.__irPara(x), ms);
      const { data } = await cdp.send('Page.captureScreenshot', { format: 'jpeg', quality: qualidade, captureBeyondViewport: false });
      return Buffer.from(data, 'base64');
    };

    if (f.poster) writeFileSync(join(SAIDA, f.poster), await quadro(POSTER_MS, 86));

    const destino = join(SAIDA, f.arquivo);
    const ffmpeg = spawn(
      'ffmpeg',
      ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'mjpeg', '-i', '-',
        '-c:v', 'libx264', '-preset', 'slow', '-crf', '21', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', destino],
      { stdio: ['pipe', 'inherit', 'inherit'] }
    );
    const total = Math.ceil((DURACAO / 1000) * FPS);
    const inicio = Date.now();
    for (let i = 0; i <= total; i++) {
      const buf = await quadro(Math.min(DURACAO, (i * 1000) / FPS));
      if (!ffmpeg.stdin.write(buf)) await once(ffmpeg.stdin, 'drain');
      if (i % (FPS * 5) === 0) process.stdout.write(`${f.nome}: ${i}/${total} quadros (${Math.round((Date.now() - inicio) / 1000)} s)\n`);
    }
    ffmpeg.stdin.end();
    const [codigo] = await once(ffmpeg, 'close');
    if (codigo !== 0) throw new Error(`ffmpeg saiu com ${codigo}`);
    console.log(`ok: ${destino}`);
    await pagina.close();
  }
} finally {
  await navegador.close();
}
