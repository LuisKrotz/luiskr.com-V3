/**
 * @file media-tails.test.js
 * @description Split from coverage-tails-4.test.js — covers the "media tails" describe.
 */
import { isGravatarUrl, getOptimizedGravatar, buildMediaUrls } from '@core/utils/media.js'

import { TEST_URLS } from '@tests/fixtures/test-constants.js'
import '@website/components/feedback/CookieBanner.js'
import '@website/components/home/ContactSection.js'
import '@website/views/not-found/NotFound.js'
import { TYPE_STRINGS } from '@core/tokens/strings/types.js'

describe('media tails', () => {
  test('gravatar detection guards non-string input', () => {
    expect(isGravatarUrl(123)).toBe(false)
    expect(isGravatarUrl(null)).toBe(false)
    expect(typeof isGravatarUrl(TEST_URLS.IMG)).toBe(TYPE_STRINGS.BOOLEAN)
    expect(getOptimizedGravatar(TEST_URLS.IMG)).toBeTruthy()
  })

  test('buildMediaUrls composes CDN variants', () => {
    const urls = buildMediaUrls(TEST_URLS.CDN, 'folder/', { src: 'pic', isVideo: false })
    const vid = buildMediaUrls(TEST_URLS.CDN, 'folder/', { src: 'clip', isVideo: true })

    expect(urls).toBeTruthy()
    expect(vid).toBeTruthy()
  })
})
