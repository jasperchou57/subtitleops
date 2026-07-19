import { createFileRoute } from '@tanstack/react-router';
import ToolsPage, { metadata } from '@/subtitleops/pages/tools/page';
import { legacyHead } from '@/lib/legacy-metadata';

export const Route = createFileRoute('/tools/')({
  head: () => legacyHead(metadata, '/tools'),
  component: ToolsPage,
});
