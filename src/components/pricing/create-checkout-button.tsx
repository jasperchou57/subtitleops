import { m } from '@/locale/paraglide/messages';
import { createCheckoutSession } from '@/api/payment';
import { Button } from '@/components/ui/button';
import { websiteConfig } from '@/config/website';
import { cn } from '@/lib/utils';
import { trackEvent } from '@/lib/analytics';
import { IconLoader2 } from '@tabler/icons-react';
import { useState } from 'react';
import { toast } from 'sonner';
interface CheckoutButtonProps {
  planId: string;
  priceId: string;
  amount: number;
  currency: string;
  metadata?: Record<string, string>;
  variant?:
    | 'default'
    | 'outline'
    | 'destructive'
    | 'secondary'
    | 'ghost'
    | 'link'
    | null;
  size?: 'default' | 'sm' | 'lg' | 'icon' | null;
  className?: string;
  children?: React.ReactNode;
}
export function CheckoutButton({
  planId,
  priceId,
  amount,
  currency,
  metadata,
  variant = 'default',
  size = 'default',
  className,
  children,
}: CheckoutButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const value = amount / 100;

  const handleClick = async () => {
    try {
      setIsLoading(true);
      trackEvent('begin_checkout', {
        currency: currency.toUpperCase(),
        payment_provider: websiteConfig.payment?.provider || 'unknown',
        plan_id: planId,
        value,
        items: [
          {
            item_id: priceId,
            item_name: planId,
            price: value,
            quantity: 1,
          },
        ],
      });
      // merge metadata with existing metadata
      const mergedMetadata = metadata ? { ...metadata } : {};
      const result = await createCheckoutSession({
        data: {
          planId,
          priceId,
          metadata:
            Object.keys(mergedMetadata).length > 0 ? mergedMetadata : undefined,
        },
      });
      if (result?.url) {
        window.location.href = result.url;
      } else {
        trackEvent('checkout_error', {
          plan_id: planId,
          error_code: 'missing_checkout_url',
        });
        toast.error(m.pricing_checkout_failed());
      }
    } catch (err) {
      console.error('Checkout error:', err);
      trackEvent('checkout_error', {
        plan_id: planId,
        error_code: 'checkout_request_failed',
      });
      toast.error(m.pricing_checkout_failed());
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Button
      data-analytics-id={`checkout_${planId}`}
      variant={variant}
      size={size}
      className={cn(className)}
      onClick={handleClick}
      disabled={isLoading}
    >
      {isLoading ? (
        <>
          <IconLoader2 className="mr-2 size-4 animate-spin" />
          {m.pricing_checkout_loading()}
        </>
      ) : (
        children
      )}
    </Button>
  );
}
