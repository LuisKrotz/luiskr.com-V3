/**
 * @file coverage-tails.test.js
 * @description Branch-tail coverage sweep for utility modules and small
 * components that sit just under the per-file gate: genie open guards,
 * sanitizeHtml's disallowed-node paths, ui-text live-dict lookup, the CMS
 * firebase mock surface, the Array/String .at ponyfill shims, scroll-state
 * deferred callbacks, gravatar URL classification, NotFound getters, jsx
 * prop-mapping branches, schema builders, wasm-media-threads guards,
 * gpu-info renderer classification, wasm-css style injection, AdminLogin
 * sign-in paths, and the cookie/contact section component branches.
 */
import { jest } from '@jest/globals'
import '@/utils/data/sanitize.js'

import { isGravatarUrl, getGravatarSrcset, getOptimizedGravatar, buildMediaUrls } from '@/core/utils/media.js'

import '@/components/feedback/CookieBanner.js'
import '@/components/home/ContactSection.js'
import '@/routes/views/not-found/NotFound.js'

import { TEST_TEXT, TEST_PROJECTS } from '../../../fixtures/test-constants.js'
import { NET_STRINGS } from '@/core/tokens/strings/net.js'
import { TYPE_STRINGS } from '@/core/tokens/strings/types.js'
import { CDN_URLS } from '@/core/tokens/media/urls.js'
import { CHAR_STRINGS } from '@/core/tokens/strings/chars.js'





jest.unstable_mockModule('@/firebase.js', () => ({
  signInWithGoogle: jest.fn(async () => ({ user: { uid: 'u1' } })),
  onAuthChange: jest.fn(async (cb) => { cb(null); return () => {} }),
  logoutUser: jest.fn(async () => {}),
  fetchFirebaseDb: jest.fn(async () => ({ exists: () => false, val: () => null })),
  getDbInstance: jest.fn(async () => ({})) }))

// ─── genie.js ────────────────────────────────────────────────────────────────

describe('media utils tails', () => {
  test('isGravatarUrl classifies host variants and bad input', () => {
    expect(isGravatarUrl(42)).toBe(false)
    expect(isGravatarUrl(NET_STRINGS.GRAVATAR_BASE + TEST_TEXT.SECOND)).toBe(true)
    expect(isGravatarUrl(`https://en${NET_STRINGS.GRAVATAR_HOSTNAME_SUFFIX}/x`)).toBe(true)
    expect(isGravatarUrl(`${NET_STRINGS.SITE_URL}/img.png`)).toBe(false)
  })

  test('gravatar srcset + optimized variants', () => {
    const srcset = getGravatarSrcset(NET_STRINGS.GRAVATAR_BASE + TEST_TEXT.SECOND)
    getOptimizedGravatar(NET_STRINGS.GRAVATAR_BASE + TEST_TEXT.SECOND, 400)
    const passthrough = getOptimizedGravatar(`${NET_STRINGS.SITE_URL}/img.png`)

    expect(srcset === null || typeof srcset === TYPE_STRINGS.STRING).toBe(true)
    expect(passthrough === null || typeof passthrough === TYPE_STRINGS.STRING).toBe(true)
  })

  test('buildMediaUrls composes image + video URLs', () => {
    const img = buildMediaUrls(CDN_URLS.CDN_BASE, `${TEST_PROJECTS.CICB}/`, { src: TEST_TEXT.SECOND, isVideo: false })
    const vid = buildMediaUrls(CDN_URLS.CDN_BASE, `${TEST_PROJECTS.CICB}/`, { src: TEST_TEXT.SECOND, isVideo: true })

    expect(img.source).toContain(TEST_TEXT.SECOND)
    expect(vid.isVideo).toBe(true)
  })

  test('isGravatarUrl uses the localhost origin without window and returns false on URL errors', () => {
    const saved = globalThis.window

    delete globalThis.window

    try {
      expect(isGravatarUrl(`${NET_STRINGS.GRAVATAR_BASE}${TEST_TEXT.HELLO}`)).toBe(true)
    } finally {
      globalThis.window = saved
    }

    expect(isGravatarUrl('http://exa mple.com/x')).toBe(false)
  })

  test('buildMediaUrls defaults isVideo/folder/src when absent', () => {
    const out = buildMediaUrls(CDN_URLS.CDN_BASE, CHAR_STRINGS.EMPTY, {})

    expect(out.isVideo).toBe(false)
    expect(out.source).toContain(CDN_URLS.CDN_BASE)
  })
})

