import { getWorkspaceOverview } from '@/api/workspaces';
import { listConversionProjects } from '@/api/workflows';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Badge } from '@/components/ui/badge';
import { buttonVariants } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Routes } from '@/lib/routes';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute, Link } from '@tanstack/react-router';
import {
  IconArchive,
  IconFiles,
  IconStack2,
  IconUsers,
} from '@tabler/icons-react';

export const Route = createFileRoute('/dashboard/')({
  component: DashboardPage,
});

function DashboardPage() {
  const workspaceQuery = useQuery({
    queryKey: ['workspace-overview'],
    queryFn: () => getWorkspaceOverview(),
  });
  const overview = workspaceQuery.data;
  const projectsQuery = useQuery({
    queryKey: ['conversion-projects', overview?.workspace.id],
    queryFn: () =>
      listConversionProjects({
        data: { workspaceId: overview?.workspace.id ?? '' },
      }),
    enabled: Boolean(overview && overview.entitlement.historyDays > 0),
  });

  return (
    <DashboardLayout
      breadcrumbs={[{ label: 'Dashboard', isCurrentPage: true }]}
      title="SubtitleOps workspace"
      description="Your plan, workflow limits, projects, and team at a glance."
    >
      {workspaceQuery.isLoading ? (
        <div className="py-12 text-center text-muted-foreground">
          Loading workspace…
        </div>
      ) : workspaceQuery.error || !overview ? (
        <Card>
          <CardContent className="py-8 text-destructive">
            {workspaceQuery.error?.message ?? 'Unable to load your workspace.'}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <MetricCard
              icon={<IconStack2 />}
              label="Current plan"
              value={overview.entitlement.planId}
            />
            <MetricCard
              icon={<IconFiles />}
              label="Batch limit"
              value={`${overview.entitlement.batchFileLimit} files`}
            />
            <MetricCard
              icon={<IconArchive />}
              label="Project history"
              value={
                overview.entitlement.historyDays > 0
                  ? `${overview.entitlement.historyDays} days`
                  : 'Not included'
              }
            />
            <MetricCard
              icon={<IconUsers />}
              label="Workspace seats"
              value={`${overview.members.length} / ${overview.entitlement.seatLimit}`}
            />
          </div>

          <Card>
            <CardHeader>
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <CardTitle>{overview.workspace.name}</CardTitle>
                  <CardDescription>
                    Start a batch conversion or continue a recent project.
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  {overview.entitlement.planId === 'free' && (
                    <Link
                      className={buttonVariants({ variant: 'outline' })}
                      to={Routes.Pricing}
                    >
                      Compare plans
                    </Link>
                  )}
                  <Link className={buttonVariants()} to={Routes.Workflows}>
                    New workflow
                  </Link>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {overview.entitlement.historyDays === 0 ? (
                <p className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
                  Free keeps every single-file tool available. Pro adds
                  multi-file batches, ZIP export, presets, quality checks, and
                  private history.
                </p>
              ) : (projectsQuery.data?.projects ?? []).length === 0 ? (
                <p className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
                  No projects yet. Your first batch will appear here.
                </p>
              ) : (
                (projectsQuery.data?.projects ?? [])
                  .slice(0, 5)
                  .map((project) => (
                    <div
                      className="flex items-center gap-3 rounded-lg border p-3"
                      key={project.id}
                    >
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-medium">{project.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {project.fileCount} files · {project.issueCount}{' '}
                          issues
                        </p>
                      </div>
                      <Badge variant="outline">
                        {project.status.replace('_', ' ')}
                      </Badge>
                    </div>
                  ))
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </DashboardLayout>
  );
}

function MetricCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <Card>
      <CardHeader className="pb-0">
        <CardDescription className="flex items-center gap-2">
          <span className="[&_svg]:size-4">{icon}</span>
          {label}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-semibold capitalize">{value}</p>
      </CardContent>
    </Card>
  );
}
