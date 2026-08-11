import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'
import { fileURLToPath, URL } from 'node:url'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    VitePWA({
      registerType: 'autoUpdate',
      filename: 'service-worker.js',
      manifestFilename: 'site.webmanifest',
      includeAssets: ['favicon.svg', 'favicon.ico', 'apple-touch-icon.png'],
      // Disable the service worker in dev — it intercepts HMR requests and
      // serves stale cached responses, breaking hot reload entirely.
      devOptions: {
        enabled: false,
      },
      manifest: {
        name: 'Luis Krötz',
        short_name: 'Luis Krötz',
        start_url: '/',
        display: 'fullscreen',
        theme_color: '#262626',
        background_color: '#FFF',
        icons: [
          {
            src: 'favicon.svg',
            sizes: '512x512',
            type: 'image/svg+xml',
            purpose: 'any maskable',
          },
          {
            src: 'android-chrome-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'android-chrome-256x256.png',
            sizes: '256x256',
            type: 'image/png',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        navigateFallback: 'index.html',
        navigateFallbackDenylist: [/\.htaccess/, /urllist\.txt/],
      },
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        // The project uses the legacy @import system.
        // Silence deprecation warnings until a full @use/@forward migration is done.
        silenceDeprecations: ['import', 'global-builtin', 'legacy-js-api'],
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
})
