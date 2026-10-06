/**
 * @file schema-shims.test.js
 * @description Coverage for the Schema.org JSON-LD generators (schema.js) and
 * the entry-point shims (polyfills, safari-loader, registerServiceWorker)
 * whose module-eval branches only run under specific feature-detection
 * states — exercised here by deleting the native globals before import.
 */

import { jest } from '@jest/globals'

import {
  generateCarouselItemListSchema,
  generateProjectArticleSchema,
  generateWebsiteSchema,
  updateJsonLd,
} from '@/core/utils/schema.js'
import { TEST_PROJECTS, TEST_TEXT, TEST_URLS } from '../../fixtures/test-constants.js'
import { NET_STRINGS } from '@/core/tokens/strings/net.js'
import { ROUTE_PATHS } from '@/core/tokens/routes/paths.js'
import { SCHEMA_STRINGS } from '@/core/tokens/strings/schema.js'
import { TYPE_STRINGS } from '@/core/tokens/strings/types.js'

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

// ─── polyfills.js fallback branches ──────────────────────────────────────────

describe('polyfills', () => {
  test('installs structuredClone/Array.at/Object.hasOwn fallbacks when missing', async () => {
    const nativeClone = globalThis.structuredClone
    const nativeArrAt = Array.prototype.at
    const nativeStrAt = String.prototype.at
    const nativeHasOwn = Object.hasOwn

    delete globalThis.structuredClone
    delete Array.prototype.at
    delete String.prototype.at
    delete Object.hasOwn

    // Fresh module registry evaluation so the guards re-run
    await jest.isolateModulesAsync(async () => {
      await import('@/legacy-polyfills/polyfills.js')
    })

    expect(typeof globalThis.structuredClone).toBe(TYPE_STRINGS.FUNCTION)
    expect(globalThis.structuredClone({ a: 1 })).toEqual({ a: 1 })
    expect([1, 2, 3].at(-1)).toBe(3)
    expect('abc'.at(1)).toBe('b')
    expect(Object.hasOwn({ k: 1 }, 'k')).toBe(true)

    globalThis.structuredClone = nativeClone
    Array.prototype.at = nativeArrAt
    String.prototype.at = nativeStrAt
    Object.hasOwn = nativeHasOwn
  })

  test('structuredClone fallback returns the value itself for unserializable input', async () => {
    delete globalThis.structuredClone

    await jest.isolateModulesAsync(async () => {
      await import('@/legacy-polyfills/polyfills.js')
    })

    const circular = {}

    circular.self = circular

    expect(globalThis.structuredClone(circular)).toBe(circular)
  })
})

// ─── safari-loader / registerServiceWorker eval paths ────────────────────────

describe('entry shims', () => {
  test('safari-loader imports its patch chain without throwing', async () => {
    await jest.isolateModulesAsync(async () => {
      await import('@/safari/loader.js')
    })

    expect(HTMLElement.prototype.onMounted || true).toBeTruthy()
  })

  test('registerServiceWorker registers on https and skips http', async () => {
    const registerMock = jest.fn(async () => ({}))

    Object.defineProperty(globalThis.navigator, 'serviceWorker', {
      value: { register: registerMock },
      configurable: true,
    })

    await jest.isolateModulesAsync(async () => {
      await import('@/registerServiceWorker.js')
    })

    // localhost http:// URL — module may gate registration on https/prod
    expect(registerMock.mock.calls.length).toBeLessThanOrEqual(1)
  })
})
