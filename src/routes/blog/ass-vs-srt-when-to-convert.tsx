import { createFileRoute } from '@tanstack/react-router';
import Page, {
  metadata,
} from '@/subtitleops/pages/blog/ass-vs-srt-when-to-convert/page';
import { legacyHead } from '@/lib/legacy-metadata';

export const Route = createFileRoute('/blog/ass-vs-srt-when-to-convert')({
  head: () => legacyHead(metadata, '/blog/ass-vs-srt-when-to-convert'),
  component: Page,
});
