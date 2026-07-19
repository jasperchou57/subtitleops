import { createFileRoute } from '@tanstack/react-router';
import Page, { metadata } from '@/subtitleops/pages/tools/subtitle-shift/page';
import { legacyHead } from '@/lib/legacy-metadata';

export const Route = createFileRoute('/tools/subtitle-shift')({
  head: () => legacyHead(metadata, '/tools/subtitle-shift'),
  component: Page,
});
