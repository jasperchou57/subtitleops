import { m } from '@/locale/paraglide/messages';
import { createCustomerPortalSession } from '@/api/payment';
import { Button } from '@/components/ui/button';
import { IconLoader2 } from '@tabler/icons-react';
import { useState } from 'react';
import { toast } from 'sonner';
interface CustomerPortalButtonProps {
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
export function CustomerPortalButton({
  variant = 'default',
  size = 'default',
  className,
  children,
}: CustomerPortalButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const handleClick = async () => {
    try {
      setIsLoading(true);
      const result = await createCustomerPortalSession({
        data: {},
      });
      if (result?.url) {
        window.location.href = result.url;
      } else {
        toast.error(m.pricing_customer_portal_failed());
      }
    } catch (err) {
      console.error('Customer portal error:', err);
      toast.error(m.pricing_customer_portal_failed());
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      onClick={handleClick}
      disabled={isLoading}
    >
      {isLoading ? (
        <>
          <IconLoader2 className="mr-2 size-4 animate-spin" />
          {m.pricing_customer_portal_loading()}
        </>
      ) : (
        children
      )}
    </Button>
  );
}
