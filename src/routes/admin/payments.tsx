import { AdminPaymentsContent } from '@/components/admin/payments/admin-payments-content';
import { DashboardHeader } from '@/components/layout/dashboard-header';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/admin/payments')({
  component: AdminPaymentsPage,
});

function AdminPaymentsPage() {
  const breadcrumbs = [
    { label: 'Admin', isCurrentPage: false },
    { label: 'Payments', isCurrentPage: true },
  ];
  return (
    <>
      <DashboardHeader breadcrumbs={breadcrumbs} />
      <div className="flex flex-1 flex-col">
        <div className="flex flex-col gap-4 px-4 py-4 lg:gap-6 lg:px-6 lg:py-6">
          <AdminPaymentsContent />
        </div>
      </div>
    </>
  );
}
