/**
 * @file vite.config.js
 * @description Multi-target build matrix driver.
 *
 * scripts/build-targets.mjs runs `vite build` once per tier in
 * build/es-targets.mjs, passing LK_TARGET=<name>. Each build emits its
 * bundle + CSS into dist/v/<tier>/assets/; the inline loader in
 * dist/index.html then feature-detects and serves the newest tier the
 * visitor's engine supports.
 *
 * Tier differences:
 *   - default (es2026): html inputs, PWA/service-worker, modulepreload
 *     polyfill, zero CSS prefixes.
 *   - other module tiers: JS+CSS assets only (no html, no PWA), CSS
 *     prefixed for that tier's browser floor.
 *   - es2016 (legacy): single self-contained IIFE classic script — no
 *     module/import() needed, i18n bootstrap chunks inlined-stubbed so the
 *     data layer falls back to REST+localStorage.
 */
import { defineConfig, createLogger } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'
import { compression } from 'vite-plugin-compression2'
import { fileURLToPath, URL } from 'node:url'
import { constants as zlibConstants } from 'node:zlib'
import { minify as htmlMinify } from 'html-minifier-terser'
import path from 'node:path'
import { mediaConvertPlugin } from './shared/scripts/media-convert/index.js'
import { ES_TARGETS } from './shared/build/es-targets.mjs'
import { modulePublicPlugin } from './shared/build/module-public.mjs'
import { docsPortalPlugin } from './shared/build/docs-portal.mjs'
import { i18nBootPlugin, i18nFallbackPlugin } from './shared/build/i18n-virtual.mjs'
import { jsxInJsPlugin, SHARED_ESBUILD } from './shared/build/jsx-in-js.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig(() => {
  // Active tier — default when invoked directly (`vite build` without the
  // orchestrator still produces a working modern build).
  const t = ES_TARGETS.find((x) => x.name === process.env.LK_TARGET) || ES_TARGETS[0]
  const isDefault = t.name === 'es2026'
  const isLegacy = !!t.legacy

  const nameCache = {}

  // lightningcss's selector parser doesn't know :host-context() yet — the
  // emitted CSS is byte-identical correct (verified: rules pass through
  // untouched), so the "not recognized" notice is pure log noise. Filter
  // exactly that pattern; every other warning keeps surfacing.
  const customLogger = createLogger()
  const warn = customLogger.warn

  customLogger.warn = (msg, opts) => {
    if (typeof msg === 'string' && msg.includes('host-context') && msg.includes('pseudo-class'))
      return

    warn(msg, opts)
  }

  const terserCompress = {
    passes: 100,
    drop_console: true,
    drop_debugger: true,
    pure_funcs: [
      'console.log',
      'console.info',
      'console.debug',
      'console.warn',
      'console.error',
      'console.table',
      'console.time',
      'console.timeEnd',
      'console.group',
      'console.groupCollapsed',
      'console.groupEnd',
    ],
    dead_code: true,
    toplevel: true,
    hoist_funs: true,
    hoist_vars: true,
    keep_fargs: false,
    pure_getters: true,
    collapse_vars: true,
    reduce_vars: true,
    inline: 3,
    evaluate: false,
    reduce_funcs: true,
    booleans: true,
    comparisons: true,
    conditionals: true,
    loops: true,
    sequences: true,
    unused: true,
    side_effects: true,
    keep_infinity: true,
  }

  const terserMangle = {
    toplevel: true,
    // Protect browser DOM globals from being mangled — they are not bundled
    // variables but runtime-provided constructors/interfaces.
    reserved: [
      'Node',
      'Element',
      'HTMLElement',
      'Document',
      'DOMParser',
      'CustomEvent',
      'Event',
      'MutationObserver',
      'IntersectionObserver',
      'ResizeObserver',
      'AbortController',
      'URL',
      'URLSearchParams',
      'WebSocket',
      'Worker',
      'MessageChannel',
      'MessagePort',
      'Performance',
      'Request',
      'Response',
      'Headers',
      'Cache',
      'CacheStorage',
    ],
    properties: {
      // Matches single words ('CLASS', 'ID', 'PX') and snake_case ('RENDER_MEDIA_THUMB')
      // Case-sensitive, no lowercase allowed
      regex: /^[A-Z0-9_]+$/,

      // Allows mangling properties exported or imported across modules/chunks
      undeclared: true,

      // Ensures obj['CLASS'] and obj.CLASS both mangle to the same token
      keep_quoted: false,

      // Protect WebGL / WebGLRenderingContext enum constants — these are
      // runtime-provided numeric properties on the GL context, not bundled
      // code. Mangling them corrupts texture format, filter, and draw calls.
      reserved: [
        // WebGL enums used in gpu-accel.js, flag-webgl.js, checkbox-webgl.js, earth-background.js
        'ARRAY_BUFFER',
        'STATIC_DRAW',
        'FLOAT',
        'UNSIGNED_BYTE',
        'VERTEX_SHADER',
        'FRAGMENT_SHADER',
        'COMPILE_STATUS',
        'LINK_STATUS',
        'TEXTURE_2D',
        'TEXTURE0',
        'TEXTURE1',
        'TEXTURE_MIN_FILTER',
        'TEXTURE_MAG_FILTER',
        'TEXTURE_WRAP_S',
        'TEXTURE_WRAP_T',
        'LINEAR',
        'LINEAR_MIPMAP_LINEAR',
        'CLAMP_TO_EDGE',
        'RGBA',
        'COLOR_BUFFER_BIT',
        'TRIANGLES',
        'TRIANGLE_STRIP',
        'BLEND',
        'SRC_ALPHA',
        'ONE',
        'ONE_MINUS_SRC_ALPHA',
        // skeleton-webgl.js / flag-webgl.js shared renderers
        'SCISSOR_TEST',
        'UNMASKED_RENDERER_WEBGL',
        'UNMASKED_VENDOR_WEBGL',
        // Three.js runtime constants
        'LOD',
        'MOUSE',
        'PAN',
        'RIGHT',
        // database.json keys looked up by runtime string paths
        // (utils/db.js cur[seg], FALLBACK_PAGES[TRANSLATION_KEYS.*])
        'APP',
        'HOME',
        'GDPR',
      ],
    },
  }

  const terserFormat = {
    comments: false,
    ascii_only: true,
    wrap_func_args: false,
  }

  // Dev-only offline CMS mode (`CMS_MOCK=1 npm run dev`): swaps real Firebase
  // SDK calls for the committed database.json snapshot (see
  // cms/dev/firebase-mock.js). Never active in production builds.
  const cmsMockPlugin = {
    name: 'cms-firebase-mock',
    enforce: 'pre',
    resolveId(source) {
      if (!process.env.CMS_MOCK) return null
      if (/(^|\/)firebase\.js$/.test(source)) {
        return fileURLToPath(new URL('./cms/dev/firebase-mock.ts', import.meta.url))
      }
      return null
    },
    // The CMS entry is cms/index.html — a bare `/cms` request otherwise
    // resolves to the module barrel (cms/index.ts), and a bare rewrite
    // would break the relative `./main.ts` script path, so redirect to
    // the canonical trailing-slash URL.
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url === '/cms') {
          res.writeHead(301, { Location: '/cms/' })
          res.end()
          return
        }
        next()
      })
    },
  }

  const plugins = [
    cmsMockPlugin,
    ...(process.env.LK_NO_PUBLIC ? [] : [modulePublicPlugin()]),
    i18nFallbackPlugin({ root: __dirname }),
    i18nBootPlugin({ root: __dirname, isLegacy }),
    docsPortalPlugin({ root: __dirname, emitAssets: isDefault }),
    mediaConvertPlugin(),
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
    jsxInJsPlugin(),
  ]

  // PWA + html post-processing only on the default tier — service workers
  // don't exist on legacy engines, and non-default builds emit no html.
  if (isDefault) {
    plugins.push(
      VitePWA({
        registerType: 'autoUpdate',
        injectRegister: 'script-defer',
        filename: 'service-worker.js',
        manifestFilename: 'site.webmanifest',
        includeAssets: [
          'assets/icons/favicon.svg',
          'favicon.ico',
          'assets/icons/apple-touch-icon.png',
        ],
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
              src: '/assets/icons/favicon.svg',
              sizes: '512x512',
              type: 'image/svg+xml',
              purpose: 'any maskable',
            },
            {
              src: '/assets/icons/android-chrome-192x192.png',
              sizes: '192x192',
              type: 'image/png',
            },
            {
              src: '/assets/icons/android-chrome-256x256.png',
              sizes: '256x256',
              type: 'image/png',
            },
          ],
        },
        workbox: {
          // Precache only the default tier — the other 11 bundles exist for
          // engines that don't support service workers anyway.
          globPatterns: [
            'index.html',
            'v/es2026/**/*.{js,css}',
            '*.{ico,png,svg,webmanifest,txt,xml}',
          ],
          globIgnores: ['**/cms-*', '**/cms.*', '**/Cms*', '**/Admin*', '**/vendor-firebase*'],
          navigateFallback: 'index.html',
          navigateFallbackDenylist: [/\.htaccess/, /urllist\.txt/, /\/v\//, /\/cms/],
          cleanupOutdatedCaches: true,
          skipWaiting: true,
          clientsClaim: true,
        },
      }),
      {
        name: 'lazyload-index-css',
        enforce: 'post',
        apply: 'build',
        transformIndexHtml: {
          order: 'post',
          async handler(html, ctx) {
            let newHtml = html
            if (ctx && ctx.bundle) {
              for (const [fileName] of Object.entries(ctx.bundle)) {
                if (fileName.endsWith('.css') && fileName.includes('assets/css/index-')) {
                  const linkRegex = new RegExp(
                    `<link rel="stylesheet"[^>]*href="[/]${fileName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"[^>]*>`,
                    'i'
                  )
                  const lazyLink = `<link rel="preload" as="style" href="/${fileName}" onload="this.onload=null;this.rel='stylesheet'"><noscript><link rel="stylesheet" href="/${fileName}"></noscript>`
                  newHtml = newHtml.replace(linkRegex, lazyLink)
                }
              }
            }
            return await htmlMinify(newHtml, {
              collapseWhitespace: true,
              removeComments: true,
              minifyCSS: true,
              minifyJS: true,
              removeRedundantAttributes: true,
              useShortDoctype: true,
              removeEmptyAttributes: true,
            })
          },
        },
      }
    )
  }

  // Asset naming: every tier lands under dist/v/<tier>/assets/ so the loader
  // map is uniform and the immutable-cache rule covers all versioned files.
  const assetBase = `v/${t.name}/assets`

  const build = {
    outDir: 'dist',
    emptyOutDir: process.env.LK_EMPTY_OUTDIR !== '0',
    // website/public stays the native publicDir (served by vite's own
    // handlers in dev); modulePublicPlugin merges the remaining module
    // public mounts (core payloads, experiment assets) into dist/dev.
    publicDir: process.env.LK_NO_PUBLIC ? false : 'website/public',
    target: t.viteTarget,
    cssTarget: t.cssTarget,
    sourcemap: true,
    cssCodeSplit: true,
    cssMinify: 'lightningcss',
    minify: 'terser',
    manifest: `v/${t.name}/.manifest.json`,
    terserOptions: {
      nameCache,
      ecma: t.terserEcma,
      compress: terserCompress,
      mangle: terserMangle,
      format: terserFormat,
    },
    modulePreload: isDefault ? { polyfill: true } : false,
    // Budget per tier: module tiers' largest chunk is the lazy-loaded three.js
    // vendor (~610kB); the legacy IIFE inlines the whole app (~2.1MB) by design.
    chunkSizeWarningLimit: isLegacy ? 2200 : 700,
    rollupOptions: {
      checks: {
        // Terser dominating build time is the chosen minification strategy,
        // not a defect — silence the plugin-timing diagnostic.
        pluginTimings: false,
        // Legacy IIFE intentionally replaces import.meta with {} — rolldown's
        // EMPTY_IMPORT_META notice is expected, not actionable.
        ...(isLegacy ? { emptyImportMeta: false } : {}),
      },
      input: isLegacy
        ? { index: fileURLToPath(new URL('./shared/src/main.js', import.meta.url)) }
        : isDefault
          ? {
              index: fileURLToPath(new URL('./index.html', import.meta.url)),
              cms: fileURLToPath(new URL('./cms/index.html', import.meta.url)),
            }
          : { index: fileURLToPath(new URL('./shared/src/main.js', import.meta.url)) },
      output: {
        // Per-tier assets grouped by kind — js/ holds entry + lazy chunks,
        // css/ holds per-tier prefixed stylesheets, misc/ holds any other
        // emitted binaries (fonts, wasm). .br/.gz siblings stay adjacent so
        // the static host's precompressed-file serving keeps working.
        entryFileNames: `${assetBase}/js/[name]-[hash].js`,
        chunkFileNames: `${assetBase}/js/[name]-[hash].js`,
        assetFileNames: (info) =>
          `${assetBase}/${info.name && info.name.endsWith('.css') ? 'css' : 'misc'}/[name]-[hash].[ext]`,
        // Legacy tier: one self-contained classic script — no imports at all.
        // codeSplitting is already off for iife, so inlineDynamicImports would
        // be redundant (rolldown flags it as ignored).
        ...(isLegacy ? { format: 'iife' } : {}),
        manualChunks: isLegacy
          ? undefined
          : (id) => {
              if (id.includes('node_modules')) {
                if (id.includes('firebase')) {
                  return 'vendor-firebase'
                }
              }
            },
      },
    },
  }

  return {
    customLogger,
    plugins,
    esbuild: { ...SHARED_ESBUILD },
    optimizeDeps: {
      noDiscovery: true,
      include: [
        'firebase/app',
        'firebase/auth',
        // Dev-only offline CMS mode: `firebase/database` resolves to the mock
        // via resolve.alias — it must not be pre-bundled.
        ...(process.env.CMS_MOCK ? [] : ['firebase/database']),
        'register-service-worker',
        'mermaid',
        'three',
        'three/webgpu',
        'three/tsl',
        'three/examples/jsm/controls/OrbitControls.js',
        'three/examples/jsm/tsl/display/BloomNode.js',
        'three/examples/jsm/tsl/display/SMAANode.js',
        'three/examples/jsm/tsl/display/ChromaticAberrationNode.js',
        'three/examples/jsm/tsl/display/FilmNode.js',
      ],
    },
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./shared/src', import.meta.url)),
        '@core': fileURLToPath(new URL('./core', import.meta.url)),
        '@website': fileURLToPath(new URL('./website', import.meta.url)),
        '@cms': fileURLToPath(new URL('./cms', import.meta.url)),
        '@earth': fileURLToPath(new URL('./experiments/earth-playground', import.meta.url)),
        '@docs': fileURLToPath(new URL('./experiments/docs', import.meta.url)),
        // Dev-only offline CMS mode (`CMS_MOCK=1 npm run dev`): the bare
        // `firebase/database` specifier is pre-bundled by optimizeDeps, so it
        // must be intercepted via resolve.alias rather than the plugin hook.
        ...(process.env.CMS_MOCK
          ? {
              'firebase/database': fileURLToPath(
                new URL('./cms/dev/firebase-mock.ts', import.meta.url)
              ),
            }
          : {}),
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          silenceDeprecations: ['import', 'global-builtin', 'legacy-js-api'],
        },
      },
      lightningcss: {
        errorRecovery: true,
      },
    },
    build,
  }
})
