import { defineConfig, devices } from '@playwright/test';

const port = Number(process.env.PORT ?? 3302);
const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? `http://localhost:${port}`;
process.env.PLAYWRIGHT_BASE_URL ??= baseURL;
const paymentProvider = process.env.E2E_PAYMENT_PROVIDER ?? '';
const stripeSecretKey =
  process.env.E2E_STRIPE_SECRET_KEY ?? 'sk_test_subtitleops_e2e';
const stripeWebhookSecret =
  process.env.E2E_STRIPE_WEBHOOK_SECRET ?? 'whsec_subtitleops_e2e';

export default defineConfig({
  testDir: './tests/e2e/specs',
  fullyParallel: false,
  workers: 1,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    baseURL,
    trace: 'on-first-retry',
  },
  webServer: {
    command: [
      'pnpm db:migrate:local',
      [
        'CLOUDFLARE_ENV=e2e',
        `VITE_BASE_URL=${baseURL}`,
        `VITE_PAYMENT_PROVIDER=${paymentProvider}`,
        `STRIPE_SECRET_KEY=${stripeSecretKey}`,
        `STRIPE_WEBHOOK_SECRET=${stripeWebhookSecret}`,
        'VITE_STRIPE_PRICE_PRO_MONTHLY=e2e_pro_monthly',
        'VITE_STRIPE_PRICE_PRO_YEARLY=e2e_pro_yearly',
        'VITE_STRIPE_PRICE_STUDIO_MONTHLY=e2e_studio_monthly',
        'VITE_STRIPE_PRICE_STUDIO_YEARLY=e2e_studio_yearly',
        'BETTER_AUTH_SECRET=subtitleops-e2e-secret-32-characters-minimum',
        `pnpm dev --mode e2e --host 127.0.0.1 --port ${port}`,
      ].join(' '),
    ].join(' && '),
    url: baseURL,
    reuseExistingServer: false,
    timeout: 120_000,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
