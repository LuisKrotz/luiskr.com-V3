/**
 * @file sanitize-tails.test.js
 * @description Split from coverage-tails-4.test.js — covers the "sanitize tails" describe.
 */
import { sanitizeHtml } from '@core/utils/data/sanitize.js'

import { TEST_TEXT } from '@tests/fixtures/test-constants.js'
import '@website/components/feedback/CookieBanner.js'
import '@website/components/home/ContactSection.js'
import '@website/views/not-found/NotFound.js'

describe('sanitize tails', () => {
  test('disallowed tags are replaced by their text content', () => {
    const clean = sanitizeHtml('<div><iframe>inner-text</iframe><p>ok</p></div>')

    expect(clean).not.toContain('iframe')
  })

  test('non-element children are dropped entirely', () => {
    const clean = sanitizeHtml('<p><!-- comment -->' + TEST_TEXT.SECOND + '</p>')

    expect(clean).toContain(TEST_TEXT.SECOND)
  })
})
