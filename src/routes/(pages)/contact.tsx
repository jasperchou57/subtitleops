import { createFileRoute } from '@tanstack/react-router';
import ContactPage, { metadata } from '@/subtitleops/pages/contact/page';
import { legacyHead } from '@/lib/legacy-metadata';

export const Route = createFileRoute('/(pages)/contact')({
  head: () => legacyHead(metadata, '/contact'),
  component: ContactPage,
});
