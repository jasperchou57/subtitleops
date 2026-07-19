import { authClient } from '@/auth/client';
import Container from '@/components/layout/container';
import { PricingTable } from '@/components/pricing/pricing-table';
import { websiteConfig } from '@/config/website';
import { useCurrentPlan } from '@/hooks/use-payment';
import { seo } from '@/lib/seo';
import type { PricePlan } from '@/payment/types';
import { createFileRoute } from '@tanstack/react-router';
import { trackSaasEvent } from '@/lib/analytics';
import { useEffect, useState } from 'react';

const checkoutEnabled =
  websiteConfig.auth?.enable === true && websiteConfig.payment?.enable === true;

const pricingFaqs = [
  {
    question: 'Will the current subtitle tools stay free?',
    answer:
      'Yes. All current single-file converters and timing tools will remain free, private, and available without an account. Pro is for repeat workflows, not access to the basic tools.',
  },
  {
    question: 'What is included in Pro and Studio?',
    answer:
      'Pro includes batch processing, saved presets, 180-day private project history, and subtitle quality checks. Studio adds a three-seat shared workspace, review workflows, 365-day history, larger batches, and production API access.',
  },
  {
    question: 'Are my subtitle files uploaded?',
    answer:
      'Free tools continue to process files locally in your browser. Pro cloud history will be optional, and you will choose when a project is saved to your private workspace.',
  },
  {
    question: 'Can I cancel a Pro subscription?',
    answer:
      'Yes. You can cancel at any time from billing settings and keep paid access until the end of the current billing period.',
  },
  {
    question: 'Does Pro include AI transcription or translation?',
    answer:
      'Not at launch. Pro focuses on reliable subtitle workflows. Future AI transcription or translation will use clearly priced usage credits instead of an unclear unlimited promise.',
  },
] as const;

export const Route = createFileRoute('/(pages)/pricing')({
  head: () =>
    seo('/pricing', {
      title: `SubtitleOps Pricing - Free Tools and Pro Workflows`,
      description:
        'Keep every current SubtitleOps converter free. Compare Pro workflows and the three-seat Studio plan for teams, review, and automation.',
    }),
  component: PricingPage,
});

function PricingPage() {
  if (checkoutEnabled) return <CheckoutPricingPage />;
  return <PricingPageContent />;
}

function CheckoutPricingPage() {
  const [userId, setUserId] = useState<string>();

  useEffect(() => {
    let active = true;
    void authClient.getSession().then(({ data: session }) => {
      if (active) setUserId(session?.user?.id);
    });
    return () => {
      active = false;
    };
  }, []);

  const { data: planData } = useCurrentPlan(!!userId);
  const currentPlan = planData?.currentPlan ?? null;
  return <PricingPageContent currentPlan={currentPlan} userId={userId} />;
}

function PricingPageContent({
  currentPlan,
  userId,
}: {
  currentPlan?: PricePlan | null;
  userId?: string;
}) {
  return (
    <>
      <PricingPageAnalytics />
      <section className="border-b bg-muted/25">
        <Container className="px-4 py-16 text-center sm:px-6 md:py-20">
          <div className="mx-auto max-w-3xl space-y-5">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-700">
              Simple, transparent pricing
            </p>
            <h1 className="text-balance text-4xl font-bold tracking-tight sm:text-5xl">
              Free for quick fixes. Pro for repeat subtitle work.
            </h1>
            <p className="mx-auto max-w-2xl text-pretty text-lg leading-8 text-muted-foreground">
              Every current single-file tool stays free. Upgrade only when you
              need batch workflows, reusable presets, private history, and
              quality checks—or a three-seat workspace for your team.
            </p>
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
              <span>No credit card for Free</span>
              <span>Cancel Pro anytime</span>
              <span>Studio includes 3 seats</span>
              <span>Files stay local by default</span>
            </div>
          </div>
        </Container>
      </section>

      <Container className="px-4 py-14 sm:px-6 md:py-20">
        <div className="mx-auto max-w-6xl space-y-12">
          {!checkoutEnabled && (
            <div className="mx-auto max-w-4xl rounded-xl border border-blue-200 bg-blue-50 px-5 py-4 text-sm leading-6 text-blue-950">
              <strong>Pro and Studio are in private beta.</strong> Checkout
              stays closed until the promised individual and team features are
              ready. Joining either beta does not charge you.
            </div>
          )}

          <PricingTable
            currentPlan={currentPlan}
            metadata={userId ? { userId } : undefined}
            checkoutEnabled={checkoutEnabled}
          />

          <section className="mx-auto max-w-4xl border-t pt-12">
            <div className="mb-8 text-center">
              <h2 className="text-2xl font-bold tracking-tight">
                Pricing questions
              </h2>
              <p className="mt-2 text-muted-foreground">
                Clear answers before you subscribe.
              </p>
            </div>
            <div className="divide-y rounded-xl border px-5 sm:px-7">
              {pricingFaqs.map((item) => (
                <details key={item.question} className="group py-5">
                  <summary className="cursor-pointer list-none font-semibold marker:hidden">
                    <span className="flex items-center justify-between gap-4">
                      {item.question}
                      <span
                        aria-hidden="true"
                        className="text-xl font-normal text-muted-foreground transition-transform group-open:rotate-45"
                      >
                        +
                      </span>
                    </span>
                  </summary>
                  <p className="max-w-3xl pt-3 text-sm leading-6 text-muted-foreground">
                    {item.answer}
                  </p>
                </details>
              ))}
            </div>
          </section>
        </div>
      </Container>
    </>
  );
}

function PricingPageAnalytics() {
  useEffect(() => {
    trackSaasEvent('pricing_view');
  }, []);
  return null;
}
