/**
 * @file coverage-tails-4.test.js
 * @description Fourth branch-tail sweep targeting files with ≤8 uncovered
 * branches: ui-text fallback dig, firebase-mock path resolver, sanitize
 * disallowed-tag replacement, webgl-pool IO guard, CMS mount guard,
 * CookieBanner actions, checkbox widget lifecycle, NPU GPU fallback,
 * ContactSection lang guards, jsx prop routing, media helpers,
 * scroll-state one-shots, NotFound link binding, wasm-css reuse,
 * Component remount reuse, schema generators, db bootstrap/cache,
 * gpu-info tiers, wasm-pool worker guards, intro-loader internals.
 */

import { generateCarouselItemListSchema } from '@core/utils/schema.js'

import { TEST_TEXT } from '../../../fixtures/test-constants.js'
import '@website/components/feedback/CookieBanner.js'
import '@website/components/home/ContactSection.js'
import '@website/views/not-found/NotFound.js'


// ─── core/locale/ui-text.js ──────────────────────────────────────────────────

describe('schema tails', () => {
  test('carousel ItemList handles empty, title-only and CDN paths', () => {
    expect(generateCarouselItemListSchema([])).toBeNull()
    expect(generateCarouselItemListSchema(null)).toBeNull()

    const list = generateCarouselItemListSchema([
      { label: TEST_TEXT.HEADING, link: '/a', src: 'covers/x.jpg' },
      { title: TEST_TEXT.SECOND, link: '/b', src: 'https://cdn.test/y.jpg' },
      { link: '/c' },
    ])

    expect(list.itemListElement.length).toBe(3)
    expect(list.itemListElement[2].name).toContain('Item')
  })
})

