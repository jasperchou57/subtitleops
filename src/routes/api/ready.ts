import { createFileRoute } from '@tanstack/react-router';
import { env } from 'cloudflare:workers';
import { websiteConfig } from '@/config/website';

type ProbeName = 'd1' | 'r2' | 'kv' | 'auth' | 'payment' | 'mail';

async function getReadiness() {
  const probes = new Map<ProbeName, boolean>();
  const runtimeEnv = process.env;

  const [d1, r2, kv] = await Promise.allSettled([
    env.DB.prepare('SELECT 1 AS ready').first(),
    env.BUCKET.head('__subtitleops_readiness__'),
    env.CACHE.get('__subtitleops_readiness__'),
  ]);
  probes.set('d1', d1.status === 'fulfilled');
  probes.set('r2', r2.status === 'fulfilled');
  probes.set('kv', kv.status === 'fulfilled');

  probes.set(
    'auth',
    Boolean(
      runtimeEnv.BETTER_AUTH_SECRET &&
        runtimeEnv.BETTER_AUTH_SECRET.length >= 32 &&
        runtimeEnv.BETTER_AUTH_SECRET !== 'better-auth-secret'
    )
  );

  const paymentReady =
    !websiteConfig.payment?.enable ||
    (websiteConfig.payment.provider === 'stripe' &&
      Boolean(
        runtimeEnv.STRIPE_SECRET_KEY?.match(/^sk_(?:test|live)_/) &&
          runtimeEnv.STRIPE_WEBHOOK_SECRET?.startsWith('whsec_')
      ));
  probes.set('payment', paymentReady);

  const mailReady =
    !websiteConfig.mail?.enable || Boolean(runtimeEnv.RESEND_API_KEY);
  probes.set('mail', mailReady);

  const failed = [...probes.entries()]
    .filter(([, ready]) => !ready)
    .map(([name]) => name);
  return { ready: failed.length === 0, failed };
}

export const Route = createFileRoute('/api/ready')({
  server: {
    handlers: {
      GET: async () => {
        const readiness = await getReadiness();
        if (!readiness.ready) {
          console.error(
            `[readiness] Unavailable dependencies: ${readiness.failed.join(', ')}`
          );
        }

        return Response.json(
          import.meta.env.PROD
            ? { status: readiness.ready ? 'ready' : 'not_ready' }
            : {
                status: readiness.ready ? 'ready' : 'not_ready',
                failed: readiness.failed,
              },
          {
            status: readiness.ready ? 200 : 503,
            headers: {
              'Cache-Control': 'no-store',
              'X-Robots-Tag': 'noindex',
            },
          }
        );
      },
    },
  },
});
