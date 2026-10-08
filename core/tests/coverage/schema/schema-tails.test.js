/**
 * @file schema-tails.test.js
 * @description Split from coverage-tails-4.test.js — covers the "schema tails" describe.
 */
import { generateCarouselItemListSchema } from '@core/utils/schema.js'

import { TEST_TEXT } from '@tests/fixtures/test-constants.js'
import '@website/components/feedback/CookieBanner.js'
import '@website/components/home/ContactSection.js'
import '@website/views/not-found/NotFound.js'

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
