import { createFileRoute } from '@tanstack/react-router';
import Page, { metadata } from '@/subtitleops/pages/tools/sbv-to-srt/page';
import { legacyHead } from '@/lib/legacy-metadata';

export const Route = createFileRoute('/tools/sbv-to-srt')({
  head: () => legacyHead(metadata, '/tools/sbv-to-srt'),
  component: Page,
});
