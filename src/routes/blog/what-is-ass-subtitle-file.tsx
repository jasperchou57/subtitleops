import { createFileRoute } from '@tanstack/react-router';
import Page, {
  metadata,
} from '@/subtitleops/pages/blog/what-is-ass-subtitle-file/page';
import { legacyHead } from '@/lib/legacy-metadata';

export const Route = createFileRoute('/blog/what-is-ass-subtitle-file')({
  head: () => legacyHead(metadata, '/blog/what-is-ass-subtitle-file'),
  component: Page,
});
