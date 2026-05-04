import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import CONFIG from './gitprofile.config';

const googleAnalyticsScript = CONFIG.googleAnalytics.id
  ? `<!-- Global site tag (gtag.js) - Google Analytics -->\n<script async src="https://www.googletagmanager.com/gtag/js?id=${CONFIG.googleAnalytics.id}"></script>\n<script>\n  window.dataLayer = window.dataLayer || [];\n  function gtag(){dataLayer.push(arguments);}\n  gtag('js', new Date());\n  gtag('config', '${CONFIG.googleAnalytics.id}');\n</script>`
  : '';

// https://vitejs.dev/config/
export default defineConfig({
  base: CONFIG.base || '/',
  plugins: [
    react(),
    {
      name: 'html-transform',
      transformIndexHtml(html) {
        return html
          .replace(/<%- metaTitle %>/g, CONFIG.seo.title)
          .replace(/<%- metaDescription %>/g, CONFIG.seo.description)
          .replace(/<%- metaImageURL %>/g, CONFIG.seo.imageURL)
          .replace(/<%- googleAnalyticsScript %>/g, googleAnalyticsScript);
      },
    },
    ...(CONFIG.enablePWA
      ? [
          VitePWA({
            registerType: 'autoUpdate',
            workbox: {
              navigateFallback: undefined,
            },
            includeAssets: ['logo.png'],
            manifest: {
              name: 'Portfolio',
              short_name: 'Portfolio',
              description: 'Personal Portfolio',
              icons: [
                {
                  src: 'logo.png',
                  sizes: '64x64 32x32 24x24 16x16 192x192 512x512',
                  type: 'image/png',
                },
              ],
            },
          }),
        ]
      : []),
  ],
  define: {
    CONFIG: CONFIG,
  },
});
