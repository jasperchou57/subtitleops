import { defineConfig } from 'vite';
import { devtools } from '@tanstack/devtools-vite';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import viteReact from '@vitejs/plugin-react';
import viteTsConfigPaths from 'vite-tsconfig-paths';
import { fileURLToPath, URL } from 'url';
import tailwindcss from '@tailwindcss/vite';
import { cloudflare } from '@cloudflare/vite-plugin';
import { paraglideVitePlugin } from '@inlang/paraglide-js';

const publicPages = [
  '/',
  '/tools',
  '/pricing',
  '/tools/ass-to-srt',
  '/tools/vtt-to-srt',
  '/tools/txt-to-srt',
  '/tools/srt-to-vtt',
  '/tools/srt-to-txt',
  '/tools/sbv-to-srt',
  '/tools/srt-to-ass',
  '/tools/vtt-to-txt',
  '/tools/subtitle-shift',
  '/tools/subtitle-fps-converter',
  '/blog',
  '/blog/how-to-fix-subtitle-delay-online',
  '/blog/what-is-ass-subtitle-file',
  '/blog/what-is-vtt-file',
  '/blog/what-is-srt-file',
  '/blog/ass-vs-srt-when-to-convert',
  '/blog/srt-vs-vtt-which-subtitle-format',
  '/about',
  '/privacy',
  '/terms',
  '/contact',
];

/**
 * Vite configuration
 * https://vite.dev/config/
 */
const config = defineConfig({
  server: {
    allowedHosts: ['.trycloudflare.com', '.subtitleops.com'],
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  plugins: [
    devtools({
      eventBusConfig: {
        port: 0,
      },
    }),
    tailwindcss(),
    paraglideVitePlugin({
      project: './project.inlang',
      outdir: './src/locale/paraglide',
      strategy: ['cookie', 'baseLocale'],
      routeStrategies: [
        { match: '/api/:path(.*)?', exclude: true },
        { match: '/robots.txt', exclude: true },
        { match: '/sitemap.xml', exclude: true },
        { match: '/manifest.json', exclude: true },
      ],
      emitTsDeclarations: true,
      isServer: 'import.meta.env?.SSR === true',
    }),
    // this is the plugin that enables path aliases
    viteTsConfigPaths({
      projects: ['./tsconfig.json'],
    }),
    // https://tanstack.dev/start/latest/docs/framework/react/build-from-scratch
    tanstackStart({
      srcDirectory: 'src',
      start: { entry: './start.tsx' },
      server: { entry: './server.ts' },
      prerender: {
        enabled: true,
        autoStaticPathsDiscovery: false,
        crawlLinks: false,
        failOnError: true,
      },
      pages: publicPages.map((path) => ({
        path,
        prerender: { enabled: true },
      })),
    }),
    // react's vite plugin must come after start's vite plugin
    viteReact(),
    // https://developers.cloudflare.com/workers/vite-plugin/
    cloudflare({
      viteEnvironment: {
        name: 'ssr',
      },
    }),
  ],
});

export default config;
