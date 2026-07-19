import { createFileRoute } from '@tanstack/react-router';
import HomePage from '@/subtitleops/pages/home';
import { legacyHead } from '@/lib/legacy-metadata';

export const Route = createFileRoute('/')({
  head: () =>
    legacyHead(
      {
        title: 'Free Online Subtitle Converter & Tools',
        description:
          'Convert SRT, ASS, VTT, TXT, and SBV subtitles in your browser. Free tools for format conversion, text extraction, timing shift, and FPS fixes.',
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
