// @ts-check
import { defineConfig, fontProviders } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://lifesoddity.com',
  trailingSlash: 'ignore',
  build: { format: 'directory' },
  // The three faces of the magazine, downloaded at build time and served from this site.
  fonts: [
    {
      provider: fontProviders.google(),
      name: 'League Gothic',
      cssVariable: '--font-gothic',
      weights: [400],
      styles: ['normal'],
      subsets: ['latin'],
      fallbacks: ['Arial Narrow', 'sans-serif'],
    },
    {
      provider: fontProviders.google(),
      name: 'Libre Franklin',
      cssVariable: '--font-sans',
      weights: ['400 900'],
      styles: ['normal', 'italic'],
      subsets: ['latin'],
      fallbacks: ['Helvetica Neue', 'Arial', 'sans-serif'],
    },
    {
      provider: fontProviders.google(),
      name: 'Mr Dafoe',
      cssVariable: '--font-script',
      weights: [400],
      styles: ['normal'],
      subsets: ['latin'],
      fallbacks: ['cursive'],
    },
  ],
});
