import { createFileRoute } from '@tanstack/react-router';
import Page, { metadata } from '@/subtitleops/pages/tools/vtt-to-srt/page';
import { legacyHead } from '@/lib/legacy-metadata';

export const Route = createFileRoute('/tools/vtt-to-srt')({
  head: () => legacyHead(metadata, '/tools/vtt-to-srt'),
  component: Page,
});
