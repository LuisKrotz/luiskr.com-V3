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
import fs from 'node:fs'
import path from 'node:path'
import { mediaConvertPlugin } from './scripts/media-convert/index.js'
import { ES_TARGETS } from './build/es-targets.mjs'

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

  // Build-time snapshot of the English UI copy (APP + components + not-found)
  // from database.json: the single source of truth for every fallback string
  // in the bundle. CMS edits flow through Firebase at runtime; this snapshot
  // only guarantees the UI never renders an empty label.
  const i18nFallbackPlugin = () => {
    const virtualId = 'virtual:i18n-fallback'

    const resolvedId = '\0' + virtualId

    return {
      name: 'vite-plugin-i18n-fallback',
      resolveId(id) {
        return id === virtualId ? resolvedId : null
      },
      load(id) {
        if (id !== resolvedId) return null

        const db = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'database.json'), 'utf8'))

        const en = db.translations.en

        const snapshot = {
          APP: en.APP,
          components: en.components,
          pages: {
            'not-found': en.pages['not-found'],
            'earth-playground': en.pages['earth-playground'],
            HOME: {
              archive: en.pages.HOME.archive,
              explore: en.pages.HOME.explore,
              featured: en.pages.HOME.featured,
              message: en.pages.HOME.message,
            },
            about: { title: en.pages.about.title, mentions: en.pages.about.mentions },
          },
        }

        // APP/HOME/GDPR are in terser's property-mangle reserved list so
        // runtime string lookups (TRANSLATION_KEYS.*) resolve correctly
        return `export default ${JSON.stringify(snapshot)}`
      },
    }
  }

  // Per-locale snapshots of database.json emitted as lazy chunks:
  //   virtual:i18n-boot/<locale>/core      → APP, components, pages
  //   virtual:i18n-boot/<locale>/projects  → projects
  // The site renders from these immediately (static-first) and revalidates
  // against Firebase in the background (see src/utils/db.js).
  // On the legacy IIFE tier the loader index is stubbed to {} — dynamic
  // import() chunks can't exist in a classic script, so the data layer
  // resolves via REST + localStorage instead (src/utils/db.js).
  const i18nBootPlugin = () => {
    const indexId = 'virtual:i18n-boot-index'

    const prefix = 'virtual:i18n-boot/'

    const readDb = () =>
      JSON.parse(fs.readFileSync(path.resolve(__dirname, 'database.json'), 'utf8')).translations

    return {
      name: 'vite-plugin-i18n-boot',
      resolveId(id) {
        if (id === indexId || id.startsWith(prefix)) return '\0' + id

        return null
      },
      load(id) {
        if (id === '\0' + indexId) {
          if (isLegacy) return 'export default {}'

          const locales = Object.keys(readDb())

          const entries = locales.map(
            (l) =>
              `  ${JSON.stringify(l)}: { core: () => import('${prefix}${l}/core'), projects: () => import('${prefix}${l}/projects') }`
          )

          return `export default {\n${entries.join(',\n')}\n}`
        }

        if (!id.startsWith('\0' + prefix)) return null

        const [locale, part] = id.slice(('\0' + prefix).length).split('/')

        const t = readDb()[locale]

        if (!t) return 'export default null'

        const data =
          part === 'projects'
            ? { projects: t.projects }
            : { APP: t.APP, components: t.components, pages: t.pages }

        return `export default ${JSON.stringify(data)}`
      },
    }
  }

  // Dev-only offline CMS mode (`CMS_MOCK=1 npm run dev`): swaps real Firebase
  // SDK calls for the committed database.json snapshot (see
  // src/cms/dev/firebase-mock.js). Never active in production builds.
  const cmsMockPlugin = {
    name: 'cms-firebase-mock',
    enforce: 'pre',
    resolveId(source) {
      if (!process.env.CMS_MOCK) return null
      if (/(^|\/)firebase\.js$/.test(source)) {
        return fileURLToPath(new URL('./src/cms/dev/firebase-mock.js', import.meta.url))
      }
      return null
    },
  }

  const plugins = [
    cmsMockPlugin,
    i18nFallbackPlugin(),
    i18nBootPlugin(),
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
    {
      name: 'vite-plugin-jsx-in-js',
      enforce: 'pre',
      async transform(code, id) {
        if (
          id.includes('/src/') &&
          id.endsWith('.js') &&
          (code.includes('</') || code.includes('/>'))
        ) {
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
        includeAssets: ['favicon.svg', 'favicon.ico', 'apple-touch-icon.png'],
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
    publicDir: process.env.LK_NO_PUBLIC ? false : 'public',
    target: t.viteTarget,
    cssTarget: t.cssTarget,
    sourcemap: false,
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
        ? { index: fileURLToPath(new URL('./src/main.js', import.meta.url)) }
        : isDefault
          ? {
              index: fileURLToPath(new URL('./index.html', import.meta.url)),
              cms: fileURLToPath(new URL('./cms/index.html', import.meta.url)),
            }
          : { index: fileURLToPath(new URL('./src/main.js', import.meta.url)) },
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
    esbuild: {
      // `jsx: 'transform'` is required for the esbuild→oxc config bridge to
      // map jsxFactory/jsxFragment onto pragma/pragmaFrag — without it the
      // mapping is skipped and .tsx would fall back to the automatic runtime.
      jsx: 'transform',
      jsxFactory: 'h',
      jsxFragment: 'Fragment',
      loader: 'jsx',
      include: /src\/.*\.[jt]sx?$/,
      legalComments: 'none',
      treeShaking: true,
    },
    optimizeDeps: {
      noDiscovery: true,
      include: [
        'firebase/app',
        'firebase/auth',
        // Dev-only offline CMS mode: `firebase/database` resolves to the mock
        // via resolve.alias — it must not be pre-bundled.
        ...(process.env.CMS_MOCK ? [] : ['firebase/database']),
        'register-service-worker',
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
        '@': fileURLToPath(new URL('./src', import.meta.url)),
        '@core': fileURLToPath(new URL('./src/core', import.meta.url)),
        // Dev-only offline CMS mode (`CMS_MOCK=1 npm run dev`): the bare
        // `firebase/database` specifier is pre-bundled by optimizeDeps, so it
        // must be intercepted via resolve.alias rather than the plugin hook.
        ...(process.env.CMS_MOCK
          ? {
              'firebase/database': fileURLToPath(
                new URL('./src/cms/dev/firebase-mock.js', import.meta.url)
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
