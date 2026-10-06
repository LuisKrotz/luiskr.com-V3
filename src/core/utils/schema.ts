/**
 * @file schema.ts
 * @description JSON-LD structured-data builders (Schema.org entities for
 * Organization, WebSite, ItemList/carousel, Article, VideoObject) plus
 * updateJsonLd() which maintains the single <script id="json-ld"> node in
 * <head>. Called by Home and Project views so search engines always see
 * the current page's graph.
 */

import { LOCALES } from '@/core/tokens/locales.js'
import { ROUTE_PATHS } from '@/core/tokens/routes/paths.js'
import { NET_STRINGS } from '@/core/tokens/strings/net.js'
import { SCHEMA_STRINGS } from '@/core/tokens/strings/schema.js'
import { TYPE_STRINGS } from '@/core/tokens/strings/types.js'
import { stripHtml } from './string.js'
import { CDN_URLS, SOCIAL_URLS } from '@/core/tokens/media/urls.js'

interface CarouselSchemaItem {
  label?: string
  link?: string
  slug?: string
  title?: string
  src?: string
}

interface ProjectSchemaSource {
  title?: string
  folder?: string
  cover?: { src?: string; isVideo?: boolean }
}

/**
 * Generates WebSite and Organization schema for the homepage.
 * @returns JSON-LD entities
 */
export const generateWebsiteSchema = (): Record<string, unknown>[] => {
  return [
    {
      '@context': SCHEMA_STRINGS.SCHEMA_CONTEXT,
      '@type': 'Organization',
      '@id': `${NET_STRINGS.SITE_URL}#organization`,
      legalName: 'Jacson Luis Krötz',
      name: 'Luis Krötz',
      url: NET_STRINGS.SITE_URL,
      logo: `${NET_STRINGS.SITE_URL}/favicon/android-chrome-512x512.png`,
      image: `${NET_STRINGS.SITE_URL}/share.png`,
      sameAs: [SOCIAL_URLS.GITHUB, SOCIAL_URLS.LINKEDIN],
    },
    {
      '@context': SCHEMA_STRINGS.SCHEMA_CONTEXT,
      '@type': 'WebSite',
      '@id': `${NET_STRINGS.SITE_URL}#website`,
      url: NET_STRINGS.SITE_URL,
      name: 'Luis Krötz',
      description:
        'Front-End Software Engineer specializing in performance, design systems, and animations.',
      publisher: {
        '@id': `${NET_STRINGS.SITE_URL}#organization`,
      },
    },
  ]
}

/**
 * Generates an ItemList matching Google Carousel rich results guidelines.
 * @returns ItemList entity
 */
export const generateCarouselItemListSchema = (
  items: CarouselSchemaItem[] = [],
  baseUrl: string = NET_STRINGS.SITE_URL
): Record<string, unknown> | null => {
  if (!Array.isArray(items) || items.length === 0) return null

  return {
    '@context': SCHEMA_STRINGS.SCHEMA_CONTEXT,
    '@type': 'ItemList',
    itemListElement: items.map((item, idx) => {
      const targetUrl = item.link?.startsWith('http')
        ? item.link
        : `${baseUrl}${ROUTE_PATHS.PORTFOLIO}${item.link || item.slug || ''}`

      return {
        '@type': 'ListItem',
        position: idx + 1,
        url: targetUrl,
        name: item.label || item.title || `Item ${idx + 1}`,
        ...(item.src
          ? {
              image: item.src.startsWith('http') ? item.src : `${CDN_URLS.CDN_BASE}${item.src}`,
            }
          : {}),
      }
    }),
  }
}

/**
 * Generates an Article and VideoObject graph for a project detail page.
 * Includes multiple aspect ratio image variants (16x9, 4x3, 1x1) for Google Rich Results.
 * @param project - Project translation data
 * @param slug - Project URL slug
 * @param locale - Page locale (defaults to LOCALES.EN)
 * @returns Array of Schema.org entities
 */
export const generateProjectArticleSchema = (
  project: ProjectSchemaSource | null,
  slug: string,
  locale: string = LOCALES.EN
): Record<string, unknown>[] => {
  if (!project || !slug) return []

  const canonicalUrl = `${NET_STRINGS.SITE_URL}${ROUTE_PATHS.PORTFOLIO}${slug}`

  const title = project.title ? stripHtml(project.title) : slug

  const coverSrc = project.cover?.src
    ? `${CDN_URLS.CDN_BASE}${project.folder || ''}${project.cover.src}`
    : null

  const imageVariants = coverSrc
    ? [`${coverSrc}.jpg`, `${coverSrc}-16x9.jpg`, `${coverSrc}-4x3.jpg`, `${coverSrc}-1x1.jpg`]
    : [`${NET_STRINGS.SITE_URL}/share.png`]

  const article: Record<string, unknown> = {
    '@context': SCHEMA_STRINGS.SCHEMA_CONTEXT,
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
    datePublished: SCHEMA_STRINGS.SCHEMA_PUBLISHED_DATE,
    dateModified: new Date().toISOString(),
    author: {
      '@type': 'Person',
      name: 'Luis Krötz',
      url: NET_STRINGS.SITE_URL,
    },
    publisher: {
      '@type': 'Person',
      name: 'Luis Krötz',
      url: NET_STRINGS.SITE_URL,
    },
    image: imageVariants,
    description: `Case study for ${title} built by Software Engineer Luis Krötz.`,
  }

  const entities: Record<string, unknown>[] = [article]

  // Add VideoObject schema if project has a cover video or section videos
  if (project.cover?.isVideo) {
    const videoUrl = `${CDN_URLS.CDN_BASE}${project.folder || ''}${project.cover.src}.mp4`

    const posterUrl = `${CDN_URLS.CDN_BASE}${project.folder || ''}${project.cover.src}.mp4.jpg-thumb.jpg`

    entities.push({
      '@context': SCHEMA_STRINGS.SCHEMA_CONTEXT,
      '@type': 'VideoObject',
      name: `${title} Video Tour`,
      description: `Showcase video for ${title}`,
      thumbnailUrl: [posterUrl],
      uploadDate: SCHEMA_STRINGS.SCHEMA_PUBLISHED_DATE,
      duration: SCHEMA_STRINGS.SCHEMA_VIDEO_DURATION,
      contentUrl: videoUrl,
      embedUrl: videoUrl,
    })
  }

  return entities
}

/**
 * Dynamically updates the JSON-LD script graph in the document head.
 */
export const updateJsonLd = (
  graph: Record<string, unknown> | Record<string, unknown>[] | null | undefined
): void => {
  if (typeof document === TYPE_STRINGS.UNDEFINED || !graph) return

  const scriptId = SCHEMA_STRINGS.JSON_LD_SCRIPT_ID

  let scriptEl = document.getElementById(scriptId) as HTMLScriptElement | null

  if (!scriptEl) {
    scriptEl = document.createElement('script')

    scriptEl.id = scriptId

    scriptEl.type = SCHEMA_STRINGS.JSON_LD_SCRIPT_TYPE

    document.head.appendChild(scriptEl)
  }

  const payload = Array.isArray(graph)
    ? { '@context': SCHEMA_STRINGS.SCHEMA_CONTEXT, '@graph': graph }
    : graph

  scriptEl.textContent = JSON.stringify(payload)
}
