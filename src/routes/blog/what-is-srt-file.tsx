import { createFileRoute } from '@tanstack/react-router';
import Page, { metadata } from '@/subtitleops/pages/blog/what-is-srt-file/page';
import { legacyHead } from '@/lib/legacy-metadata';

export const Route = createFileRoute('/blog/what-is-srt-file')({
  head: () => legacyHead(metadata, '/blog/what-is-srt-file'),
  component: Page,
});
