import { defineConfig, devices } from '@playwright/test';

// A porta 3000 é frequentemente ocupada por outros serviços na máquina de
// desenvolvimento (ex.: containers Docker de outros projetos). Esta suíte
// usa a porta 3100, exclusiva dela, para ter um alvo determinístico.
export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  // `fullyParallel` sem `workers` deixava o Playwright escolher sozinho
  // (metade das CPUs — 5, numa máquina de 10 núcleos) quantos navegadores
  // martelam o `next start` ao mesmo tempo. O problema: quase toda rota do
  // site é `ƒ` (renderizada por requisição — o CSP com nonce tirou o HTML
  // do estático), então cada navegação é trabalho de CPU do servidor, e
  // `next start` é um processo Node único. Sob 5 workers — e mais ainda sob
  // 10, testado manualmente — as varreduras do axe-core e os testes que
  // navegam 10-14 páginas em sequência (acessibilidade.spec.ts, área.spec.ts)
  // chegavam perto ou estouravam os 30s de timeout padrão do Playwright só
  // de fila no servidor, sem nenhum defeito real por trás. Recuperado com
  // `page.goto` chegando a 8,6s sob carga controlada (vs. ~0,3s sem
  // contenção) — o gargalo é o processo do servidor, não os testes.
  // 3 workers elimina a fila: nos mesmos testes, sob a mesma carga real da
  // máquina de desenvolvimento (múltiplos apps abertos), a navegação de 14
  // páginas caiu de ~19-27s para ~4-5s e a suíte inteira ficou mais RÁPIDA
  // no total (o ganho de menos fila mais que compensa a perda de paralelismo)
  // — 5 execuções consecutivas sem falha, contra falhas recorrentes em 4-10
  // workers. Fixo (não CI-condicional): o gargalo é o servidor único, não a
  // contagem de CPUs do ambiente.
  workers: 3,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:3100',
    trace: 'retain-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
  webServer: {
    command: 'npm run build && npm run start -- --port 3100',
    url: 'http://localhost:3100',
    reuseExistingServer: !process.env.CI,
    timeout: 300_000,
    // Sem estas variáveis, components/analytics.tsx (env-gated) nunca
    // anexa nenhum vendor — nem sob consentimento — e o teste que garante
    // "sem consentimento, nada é solicitado" passaria por vacuidade em
    // qualquer ambiente, CI incluído, onde elas não estão definidas.
    // IDs de teste: nunca batem numa conta real, então nenhuma chamada
    // de rede desses domínios chega a ter efeito — só precisam existir
    // para o gate `if (!gaId) return` liberar o script.
    env: {
      NEXT_PUBLIC_GA_ID: 'G-TEST00000',
      NEXT_PUBLIC_CLARITY_ID: 'testclarity',
      NEXT_PUBLIC_META_PIXEL_ID: '000000000000000',
    },
  },
});
