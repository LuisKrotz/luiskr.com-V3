import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'
import { compression } from 'vite-plugin-compression2'
import { fileURLToPath, URL } from 'node:url'
import { constants as zlibConstants } from 'node:zlib'
import { cssManglePlugin } from './plugins/vite-plugin-css-mangle.js'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    cssManglePlugin(),
    compression({
      algorithm: 'brotliCompress',
      exclude: [/\.(br|gz)$/i],
      compressionOptions: {
        params: {
          [zlibConstants.BROTLI_PARAM_QUALITY]: 11,
        },
      },
    }),
    compression({
      algorithm: 'gzip',
      exclude: [/\.(br|gz)$/i],
      compressionOptions: {
        level: 9,
      },
    }),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'script-defer',
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
        cleanupOutdatedCaches: true,
        skipWaiting: true,
        clientsClaim: true,
      },
    }),
    {
      name: 'vite-plugin-jsx-in-js',
      enforce: 'pre',
      async transform(code, id) {
        if (id.includes('/src/') && id.endsWith('.js') && (code.includes('</') || code.includes('/>'))) {
          const { transformWithOxc } = await import('vite')
          const res = await transformWithOxc(code, id.replace(/\.js$/, '.jsx'), {
            jsx: { runtime: 'classic', pragma: 'h', pragmaFrag: 'Fragment' },
          })
          return {
            code: res.code,
            map: res.map,
          }
        }
      },
    },
    {
      name: 'inline-critical-css',
      enforce: 'post',
      apply: 'build',
      transformIndexHtml: {
        order: 'post',
        handler(html, ctx) {
          if (!ctx || !ctx.bundle) return html
          let newHtml = html
          for (const [fileName, file] of Object.entries(ctx.bundle)) {
            if (fileName.endsWith('.css') && fileName.startsWith('assets/index-')) {
              const css = file.source ? file.source.toString() : ''
              if (css) {
                // Remove render-blocking stylesheet link
                newHtml = newHtml.replace(new RegExp(`<link rel="stylesheet"[^>]*href="[/]${fileName}"[^>]*>`, 'i'), '')
                // Inject as inline <style> in <head> for zero-latency instant render
                newHtml = newHtml.replace('</head>', `<style id="critical-css">${css}</style></head>`)
              }
            }
          }
          return newHtml
        },
      },
    },
  ],
  esbuild: {
    jsxFactory: 'h',
    jsxFragment: 'Fragment',
    loader: 'jsx',
    include: /src\/.*\.jsx?$/,
    legalComments: 'none',
    treeShaking: true,
  },
  optimizeDeps: {
    noDiscovery: true,
    include: ['firebase/app', 'firebase/auth', 'firebase/database', 'register-service-worker'],
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@core': fileURLToPath(new URL('./src/core', import.meta.url)),
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
    // errorRecovery: preserve rules with unknown pseudo-classes like :host-context()
    // instead of silently dropping them during minification.
    lightningcss: {
      errorRecovery: true,
    },
  },
  build: {
    outDir: 'dist',
    target: 'esnext',
    cssTarget: 'chrome120',
    sourcemap: true,
    cssCodeSplit: true,
    cssMinify: 'lightningcss',
    modulePreload: {
      polyfill: true,
    },
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (
            id.includes('/src/components/cms/') ||
            id.includes('/src/views/Cms') ||
            id.includes('/src/views/AdminLogin') ||
            id.includes('/src/core/cms/')
          ) {
            return 'cms-bundle'
          }
          if (id.includes('node_modules')) {
            if (id.includes('firebase')) {
              return 'vendor-firebase'
            }
          }
        },
      },
    },
  },
})
