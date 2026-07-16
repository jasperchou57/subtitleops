import { expect, test } from '@playwright/test';
import {
  cleanupE2EUsers,
  loginByForm,
  registerE2EUser,
  updateE2EUser,
} from '../fixtures/auth';

const firstSubtitle = `1
00:00:01,000 --> 00:00:03,000
Hello from SubtitleOps.
`;

const secondSubtitle = `WEBVTT

00:00:02.000 --> 00:00:04.000
Second file
`;

test.describe('paid subtitle workflows', () => {
  test.beforeEach(async ({ request }) => {
    await cleanupE2EUsers(request);
  });

  test.afterEach(async ({ request }) => {
    await cleanupE2EUsers(request);
  });

  test('Free users are directed to single-file tools instead of paid workflows', async ({
    page,
    request,
  }) => {
    const user = await registerE2EUser(request);
    await loginByForm(page, user);
    await page.goto('/dashboard/workflows');

    await expect(page.getByTestId('workflow-studio')).toContainText(/free/i);
    await expect(page.getByTestId('batch-upgrade-required')).toBeVisible();
    await expect(page.getByTestId('process-batch')).toHaveCount(0);
    await expect(page.getByLabel('Subtitle files')).toHaveCount(0);
  });

  test('Pro processes a batch, checks quality, and saves history', async ({
    page,
    request,
  }) => {
    const user = await registerE2EUser(request);
    await updateE2EUser(request, { email: user.email, planId: 'pro' });
    await loginByForm(page, user);
    await page.goto('/dashboard/workflows');

    await expect(page.getByTestId('workflow-studio')).toContainText(/pro/i);
    await page.getByLabel('Subtitle files').setInputFiles([
      {
        name: 'first.srt',
        mimeType: 'text/plain',
        buffer: Buffer.from(firstSubtitle),
      },
      {
        name: 'second.vtt',
        mimeType: 'text/vtt',
        buffer: Buffer.from(secondSubtitle),
      },
    ]);
    await page.getByLabel('Output format').selectOption('vtt');
    await page.getByTestId('process-batch').click();

    await expect(page.getByTestId('batch-results')).toContainText('first.vtt');
    await expect(page.getByTestId('batch-results')).toContainText('second.vtt');
    await expect(page.getByText(/2 files · 0 issues/)).toBeVisible();
    await expect(
      page.getByRole('link', { name: 'Download archive' })
    ).toHaveAttribute('href', /\/api\/storage\/file\?key=/);
  });

  test('Studio invites a member and enforces the three-seat workspace', async ({
    browser,
    page,
    request,
  }) => {
    const user = await registerE2EUser(request);
    const invitedUser = await registerE2EUser(request);
    await updateE2EUser(request, { email: user.email, planId: 'studio' });
    await loginByForm(page, user);
    await page.goto('/dashboard/workflows');

    await expect(page.getByTestId('workflow-studio')).toContainText(/studio/i);
    await page.getByLabel('Subtitle files').setInputFiles({
      name: 'shared.srt',
      mimeType: 'text/plain',
      buffer: Buffer.from(firstSubtitle),
    });
    await page.getByTestId('process-batch').click();
    await expect(
      page.getByRole('link', { name: 'Download archive' })
    ).toBeVisible();

    await page.getByLabel('Team member email').fill(invitedUser.email);
    await page.getByLabel('Team member role').selectOption('editor');
    await page.getByRole('button', { name: 'Invite' }).click();
    await expect(page.getByText(invitedUser.email)).toBeVisible();
    const inviteLink = await page.getByLabel('Invitation link').inputValue();

    const inviteeContext = await browser.newContext({
      baseURL: process.env.PLAYWRIGHT_BASE_URL,
    });
    const inviteePage = await inviteeContext.newPage();
    await loginByForm(inviteePage, invitedUser);
    await inviteePage.goto(inviteLink);
    await inviteePage
      .getByRole('button', { name: 'Accept invitation' })
      .click();
    await expect(inviteePage.getByText('Invitation accepted')).toBeVisible();
    await inviteePage
      .getByRole('link', { name: 'Open shared workflows' })
      .click();
    const sharedArchive = inviteePage.getByRole('link', {
      name: 'Download archive',
    });
    await expect(sharedArchive).toBeVisible();
    const archiveResponse = await inviteePage.request.get(
      (await sharedArchive.getAttribute('href')) ?? ''
    );
    expect(archiveResponse.status()).toBe(200);
    await inviteeContext.close();

    await page.getByLabel('Team member email').fill('reviewer@example.test');
    await page.getByLabel('Team member role').selectOption('reviewer');
    await page.getByRole('button', { name: 'Invite' }).click();
    await expect(page.getByText('3 of 3 seats used')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Invite' })).toBeDisabled();
  });

  test('an invitation cannot be accepted after the owner loses Studio', async ({
    browser,
    page,
    request,
  }) => {
    const owner = await registerE2EUser(request);
    const invitedUser = await registerE2EUser(request);
    await updateE2EUser(request, { email: owner.email, planId: 'studio' });
    await loginByForm(page, owner);
    await page.goto('/dashboard/workflows');

    await page.getByLabel('Team member email').fill(invitedUser.email);
    await page.getByRole('button', { name: 'Invite' }).click();
    const inviteLink = await page.getByLabel('Invitation link').inputValue();
    await updateE2EUser(request, { email: owner.email, planId: 'free' });

    const inviteeContext = await browser.newContext({
      baseURL: process.env.PLAYWRIGHT_BASE_URL,
    });
    const inviteePage = await inviteeContext.newPage();
    await loginByForm(inviteePage, invitedUser);
    await inviteePage.goto(inviteLink);
    await inviteePage
      .getByRole('button', { name: 'Accept invitation' })
      .click();

    await expect(
      inviteePage.getByText(/active Studio plan before this invitation/i)
    ).toBeVisible();
    await inviteeContext.close();
  });
});
