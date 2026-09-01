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
  },
});
