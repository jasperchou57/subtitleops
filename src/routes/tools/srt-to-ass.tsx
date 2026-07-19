import { createFileRoute } from '@tanstack/react-router';
import Page, { metadata } from '@/subtitleops/pages/tools/srt-to-ass/page';
import { legacyHead } from '@/lib/legacy-metadata';

export const Route = createFileRoute('/tools/srt-to-ass')({
  head: () => legacyHead(metadata, '/tools/srt-to-ass'),
  component: Page,
});
