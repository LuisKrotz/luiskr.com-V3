/**
 * @file build-targets.mjs
 * @description Multi-target build orchestrator.
 *
 *   1. `vite build` once per tier in build/es-targets.mjs — each emits
 *      dist/v/<tier>/assets/{js,css,misc}/<name>-<hash>.* (module tiers) or a
 *      self-contained IIFE bundle (es2016). The default tier additionally
 *      emits dist/index.html, dist/cms/index.html, public/ assets and the
 *      service worker.
 *   2. esbuild each core/legacy-polyfills/* entry to
 *      dist/assets/polyfills/<name>-<hash>.js — fetched ONLY by engines
 *      whose runtime guards fail.
 *   3. Rewrite dist/index.html: swap the hardcoded module script for the
 *      inlined ES5 loader (scripts/build/browser-loader.js) + the tier/polyfill
 *      manifest, so every visitor downloads only the bundle their engine
 *      can execute. Modern browsers and Lighthouse get the default
 *      es2026/esnext bundle with zero polyfills and zero prefixes.
 *
 * Invoked by `yarn build` AFTER the prebuild verify gate passes.
 */
import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import zlib from 'node:zlib'
import crypto from 'node:crypto'
import { constants as zlibConstants } from 'node:zlib'
import { fileURLToPath } from 'node:url'
import { ES_TARGETS, POLYFILLS, POLYFILL_ORDER, BROWSERS } from '../../build/es-targets.mjs'
import { buildLocalePages } from './build-locale-pages.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..', '..', '..')
const DIST = path.join(ROOT, 'dist')

const run = (cmd, args, env = {}) =>
  execFileSync(cmd, args, { cwd: ROOT, env: { ...process.env, ...env }, stdio: 'inherit' })

// ── 1. Per-tier vite builds ─────────────────────────────────────────────────
// The first build owns emptyOutDir + publicDir copying; later builds only
// add their own v/<tier>/ directory (no html inputs, no public re-copy).
// LK_ONLY=a,b limits the build list (dev iteration; manifest still expects
// every tier on disk).
const only = process.env.LK_ONLY ? new Set(process.env.LK_ONLY.split(',')) : null
const buildList = ES_TARGETS.filter((t) => !only || only.has(t.name))

for (const [i, t] of buildList.entries()) {
  console.log(`\n═══ build ${i + 1}/${buildList.length}: ${t.name} (${t.format}) ═══`)

  run('yarn', ['vite', 'build'], {
    LK_TARGET: t.name,
    LK_EMPTY_OUTDIR: i === 0 && !process.env.LK_KEEP_DIST ? '1' : '0',
    LK_NO_PUBLIC: i === 0 && !process.env.LK_KEEP_DIST ? '' : '1',
  })
}

// ── 2. Polyfill bundles ─────────────────────────────────────────────────────
console.log('\n═══ polyfill bundles ═══')

const { rolldown } = await import('rolldown')

// One classic-script bundle per group — iife can't code-split, so each
// entry gets its own single-file build.
for (const p of POLYFILLS) {
  const bundle = await rolldown({
    input: { [p.name]: path.join(ROOT, p.entry) },
    platform: 'browser',
    transform: { target: 'es2015' },
  })

  await bundle.write({
    dir: path.join(DIST, 'assets/polyfills'),
    format: 'iife',
    entryFileNames: '[name]-[hash].js',
    minify: true,
    codeSplitting: false,
  })

  if (typeof bundle.close === 'function') await bundle.close()
}

// Hash-named files → runtime paths for the loader manifest.
const polyDir = path.join(DIST, 'assets/polyfills')

const polyFiles = fs.readdirSync(polyDir)

const findPoly = (name) =>
  `/assets/polyfills/${polyFiles.find((f) => f.startsWith(`${name}-`) && f.endsWith('.js'))}`

const polyManifest = POLYFILLS.map((p) => ({
  name: p.name,
  file: findPoly(p.name),
  guard: p.guard,
}))

// ── 3. Missing CSS for IIFE tiers ───────────────────────────────────────────
// Rolldown emits no CSS asset when codeSplitting is off (iife), so compile
// the global sheet directly: sass → lightningcss with the tier's prefix
// target. Only tiers that produced no css get this pass.
const cssTargetMap = (cssTarget) => {
  if (cssTarget === 'esnext') return undefined
  const m = cssTarget.match(/^([a-z]+)(\d+)$/)
  if (!m) return undefined
  const version = parseInt(m[2], 10) << 16
  const map = {
    chrome: 'chrome',
    firefox: 'firefox',
    safari: 'safari',
    edge: 'edge',
    ie: 'ie',
    samsung: 'samsung',
    opera: 'opera',
  }
  const engine = map[m[1]]
  return engine ? { [engine]: version } : undefined
}

const emitCss = async (t, prefix = 'index-') => {
  const sass = await import('sass')
  const { transform } = await import('lightningcss')

  const compiled = sass.compile(path.join(ROOT, 'core/sass/components/shell/app.scss'), {
    loadPaths: [path.join(ROOT, 'core/sass')],
    silenceDeprecations: ['import', 'global-builtin', 'legacy-js-api'],
    sourceMap: true,
    sourceMapIncludeSources: true,
  })

  const outDir = path.join(DIST, 'v', t.name, 'assets', 'css')
  fs.mkdirSync(outDir, { recursive: true })

  const { code, map } = transform({
    filename: 'app.css',
    code: Buffer.from(compiled.css),
    minify: true,
    targets: cssTargetMap(t.cssTarget),
    errorRecovery: true,
    sourceMap: true,
    inputSourceMap: JSON.stringify(compiled.sourceMap),
  })

  const hash = crypto.createHash('md5').update(code).digest('hex').slice(0, 8)
  const name = `${prefix}${hash}.css`
  const finalCode = Buffer.concat([code, Buffer.from(`\n/*# sourceMappingURL=${name}.map */\n`)])

  fs.writeFileSync(path.join(outDir, name), finalCode)

  // Sass emits absolute build-machine paths in `sources` — rewrite them
  // repo-relative so deployed maps don't leak the filesystem layout.
  const parsedMap = JSON.parse(map.toString())

  parsedMap.sources = parsedMap.sources.map((s) =>
    s.replace(/^.*?(?=src[/\\]sass)/, '').replace(/\\/g, '/')
  )

  fs.writeFileSync(path.join(outDir, `${name}.map`), JSON.stringify(parsedMap))
  fs.writeFileSync(
    path.join(outDir, `${name}.br`),
    zlib.brotliCompressSync(finalCode, { params: { [zlibConstants.BROTLI_PARAM_QUALITY]: 11 } })
  )
  fs.writeFileSync(path.join(outDir, `${name}.gz`), zlib.gzipSync(finalCode, { level: 9 }))

  return name
}

// ── 4. Tier manifest from the emitted assets ────────────────────────────────
const tierManifest = []

for (const t of ES_TARGETS) {
  const jsDir = path.join(DIST, 'v', t.name, 'assets', 'js')
  const cssDir = path.join(DIST, 'v', t.name, 'assets', 'css')

  const jsFiles = fs.existsSync(jsDir) ? fs.readdirSync(jsDir) : []

  const js = jsFiles.find((f) => f.startsWith('index-') && f.endsWith('.js'))

  if (!js) {
    if (only) {
      console.warn(`  ! tier ${t.name} not built (LK_ONLY dev mode) — omitted from manifest`)
      continue
    }
    throw new Error(`missing entry bundle for tier ${t.name}`)
  }

  const cssFiles = fs.existsSync(cssDir) ? fs.readdirSync(cssDir) : []

  let css = cssFiles.filter((f) => f.startsWith('index-') && f.endsWith('.css'))

  if (!css.length) {
    const emitted = await emitCss(t)
    css = [emitted]
    console.log(`  css emitted for ${t.name}: ${emitted}`)
  } else {
    // rolldown-vite doesn't emit sourcemaps for code-split CSS assets yet —
    // ship the sass→lightningcss mapped global sheet alongside so every
    // tier carries a .css.map that resolves back to real .scss lines.
    const dbg = await emitCss(t, 'app-')
    console.log(`  css sourcemap emitted for ${t.name}: ${dbg}.map`)
  }

  tierManifest.push({
    name: t.name,
    js: `/v/${t.name}/assets/js/${js}`,
    css: css[0],
    module: t.format === 'module',
    default: t.name === 'es2026',
    tests: t.test,
  })
}

for (const t of tierManifest) t.css = `/v/${t.name}/assets/css/${t.css}`

// ── 5. Inline loader + manifest into dist/index.html ────────────────────────
const indexPath = path.join(DIST, 'index.html')

let html = fs.readFileSync(indexPath, 'utf8')

const loaderSrc = fs.readFileSync(path.join(ROOT, 'shared/scripts/build/browser-loader.js'), 'utf8')

const manifestSrc = `window.__LK=${JSON.stringify({ targets: tierManifest, polys: polyManifest, order: POLYFILL_ORDER, browsers: BROWSERS })};`

// Minify manifest + loader together (the loader is authored ES5-readable;
// terser ecma:5 keeps it parseable on the oldest engines it detects).
const { minify: terserMinify } = await import('terser')

const { code: loaderMin } = await terserMinify(manifestSrc + '\n' + loaderSrc, {
  ecma: 5,
  compress: { passes: 2 },
  mangle: { toplevel: true },
  format: { ascii_only: true },
})

// Replace the default-tier module script tag with the inline loader. The
// emitted html (default build) contains exactly one app entry script. On
// re-runs the html is already rewritten — locate the injected block by the
// modulepreload link + the `window.__LK` script instead.
const moduleScriptRe =
  /<script\s+type="module"\s+crossorigin\s+src="(\/v\/es2026\/assets\/js\/index-[^"]+\.js)"><\/script>/i
const injectedRe =
  /<link\s+rel="modulepreload"\s+crossorigin\s+href="(\/v\/es2026\/assets\/js\/index-[^"]+\.js)"><script>window\.__LK=[\s\S]*?<\/script>/i

const match = html.match(moduleScriptRe) || html.match(injectedRe)

if (!match) throw new Error('could not locate entry module script in dist/index.html')

const defaultEntry = match[1]

const loaderTag = `<link rel="modulepreload" crossorigin href="${defaultEntry}"><script>${loaderMin.trim()}</script>`

html = html.replace(match[0], loaderTag)

// Per-locale shells: emit dist/<loc>/<slug>/index.html for every sitemap
// route with translated title/meta/JSON-LD + hreflang alternates, and return
// the localized root document (alternates injected). CMS is never touched.
const localePages = buildLocalePages(DIST, html)

html = localePages.html

fs.writeFileSync(indexPath, html)

// Compressed index.html siblings (Firebase serves .br/.gz when present).
const htmlBuf = Buffer.from(html, 'utf8')

fs.writeFileSync(
  `${indexPath}.br`,
  zlib.brotliCompressSync(htmlBuf, { params: { [zlibConstants.BROTLI_PARAM_QUALITY]: 11 } })
)
fs.writeFileSync(`${indexPath}.gz`, zlib.gzipSync(htmlBuf, { level: 9 }))

// Re-stamp the service-worker's precache revision for index.html so the new
// html (with the loader) is what Workbox serves.
const swPath = path.join(DIST, 'service-worker.js')

if (fs.existsSync(swPath)) {
  const htmlHash = crypto.createHash('md5').update(html).digest('hex')
  let sw = fs.readFileSync(swPath, 'utf8')
  sw = sw.replace(
    /\{url:"index\.html",revision:"[^"]+"\}/,
    `{url:"index.html",revision:"${htmlHash}"}`
  )
  fs.writeFileSync(swPath, sw)

  const swBuf = Buffer.from(sw, 'utf8')
  if (fs.existsSync(`${swPath}.br`))
    fs.writeFileSync(
      `${swPath}.br`,
      zlib.brotliCompressSync(swBuf, { params: { [zlibConstants.BROTLI_PARAM_QUALITY]: 11 } })
    )
  if (fs.existsSync(`${swPath}.gz`))
    fs.writeFileSync(`${swPath}.gz`, zlib.gzipSync(swBuf, { level: 9 }))
}

console.log(
  `\n  locale-pages: ${localePages.written + 1} localized documents across ${localePages.locales} locales`
)
console.log('\n═══ done ═══')
for (const t of tierManifest) console.log(`  ${t.name}: ${t.js}`)
for (const p of polyManifest) console.log(`  polyfill ${p.name}: ${p.file}`)
