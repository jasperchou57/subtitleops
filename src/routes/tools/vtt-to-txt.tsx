import { createFileRoute } from '@tanstack/react-router';
import Page, { metadata } from '@/subtitleops/pages/tools/vtt-to-txt/page';
import { legacyHead } from '@/lib/legacy-metadata';

export const Route = createFileRoute('/tools/vtt-to-txt')({
  head: () => legacyHead(metadata, '/tools/vtt-to-txt'),
  component: Page,
});
