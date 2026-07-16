import { getDb } from '@/db';
import { betaLeads } from '@/db/app.schema';
import { createServerFn } from '@tanstack/react-start';
import { z } from 'zod';

const joinBetaSchema = z.object({
  email: z.email().transform((value) => value.trim().toLowerCase()),
  planId: z.enum(['pro', 'studio']),
  useCase: z.string().trim().max(1000).optional(),
  source: z.string().trim().min(1).max(80).default('pricing'),
});

export const joinBeta = createServerFn({ method: 'POST' })
  .inputValidator(joinBetaSchema)
  .handler(async ({ data }) => {
    const now = new Date();
    await getDb()
      .insert(betaLeads)
      .values({
        id: crypto.randomUUID(),
        email: data.email,
        planId: data.planId,
        useCase: data.useCase || null,
        source: data.source,
        createdAt: now,
        updatedAt: now,
      })
      .onConflictDoUpdate({
        target: [betaLeads.email, betaLeads.planId],
        set: {
          useCase: data.useCase || null,
          source: data.source,
          updatedAt: now,
        },
      });
    return { success: true };
  });
