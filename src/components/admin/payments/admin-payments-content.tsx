import {
  usePaymentReconciliation,
  useReconcileStripePayment,
} from '@/hooks/use-payment-admin';
import { formatDateTime } from '@/lib/formatter';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useState } from 'react';
import { toast } from 'sonner';

const PAGE_SIZE = 25;

function shortId(value: string | null) {
  if (!value) return '—';
  return value.length > 24 ? `${value.slice(0, 12)}…${value.slice(-8)}` : value;
}

export function AdminPaymentsContent() {
  const [pageIndex, setPageIndex] = useState(0);
  const [search, setSearch] = useState('');
  const [objectId, setObjectId] = useState('');
  const query = usePaymentReconciliation(pageIndex, PAGE_SIZE, search);
  const reconcile = useReconcileStripePayment();
  const total = query.data?.total ?? 0;

  const handleReconcile = async () => {
    try {
      await reconcile.mutateAsync(objectId.trim());
      toast.success(`Reconciled ${objectId.trim()}`);
      setObjectId('');
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Reconciliation failed'
      );
    }
  };

  return (
    <div className="space-y-8">
      <section className="space-y-3 rounded-xl border bg-card p-5">
        <div>
          <h2 className="font-semibold">Safe Stripe reconciliation</h2>
          <p className="text-sm text-muted-foreground">
            Stripe is queried first. This action never accepts an amount or plan
            from the administrator.
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Input
            value={objectId}
            onChange={(event) => setObjectId(event.target.value)}
            placeholder="in_…, cs_…, or pi_…"
            aria-label="Stripe object ID"
          />
          <Button
            onClick={handleReconcile}
            disabled={!objectId.trim() || reconcile.isPending}
          >
            {reconcile.isPending ? 'Reconciling…' : 'Reconcile'}
          </Button>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <h2 className="font-semibold">Payment transactions</h2>
            <p className="text-sm text-muted-foreground">
              {total} auditable payment{' '}
              {total === 1 ? 'transaction' : 'transactions'}
            </p>
          </div>
          <Input
            className="sm:max-w-sm"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPageIndex(0);
            }}
            placeholder="Email, user, customer, session, invoice, intent…"
            aria-label="Search payments"
          />
        </div>

        <div className="overflow-x-auto rounded-xl border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Stripe objects</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Fulfillment</TableHead>
                <TableHead>Updated</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {query.isLoading ? (
                <TableRow>
                  <TableCell colSpan={7}>Loading payments…</TableCell>
                </TableRow>
              ) : query.data?.items.length ? (
                query.data.items.map((item) => (
                  <TableRow key={item.transactionId}>
                    <TableCell>
                      <div className="font-medium">{item.email}</div>
                      <code className="text-xs text-muted-foreground">
                        {shortId(item.userId)}
                      </code>
                    </TableCell>
                    <TableCell>{item.planId ?? '—'}</TableCell>
                    <TableCell className="min-w-64 space-y-1 text-xs">
                      <div title={item.businessKey}>
                        Key: {shortId(item.businessKey)}
                      </div>
                      <div title={item.invoiceId ?? undefined}>
                        Invoice: {shortId(item.invoiceId)}
                      </div>
                      <div title={item.paymentIntentId ?? undefined}>
                        Intent: {shortId(item.paymentIntentId)}
                      </div>
                      <div title={item.subscriptionId ?? undefined}>
                        Subscription: {shortId(item.subscriptionId)}
                      </div>
                    </TableCell>
                    <TableCell>
                      {(item.amount / 100).toLocaleString(undefined, {
                        style: 'currency',
                        currency: item.currency.toUpperCase(),
                      })}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{item.paymentStatus}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{item.fulfillmentStatus}</Badge>
                      {item.failureMessage && (
                        <p className="mt-1 max-w-64 text-xs text-destructive">
                          {item.failureMessage}
                        </p>
                      )}
                    </TableCell>
                    <TableCell>
                      {formatDateTime(new Date(item.updatedAt))}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7}>
                    No payment transactions found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-end gap-2">
          <Button
            variant="outline"
            disabled={pageIndex === 0}
            onClick={() => setPageIndex((value) => Math.max(0, value - 1))}
          >
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {pageIndex + 1}
          </span>
          <Button
            variant="outline"
            disabled={(pageIndex + 1) * PAGE_SIZE >= total}
            onClick={() => setPageIndex((value) => value + 1)}
          >
            Next
          </Button>
        </div>
      </section>

      <section className="space-y-3">
        <div>
          <h2 className="font-semibold">Recent Stripe events</h2>
          <p className="text-sm text-muted-foreground">
            Search also matches Event IDs, object IDs, and event types.
          </p>
        </div>
        <div className="overflow-x-auto rounded-xl border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Event</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Object</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Attempts</TableHead>
                <TableHead>Received</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {query.data?.events.length ? (
                query.data.events.map((event) => (
                  <TableRow key={event.id}>
                    <TableCell>
                      <code>{shortId(event.id)}</code>
                    </TableCell>
                    <TableCell>{event.eventType}</TableCell>
                    <TableCell>
                      <code>{shortId(event.objectId)}</code>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{event.status}</Badge>
                    </TableCell>
                    <TableCell>{event.attempts}</TableCell>
                    <TableCell>
                      {formatDateTime(new Date(event.receivedAt))}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6}>No Stripe events found.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </section>
    </div>
  );
}
