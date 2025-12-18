import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test('should display homepage', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByRole('heading', { name: /RASCACIELO DIGITAL/i })).toBeVisible();
    await expect(page.getByText(/SaaS production-ready/i)).toBeVisible();
  });

  test('should navigate to login', async ({ page }) => {
    await page.goto('/');

    await page.getByRole('link', { name: /Iniciar Sesión/i }).click();
    await expect(page).toHaveURL('/login');
  });

  test('should navigate to signup', async ({ page }) => {
    await page.goto('/');

    await page.getByRole('link', { name: /Registrarse/i }).click();
    await expect(page).toHaveURL('/signup');
  });
});
