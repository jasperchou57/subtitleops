import { beforeEach, describe, expect, it, vi } from 'vitest';

const {
  deleteMock,
  insertMock,
  onConflictDoUpdateMock,
  returningMock,
  valuesMock,
  whereMock,
} = vi.hoisted(() => {
  const returning = vi.fn();
  const onConflictDoUpdate = vi.fn(() => ({ returning }));
  const values = vi.fn(() => ({ onConflictDoUpdate }));
  const insert = vi.fn(() => ({ values }));
  const where = vi.fn();
  const deleteFn = vi.fn(() => ({ where }));
  return {
    deleteMock: deleteFn,
    insertMock: insert,
    onConflictDoUpdateMock: onConflictDoUpdate,
    returningMock: returning,
    valuesMock: values,
    whereMock: where,
  };
});

vi.mock('@/db', () => ({
  getDb: () => ({
    delete: deleteMock,
    insert: insertMock,
  }),
}));

import {
  consumeProductionApiQuota,
  getProductionApiUsageDate,
  PRODUCTION_API_DAILY_LIMIT,
  purgeOldProductionApiUsage,
} from './api-usage';

describe('production API usage', () => {
  beforeEach(() => {
    deleteMock.mockClear();
    insertMock.mockClear();
    onConflictDoUpdateMock.mockClear();
    returningMock.mockReset();
    valuesMock.mockClear();
    whereMock.mockReset();
  });

  it('uses a UTC calendar date and resets at the next UTC midnight', async () => {
    const now = new Date('2026-07-16T23:59:30.000Z');
    returningMock.mockResolvedValue([{ requestCount: 1 }]);

    const result = await consumeProductionApiQuota('user-1', now);

    expect(getProductionApiUsageDate(now)).toBe('2026-07-16');
    expect(valuesMock).toHaveBeenCalledWith({
      userId: 'user-1',
      usageDate: '2026-07-16',
      requestCount: 1,
      updatedAt: now,
    });
    expect(result).toEqual({
      allowed: true,
      limit: PRODUCTION_API_DAILY_LIMIT,
      remaining: 999,
      resetAt: Date.parse('2026-07-17T00:00:00.000Z') / 1000,
      retryAfter: 30,
    });
  });

  it('rejects requests when the atomic update returns no usage row', async () => {
    const now = new Date('2026-07-16T12:00:00.000Z');
    returningMock.mockResolvedValue([]);

    const result = await consumeProductionApiQuota('user-1', now);

    expect(result.allowed).toBe(false);
    expect(result.remaining).toBe(0);
    expect(result.retryAfter).toBe(12 * 60 * 60);
    expect(onConflictDoUpdateMock).toHaveBeenCalledOnce();
  });

  it('purges usage rows older than the retention window', async () => {
    whereMock.mockResolvedValue(undefined);

    await purgeOldProductionApiUsage(new Date('2026-07-16T12:00:00.000Z'));

    expect(deleteMock).toHaveBeenCalledOnce();
    expect(whereMock).toHaveBeenCalledOnce();
  });
});
