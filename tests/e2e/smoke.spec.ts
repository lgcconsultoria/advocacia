import { test, expect } from '@playwright/test';

test('a home responde e tem o H1 de posicionamento', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('h1')).toContainText('conflito e um prazo');
});
