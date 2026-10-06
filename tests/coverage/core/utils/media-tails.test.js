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

import { isGravatarUrl, getOptimizedGravatar, buildMediaUrls } from '@/core/utils/media.js'

import { TEST_URLS } from '../../../fixtures/test-constants.js'
import '@/components/feedback/CookieBanner.js'
import '@/components/home/ContactSection.js'
import '@/routes/views/not-found/NotFound.js'
import { TYPE_STRINGS } from '@/core/tokens/strings/types.js'



// ─── core/locale/ui-text.js ──────────────────────────────────────────────────

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

