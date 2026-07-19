import { expect, test } from '@playwright/test';

test('pricing captures a Pro beta request without payment details', async ({
  page,
}) => {
  test.skip(
    Boolean(process.env.E2E_PAYMENT_PROVIDER),
    'Beta signup is only shown while checkout is disabled'
  );

  await page.goto('/pricing');
  await page.waitForLoadState('networkidle');
  await page.getByRole('button', { name: /Join Pro beta/i }).click();
  await page.getByLabel('Work email').fill('beta@example.test');
  await page
    .getByLabel('What subtitle work do you repeat?')
    .fill('Weekly client subtitle batches');
  await page.getByRole('button', { name: 'Request beta access' }).click();

  await expect(page.getByText(/on the Pro beta list/i)).toBeVisible();
  await expect(page.getByText(/No card required/i)).not.toBeVisible();
});
