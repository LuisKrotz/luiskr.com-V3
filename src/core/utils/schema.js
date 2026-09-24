import { URLS, STRINGS, ATTRS, LOCALES, PATHS } from '../constants.js'
import { stripHtml } from './string.js'

/**
 * Generates WebSite and Organization schema for the homepage.
 * @returns {Object[]} JSON-LD entities
 */
export const generateWebsiteSchema = () => {
  return [
    {
      '@context': STRINGS.SCHEMA_CONTEXT,
      '@type': 'Organization',
      '@id': `${STRINGS.SITE_URL}#organization`,
      legalName: 'Jacson Luis Krötz',
      name: 'Luis Krötz',
      url: STRINGS.SITE_URL,
      logo: `${STRINGS.SITE_URL}/favicon/android-chrome-512x512.png`,
      image: `${STRINGS.SITE_URL}/share.png`,
      sameAs: [
        URLS.GITHUB,
        URLS.LINKEDIN,
      ],
    },
    {
      '@context': STRINGS.SCHEMA_CONTEXT,
      '@type': 'WebSite',
      '@id': `${STRINGS.SITE_URL}#website`,
      url: STRINGS.SITE_URL,
      name: 'Luis Krötz',
      description: 'Front-End Software Engineer specializing in performance, design systems, and animations.',
      publisher: {
        '@id': `${STRINGS.SITE_URL}#organization`,
      },
    },
  ]
}

/**
 * Generates an ItemList matching Google Carousel rich results guidelines.
 * @param {Array<{ label: string, link: string, src?: string }>} items - Carousel items
 * @param {string} baseUrl - Base URL for links
 * @returns {Object} ItemList entity
 */
export const generateCarouselItemListSchema = (items = [], baseUrl = STRINGS.SITE_URL) => {
  if (!Array.isArray(items) || items.length === 0) return null

  return {
    '@context': STRINGS.SCHEMA_CONTEXT,
    '@type': 'ItemList',
    itemListElement: items.map((item, idx) => {
      const targetUrl = item.link?.startsWith('http')
        ? item.link
        : `${baseUrl}${PATHS.PORTFOLIO}${item.link || item.slug || ''}`

      return {
        '@type': 'ListItem',
        position: idx + 1,
        url: targetUrl,
        name: item.label || item.title || `Item ${idx + 1}`,
        ...(item.src
          ? {
              image: item.src.startsWith('http')
                ? item.src
                : `${URLS.CDN_BASE}${item.src}`,
            }
          : {}),
      }
    }),
  }
}

/**
 * Generates an Article and VideoObject graph for a project detail page.
 * Includes multiple aspect ratio image variants (16x9, 4x3, 1x1) for Google Rich Results.
 * @param {Object} project - Project translation data
 * @param {string} slug - Project URL slug
 * @param {string} [locale] - Page locale (defaults to LOCALES.EN)
 * @returns {Object[]} Array of Schema.org entities
 */
export const generateProjectArticleSchema = (project, slug, locale = LOCALES.EN) => {
  if (!project || !slug) return []

  const canonicalUrl = `${STRINGS.SITE_URL}${PATHS.PORTFOLIO}${slug}`

  const title = project.title ? stripHtml(project.title) : slug

  const coverSrc = project.cover?.src ? `${URLS.CDN_BASE}${project.folder || ''}${project.cover.src}` : null

  const imageVariants = coverSrc
    ? [
        `${coverSrc}.jpg`,
        `${coverSrc}-16x9.jpg`,
        `${coverSrc}-4x3.jpg`,
        `${coverSrc}-1x1.jpg`,
      ]
    : [`${STRINGS.SITE_URL}/share.png`]

  const article = {
    '@context': STRINGS.SCHEMA_CONTEXT,
    '@type': 'Article',
    '@id': `${canonicalUrl}#article`,
    isPartOf: {
      '@type': 'WebPage',
      '@id': canonicalUrl,
      url: canonicalUrl,
      name: title,
      inLanguage: locale,
    },
    headline: title,
    inLanguage: locale,
    mainEntityOfPage: canonicalUrl,
    datePublished: STRINGS.SCHEMA_PUBLISHED_DATE,
    dateModified: new Date().toISOString(),
    author: {
      '@type': 'Person',
      name: 'Luis Krötz',
      url: STRINGS.SITE_URL,
    },
    publisher: {
      '@type': 'Person',
      name: 'Luis Krötz',
      url: STRINGS.SITE_URL,
    },
    image: imageVariants,
    description: `Case study for ${title} built by Software Engineer Luis Krötz.`,
  }

  const entities = [article]

  // Add VideoObject schema if project has a cover video or section videos
  if (project.cover?.isVideo) {
    const videoUrl = `${URLS.CDN_BASE}${project.folder || ''}${project.cover.src}.mp4`

    const posterUrl = `${URLS.CDN_BASE}${project.folder || ''}${project.cover.src}.mp4.jpg-thumb.jpg`

    entities.push({
      '@context': STRINGS.SCHEMA_CONTEXT,
      '@type': 'VideoObject',
      name: `${title} Video Tour`,
      description: `Showcase video for ${title}`,
      thumbnailUrl: [posterUrl],
      uploadDate: STRINGS.SCHEMA_PUBLISHED_DATE,
      duration: STRINGS.SCHEMA_VIDEO_DURATION,
      contentUrl: videoUrl,
      embedUrl: videoUrl,
    })
  }

  return entities
}

/**
 * Dynamically updates the JSON-LD script graph in the document head.
 * @param {Object|Object[]} graph - Schema object or array of schema entities
 */
export const updateJsonLd = (graph) => {
  if (typeof document === STRINGS.UNDEFINED || !graph) return

  const scriptId = STRINGS.JSON_LD_SCRIPT_ID

  let scriptEl = document.getElementById(scriptId)

  if (!scriptEl) {
    scriptEl = document.createElement('script')

    scriptEl.id = scriptId

    scriptEl.type = STRINGS.JSON_LD_SCRIPT_TYPE

    document.head.appendChild(scriptEl)
  }

  const payload = Array.isArray(graph)
    ? { '@context': STRINGS.SCHEMA_CONTEXT, '@graph': graph }
    : graph

  scriptEl.textContent = JSON.stringify(payload)
}
