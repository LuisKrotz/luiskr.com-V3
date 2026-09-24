import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'
import { compression } from 'vite-plugin-compression2'
import { fileURLToPath, URL } from 'node:url'
import { constants as zlibConstants } from 'node:zlib'
import { minify as htmlMinify } from 'html-minifier-terser'
import fs from 'node:fs'
import path from 'node:path'
import zlib from 'node:zlib'

export default defineConfig(({ mode }) => {
  const isCompat = mode === 'compat' || process.env.BUILD_TARGET === 'compat'

  const terserCompress = {
    passes: 10,
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
    unsafe: true,
    unsafe_arrows: true,
    unsafe_methods: true,
    unsafe_proto: true,
    unsafe_regexp: true,
    booleans_as_integers: true,
    hoist_funs: true,
    hoist_vars: true,
    keep_fargs: false,
    dead_code: true,
    toplevel: true,
  }

  const terserMangle = {
    toplevel: true,
  }

  const terserFormat = {
    comments: false,
    ascii_only: true,
    wrap_func_args: false,
  }

  const plugins = [
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
  ]

  if (!isCompat) {
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
          globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
          globIgnores: ['**/cms-*', '**/cms.*', '**/Cms*', '**/Admin*', '**/vendor-firebase*'],
          navigateFallback: 'index.html',
          navigateFallbackDenylist: [/\.htaccess/, /urllist\.txt/],
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
                if (fileName.endsWith('.css') && fileName.startsWith('assets/index-')) {
                  const linkRegex = new RegExp(`<link rel="stylesheet"[^>]*href="[/]${fileName}"[^>]*>`, 'i')
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
  } else {
    plugins.push({
      name: 'compat-distributor',
      enforce: 'post',
      apply: 'build',
      closeBundle() {
        const distDir = path.resolve('dist')
        const compatDir = path.join(distDir, 'assets/compat')
        const indexPath = path.join(distDir, 'index.html')

        if (!fs.existsSync(compatDir) || !fs.existsSync(indexPath)) return

        const compatFiles = fs.readdirSync(compatDir)
        const compatEntry = compatFiles.find((f) => f.startsWith('compat-') && f.endsWith('.js'))
        if (!compatEntry) return

        let html = fs.readFileSync(indexPath, 'utf-8')

        const modernScriptRegex = /<script\s+type="module"\s+crossorigin\s+src="(\/assets\/index-[^"]+\.js)"><\/script>/i
        const match = html.match(modernScriptRegex)

        if (match) {
          const modernSrc = match[1]
          const loader = `<link rel="modulepreload" crossorigin href="${modernSrc}"><script type="module">(function(){var m=Boolean(typeof Promise.withResolvers==="function"&&typeof Object.groupBy==="function"&&typeof Array.prototype.toReversed==="function"&&typeof Set.prototype.intersection==="function");import(m?"${modernSrc}":"/assets/compat/${compatEntry}")})();</script>`
          html = html.replace(match[0], loader)
          fs.writeFileSync(indexPath, html, 'utf-8')

          const htmlBuf = Buffer.from(html, 'utf-8')
          fs.writeFileSync(
            path.join(distDir, 'index.html.br'),
            zlib.brotliCompressSync(htmlBuf, {
              params: { [zlibConstants.BROTLI_PARAM_QUALITY]: 11 },
            })
          )
          fs.writeFileSync(
            path.join(distDir, 'index.html.gz'),
            zlib.gzipSync(htmlBuf, { level: 9 })
          )
        }

        for (const file of compatFiles) {
          if (file.endsWith('.css') || file.endsWith('.css.br') || file.endsWith('.css.gz')) {
            fs.unlinkSync(path.join(compatDir, file))
          }
        }
      },
    })
  }

  const build = isCompat
    ? {
        outDir: 'dist',
        emptyOutDir: false,
        target: 'es2022',
        sourcemap: false,
        minify: 'terser',
        terserOptions: {
          ecma: 2022,
          compress: terserCompress,
          mangle: terserMangle,
          format: terserFormat,
        },
        rollupOptions: {
          input: {
            compat: fileURLToPath(new URL('./src/main.js', import.meta.url)),
          },
          output: {
            entryFileNames: 'assets/compat/[name]-[hash].js',
            chunkFileNames: 'assets/compat/[name]-[hash].js',
            assetFileNames: 'assets/compat/[name]-[hash].[ext]',
            manualChunks(id) {
              if (id.includes('node_modules')) {
                if (id.includes('firebase')) {
                  return 'vendor-firebase'
                }
              }
            },
          },
        },
      }
    : {
        outDir: 'dist',
        emptyOutDir: true,
        target: 'es2026',
        cssTarget: 'chrome120',
        sourcemap: false,
        cssCodeSplit: true,
        cssMinify: 'lightningcss',
        minify: 'terser',
        terserOptions: {
          ecma: 2026,
          compress: terserCompress,
          mangle: terserMangle,
          format: terserFormat,
        },
        modulePreload: {
          polyfill: true,
        },
        rollupOptions: {
          input: {
            index: fileURLToPath(new URL('./index.html', import.meta.url)),
            home: fileURLToPath(new URL('./src/sass/home.scss', import.meta.url)),
            internal: fileURLToPath(new URL('./src/sass/internals.scss', import.meta.url)),
            legal: fileURLToPath(new URL('./src/sass/legal.scss', import.meta.url)),
            cms: fileURLToPath(new URL('./src/sass/cms.scss', import.meta.url)),
          },
          output: {
            manualChunks(id) {
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
    plugins,
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
