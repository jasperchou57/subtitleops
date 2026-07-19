import { expect, test } from '@playwright/test';
import {
  cleanupE2EUsers,
  loginByForm,
  registerE2EUser,
  updateE2EUser,
} from '../fixtures/auth';

test.describe('billing lifecycle', () => {
  test.skip(
    process.env.E2E_PAYMENT_PROVIDER !== 'stripe',
    'Run with E2E_PAYMENT_PROVIDER=stripe'
  );

  test.beforeEach(async ({ request }) => cleanupE2EUsers(request));
  test.afterEach(async ({ request }) => cleanupE2EUsers(request));

  test('keeps access through scheduled cancellation, then downgrades', async ({
    page,
    request,
  }) => {
    const user = await registerE2EUser(request);
    await updateE2EUser(request, {
      email: user.email,
      planId: 'studio',
      cancelAtPeriodEnd: true,
    });
    await loginByForm(page, user);
    await page.goto('/settings/billing');

    await expect(page.getByText('Studio', { exact: true })).toBeVisible();
    await expect(page.getByText(/cancels at period end/i)).toBeVisible();

    await updateE2EUser(request, {
      email: user.email,
      planId: 'studio',
      subscriptionStatus: 'canceled',
    });
    await page.reload();
    await expect(page.getByText('Free', { exact: true })).toBeVisible();
  });

  test('sends paid users to billing instead of creating another subscription', async ({
    page,
    request,
  }) => {
    const user = await registerE2EUser(request);
    await updateE2EUser(request, {
      email: user.email,
      planId: 'pro',
    });
    await loginByForm(page, user);
    await page.goto('/pricing');

    await expect(
      page.getByRole('button', { name: /your current plan/i })
    ).toBeDisabled();
    await expect(
      page.getByRole('link', { name: /manage subscription/i })
    ).toHaveAttribute('href', '/settings/billing');
    await expect(
      page.getByRole('button', { name: /upgrade to studio/i })
    ).toHaveCount(0);
  });
});
