import { createFileRoute } from '@tanstack/react-router';
import Page, { metadata } from '@/subtitleops/pages/tools/srt-to-txt/page';
import { legacyHead } from '@/lib/legacy-metadata';

export const Route = createFileRoute('/tools/srt-to-txt')({
  head: () => legacyHead(metadata, '/tools/srt-to-txt'),
  component: Page,
});
