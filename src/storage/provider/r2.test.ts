import { beforeEach, describe, expect, it, vi } from 'vitest';

const { deleteMock, putMock } = vi.hoisted(() => ({
  deleteMock: vi.fn().mockResolvedValue(undefined),
  putMock: vi.fn().mockResolvedValue(undefined),
}));

vi.mock('cloudflare:workers', () => ({
  env: {
    BUCKET: {
      delete: deleteMock,
      put: putMock,
    },
  },
}));

vi.mock('../../config/website', () => ({
  websiteConfig: {
    storage: {
      provider: 'r2',
      userFilesFolder: 'subtitle-files',
      maxFileSize: 10 * 1024 * 1024,
      allowedTypes: ['srt'],
    },
  },
}));

import { R2Provider } from './r2';

describe('R2Provider.deleteFiles', () => {
  beforeEach(() => {
    deleteMock.mockClear();
  });

  it('deletes objects in batches of at most 1000 keys', async () => {
    const provider = new R2Provider();
    const keys = Array.from({ length: 2001 }, (_, index) => `file-${index}`);

    await provider.deleteFiles(keys);

    expect(deleteMock).toHaveBeenCalledTimes(3);
    expect(deleteMock.mock.calls[0]?.[0]).toHaveLength(1000);
    expect(deleteMock.mock.calls[1]?.[0]).toHaveLength(1000);
    expect(deleteMock.mock.calls[2]?.[0]).toEqual(['file-2000']);
  });
});

describe('R2Provider.uploadFile', () => {
  beforeEach(() => {
    putMock.mockClear();
  });

  it('accepts avatar images and scopes them to the user', async () => {
    const provider = new R2Provider();
    const result = await provider.uploadFile({
      file: new Blob(['avatar'], { type: 'image/png' }),
      filename: 'avatar.png',
      contentType: 'image/png',
      folder: 'avatars',
      userId: 'user-123',
      requestOrigin: 'https://subtitleops.com',
    });

    expect(result.key).toMatch(/^avatars\/user-123\/.+-avatar\.png$/);
    expect(result.url).toContain('/api/storage/file?key=');
    expect(putMock).toHaveBeenCalledOnce();
  });

  it('keeps subtitle validation for non-avatar uploads', async () => {
    const provider = new R2Provider();

    await expect(
      provider.uploadFile({
        file: new Blob(['avatar'], { type: 'image/png' }),
        filename: 'avatar.png',
        contentType: 'image/png',
        userId: 'user-123',
      })
    ).rejects.toThrow('File type not supported');
  });
});
