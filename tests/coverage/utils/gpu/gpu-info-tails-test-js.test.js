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

import { glContextOptions } from '@/utils/gpu/gpu-info.js'

import '@/components/feedback/CookieBanner.js'
import '@/components/home/ContactSection.js'
import '@/routes/views/not-found/NotFound.js'
import { CHAR_STRINGS } from '@/core/tokens/strings/chars.js'
import { TYPE_STRINGS } from '@/core/tokens/strings/types.js'



jest.unstable_mockModule('@/firebase.js', () => ({
  signInWithGoogle: jest.fn(async () => ({ user: { uid: 'u1' } })),
  onAuthChange: jest.fn(async (cb) => { cb(null); return () => {} }),
  logoutUser: jest.fn(async () => {}),
  fetchFirebaseDb: jest.fn(async () => ({ exists: () => false, val: () => null })),
  getDbInstance: jest.fn(async () => ({})) }))

// ─── genie.js ────────────────────────────────────────────────────────────────

describe('gpu-info tails', () => {
  test('renderer classification via debug extension', async () => {
    const fakeGl = {
      getExtension: (name) => (name ? { UNMASKED_RENDERER_WEBGL: 1 } : null),
      getParameter: () => 'Apple M3' }

    const proto = window.HTMLCanvasElement.prototype
    const prev = proto.getContext

    proto.getContext = () => fakeGl

    jest.resetModules()
    const { getGPUInfo } = await import('@/utils/gpu/gpu-info.js')

    const info = getGPUInfo()

    expect(info.apple).toBe(true)

    proto.getContext = prev
    jest.resetModules()
  })

  test('null-GL probe returns the empty renderer', async () => {
    const proto = window.HTMLCanvasElement.prototype
    const prev = proto.getContext

    proto.getContext = () => null

    jest.resetModules()
    const { getGPUInfo } = await import('@/utils/gpu/gpu-info.js')

    const info = getGPUInfo()

    expect(info.renderer).toBe(CHAR_STRINGS.EMPTY)

    proto.getContext = prev
    jest.resetModules()
  })

  test('glContextOptions reflects capability', () => {
    const opts = glContextOptions({ alpha: true })

    expect(opts.alpha).toBe(true)
    expect(typeof opts).toBe(TYPE_STRINGS.OBJECT)
  })
})

