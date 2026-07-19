import { createFileRoute } from '@tanstack/react-router';
import Page, {
  metadata,
} from '@/subtitleops/pages/blog/how-to-fix-subtitle-delay-online/page';
import { legacyHead } from '@/lib/legacy-metadata';

export const Route = createFileRoute('/blog/how-to-fix-subtitle-delay-online')({
  head: () => legacyHead(metadata, '/blog/how-to-fix-subtitle-delay-online'),
  component: Page,
});
