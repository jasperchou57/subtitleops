import { createFileRoute } from '@tanstack/react-router';
import { legacyHead } from '@/lib/legacy-metadata';
import CookiePolicyPage, { metadata } from '@/subtitleops/pages/cookie/page';

export const Route = createFileRoute('/(legals)/cookie')({
  head: () => legacyHead(metadata, '/cookie'),
  component: CookiePolicyPage,
});
