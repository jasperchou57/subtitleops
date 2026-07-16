import { createFileRoute } from '@tanstack/react-router';
import Page, {
  metadata,
} from '@/subtitleops/pages/blog/srt-vs-vtt-which-subtitle-format/page';
import { legacyHead } from '@/lib/legacy-metadata';

export const Route = createFileRoute('/blog/srt-vs-vtt-which-subtitle-format')({
  head: () => legacyHead(metadata, '/blog/srt-vs-vtt-which-subtitle-format'),
  component: Page,
});
