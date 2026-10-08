/**
 * @file docs-schema.test.js
 * @description Coverage tails for generateDocsSchema() — the docs-portal
 * JSON-LD builder. Exercises the portal-root CollectionPage, folder
 * CollectionPage with breadcrumb depth, and file-page TechArticle with
 * and without an mtime stamp (dateModified arm).
 */

import { generateDocsSchema, updateJsonLd } from '@core/utils/schema.js'
import { NET_STRINGS } from '@core/tokens/strings/net.js'
import { SCHEMA_STRINGS } from '@core/tokens/strings/schema.js'

const DOC_PAGE = { name: 'guide.md', type: 'file', mtime: '2026-01-02T03:04:05.000Z' }
const DIR_PAGE = { name: 'architecture', type: 'dir' }

describe('generateDocsSchema', () => {
  test('portal root emits BreadcrumbList + CollectionPage with a single crumb', () => {
    const [breadcrumb, page] = generateDocsSchema('', null)

    expect(breadcrumb['@type']).toBe('BreadcrumbList')
    expect(breadcrumb.itemListElement).toHaveLength(1)
    expect(breadcrumb.itemListElement[0].item).toBe(`${NET_STRINGS.SITE_URL}/docs`)
    expect(page['@type']).toBe('CollectionPage')
    expect(page['@id']).toBe(`${NET_STRINGS.SITE_URL}/docs`)
    expect(page.inLanguage).toBe('en')
    expect(page.dateModified).toBeUndefined()
  })

  test('folder page emits nested crumbs and CollectionPage', () => {
    const [breadcrumb, page] = generateDocsSchema('docs/architecture', DIR_PAGE)

    expect(breadcrumb.itemListElement).toHaveLength(3)
    expect(breadcrumb.itemListElement[2].name).toBe('architecture')
    expect(breadcrumb.itemListElement[2].item).toBe(
      `${NET_STRINGS.SITE_URL}/docs/docs/architecture`
    )
    expect(page['@type']).toBe('CollectionPage')
    expect(page.url).toBe(`${NET_STRINGS.SITE_URL}/docs/docs/architecture`)
  })

  test('file page emits TechArticle with mtime-derived dates', () => {
    const [, page] = generateDocsSchema('docs/build.md', DOC_PAGE)

    expect(page['@type']).toBe('TechArticle')
    expect(page.name).toBe('guide.md')
    expect(page.datePublished).toBe(SCHEMA_STRINGS.SCHEMA_PUBLISHED_DATE)
    expect(page.dateModified).toBe(DOC_PAGE.mtime)
    expect(page.description).toContain('guide.md')
  })

  test('file page without mtime omits date fields', () => {
    const [, page] = generateDocsSchema('docs/readme.md', { name: 'readme.md', type: 'file' })

    expect(page['@type']).toBe('TechArticle')
    expect(page.dateModified).toBeUndefined()
    expect(page.datePublished).toBeUndefined()
  })
})

describe('updateJsonLd clear arm', () => {
  test('null removes the graph node; repeated null is a no-op', () => {
    updateJsonLd({ '@type': 'One' })

    const el = document.getElementById(SCHEMA_STRINGS.JSON_LD_SCRIPT_ID)

    expect(el).not.toBeNull()

    updateJsonLd(null)

    expect(document.getElementById(SCHEMA_STRINGS.JSON_LD_SCRIPT_ID)).toBeNull()

    // No node present — the optional-chain null arm.
    expect(() => updateJsonLd(undefined)).not.toThrow()
  })

  test('SSR guard — no document means no DOM work at all', () => {
    const origDoc = globalThis.document

    delete globalThis.document

    expect(() => updateJsonLd({ '@type': 'One' })).not.toThrow()
    expect(() => updateJsonLd(null)).not.toThrow()

    globalThis.document = origDoc
  })
})
