import { defineConfig, devices } from '@playwright/test';

// A porta 3000 é frequentemente ocupada por outros serviços na máquina de
// desenvolvimento (ex.: containers Docker de outros projetos). Esta suíte
// usa a porta 3100, exclusiva dela, para ter um alvo determinístico.
export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
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
