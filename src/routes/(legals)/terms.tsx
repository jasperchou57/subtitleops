import { createFileRoute } from '@tanstack/react-router';
import TermsPage, { metadata } from '@/subtitleops/pages/terms/page';
import { legacyHead } from '@/lib/legacy-metadata';

export const Route = createFileRoute('/(legals)/terms')({
  head: () => legacyHead(metadata, '/terms'),
  component: TermsPage,
});
