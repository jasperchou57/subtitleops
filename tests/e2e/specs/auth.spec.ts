import { expect, test } from '@playwright/test';
import {
  cleanupE2EUsers,
  loginByForm,
  registerE2EUser,
} from '../fixtures/auth';

test.describe('authentication and protected routes', () => {
  test.beforeAll(async ({ request }) => {
    await cleanupE2EUsers(request);
  });

  test.afterAll(async ({ request }) => {
    await cleanupE2EUsers(request);
  });

  test('redirects guests from dashboard to login', async ({ page }) => {
    await page.goto('/dashboard');

    await expect(page).toHaveURL(/\/auth\/login/);
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.getByRole('button', { name: /Google/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /GitHub/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Apple/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /sign up|注册/i })).toHaveCount(
      0
    );
  });

  test('allows a verified user to sign in and view dashboard', async ({
    page,
    request,
  }) => {
    const user = await registerE2EUser(request);

    await loginByForm(page, user);
    await expect(
      page.getByRole('heading', { name: 'SubtitleOps workspace' })
    ).toBeVisible();
  });

  test('keeps login callbacks on SubtitleOps', async ({ page, request }) => {
    const user = await registerE2EUser(request);

    await page.goto(
      '/auth/login?callbackUrl=https%3A%2F%2Fexample.com%2Fphishing'
    );
    await page.waitForLoadState('networkidle');
    await page.locator('input[name="email"]').fill(user.email);
    await page.locator('input[name="password"]').fill(user.password);
    await page.getByRole('button', { name: /^sign in$|^登录$/i }).click();

    await expect(page).toHaveURL(/\/dashboard\/?$/);
    expect(new URL(page.url()).origin).toBe(
      process.env.PLAYWRIGHT_BASE_URL ?? 'http://localhost:3302'
    );
  });

  test('does not expose email registration', async ({ page }) => {
    await page.goto('/auth/register');
    await expect(page).toHaveURL(/\/auth\/login\/?$/);
    await expect(page.locator('input[name="name"]')).toHaveCount(0);
  });

  test('redirects non-admin users away from admin pages', async ({
    page,
    request,
  }) => {
    const user = await registerE2EUser(request);

    await loginByForm(page, user);
    await page.goto('/admin/users');

    await expect(page).toHaveURL(/\/dashboard\/?$/);
  });

  test('allows admin users to view the users dashboard', async ({
    page,
    request,
  }) => {
    const user = await registerE2EUser(request, { role: 'admin' });

    await loginByForm(page, user);
    await page.goto('/admin/users');

    await expect(page).toHaveURL(/\/admin\/users\/?$/);
    await expect(
      page.getByRole('table').getByText(user.email).first()
    ).toBeVisible();
  });
});
