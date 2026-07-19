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
    await expect(page.getByRole('button', { name: /Apple/i })).toHaveCount(0);
    await expect(
      page.getByRole('link', { name: /sign up|注册/i })
    ).toBeVisible();
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

  test('offers social registration without email registration', async ({
    page,
  }) => {
    await page.goto('/auth/register');
    await expect(page).toHaveURL(/\/auth\/register\/?$/);
    await expect(page.locator('input[name="name"]')).toHaveCount(0);
    await expect(page.locator('input[name="email"]')).toHaveCount(0);
    await expect(
      page.getByRole('button', { name: /sign up with Google|Google 注册/i })
    ).toBeVisible();
    await expect(
      page.getByRole('button', { name: /sign up with GitHub|GitHub 注册/i })
    ).toBeVisible();
    await expect(page.getByRole('button', { name: /Apple/i })).toHaveCount(0);
  });

  test('shows pricing, sign in, and sign up in the public header', async ({
    page,
  }) => {
    await page.goto('/');
    const header = page.locator('[data-analytics-area="header"]');

    await expect(header.getByRole('link', { name: 'Pricing' })).toBeVisible();
    await expect(header.getByRole('link', { name: 'Sign In' })).toBeVisible();
    await expect(header.getByRole('link', { name: 'Sign Up' })).toBeVisible();
  });

  test('shows sign in and sign up inside the mobile menu', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    const header = page.locator('[data-analytics-area="header"]');

    await header.getByRole('button', { name: 'Toggle menu' }).click();
    await expect(header.getByRole('link', { name: 'Pricing' })).toBeVisible();
    await expect(header.getByRole('link', { name: 'Sign In' })).toBeVisible();
    await expect(header.getByRole('link', { name: 'Sign Up' })).toBeVisible();
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
