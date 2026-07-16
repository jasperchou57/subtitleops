import { beforeEach, describe, expect, it, vi } from 'vitest';

const { deleteMock } = vi.hoisted(() => ({
  deleteMock: vi.fn().mockResolvedValue(undefined),
}));

vi.mock('cloudflare:workers', () => ({
  env: {
    BUCKET: {
      delete: deleteMock,
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
