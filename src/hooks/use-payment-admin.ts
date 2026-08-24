import {
  listPaymentReconciliation,
  reconcileStripePayment,
} from '@/api/payment-admin';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const paymentAdminKeys = {
  all: ['admin-payments'] as const,
  list: (pageIndex: number, pageSize: number, search: string) =>
    [...paymentAdminKeys.all, pageIndex, pageSize, search] as const,
};

export function usePaymentReconciliation(
  pageIndex: number,
  pageSize: number,
  search: string
) {
  return useQuery({
    queryKey: paymentAdminKeys.list(pageIndex, pageSize, search),
    queryFn: () =>
      listPaymentReconciliation({ data: { pageIndex, pageSize, search } }),
  });
}

export function useReconcileStripePayment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (objectId: string) =>
      reconcileStripePayment({ data: { objectId } }),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: paymentAdminKeys.all }),
  });
}
