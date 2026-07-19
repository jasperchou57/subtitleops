import { m } from '@/locale/paraglide/messages';
import { getMyEntitlement } from '@/api/entitlements';
import { ApiKeysTable } from '@/components/settings/apikeys/apikeys-table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { buttonVariants } from '@/components/ui/button';
import {
  useApiKeys,
  useCreateApiKey,
  useDeleteApiKey,
} from '@/hooks/use-apikeys';
import { toast } from 'sonner';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';
import { Routes } from '@/lib/routes';

export function ApiKeysPageContent() {
  const entitlementQuery = useQuery({
    queryKey: ['my-entitlement'],
    queryFn: () => getMyEntitlement(),
  });

  if (entitlementQuery.isLoading) {
    return (
      <div className="py-12 text-center text-muted-foreground">
        Loading plan…
      </div>
    );
  }

  if (!entitlementQuery.data?.productionApi) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Production API is a Studio feature</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Studio includes API keys and 1,000 authenticated conversion requests
            per day.
          </p>
          <Link className={buttonVariants()} to={Routes.Pricing}>
            View Studio plan
          </Link>
        </CardContent>
      </Card>
    );
  }

  return <ApiKeysManager />;
}

function ApiKeysManager() {
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const { data, isLoading } = useApiKeys(page, pageSize);
  const createMutation = useCreateApiKey();
  const deleteMutation = useDeleteApiKey();
  const handleCreate = (name: string) =>
    new Promise<
      | {
          key: string;
        }
      | undefined
    >((resolve) => {
      createMutation.mutate(
        { name },
        {
          onSuccess: (data) => {
            toast.success(m.settings_api_keys_create_success());
            resolve(data?.key ? { key: data.key } : undefined);
          },
          onError: () => {
            toast.error(m.settings_api_keys_create_error());
            resolve(undefined);
          },
        }
      );
    });
  const handleDelete = (keyId: string) => {
    deleteMutation.mutate(
      { keyId },
      {
        onSuccess: () => toast.success(m.settings_api_keys_delete_success()),
        onError: () => toast.error(m.settings_api_keys_delete_error()),
      }
    );
  };
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>API endpoint</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <code className="block rounded-lg bg-muted p-3">
            POST /api/v1/convert
          </code>
          <p className="text-muted-foreground">
            Send the key as <code>x-api-key</code> and a JSON body with content,
            filename, and outputFormat. Never expose a production key in browser
            code.
          </p>
        </CardContent>
      </Card>
      <ApiKeysTable
        data={data?.items ?? []}
        total={data?.total ?? 0}
        pageIndex={page}
        pageSize={pageSize}
        loading={isLoading}
        creating={createMutation.isPending}
        onPageChange={setPage}
        onPageSizeChange={(size) => {
          setPageSize(size);
          setPage(0);
        }}
        onDelete={handleDelete}
        onCreate={handleCreate}
      />
    </div>
  );
}
