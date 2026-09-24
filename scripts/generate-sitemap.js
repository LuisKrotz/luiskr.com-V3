import fs from 'fs'
import { LANG_SLUGS, VALID_LANGS } from '../src/core/i18n.js'

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

  // Localized routes from LANG_SLUGS
  for (const lang of VALID_LANGS) {
    if (lang === 'en') continue
    urlSet.add(`/${lang}`)
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
    console.error('Failed to fetch remote projects, falling back to local translations-full.json', err)
    if (fs.existsSync('scripts/translations-full.json')) {
      const full = JSON.parse(fs.readFileSync('scripts/translations-full.json', 'utf-8'))
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
    'minimelissa': 'mini-melissa',
  }
  for (const alias of Object.keys(aliases)) {
    urlSet.add(`/portfolio/${alias}`)
  }

  const allUrls = Array.from(urlSet).sort()
  console.log('Total unique URLs:', allUrls.length)

  // Generate urllist.txt
  const urllist = allUrls.map((u) => `${base}${u === '/' ? '' : u}`).join('\n') + '\n'
  fs.writeFileSync('public/urllist.txt', urllist, 'utf-8')

  // Generate sitemap.xml
  const now = new Date().toISOString().split('T')[0] + 'T00:00:00+00:00'
  const sitemapItems = allUrls
    .map((u) => {
      const loc = `${base}${u === '/' ? '/' : u}`
      const priority =
        u === '/'
          ? '1.0'
          : u.startsWith('/portfolio/') && u.split('/').length > 3
            ? '0.6'
            : '0.8'
      return `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${now}</lastmod>\n    <priority>${priority}</priority>\n  </url>`
    })
    .join('\n')

  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapItems}\n</urlset>\n`
  fs.writeFileSync('public/sitemap.xml', sitemapXml, 'utf-8')
  console.log('Successfully generated public/sitemap.xml and public/urllist.txt')
}

run()
