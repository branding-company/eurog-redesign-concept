import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Deployed to GitHub Pages: https://branding-company.github.io/eurog-redesign-concept/
export default defineConfig({
  site: 'https://branding-company.github.io',
  base: '/eurog-redesign-concept',
  trailingSlash: 'always',
  build: { format: 'directory' },
  integrations: [
    sitemap({
      i18n: { defaultLocale: 'hy', locales: { hy: 'hy-AM', ru: 'ru-RU', en: 'en-US' } },
    }),
  ],
});
