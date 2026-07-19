import { createFileRoute } from '@tanstack/react-router';
import Page, { metadata } from '@/subtitleops/pages/tools/srt-to-vtt/page';
import { legacyHead } from '@/lib/legacy-metadata';

export const Route = createFileRoute('/tools/srt-to-vtt')({
  head: () => legacyHead(metadata, '/tools/srt-to-vtt'),
  component: Page,
});
