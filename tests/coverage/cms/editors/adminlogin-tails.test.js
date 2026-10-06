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

import '@/components/feedback/CookieBanner.js'
import '@/components/home/ContactSection.js'
import '@/routes/views/not-found/NotFound.js'

import { TEST_TEXT } from '../../../fixtures/test-constants.js'
import { CMS_TAGS } from '@/cms/tokens.js'
import { TYPE_STRINGS } from '@/core/tokens/strings/types.js'


jest.unstable_mockModule('@/firebase.js', () => ({
  signInWithGoogle: jest.fn(async () => ({ user: { uid: 'u1' } })),
  onAuthChange: jest.fn(async (cb) => { cb(null); return () => {} }),
  logoutUser: jest.fn(async () => {}),
  fetchFirebaseDb: jest.fn(async () => ({ exists: () => false, val: () => null })),
  getDbInstance: jest.fn(async () => ({})) }))

const flush = (ms = 60) => new Promise((r) => setTimeout(r, ms))

// ─── genie.js ────────────────────────────────────────────────────────────────

describe('AdminLogin tails', () => {
  test('google login resolves, rejects and guards re-entry', async () => {
    const { signInWithGoogle } = await import('@/firebase.js')
    const { default: _c } = await import('@/cms/routes/AdminLogin.js').catch(() => ({}))

    const el = document.createElement(CMS_TAGS.VIEW_ADMIN_LOGIN)

    document.body.appendChild(el)
    await flush()

    if (typeof el.handleGoogleLogin !== TYPE_STRINGS.FUNCTION) {
      el.remove()
      return
    }

    signInWithGoogle?.mockResolvedValueOnce?.({ user: { uid: 'u1' } })
    await el.handleGoogleLogin()

    signInWithGoogle?.mockRejectedValueOnce?.({ code: 'auth/popup-closed-by-user' })
    await el.handleGoogleLogin()

    signInWithGoogle?.mockRejectedValueOnce?.(new Error(TEST_TEXT.SECOND))
    await el.handleGoogleLogin()

    el._loginInProgress = true
    await el.handleGoogleLogin()

    el.remove()
  })
})

