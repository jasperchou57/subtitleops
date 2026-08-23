import { m } from '@/locale/paraglide/messages';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { getPricePlans } from '@/lib/price-plan';
import { cn } from '@/lib/utils';
import { trackSaasEvent } from '@/lib/analytics';
import type { PlanInterval, PricePlan } from '@/payment/types';
import { PlanIntervals, PaymentTypes } from '@/payment/types';
import { useState } from 'react';
import { PricingCard } from './pricing-card';
interface PricingTableProps {
  metadata?: Record<string, string>;
  currentPlan?: PricePlan | null;
  checkoutEnabled?: boolean;
  className?: string;
}
export function PricingTable({
  metadata,
  currentPlan,
  checkoutEnabled = false,
  className,
}: PricingTableProps) {
  const [interval, setInterval] = useState<PlanInterval>(PlanIntervals.YEAR);
  const plans = Object.values(getPricePlans());
  const currentPlanId = currentPlan?.id ?? null;
  const hasPaidPlan = Boolean(currentPlan && !currentPlan.isFree);
  const freePlans = plans.filter((p) => p.isFree && !p.disabled);
  const subscriptionPlans = plans.filter(
    (p) =>
      !p.isFree &&
      !p.disabled &&
      p.prices.some(
        (pr) => !pr.disabled && pr.type === PaymentTypes.SUBSCRIPTION
      )
  );
  const oneTimePlans = plans.filter(
    (p) =>
      !p.isFree &&
      !p.disabled &&
      p.prices.some((pr) => !pr.disabled && pr.type === PaymentTypes.ONE_TIME)
  );
  const hasMonthly = subscriptionPlans.some((p) =>
    p.prices.some(
      (pr) =>
        pr.type === PaymentTypes.SUBSCRIPTION &&
        pr.interval === PlanIntervals.MONTH
    )
  );
  const hasYearly = subscriptionPlans.some((p) =>
    p.prices.some(
      (pr) =>
        pr.type === PaymentTypes.SUBSCRIPTION &&
        pr.interval === PlanIntervals.YEAR
    )
  );
  const totalVisible =
    freePlans.length + subscriptionPlans.length + oneTimePlans.length;
  return (
    <div className={cn('flex flex-col gap-12', className)}>
      {(hasMonthly || hasYearly) && subscriptionPlans.length > 0 && (
        <div className="flex justify-center">
          <ToggleGroup
            role="toolbar"
            aria-label="Billing interval"
            size="sm"
            value={[interval] as const}
            onValueChange={(v) => {
              const next = v?.[0];
              if (next === PlanIntervals.MONTH || next === PlanIntervals.YEAR) {
                setInterval(next);
                trackSaasEvent('plan_interval_changed', { interval: next });
              }
            }}
            className="rounded-lg border p-1 flex gap-0.5"
          >
            {hasMonthly && (
              <ToggleGroupItem
                value="month"
                className="rounded-md px-3 py-0 text-sm data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
              >
                {m.pricing_monthly()}
              </ToggleGroupItem>
            )}
            {hasYearly && (
              <ToggleGroupItem
                value="year"
                className="rounded-md px-3 py-0 text-sm data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
              >
                {m.pricing_yearly()} · Save 34%
              </ToggleGroupItem>
            )}
          </ToggleGroup>
        </div>
      )}

      <div
        className={cn(
          'grid gap-6',
          totalVisible === 1 && 'mx-auto w-full max-w-md grid-cols-1',
          totalVisible === 2 &&
            'mx-auto w-full max-w-4xl grid-cols-1 md:grid-cols-2',
          totalVisible >= 3 && 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
        )}
      >
        {freePlans.map((plan) => (
          <PricingCard
            key={plan.id}
            plan={plan}
            metadata={metadata}
            isCurrentPlan={currentPlanId === plan.id}
            hasPaidPlan={hasPaidPlan}
            checkoutEnabled={checkoutEnabled}
          />
        ))}
        {subscriptionPlans.map((plan) => (
          <PricingCard
            key={plan.id}
            plan={plan}
            interval={interval}
            paymentType={PaymentTypes.SUBSCRIPTION}
            metadata={metadata}
            isCurrentPlan={currentPlanId === plan.id}
            hasPaidPlan={hasPaidPlan}
            checkoutEnabled={checkoutEnabled}
          />
        ))}
        {oneTimePlans.map((plan) => (
          <PricingCard
            key={plan.id}
            plan={plan}
            paymentType={PaymentTypes.ONE_TIME}
            metadata={metadata}
            isCurrentPlan={currentPlanId === plan.id}
            hasPaidPlan={hasPaidPlan}
            checkoutEnabled={checkoutEnabled}
          />
        ))}
      </div>
    </div>
  );
}
