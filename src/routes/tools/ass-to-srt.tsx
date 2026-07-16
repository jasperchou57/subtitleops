import { createFileRoute } from '@tanstack/react-router';
import Page, { metadata } from '@/subtitleops/pages/tools/ass-to-srt/page';
import { legacyHead } from '@/lib/legacy-metadata';

export const Route = createFileRoute('/tools/ass-to-srt')({
  head: () => legacyHead(metadata, '/tools/ass-to-srt'),
  component: Page,
});
