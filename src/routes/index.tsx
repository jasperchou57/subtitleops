import { createFileRoute } from '@tanstack/react-router';
import HomePage from '@/subtitleops/pages/home';
import { legacyHead } from '@/lib/legacy-metadata';

export const Route = createFileRoute('/')({
  head: () =>
    legacyHead(
      {
        title: 'Subtitle Converter for Real Workflows',
        description:
          'Convert SRT, VTT, ASS, TXT, and SBV files with a subtitle converter built for clear results, format changes, and repeat workflows.',
        keywords: [
          'subtitle converter',
          'subtitle tools',
          'free subtitle converter',
          'srt converter',
          'subtitle timing',
        ],
        alternates: { canonical: '/' },
        openGraph: { url: '/' },
      },
      '/'
    ),
  component: HomePage,
});
