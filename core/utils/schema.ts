/**
 * @file schema.ts
 * @description JSON-LD structured-data builders (Schema.org entities for
 * Organization, WebSite, ItemList/carousel, Article, VideoObject) plus
 * updateJsonLd() which maintains the single <script id="json-ld"> node in
 * <head>. Called by Home and Project views so search engines always see
 * the current page's graph.
 */

import { LOCALES } from '@core/tokens/locales.js'
import { DOCS_STRINGS } from '@core/tokens/strings/docs.js'
import { ROUTE_NAMES } from '@core/tokens/routes/names.js'
import { ROUTE_PATHS } from '@core/tokens/routes/paths.js'
import { NET_STRINGS } from '@core/tokens/strings/net.js'
import { SCHEMA_STRINGS } from '@core/tokens/strings/schema.js'
import { TYPE_STRINGS } from '@core/tokens/strings/types.js'
import { stripHtml } from './string.js'
import { CDN_URLS, SOCIAL_URLS } from '@core/tokens/media/urls.js'

/** Award/press item as handed to the ItemList builder — label/title are display names, link/slug feed the target URL. */
interface CarouselSchemaItem {
  label?: string
  link?: string
  slug?: string
  title?: string
  src?: string
}

/** Project translation slice the Article/VideoObject builders read — cover drives both image variants and the optional VideoObject. */
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
 * Generates an ItemList matching Google Carousel rich results guidelines —
 * `position` is 1-based per the spec, and `image` is only emitted when the
 * item carries a src (an absent property beats an empty one for parsers).
 * @returns ItemList entity, or null when there is nothing to list.
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
      // Absolute links (external press) pass through verbatim; internal
      // slugs get prefixed with the portfolio route so crawlers resolve
      // to canonical project pages rather than bare fragments.
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

/** Minimal manifest-node shape the docs schema reads — kept structural so `core` never imports from `experiments`. */
interface DocsSchemaNode {
  name?: string
  type?: 'dir' | 'file'
  mtime?: string
}

/**
 * Generates the docs-portal JSON-LD graph for a resolved docs path:
 * a `BreadcrumbList` mirroring the on-page crumb trail plus one page
 * entity — `CollectionPage` for the portal root and folders,
 * `TechArticle` for file pages (markdown/code/report payloads). English
 * is the only docs locale, so `inLanguage` is fixed to `en`.
 * @param docsPath Manifest-relative path ('' → the portal root).
 * @param node     Resolved manifest node (null at the root / on misses).
 * @returns JSON-LD entities for updateJsonLd().
 */
export const generateDocsSchema = (
  docsPath: string,
  node: DocsSchemaNode | null
): Record<string, unknown>[] => {
  const pageUrl = `${NET_STRINGS.SITE_URL}${ROUTE_PATHS.DOCS}${docsPath ? `/${docsPath}` : ''}`

  const segments = docsPath.split('/').filter(Boolean)

  const breadcrumb: Record<string, unknown> = {
    '@context': SCHEMA_STRINGS.SCHEMA_CONTEXT,
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: ROUTE_NAMES.DOCS,
        item: `${NET_STRINGS.SITE_URL}${ROUTE_PATHS.DOCS}`,
      },
      ...segments.map((seg, i) => ({
        '@type': 'ListItem',
        position: i + 2,
        name: seg,
        item: `${NET_STRINGS.SITE_URL}${ROUTE_PATHS.DOCS}/${segments.slice(0, i + 1).join('/')}`,
      })),
    ],
  }

  const isFile = node?.type === 'file'

  const page: Record<string, unknown> = {
    '@context': SCHEMA_STRINGS.SCHEMA_CONTEXT,
    '@type': isFile ? 'TechArticle' : 'CollectionPage',
    '@id': pageUrl,
    url: pageUrl,
    name: isFile ? String(node?.name) : DOCS_STRINGS.TITLE,
    inLanguage: LOCALES.EN,
    isPartOf: {
      '@type': 'WebSite',
      '@id': `${NET_STRINGS.SITE_URL}#website`,
      url: NET_STRINGS.SITE_URL,
      name: 'Luis Krötz',
    },
    publisher: {
      '@id': `${NET_STRINGS.SITE_URL}#organization`,
    },
    description: isFile
      ? `${String(node?.name)} — published as part of the luiskr.com documentation portal.`
      : DOCS_STRINGS.SCHEMA_DESCRIPTION,
    ...(isFile && node?.mtime
      ? { dateModified: node.mtime, datePublished: SCHEMA_STRINGS.SCHEMA_PUBLISHED_DATE }
      : {}),
  }

  return [breadcrumb, page]
}

/**
 * Dynamically updates the JSON-LD script graph in the document head.
 * Maintains exactly one `<script type="application/ld+json">` node — an
 * array payload is wrapped in a `@graph` container so a single script can
 * carry the whole entity set (the form Google's parsers prefer), and
 * `textContent` (not innerHTML) writes it since JSON must not go through
 * the HTML parser. Passing `null`/`undefined` REMOVES the node — routes
 * that own a page-scoped graph (docs TechArticle, project Article) clear
 * it on teardown so the entity never leaks onto the next route.
 * @param graph Entity or entity array; null/undefined removes the node.
 */
export const updateJsonLd = (
  graph: Record<string, unknown> | Record<string, unknown>[] | null | undefined
): void => {
  if (typeof document === TYPE_STRINGS.UNDEFINED) return

  const scriptId = SCHEMA_STRINGS.JSON_LD_SCRIPT_ID

  let scriptEl = document.getElementById(scriptId) as HTMLScriptElement | null

  if (!graph) {
    scriptEl?.remove()

    return
  }

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
