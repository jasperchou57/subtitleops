import { joinBeta } from '@/api/beta';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { trackSaasEvent } from '@/lib/analytics';
import type { ProductPlanId } from '@/lib/entitlements';
import { IconLoader2 } from '@tabler/icons-react';
import { type FormEvent, useState } from 'react';

export function BetaSignupButton({
  planId,
  planName,
}: {
  planId: Exclude<ProductPlanId, 'free'>;
  planName: string;
}) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [useCase, setUseCase] = useState('');
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');
  const [complete, setComplete] = useState(false);

  const showForm = () => {
    setOpen(true);
    trackSaasEvent('beta_intent', { plan_id: planId, source: 'pricing' });
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPending(true);
    setError('');
    try {
      await joinBeta({
        data: {
          email,
          planId,
          useCase: useCase || undefined,
          source: 'pricing',
        },
      });
      setComplete(true);
      trackSaasEvent('beta_joined', { plan_id: planId, source: 'pricing' });
    } catch (caught) {
      setError(
        caught instanceof Error ? caught.message : 'Could not save your request'
      );
    } finally {
      setPending(false);
    }
  };

  if (complete) {
    return (
      <div className="mt-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-900">
        You&apos;re on the {planName} beta list. We&apos;ll email you before
        billing opens.
      </div>
    );
  }

  if (!open) {
    return (
      <Button type="button" className="mt-4 w-full" onClick={showForm}>
        Join {planName} beta
      </Button>
    );
  }

  return (
    <form onSubmit={submit} className="mt-4 space-y-3 rounded-lg border p-3">
      <label className="block text-xs font-medium" htmlFor={`${planId}-email`}>
        Work email
      </label>
      <Input
        id={`${planId}-email`}
        type="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        placeholder="you@example.com"
        required
      />
      <label
        className="block text-xs font-medium"
        htmlFor={`${planId}-use-case`}
      >
        What subtitle work do you repeat?
      </label>
      <textarea
        id={`${planId}-use-case`}
        value={useCase}
        onChange={(event) => setUseCase(event.target.value)}
        className="min-h-20 w-full rounded-lg border bg-background px-3 py-2 text-sm"
        maxLength={1000}
        placeholder="Batch conversions, client delivery, review..."
      />
      {error && <p className="text-xs text-destructive">{error}</p>}
      <div className="flex gap-2">
        <Button type="submit" className="flex-1" disabled={pending}>
          {pending && <IconLoader2 className="size-4 animate-spin" />}
          Request beta access
        </Button>
        <Button type="button" variant="outline" onClick={() => setOpen(false)}>
          Cancel
        </Button>
      </div>
      <p className="text-xs text-muted-foreground">
        No card required. No charge until you explicitly start a subscription.
      </p>
    </form>
  );
}
