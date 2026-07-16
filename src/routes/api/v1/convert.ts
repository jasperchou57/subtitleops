import { auth } from '@/auth/auth';
import { getUserEntitlement } from '@/lib/entitlements';
import { detectFormat } from '@/lib/converters/detect-format';
import { checkSubtitleQuality } from '@/lib/converters/quality';
import { universalConvert } from '@/lib/converters/universal';
import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';

const requestSchema = z.object({
  content: z.string().min(1).max(2_000_000),
  filename: z.string().min(1).max(255).default('subtitle.srt'),
  outputFormat: z.enum(['srt', 'ass', 'vtt', 'txt']),
});

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, content-type, x-api-key',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

function json(data: unknown, status = 200) {
  return Response.json(data, { status, headers: corsHeaders });
}

function getApiKey(request: Request) {
  const direct = request.headers.get('x-api-key');
  if (direct) return direct;
  const authorization = request.headers.get('authorization');
  return authorization?.toLowerCase().startsWith('bearer ')
    ? authorization.slice(7).trim()
    : null;
}

export const Route = createFileRoute('/api/v1/convert')({
  server: {
    handlers: {
      OPTIONS: async () =>
        new Response(null, { status: 204, headers: corsHeaders }),
      POST: async ({ request }) => {
        const key = getApiKey(request);
        if (!key) return json({ error: 'API key required' }, 401);

        const verified = await auth.api.verifyApiKey({ body: { key } });
        if (!verified.valid || !verified.key?.userId) {
          return json({ error: 'Invalid API key' }, 401);
        }

        const entitlement = await getUserEntitlement(verified.key.userId);
        if (!entitlement.productionApi) {
          return json({ error: 'Studio plan required' }, 403);
        }

        let input: z.infer<typeof requestSchema>;
        try {
          input = requestSchema.parse(await request.json());
        } catch (caught) {
          if (caught instanceof z.ZodError) {
            return json(
              { error: 'Invalid request', issues: caught.issues },
              400
            );
          }
          return json({ error: 'Invalid JSON body' }, 400);
        }

        try {
          const inputFormat = detectFormat(input.content, input.filename);
          const content = universalConvert(
            input.content,
            inputFormat,
            input.outputFormat
          );
          const qualitySource = universalConvert(
            input.content,
            inputFormat,
            'srt'
          );
          return json({
            inputFormat,
            outputFormat: input.outputFormat,
            content,
            quality: checkSubtitleQuality(qualitySource),
          });
        } catch (caught) {
          return json(
            {
              error:
                caught instanceof Error ? caught.message : 'Conversion failed',
            },
            422
          );
        }
      },
    },
  },
});
