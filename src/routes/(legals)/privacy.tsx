import { createFileRoute } from '@tanstack/react-router';
import PrivacyPage, { metadata } from '@/subtitleops/pages/privacy/page';
import { legacyHead } from '@/lib/legacy-metadata';

export const Route = createFileRoute('/(legals)/privacy')({
  head: () => legacyHead(metadata, '/privacy'),
  component: PrivacyPage,
});
