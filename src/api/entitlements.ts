import { getUserEntitlement } from '@/lib/entitlements';
import { authApiMiddleware } from '@/middlewares/auth-middleware';
import { createServerFn } from '@tanstack/react-start';

export const getMyEntitlement = createServerFn({ method: 'GET' })
  .middleware([authApiMiddleware])
  .handler(async ({ context }) => {
    return getUserEntitlement(context.userId);
  });
