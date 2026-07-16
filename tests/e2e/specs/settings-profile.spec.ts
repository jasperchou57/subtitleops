import { expect, test } from '@playwright/test';
import {
  cleanupE2EUsers,
  loginByForm,
  registerE2EUser,
} from '../fixtures/auth';

test.describe('settings profile', () => {
  test.beforeEach(async ({ request }) => {
    await cleanupE2EUsers(request);
  });

  test.afterEach(async ({ request }) => {
    await cleanupE2EUsers(request);
  });

  test('updates the signed-in user display name', async ({ page, request }) => {
    const user = await registerE2EUser(request);
    const newName = `E2E Updated ${Date.now().toString().slice(-6)}`;

    await loginByForm(page, user);
    await page.goto('/settings/profile');

    const nameInput = page.locator('input[name="name"]');
    await expect(nameInput).toBeVisible();
    await nameInput.fill(newName);
    await page.getByRole('button', { name: /save|保存/i }).click();

    await expect(
      page.getByText(/name updated successfully|名字更新成功/i)
    ).toBeVisible();
    await expect(nameInput).toHaveValue(newName);

    await page.reload();
    await expect(page.locator('input[name="name"]')).toHaveValue(newName);
  });

  test('uploads a public avatar scoped to the signed-in user', async ({
    page,
    request,
  }) => {
    const user = await registerE2EUser(request);
    const png = Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAusB9Wl2nVQAAAAASUVORK5CYII=',
      'base64'
    );

    await loginByForm(page, user);
    await page.goto('/settings/profile');
    await page
      .locator('input[type="file"][accept*="image/png"]')
      .setInputFiles({
        name: 'avatar.png',
        mimeType: 'image/png',
        buffer: png,
      });

    await expect(
      page.getByText(/avatar updated successfully|头像更新成功/i)
    ).toBeVisible();
    await page.reload();

    const avatarUrl = await page
      .locator('img[src*="/api/storage/file"]')
      .first()
      .getAttribute('src');
    expect(avatarUrl).toMatch(/key=avatars%2F.+%2F.+-avatar\.png/);
    const response = await page.request.get(avatarUrl ?? '');
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toBe('image/png');
  });
});
