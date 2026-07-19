import { createFileRoute } from '@tanstack/react-router';
import Page, { metadata } from '@/subtitleops/pages/blog/what-is-vtt-file/page';
import { legacyHead } from '@/lib/legacy-metadata';

export const Route = createFileRoute('/blog/what-is-vtt-file')({
  head: () => legacyHead(metadata, '/blog/what-is-vtt-file'),
  component: Page,
});
