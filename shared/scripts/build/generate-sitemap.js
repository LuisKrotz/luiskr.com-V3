import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { LANG_SLUGS } from '../../../core/locale/lang-slugs.ts'
import { scanManifest } from '../../build/docs/scan.mjs'

const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..')

const VALID_LANGS = Object.keys(LANG_SLUGS)

function slugify(text) {
  return (text || '')
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

async function run() {
  const base = 'https://luiskr.com'
  const urlSet = new Set()

  // Root
  urlSet.add('/')

  // Legal routes (default English)
  urlSet.add('/privacy-policy')
  urlSet.add('/gdpr')
  urlSet.add('/terms-of-use')

  // Earth / Space Playground (default English)
  urlSet.add('/earth-playground')
  urlSet.add('/space-playground')

  // Localized routes from LANG_SLUGS
  for (const lang of VALID_LANGS) {
    if (lang === 'en') continue
    urlSet.add(`/${lang}`)
    urlSet.add(`/${lang}/earth-playground`)
    urlSet.add(`/${lang}/space-playground`)
    const slugs = LANG_SLUGS[lang]
    if (slugs) {
      if (slugs.privacy) urlSet.add(`/${lang}/${slugs.privacy}`)
      if (slugs.gdpr) urlSet.add(`/${lang}/${slugs.gdpr}`)
      if (slugs.terms) urlSet.add(`/${lang}/${slugs.terms}`)
      if (slugs.about) urlSet.add(`/${lang}/${slugs.about}`)
      if (slugs.contact) urlSet.add(`/${lang}/${slugs.contact}`)
    }
  }

  // Fetch projects data
  let data = {}
  try {
    const res = await fetch('https://luiskr-com.firebaseio.com/translations/en/projects.json')
    data = await res.json()
  } catch (err) {
    console.error(
      'Failed to fetch remote projects, falling back to local translations-full.json',
      err
    )
    if (fs.existsSync('shared/scripts/i18n/translations-full.json')) {
      const full = JSON.parse(
        fs.readFileSync('shared/scripts/i18n/translations-full.json', 'utf-8')
      )
      data = full.translations?.en?.projects || {}
    }
  }

  // Portfolio routes & media modal URLs
  for (const [projectSlug, projectData] of Object.entries(data || {})) {
    urlSet.add(`/portfolio/${projectSlug}`)
    if (projectData && projectData.sections) {
      for (const section of projectData.sections) {
        if (Array.isArray(section)) {
          for (const item of section) {
            if (Array.isArray(item)) {
              for (const media of item) {
                if (media && typeof media === 'object' && media.label && media.canExpand) {
                  const mediaSlug = slugify(media.label)
                  if (mediaSlug) {
                    urlSet.add(`/portfolio/${projectSlug}/${mediaSlug}`)
                  }
                }
              }
            } else if (item && typeof item === 'object' && item.label && item.canExpand) {
              const mediaSlug = slugify(item.label)
              if (mediaSlug) {
                urlSet.add(`/portfolio/${projectSlug}/${mediaSlug}`)
              }
            }
          }
        }
      }
    }
  }

  // Backward compatibility aliases
  const aliases = {
    'brazilian-leather': 'cicb',
    'clinica-de-desenvolvimento-nathalia-bond': 'nathalia-bond',
    'genesysinf-sageweb': 'sage',
    minimelissa: 'mini-melissa',
  }
  for (const alias of Object.keys(aliases)) {
    urlSet.add(`/portfolio/${alias}`)
  }

  // Docs portal — English-only SPA; every publishable manifest file is a
  // crawlable '/docs/<root>/<relpath>' route (files only — dirs resolve to
  // the same portal page, and media payloads render inline in the viewer).
  urlSet.add('/docs')

  try {
    const { roots } = scanManifest(REPO_ROOT)

    const walkDocs = (nodes) => {
      for (const node of nodes) {
        urlSet.add(`/docs/${node.path}`)

        if (node.type === 'dir') walkDocs(node.children)
      }
    }

    for (const root of roots) walkDocs(root.children)
  } catch (err) {
    console.error('Failed to scan docs manifest for sitemap — /docs routes skipped', err)
  }

  const allUrls = Array.from(urlSet).sort()
  console.log('Total unique URLs:', allUrls.length)

  const META_DIR = 'website/public/meta'
  const now = new Date().toISOString().split('T')[0] + 'T00:00:00+00:00'
  const priorityOf = (u) =>
    u === '/' || /^\/[a-z-]+$/.test(u)
      ? '1.0'
      : u.includes('/earth-playground') || u.includes('/space-playground')
        ? '0.9'
        : u.startsWith('/portfolio/') && u.split('/').length > 3
          ? '0.6'
          : '0.8'

  /** Emits one `<urlset>` document for `urls`. */
  const sitemapDoc = (urls) => {
    const items = urls
      .map(
        (u) =>
          `  <url>\n    <loc>${base}${u === '/' ? '/' : u}</loc>\n    <lastmod>${now}</lastmod>\n    <priority>${priorityOf(u)}</priority>\n  </url>`
      )
      .join('\n')

    return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${items}\n</urlset>\n`
  }

  /** URLs owned by one locale — `/<loc>` plus its localized + playground routes. */
  const localeUrlsOf = (loc) => {
    const own = [`/${loc}`, `/${loc}/earth-playground`, `/${loc}/space-playground`]
    const slugs = LANG_SLUGS[loc] || {}

    for (const key of ['privacy', 'gdpr', 'terms', 'about', 'contact']) {
      if (slugs[key]) own.push(`/${loc}/${slugs[key]}`)
    }

    return own.sort()
  }

  // ── Per-locale sitemaps + sitemap index ────────────────────────────────────
  // English gets the unprefixed surface (/, /portfolio/**, /docs/** — the docs
  // portal is English-only by design); every other locale sitemap lists only
  // its own /<loc>/… routes. sitemap.xml becomes the index document.
  const sharedUrls = allUrls.filter((u) => !/^\/[a-z]{2,5}(\/|$)/.test(u) || u === '/')
  const enUrls = sharedUrls
  const translations = fs.existsSync('database.json')
    ? JSON.parse(fs.readFileSync('database.json', 'utf-8')).translations || {}
    : {}
  const llmsTemplate = fs.readFileSync(path.join(META_DIR, 'llms.txt'), 'utf-8')

  /** Localized llms.txt — swaps the intro line for the locale's about text. */
  const localizedLlms = (loc) => {
    const raw = translations[loc]?.pages?.about?.col1?.[0]
    const bio = String(raw || '')
      .replace(/<br\s*\/?>/gi, ' ')
      .replace(/<[^>]+>/g, '')
      .replace(/&nbsp;/gi, ' ')
      .replace(/&amp;/gi, '&')
      .replace(/\s+/g, ' ')
      .trim()

    if (!bio) return llmsTemplate

    return llmsTemplate.replace(/>\s*Luis Krötz is[^\n]*/, `> ${bio}`)
  }

  /** Localized ai-catalog — entry URLs get the /<loc> prefix (docs stay EN). */
  const localizedCatalog = (loc) => {
    const catalog = JSON.parse(fs.readFileSync(path.join(META_DIR, 'ai-catalog.json'), 'utf-8'))

    return {
      ...catalog,
      entries: (catalog.entries || []).map((e) => ({
        ...e,
        url: e.url && !e.url.includes('/docs') ? e.url.replace(base, `${base}/${loc}`) : e.url,
      })),
    }
  }

  fs.writeFileSync(path.join(META_DIR, 'sitemap-en.xml'), sitemapDoc(enUrls), 'utf-8')

  const indexEntries = [
    `  <sitemap>\n    <loc>${base}/sitemap-en.xml</loc>\n    <lastmod>${now}</lastmod>\n  </sitemap>`,
  ]

  for (const loc of VALID_LANGS) {
    if (loc === 'en') continue

    const locUrls = localeUrlsOf(loc)

    fs.writeFileSync(path.join(META_DIR, `sitemap-${loc}.xml`), sitemapDoc(locUrls), 'utf-8')

    indexEntries.push(
      `  <sitemap>\n    <loc>${base}/sitemap-${loc}.xml</loc>\n    <lastmod>${now}</lastmod>\n  </sitemap>`
    )

    // Localized agent/agent-readable files — firebase maps /<loc>/x → /meta/<loc>/x.
    const locDir = path.join(META_DIR, loc)

    fs.mkdirSync(locDir, { recursive: true })
    fs.writeFileSync(
      path.join(locDir, 'robots.txt'),
      `User-agent: *\nDisallow: /cms/\nDisallow: /admin\n\nSitemap: ${base}/sitemap-${loc}.xml\n`,
      'utf-8'
    )
    fs.writeFileSync(
      path.join(locDir, 'urllist.txt'),
      locUrls.map((u) => `${base}${u}`).join('\n') + '\n',
      'utf-8'
    )
    fs.writeFileSync(path.join(locDir, 'llms.txt'), localizedLlms(loc), 'utf-8')
    fs.writeFileSync(
      path.join(locDir, 'ai-catalog.json'),
      `${JSON.stringify(localizedCatalog(loc), null, 2)}\n`,
      'utf-8'
    )
  }

  const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${indexEntries.join('\n')}\n</sitemapindex>\n`

  fs.writeFileSync(path.join(META_DIR, 'sitemap.xml'), sitemapIndex, 'utf-8')
  fs.writeFileSync(
    path.join(META_DIR, 'urllist.txt'),
    allUrls.map((u) => `${base}${u === '/' ? '' : u}`).join('\n') + '\n',
    'utf-8'
  )
  console.log(
    `Generated sitemap index + ${VALID_LANGS.length} locale sitemaps and localized meta files under ${META_DIR}/`
  )
}

run()
