import { createFileRoute } from '@tanstack/react-router';
import AboutPage, { metadata } from '@/subtitleops/pages/about/page';
import { legacyHead } from '@/lib/legacy-metadata';

export const Route = createFileRoute('/(pages)/about')({
  head: () => legacyHead(metadata, '/about'),
  component: AboutPage,
});
