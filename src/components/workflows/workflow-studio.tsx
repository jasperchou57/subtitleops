import {
  createConversionProject,
  deleteConversionPreset,
  listConversionPresets,
  listConversionProjects,
  reviewConversionProject,
  saveConversionPreset,
} from '@/api/workflows';
import {
  getWorkspaceOverview,
  inviteWorkspaceMember,
  removeWorkspaceMember,
  updateWorkspaceMemberRole,
} from '@/api/workspaces';
import { uploadUserFile } from '@/api/user-files';
import { Badge } from '@/components/ui/badge';
import { Button, buttonVariants } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Routes } from '@/lib/routes';
import { trackSaasEvent } from '@/lib/analytics';
import {
  processBatchFiles,
  type BatchFileResult,
} from '@/lib/converters/batch';
import { createBatchZip, downloadBatchZip } from '@/lib/download-zip';
import { Link } from '@tanstack/react-router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  IconAlertTriangle,
  IconCheck,
  IconDownload,
  IconLoader2,
  IconTrash,
  IconUsers,
} from '@tabler/icons-react';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';

type OutputFormat = 'srt' | 'ass' | 'vtt' | 'txt';

const workspaceQueryKey = ['workspace-overview'] as const;

export function WorkflowStudio() {
  const queryClient = useQueryClient();
  const [files, setFiles] = useState<File[]>([]);
  const [outputFormat, setOutputFormat] = useState<OutputFormat>('srt');
  const [fileNamePattern, setFileNamePattern] = useState('{name}.{ext}');
  const [results, setResults] = useState<BatchFileResult[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [presetName, setPresetName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'editor' | 'reviewer'>('editor');
  const [inviteLink, setInviteLink] = useState('');
  const [storeArchive, setStoreArchive] = useState(true);

  const workspaceQuery = useQuery({
    queryKey: workspaceQueryKey,
    queryFn: () => getWorkspaceOverview(),
  });
  const overview = workspaceQuery.data;
  const workspaceId = overview?.workspace.id;
  const entitlement = overview?.entitlement;

  const presetsQuery = useQuery({
    queryKey: ['conversion-presets', workspaceId],
    queryFn: () =>
      listConversionPresets({ data: { workspaceId: workspaceId ?? '' } }),
    enabled: Boolean(workspaceId && entitlement?.savedPresets),
  });
  const projectsQuery = useQuery({
    queryKey: ['conversion-projects', workspaceId],
    queryFn: () =>
      listConversionProjects({ data: { workspaceId: workspaceId ?? '' } }),
    enabled: Boolean(workspaceId && entitlement && entitlement.historyDays > 0),
  });

  const savePresetMutation = useMutation({
    mutationFn: () =>
      saveConversionPreset({
        data: {
          workspaceId: workspaceId ?? '',
          name: presetName,
          outputFormat,
          fileNamePattern,
          settings: {},
          shared: entitlement?.sharedWorkspace ?? false,
        },
      }),
    onSuccess: () => {
      setPresetName('');
      queryClient.invalidateQueries({
        queryKey: ['conversion-presets', workspaceId],
      });
      toast.success('Preset saved');
    },
    onError: (error) => toast.error(error.message),
  });

  const deletePresetMutation = useMutation({
    mutationFn: (presetId: string) =>
      deleteConversionPreset({
        data: { workspaceId: workspaceId ?? '', presetId },
      }),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ['conversion-presets', workspaceId],
      }),
    onError: (error) => toast.error(error.message),
  });

  const inviteMutation = useMutation({
    mutationFn: () =>
      inviteWorkspaceMember({
        data: {
          workspaceId: workspaceId ?? '',
          email: inviteEmail,
          role: inviteRole,
        },
      }),
    onSuccess: (result) => {
      setInviteEmail('');
      setInviteLink(result.inviteUrl ?? '');
      queryClient.invalidateQueries({ queryKey: workspaceQueryKey });
      toast.success(
        result.emailSent
          ? 'Invitation email sent'
          : 'Invitation created — share the link below'
      );
    },
    onError: (error) => toast.error(error.message),
  });

  const memberMutation = useMutation({
    mutationFn: async (input: {
      action: 'remove' | 'role';
      memberId: string;
      role?: 'editor' | 'reviewer';
    }) => {
      if (input.action === 'remove') {
        return removeWorkspaceMember({
          data: { workspaceId: workspaceId ?? '', memberId: input.memberId },
        });
      }
      return updateWorkspaceMemberRole({
        data: {
          workspaceId: workspaceId ?? '',
          memberId: input.memberId,
          role: input.role ?? 'editor',
        },
      });
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: workspaceQueryKey }),
    onError: (error) => toast.error(error.message),
  });

  const reviewMutation = useMutation({
    mutationFn: (input: {
      projectId: string;
      status: 'needs_review' | 'approved';
    }) =>
      reviewConversionProject({
        data: {
          workspaceId: workspaceId ?? '',
          projectId: input.projectId,
          status: input.status,
        },
      }),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ['conversion-projects', workspaceId],
      }),
    onError: (error) => toast.error(error.message),
  });

  const issueCount = useMemo(
    () =>
      results.reduce(
        (count, result) =>
          count +
          (result.status === 'success' ? result.quality.issues.length : 1),
        0
      ),
    [results]
  );

  async function processFiles() {
    if (!entitlement || !workspaceId) return;
    setIsProcessing(true);
    try {
      const inputs = await Promise.all(
        files.map(async (file) => ({
          name: file.name,
          content: await file.text(),
        }))
      );
      const nextResults = processBatchFiles({
        files: inputs,
        outputFormat,
        fileNamePattern,
        fileLimit: entitlement.batchFileLimit,
      });
      setResults(nextResults);

      if (entitlement.historyDays > 0) {
        let archiveFileId: string | null = null;
        if (storeArchive) {
          const archiveName = `subtitleops-${Date.now()}.zip`;
          const form = new FormData();
          form.append(
            'file',
            new File([createBatchZip(nextResults)], archiveName, {
              type: 'application/zip',
            })
          );
          form.append('folder', 'workflow-archives');
          form.append('description', 'SubtitleOps batch archive');
          const upload = await uploadUserFile({ data: form });
          archiveFileId = upload.metadata?.id ?? null;
        }
        await createConversionProject({
          data: {
            workspaceId,
            name: `Batch ${new Date().toLocaleString()}`,
            outputFormat,
            manifest: nextResults.map((result) => ({
              originalName: result.originalName,
              outputName: result.outputName,
              inputFormat: result.inputFormat,
              outputFormat: result.outputFormat,
              status: result.status,
              issues:
                result.status === 'success'
                  ? result.quality.issues.map((issue) => issue.message)
                  : [result.error],
            })),
            archiveFileId,
          },
        });
        await queryClient.invalidateQueries({
          queryKey: ['conversion-projects', workspaceId],
        });
      }
      toast.success(`Processed ${nextResults.length} file(s)`);
    } catch (caught) {
      if (
        caught instanceof Error &&
        caught.message.includes('supports up to')
      ) {
        trackSaasEvent('limit_reached', {
          plan_id: entitlement.planId,
          limit_type: 'batch_files',
          limit: entitlement.batchFileLimit,
        });
      }
      toast.error(
        caught instanceof Error ? caught.message : 'Conversion failed'
      );
    } finally {
      setIsProcessing(false);
    }
  }

  if (workspaceQuery.isLoading) {
    return (
      <div className="py-12 text-center text-muted-foreground">
        Loading workspace…
      </div>
    );
  }
  if (workspaceQuery.error || !overview || !entitlement) {
    return (
      <Card>
        <CardContent className="py-8 text-destructive">
          {workspaceQuery.error?.message ?? 'Unable to load the workspace.'}
        </CardContent>
      </Card>
    );
  }

  if (entitlement.planId === 'free') {
    return (
      <div className="space-y-6" data-testid="workflow-studio">
        <div className="flex flex-wrap items-center gap-3 rounded-xl border p-4">
          <Badge className="uppercase">{entitlement.planId}</Badge>
          <span className="text-sm text-muted-foreground">
            All 10 single-file tools stay free in your browser.
          </span>
        </div>
        <Card data-testid="batch-upgrade-required">
          <CardHeader>
            <CardTitle>Batch workflows start with Pro</CardTitle>
            <CardDescription>
              Upgrade for multi-file conversion, ZIP export and naming, reusable
              presets, quality checks, and private project history.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-3">
            <Link className={buttonVariants()} to={Routes.Pricing}>
              Compare Pro and Studio
            </Link>
            <Link
              className={buttonVariants({ variant: 'outline' })}
              to={Routes.Root}
            >
              Use free single-file tools
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6" data-testid="workflow-studio">
      <div className="flex flex-wrap items-center gap-3 rounded-xl border p-4">
        <Badge className="uppercase">{entitlement.planId}</Badge>
        <span className="text-sm text-muted-foreground">
          {entitlement.batchFileLimit} files per batch ·{' '}
          {entitlement.historyDays || 0}
          -day history · {entitlement.seatLimit} seat
          {entitlement.seatLimit > 1 ? 's' : ''}
        </span>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.35fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Batch converter</CardTitle>
            <CardDescription>
              Files stay in this browser. Only the project summary is saved to
              history.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="batch-files">Subtitle files</Label>
              <Input
                id="batch-files"
                type="file"
                multiple={entitlement.batchFileLimit > 1}
                accept=".srt,.ass,.ssa,.vtt,.sbv,.txt"
                onChange={(event) =>
                  setFiles(Array.from(event.target.files ?? []))
                }
              />
              <p className="text-xs text-muted-foreground">
                {files.length} selected / {entitlement.batchFileLimit} allowed
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="output-format">Output format</Label>
                <select
                  id="output-format"
                  className="h-9 w-full rounded-lg border bg-background px-3 text-sm"
                  value={outputFormat}
                  onChange={(event) =>
                    setOutputFormat(event.target.value as OutputFormat)
                  }
                >
                  <option value="srt">SRT</option>
                  <option value="vtt">VTT</option>
                  <option value="ass">ASS</option>
                  <option value="txt">TXT</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="filename-pattern">File name pattern</Label>
                <Input
                  id="filename-pattern"
                  value={fileNamePattern}
                  onChange={(event) => setFileNamePattern(event.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Use {'{name}'}, {'{ext}'}, {'{index}'}
                </p>
              </div>
            </div>
            <Button
              data-testid="process-batch"
              disabled={files.length === 0 || isProcessing}
              onClick={processFiles}
            >
              {isProcessing && <IconLoader2 className="animate-spin" />}
              Process files
            </Button>
            {entitlement.historyDays > 0 && (
              <label className="flex items-center gap-2 text-sm text-muted-foreground">
                <input
                  type="checkbox"
                  checked={storeArchive}
                  onChange={(event) => setStoreArchive(event.target.checked)}
                />
                Keep the ZIP archive in private project history
              </label>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Reusable preset</CardTitle>
            <CardDescription>
              Save the current output and naming settings.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {!entitlement.savedPresets ? (
              <p className="text-sm text-muted-foreground">
                Presets are included with Pro and Studio.
              </p>
            ) : (
              <>
                <div className="flex gap-2">
                  <Input
                    aria-label="Preset name"
                    placeholder="YouTube delivery"
                    value={presetName}
                    onChange={(event) => setPresetName(event.target.value)}
                  />
                  <Button
                    variant="outline"
                    disabled={
                      presetName.trim().length < 2 ||
                      savePresetMutation.isPending
                    }
                    onClick={() => savePresetMutation.mutate()}
                  >
                    Save
                  </Button>
                </div>
                <div className="space-y-2">
                  {(presetsQuery.data?.presets ?? []).map((preset) => (
                    <div
                      className="flex items-center gap-2 rounded-lg border p-2"
                      key={preset.id}
                    >
                      <button
                        className="min-w-0 flex-1 text-left"
                        type="button"
                        onClick={() => {
                          setOutputFormat(preset.outputFormat as OutputFormat);
                          setFileNamePattern(preset.fileNamePattern);
                        }}
                      >
                        <span className="block truncate font-medium">
                          {preset.name}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {preset.outputFormat.toUpperCase()} ·{' '}
                          {preset.fileNamePattern}
                        </span>
                      </button>
                      {preset.shared && <Badge variant="outline">Shared</Badge>}
                      <Button
                        aria-label={`Delete ${preset.name}`}
                        size="icon"
                        variant="ghost"
                        onClick={() => deletePresetMutation.mutate(preset.id)}
                      >
                        <IconTrash />
                      </Button>
                    </div>
                  ))}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {results.length > 0 && (
        <Card data-testid="batch-results">
          <CardHeader>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <CardTitle>Results</CardTitle>
                <CardDescription>
                  {issueCount} quality issue(s) found
                </CardDescription>
              </div>
              <Button
                variant="outline"
                onClick={() => downloadBatchZip(results)}
              >
                <IconDownload /> Download ZIP
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {results.map((result) => (
              <div
                className="flex items-start gap-3 rounded-lg border p-3"
                key={`${result.originalName}-${result.outputName}`}
              >
                {result.status === 'success' ? (
                  <IconCheck className="mt-0.5 size-4 text-emerald-600" />
                ) : (
                  <IconAlertTriangle className="mt-0.5 size-4 text-destructive" />
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{result.outputName}</p>
                  <p className="text-xs text-muted-foreground">
                    {result.status === 'success'
                      ? `${result.quality.cueCount} cues · ${result.quality.errorCount} errors · ${result.quality.warningCount} warnings`
                      : result.error}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {entitlement.historyDays > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Project history</CardTitle>
            <CardDescription>
              Stored for {entitlement.historyDays} days.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {(projectsQuery.data?.projects ?? []).length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Your completed batches will appear here.
              </p>
            ) : (
              (projectsQuery.data?.projects ?? []).map((project) => (
                <div
                  className="flex flex-wrap items-center gap-3 rounded-lg border p-3"
                  key={project.id}
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">{project.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {project.fileCount} files · {project.issueCount} issues
                    </p>
                  </div>
                  <Badge variant="outline">
                    {project.status.replace('_', ' ')}
                  </Badge>
                  {project.archiveUrl && (
                    <a
                      className="text-sm font-medium underline"
                      href={project.archiveUrl}
                    >
                      Download archive
                    </a>
                  )}
                  {entitlement.reviewWorkflow &&
                    overview.member.role !== 'editor' &&
                    project.status !== 'approved' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          reviewMutation.mutate({
                            projectId: project.id,
                            status: 'approved',
                          })
                        }
                      >
                        Approve
                      </Button>
                    )}
                </div>
              ))
            )}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IconUsers /> Team workspace
          </CardTitle>
          <CardDescription>
            Studio includes three total seats with owner, editor, and reviewer
            roles.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!entitlement.sharedWorkspace ? (
            <div className="flex items-center justify-between gap-4 rounded-lg border border-dashed p-4">
              <p className="text-sm text-muted-foreground">
                Upgrade to Studio to invite two teammates.
              </p>
              <Link
                className="text-sm font-medium underline"
                to={Routes.Pricing}
              >
                View Studio
              </Link>
            </div>
          ) : (
            <>
              <div className="grid gap-2 sm:grid-cols-[1fr_160px_auto]">
                <Input
                  aria-label="Team member email"
                  type="email"
                  placeholder="teammate@example.com"
                  value={inviteEmail}
                  onChange={(event) => setInviteEmail(event.target.value)}
                />
                <select
                  aria-label="Team member role"
                  className="h-9 rounded-lg border bg-background px-3 text-sm"
                  value={inviteRole}
                  onChange={(event) =>
                    setInviteRole(event.target.value as 'editor' | 'reviewer')
                  }
                >
                  <option value="editor">Editor</option>
                  <option value="reviewer">Reviewer</option>
                </select>
                <Button
                  disabled={
                    !inviteEmail ||
                    inviteMutation.isPending ||
                    overview.members.length >= entitlement.seatLimit
                  }
                  onClick={() => inviteMutation.mutate()}
                >
                  Invite
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                {overview.members.length} of {entitlement.seatLimit} seats used
              </p>
              {inviteLink && (
                <div className="space-y-2 rounded-lg border border-blue-200 bg-blue-50 p-3 text-blue-950">
                  <p className="text-sm font-medium">
                    Share this private invitation link
                  </p>
                  <div className="flex gap-2">
                    <Input
                      aria-label="Invitation link"
                      readOnly
                      value={inviteLink}
                    />
                    <Button
                      variant="outline"
                      onClick={async () => {
                        await navigator.clipboard.writeText(inviteLink);
                        toast.success('Invitation link copied');
                      }}
                    >
                      Copy
                    </Button>
                  </div>
                </div>
              )}
              <div className="space-y-2">
                {overview.members.map((member) => (
                  <div
                    className="flex flex-wrap items-center gap-3 rounded-lg border p-3"
                    key={member.id}
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium">{member.email}</p>
                      <p className="text-xs text-muted-foreground">
                        {member.status}
                      </p>
                    </div>
                    {member.role === 'owner' ? (
                      <Badge>Owner</Badge>
                    ) : (
                      <>
                        <select
                          aria-label={`Role for ${member.email}`}
                          className="h-8 rounded-lg border bg-background px-2 text-sm"
                          value={member.role}
                          onChange={(event) =>
                            memberMutation.mutate({
                              action: 'role',
                              memberId: member.id,
                              role: event.target.value as 'editor' | 'reviewer',
                            })
                          }
                        >
                          <option value="editor">Editor</option>
                          <option value="reviewer">Reviewer</option>
                        </select>
                        <Button
                          aria-label={`Remove ${member.email}`}
                          size="icon"
                          variant="ghost"
                          onClick={() =>
                            memberMutation.mutate({
                              action: 'remove',
                              memberId: member.id,
                            })
                          }
                        >
                          <IconTrash />
                        </Button>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
