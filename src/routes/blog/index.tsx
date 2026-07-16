import { createFileRoute } from '@tanstack/react-router';
import BlogPage, { metadata } from '@/subtitleops/pages/blog/page';
import { legacyHead } from '@/lib/legacy-metadata';

export const Route = createFileRoute('/blog/')({
  head: () => legacyHead(metadata, '/blog'),
  component: BlogPage,
});
