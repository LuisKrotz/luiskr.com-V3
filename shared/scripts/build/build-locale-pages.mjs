#!/usr/bin/env node

/**
 * @file build-locale-pages.mjs
 * @description Emits per-locale, per-route static index.html files into
 * dist/ so crawlers and no-JS visitors get translated <title>, meta
 * description, canonical, og/twitter cards, hreflang alternates and JSON-LD
 * — instead of the English shell the catch-all Firebase rewrite serves.
 *
 * Route inventory mirrors the runtime router (core/router/router.js) and
 * public/meta/sitemap.xml: for every locale in LANG_SLUGS the generator emits
 * home (/<loc>), about, contact, privacy, gdpr, terms, the localized
 * earth-playground slug and the English playground aliases the sitemap
 * also lists. dist/cms/ is never touched — the CMS stays unindexed.
 *
 * The template is dist/index.html *after* the multi-tier loader injection
 * (build-targets.mjs step 5), so each page boots the same capability-based
 * bundle selection as the root document.
 *
 * Runnable standalone (`node scripts/build/build-locale-pages.mjs`) or imported
 * by build-targets.mjs via buildLocalePages(distDir).
 */

import fs from 'node:fs'
import path from 'node:path'
import zlib from 'node:zlib'
import { Buffer } from 'node:buffer'
import { fileURLToPath } from 'node:url'

import { LANG_SLUGS } from '../../../core/locale/lang-slugs.ts'

const VALID_LANGS = Object.keys(LANG_SLUGS)

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..')

// ─── Locale → BCP-47 / og:locale mapping ─────────────────────────────────────
// hreflang and <html lang> need BCP-47 tags; og:locale wants xx_YY. Dialects
// without a region code keep their ISO-639-3 tag and map og:locale to the
// closest standardized culture.
const LOCALE_TAGS = Object.freeze({
  en: { bcp: 'en', og: 'en_US' },
  br: { bcp: 'pt-BR', og: 'pt_BR' },
  es: { bcp: 'es', og: 'es_ES' },
  de: { bcp: 'de', og: 'de_DE' },
  hrk: { bcp: 'hrk', og: 'de_DE' },
  cas: { bcp: 'es-AR', og: 'es_AR' },
  riv: { bcp: 'es-UY', og: 'es_UY' },
  gn: { bcp: 'gn', og: 'es_PY' },
  it: { bcp: 'it', og: 'it_IT' },
  ru: { bcp: 'ru', og: 'ru_RU' },
  fr: { bcp: 'fr', og: 'fr_FR' },
  tln: { bcp: 'tln', og: 'it_IT' },
  gl: { bcp: 'gl', og: 'gl_ES' },
  ca: { bcp: 'ca', og: 'ca_ES' },
  nl: { bcp: 'nl', og: 'nl_NL' },
  ga: { bcp: 'ga', og: 'ga_IE' },
})

const SITE_URL = 'https://luiskr.com'
const BASE_TITLE = 'Luis Krötz'

/** Escape a string for use inside an HTML attribute or text node. */
const esc = (s) =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')

/**
 * Strips markup from a translated rich-text string and compacts it into a
 * meta-description-sized plain-text snippet (≤160 chars, cut at a word
 * boundary). &nbsp; entities decode to regular spaces so the tag can sit
 * in a content attribute.
 */
const toDescription = (html, max = 160) => {
  const text = String(html || '')
    .replace(/<br\s*\/?>/gi, ' ')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/\s+/g, ' ')
    .trim()

  if (text.length <= max) return text

  const cut = text.slice(0, max)

  return cut.slice(0, Math.max(cut.lastIndexOf(' '), 0)).trim()
}

/** Brotil + gzip siblings next to each emitted index.html (Firebase serves them). */
const writeCompressed = (file, html) => {
  const buf = Buffer.from(html, 'utf8')

  fs.writeFileSync(file, html)
  fs.writeFileSync(
    `${file}.br`,
    zlib.brotliCompressSync(buf, { params: { [zlib.constants.BROTLI_PARAM_QUALITY]: 11 } })
  )
  fs.writeFileSync(`${file}.gz`, zlib.gzipSync(buf, { level: 9 }))
}

/**
 * Rewrites the English shell into a localized document.
 * @param {string} html - post-loader dist/index.html source
 * @param {object} o
 * @param {string} o.bcpLang - BCP-47 tag for <html lang> + og:locale alt
 * @param {string} o.ogLocale - og:locale value (xx_YY)
 * @param {string} o.title - document + social title
 * @param {string} o.description - meta description text
 * @param {string} o.url - canonical absolute URL for this page
 * @param {Array<{bcp:string,url:string}>} o.alternates - hreflang rows
 */
function localize(html, { bcpLang, ogLocale, title, description, url, alternates }) {
  let out = html

  // <html lang> + document title
  out = out.replace(/<html lang="[^"]*"/, `<html lang="${bcpLang}"`)
  out = out.replace(/<title>[^<]*<\/title>/, `<title>${esc(title)}</title>`)

  // Title-bearing metas
  for (const name of ['og:title', 'twitter:title']) {
    out = out.replace(
      new RegExp(`(<meta (?:property|name)="${name}" content=")[^"]*(")`),
      `$1${esc(title)}$2`
    )
  }
  out = out.replace(/(<meta name="DC\.Title" content=")[^"]*(")/, `$1${esc(title)}$2`)

  // Canonical + social URLs — attribute-targeted so share.png and JSON-LD
  // image/logo URLs are never rewritten.
  out = out.replace(/(<link rel="canonical" href=")[^"]*(")/, `$1${url}$2`)
  out = out.replace(/(<meta property="og:url" content=")[^"]*(")/, `$1${url}$2`)
  out = out.replace(/(<meta name="twitter:url" content=")[^"]*(")/, `$1${url}$2`)

  // Description metas
  const d = esc(description)

  out = out.replace(/(<meta name="description"\s+content=")[^"]*(")/, `$1${d}$2`)
  out = out.replace(/(<meta property="og:description"\s+content=")[^"]*(")/, `$1${d}$2`)
  out = out.replace(/(<meta name="twitter:description" content=")[^"]*(")/, `$1${d}$2`)
  out = out.replace(/(<meta name="DC\.Description"\s+content=")[^"]*(")/, `$1${d}$2`)
  out = out.replace(/(<meta property="og:image:alt" content=")[^"]*(")/, `$1${d}$2`)

  // Language declarations
  out = out.replace(
    /(<meta name="DC\.Language" content=")[^"]*(")/,
    `$1${ogLocale.toLowerCase()}$2`
  )

  // JSON-LD: the Website entity carries the page URL + inLanguage; the
  // Organization entity keeps its canonical root url.
  out = out.replace(
    /("@type":"Website","@id":"Page","url":")[^"]*(")/,
    `$1${url}$2,"inLanguage":"${bcpLang}"`
  )

  // og:locale + hreflang alternates + x-default, inserted before </head>.
  const alt = alternates
    .map((a) => `  <link rel="alternate" hreflang="${a.bcp}" href="${a.url}">`)
    .join('\n')
  const inject = [
    `  <meta property="og:locale" content="${ogLocale}">`,
    ...alternates.slice(1).map((a) => `  <meta property="og:locale:alternate" content="${a.og}">`),
    alt,
    `  <link rel="alternate" hreflang="x-default" href="${alternates[0].url}">`,
  ].join('\n')

  out = out.replace('</head>', `${inject}\n</head>`)

  return out
}

/**
 * Generates all localized pages under `distDir`. When `template` is omitted
 * the post-loader dist/index.html is read from disk; when provided (the
 * build orchestrator's in-memory copy) the localized root document is
 * returned so the caller can run its own compress/SW-stamp pass.
 * @param {string} distDir - absolute dist path
 * @param {string} [template] - shell HTML; defaults to dist/index.html on disk
 * @returns {{html: string, written: number, locales: number}} localized root html + counts
 */
export function buildLocalePages(distDir = path.join(ROOT, 'dist'), template) {
  const indexPath = path.join(distDir, 'index.html')

  if (!template) {
    if (!fs.existsSync(indexPath)) throw new Error(`build-locale-pages: ${indexPath} not found`)

    template = fs.readFileSync(indexPath, 'utf8')
  }

  let translations = {}
  const dbPath = path.join(ROOT, 'database.json')

  if (fs.existsSync(dbPath))
    translations = JSON.parse(fs.readFileSync(dbPath, 'utf8')).translations || {}
  else console.warn('[locale-pages] database.json missing — emitting English fallbacks only')

  const en = translations.en || {}
  const legalEn = en.components?.['legal-footer']?.links || []

  /** Per-locale lookup with English fallback (mirrors runtime appText). */
  const t = (loc, get) => {
    const v = get(translations[loc] || {})
    return v === undefined || v === null || v === '' ? get(en) : v
  }

  // hreflang alternates — identical on every emitted page.
  const alternates = VALID_LANGS.filter((loc) => LOCALE_TAGS[loc]).map((loc) => ({
    bcp: LOCALE_TAGS[loc].bcp,
    og: LOCALE_TAGS[loc].og,
    url: loc === 'en' ? `${SITE_URL}/` : `${SITE_URL}/${loc}`,
  }))

  let written = 0

  /** Route table: path-suffix → title factory. */
  const routesFor = (loc) => {
    const slugs = LANG_SLUGS[loc]
    const legal = t(loc, (x) => x.components?.['legal-footer']?.links) || legalEn
    const pageName = (i) => legal?.[i]?.page
    const titleOf = (suffix) => (suffix ? `${BASE_TITLE} | ${suffix}` : BASE_TITLE)
    const pgTitle = () =>
      `${t(loc, (x) => x.APP?.earthPlayground) || 'Earth Playground'} | ${BASE_TITLE}`

    const routes = [{ path: loc, title: BASE_TITLE }]

    if (slugs) {
      routes.push(
        { path: `${loc}/${slugs.about}`, title: titleOf(t(loc, (x) => x.APP?.about?.description)) },
        { path: `${loc}/${slugs.contact}`, title: titleOf(t(loc, (x) => x.APP?.contact)) },
        { path: `${loc}/${slugs.privacy}`, title: titleOf(pageName(1)) },
        { path: `${loc}/${slugs.gdpr}`, title: titleOf(pageName(2)) },
        { path: `${loc}/${slugs.terms}`, title: titleOf(pageName(3)) },
        { path: `${loc}/${slugs.earthPlayground}`, title: pgTitle() }
      )
    }

    // English playground segments under the locale prefix (sitemap parity).
    routes.push(
      { path: `${loc}/earth-playground`, title: pgTitle() },
      { path: `${loc}/space-playground`, title: pgTitle() }
    )

    return routes
  }

  // ── Root document: inject the alternate-language block ────────────────────
  // The English shell keeps its own metas; alternates point crawlers at the
  // localized variants.
  const rootDescription = toDescription(
    en.pages?.about?.col1?.[0] || 'Front-End Developer focused on creating beautiful experiences.'
  )
  const rootHtml = localize(template, {
    bcpLang: 'en',
    ogLocale: 'en_US',
    title: BASE_TITLE,
    description: rootDescription,
    url: `${SITE_URL}/`,
    alternates,
  })

  // ── Localized documents ───────────────────────────────────────────────────
  for (const loc of VALID_LANGS) {
    if (loc === 'en' || !LOCALE_TAGS[loc]) continue

    const tags = LOCALE_TAGS[loc]
    const description = toDescription(
      t(loc, (x) => x.pages?.about?.col1?.[0]) ||
        'Front-End Developer focused on creating beautiful experiences.'
    )

    for (const route of routesFor(loc)) {
      const out = localize(template, {
        bcpLang: tags.bcp,
        ogLocale: tags.og,
        title: route.title,
        description,
        url: `${SITE_URL}/${route.path}`,
        alternates,
      })

      // Locales live under dist/langs/<loc>/… — firebase.json rewrites map
      // the public /<loc>/… URLs back to these files (rewrites have no splat
      // destination support, so every route gets an explicit entry).
      const file = path.join(distDir, 'langs', route.path, 'index.html')

      fs.mkdirSync(path.dirname(file), { recursive: true })
      writeCompressed(file, out)
      written++
    }
  }

  syncFirebaseRewrites()

  return { html: rootHtml, written, locales: VALID_LANGS.length - 1 }
}

/**
 * Regenerates the `hosting.rewrites` block in firebase.json so the public
 * locale URLs (`/br`, `/br/sobre`, …) keep serving the pages now emitted
 * under `dist/langs/<loc>/…`. Firebase rewrite destinations are single
 * files — no glob capture — so the table enumerates every route the same
 * way `routesFor` does. Preserves every non-rewrite hosting key and the
 * meta/CMS/SPA-catch-all entries declared in `STATIC_REWRITES`.
 */
export function syncFirebaseRewrites() {
  const firebasePath = path.join(ROOT, 'firebase.json')
  const cfg = JSON.parse(fs.readFileSync(firebasePath, 'utf8'))

  const localeRoutes = []

  for (const loc of VALID_LANGS) {
    if (loc === 'en' || !LOCALE_TAGS[loc]) continue

    const slugs = LANG_SLUGS[loc] || {}
    const subRoutes = [
      slugs.about,
      slugs.contact,
      slugs.privacy,
      slugs.gdpr,
      slugs.terms,
      slugs.earthPlayground,
      'earth-playground',
      'space-playground',
    ].filter(Boolean)

    localeRoutes.push({ source: `/${loc}`, destination: `/langs/${loc}/index.html` })

    for (const sub of subRoutes) {
      localeRoutes.push({
        source: `/${loc}/${sub}`,
        destination: `/langs/${loc}/${sub}/index.html`,
      })
    }
  }

  cfg.hosting.rewrites = [...STATIC_REWRITES, ...localeRoutes, ...SPA_REWRITES]

  fs.writeFileSync(firebasePath, `${JSON.stringify(cfg, null, 2)}\n`)
}

/** Rewrites that sit before the locale table — meta files moved into
 * public/meta/ keep their root URLs through these entries. Per-locale
 * sitemap files and localized agent-readable files (robots/urllist/llms/
 * ai-catalog under /meta/<loc>/) keep their `/<loc>/<file>` URLs. */
const META_FILE_REWRITES = Object.freeze([
  'robots.txt',
  'urllist.txt',
  'llms.txt',
  'ai-catalog.json',
])

const STATIC_REWRITES = Object.freeze([
  { source: '/robots.txt', destination: '/meta/robots.txt' },
  { source: '/sitemap.xml', destination: '/meta/sitemap.xml' },
  { source: '/urllist.txt', destination: '/meta/urllist.txt' },
  { source: '/llms.txt', destination: '/meta/llms.txt' },
  { source: '/ai-catalog.json', destination: '/meta/ai-catalog.json' },
  { source: '/.well-known/ai-catalog.json', destination: '/meta/.well-known/ai-catalog.json' },
  { source: '/browserconfig.xml', destination: '/meta/browserconfig.xml' },
  ...VALID_LANGS.map((loc) => ({
    source: `/sitemap-${loc}.xml`,
    destination: `/meta/sitemap-${loc}.xml`,
  })),
  ...VALID_LANGS.filter((loc) => loc !== 'en').flatMap((loc) =>
    META_FILE_REWRITES.map((file) => ({
      source: `/${loc}/${file}`,
      destination: `/meta/${loc}/${file}`,
    }))
  ),
])

/** CMS + SPA catch-all — always last. */
const SPA_REWRITES = Object.freeze([
  { source: '/admin', destination: '/cms/index.html' },
  { source: '/admin/**', destination: '/cms/index.html' },
  { source: '/cms', destination: '/cms/index.html' },
  { source: '/cms/**', destination: '/cms/index.html' },
  { source: '**', destination: '/index.html' },
])

// Standalone entry: `node scripts/build/build-locale-pages.mjs` — writes the
// localized root itself (the orchestrator does it in-memory instead) and
// re-stamps the service-worker precache revision the same way.
if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const DIST = path.join(ROOT, 'dist')
  const indexPath = path.join(DIST, 'index.html')
  const { html, written, locales } = buildLocalePages(DIST)

  writeCompressed(indexPath, html)

  const swPath = path.join(DIST, 'service-worker.js')

  if (fs.existsSync(swPath)) {
    const crypto = await import('node:crypto')
    const htmlHash = crypto.createHash('md5').update(html).digest('hex')
    let sw = fs.readFileSync(swPath, 'utf8')

    sw = sw.replace(
      /\{url:"index\.html",revision:"[^"]+"\}/,
      `{url:"index.html",revision:"${htmlHash}"}`
    )
    writeCompressed(swPath, sw)
  }

  console.log(`[locale-pages] wrote ${written + 1} documents across ${locales} locales`)
}
