/**
 * @file schema-shims-schema-generators.test.js
 * @description Split from schema-shims.test.js — covers the "schema generators" describe.
 */
import {
  generateCarouselItemListSchema,
  generateProjectArticleSchema,
  generateWebsiteSchema,
  updateJsonLd,
} from '@core/utils/schema.js'
import { TEST_PROJECTS, TEST_TEXT, TEST_URLS } from '@tests/fixtures/test-constants.js'
import { NET_STRINGS } from '@core/tokens/strings/net.js'
import { ROUTE_PATHS } from '@core/tokens/routes/paths.js'
import { SCHEMA_STRINGS } from '@core/tokens/strings/schema.js'

// ─── schema.js generators ────────────────────────────────────────────────────
describe('schema generators', () => {
  test('generateCarouselItemListSchema wraps items in an ItemList', () => {
    const schema = generateCarouselItemListSchema([
      { label: TEST_TEXT.HEADING, src: TEST_URLS.IMG, link: TEST_PROJECTS.CICB },
      { title: 'NoImage', slug: TEST_PROJECTS.CICB },
      { label: 'Cdn', src: `${TEST_PROJECTS.CICB}/cover`, link: TEST_URLS.IMG },
      { label: 'Bare' },
    ])

    expect(schema['@type']).toBe('ItemList')
    expect(schema.itemListElement).toHaveLength(4)
    expect(schema.itemListElement[0].image).toBe(TEST_URLS.IMG)
    expect(schema.itemListElement[1].image).toBeUndefined()
    expect(schema.itemListElement[2].url).toBe(TEST_URLS.IMG)
    expect(schema.itemListElement[3].url).toBe(`${NET_STRINGS.SITE_URL}${ROUTE_PATHS.PORTFOLIO}`)
  })

  test('generateCarouselItemListSchema returns null for empty input', () => {
    expect(generateCarouselItemListSchema()).toBeNull()
    expect(generateCarouselItemListSchema(null)).toBeNull()
  })

  test('generateProjectArticleSchema returns [] for missing inputs', () => {
    expect(generateProjectArticleSchema(null, TEST_PROJECTS.CICB)).toEqual([])
    expect(generateProjectArticleSchema({}, '')).toEqual([])
  })

  test('generateProjectArticleSchema builds Article + VideoObject entities', () => {
    const project = {
      title: `<p>${TEST_TEXT.HEADING}</p>`,
      folder: `${TEST_PROJECTS.CICB}/`,
      cover: { src: 'cover', isVideo: true },
    }

    const entities = generateProjectArticleSchema(project, TEST_PROJECTS.CICB)

    expect(entities[0]['@type']).toBe('Article')
    expect(entities[0].image.length).toBe(4)
    expect(entities[1]['@type']).toBe('VideoObject')
  })

  test('generateProjectArticleSchema falls back to the share image without a cover', () => {
    const entities = generateProjectArticleSchema({ title: TEST_TEXT.HEADING }, TEST_PROJECTS.CICB)

    expect(entities[0].image).toHaveLength(1)
    expect(entities).toHaveLength(1)
  })

  test('generateProjectArticleSchema uses slug title and cover without src', () => {
    const entities = generateProjectArticleSchema({ cover: {} }, TEST_PROJECTS.CICB)

    expect(entities[0].headline).toBe(TEST_PROJECTS.CICB)
    expect(entities[0].image).toHaveLength(1)
  })

  test('generateProjectArticleSchema video entity tolerates a missing folder', () => {
    const entities = generateProjectArticleSchema(
      { title: TEST_TEXT.HEADING, cover: { src: 'c', isVideo: true } },
      TEST_PROJECTS.CICB
    )

    expect(entities[1]['@type']).toBe('VideoObject')
  })

  test('generateWebsiteSchema emits Organization + WebSite entities', () => {
    const schema = generateWebsiteSchema()

    expect(schema.find((e) => e['@type'] === 'WebSite')).toBeTruthy()
    expect(schema.find((e) => e['@type'] === 'Organization')).toBeTruthy()
  })

  test('updateJsonLd injects a script node and replaces an existing one', () => {
    updateJsonLd({ '@type': 'One' })

    const first =
      document.getElementById(SCHEMA_STRINGS.JSON_LD_SCRIPT_ID) ||
      document.querySelector('script[type="application/ld+json"]')

    expect(first).toBeTruthy()

    updateJsonLd({ '@type': 'Two' })

    const scripts = document.querySelectorAll('script[type="application/ld+json"]')

    expect(scripts.length).toBe(1)

    expect(() => updateJsonLd(null)).not.toThrow()
  })
})
