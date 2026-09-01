import { test, expect } from '@playwright/test';

test('a home cabe em 900 KB e nenhum asset passa de 600 KB', async ({ page }) => {
  const porUrl = new Map<string, number>();

  page.on('response', async (res) => {
    const url = res.url();
    // Não fixar a porta: o filtro precisa acompanhar o baseURL da config.
    // Um número de porta desatualizado aqui faria o teste passar por acidente,
    // porque `porUrl` ficaria vazio e o total daria zero.
    if (!url.startsWith('http://localhost:')) return;
    try {
      const s = await res.request().sizes();
      // Bytes que realmente trafegaram. `res.body()` devolveria o corpo
      // DESCOMPRIMIDO e superestimaria texto comprimido (JS/CSS/HTML) em ~3x.
      porUrl.set(url, s.responseBodySize + s.responseHeadersSize);
    } catch {
      /* respostas sem corpo (redirects, 304) */
    }
  });

  await page.goto('/', { waitUntil: 'networkidle' });

  const total = [...porUrl.values()].reduce((a, b) => a + b, 0);
  const [maiorUrl, maiorBytes] = [...porUrl.entries()].sort((a, b) => b[1] - a[1])[0] ?? ['nenhum', 0];

  expect(
    total,
    `total ${(total / 1024).toFixed(0)} KB; maior: ${maiorUrl} (${(maiorBytes / 1024).toFixed(0)} KB)`
  ).toBeLessThanOrEqual(900 * 1024);

  for (const [url, bytes] of porUrl) {
    expect(bytes, `${url} tem ${(bytes / 1024).toFixed(0)} KB`).toBeLessThanOrEqual(600 * 1024);
  }
});

test('o vídeo do hero cabe em 600 KB', async ({ request }) => {
  // Aqui `body()` já é o peso real de rede — não é a mesma armadilha do
  // teste acima. `sizes()` só existe em `Request` de página (via `page`, não
  // via `request`/APIRequestContext), e as duas alternativas com `page`
  // testadas se mostraram frágeis: `page.goto()` direto no arquivo abre o
  // player nativo do Chromium, que faz *range requests* de streaming cujo
  // `Request` nunca "termina" da forma que `sizes()` espera (trava até o
  // timeout); e disparar `fetch()` de dentro da própria home colide com o
  // <video> do hero, que já está baixando o mesmo arquivo por range request
  // — sob paralelismo (`npm run e2e` roda os testes deste arquivo lado a
  // lado com os outros specs), isso produzia 206 (Partial Content) de forma
  // intermitente. `hero.webm`/`hero.mp4` não têm `Content-Encoding` (video/
  // webm e video/mp4 já são binários comprimidos — confirmado com
  // `curl -H "Accept-Encoding: gzip, br"`, sem cabeçalho de compressão em
  // nenhum dos dois, `Content-Length` batendo com o tamanho em disco), então
  // `body().length` já é exatamente o número de bytes que trafegam — ao
  // contrário de JS/CSS/HTML, que o servidor comprime.
  for (const arquivo of ['/assets/video/hero.webm', '/assets/video/hero.mp4']) {
    const res = await request.get(arquivo);
    expect(res.status()).toBe(200);
    const bytes = (await res.body()).length;
    expect(bytes, `${arquivo} tem ${(bytes / 1024).toFixed(0)} KB`).toBeLessThanOrEqual(600 * 1024);
  }
});
