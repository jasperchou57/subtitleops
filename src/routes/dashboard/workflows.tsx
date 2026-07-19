import { WorkflowStudio } from '@/components/workflows/workflow-studio';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/dashboard/workflows')({
  component: WorkflowsPage,
});

function WorkflowsPage() {
  return (
    <DashboardLayout
      breadcrumbs={[
        { label: 'Dashboard', isCurrentPage: false },
        { label: 'Workflows', isCurrentPage: true },
      ]}
      title="Subtitle workflows"
      description="Batch convert, run quality checks, save presets, and collaborate with your team."
    >
      <WorkflowStudio />
    </DashboardLayout>
  );
}
