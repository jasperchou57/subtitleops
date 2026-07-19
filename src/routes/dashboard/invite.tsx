import { acceptWorkspaceInvite } from '@/api/workspaces';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Button, buttonVariants } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Routes } from '@/lib/routes';
import { useMutation } from '@tanstack/react-query';
import { createFileRoute, Link } from '@tanstack/react-router';
import { IconLoader2 } from '@tabler/icons-react';
import { z } from 'zod';

export const Route = createFileRoute('/dashboard/invite')({
  validateSearch: z.object({ token: z.string().optional() }),
  component: WorkspaceInvitePage,
});

function WorkspaceInvitePage() {
  const { token } = Route.useSearch();
  const acceptMutation = useMutation({
    mutationFn: () => acceptWorkspaceInvite({ data: { token: token ?? '' } }),
  });

  return (
    <DashboardLayout
      breadcrumbs={[
        { label: 'Dashboard', isCurrentPage: false },
        { label: 'Workspace invitation', isCurrentPage: true },
      ]}
      title="Workspace invitation"
      description="Confirm the invitation while signed in with the invited email address."
    >
      <Card className="max-w-xl">
        <CardHeader>
          <CardTitle>
            {acceptMutation.isSuccess
              ? 'Invitation accepted'
              : 'Join workspace'}
          </CardTitle>
          <CardDescription>
            {acceptMutation.isSuccess
              ? 'You now have access to the shared Studio workspace.'
              : 'Your role and workspace plan are controlled by the workspace owner.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!token ? (
            <p className="text-sm text-destructive">
              This invitation link is incomplete.
            </p>
          ) : acceptMutation.isSuccess ? (
            <Link className={buttonVariants()} to={Routes.Workflows}>
              Open shared workflows
            </Link>
          ) : (
            <div className="space-y-3">
              <Button
                disabled={acceptMutation.isPending}
                onClick={() => acceptMutation.mutate()}
              >
                {acceptMutation.isPending && (
                  <IconLoader2 className="animate-spin" />
                )}
                Accept invitation
              </Button>
              {acceptMutation.error && (
                <p className="text-sm text-destructive">
                  {acceptMutation.error.message}
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
