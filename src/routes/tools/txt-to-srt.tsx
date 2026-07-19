import { createFileRoute } from '@tanstack/react-router';
import Page, { metadata } from '@/subtitleops/pages/tools/txt-to-srt/page';
import { legacyHead } from '@/lib/legacy-metadata';

export const Route = createFileRoute('/tools/txt-to-srt')({
  head: () => legacyHead(metadata, '/tools/txt-to-srt'),
  component: Page,
});
