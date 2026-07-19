import { createFileRoute } from '@tanstack/react-router';
import Page, {
  metadata,
} from '@/subtitleops/pages/tools/subtitle-fps-converter/page';
import { legacyHead } from '@/lib/legacy-metadata';

export const Route = createFileRoute('/tools/subtitle-fps-converter')({
  head: () => legacyHead(metadata, '/tools/subtitle-fps-converter'),
  component: Page,
});
