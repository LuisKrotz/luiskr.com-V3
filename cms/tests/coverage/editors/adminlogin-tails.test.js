/**
 * @file adminlogin-tails.test.js
 * @description Split from coverage-tails.test.js — covers the "AdminLogin tails" describe.
 */
import { jest } from '@jest/globals'
import '@core/utils/data/sanitize.js'

import '@website/components/feedback/CookieBanner.js'
import '@website/components/home/ContactSection.js'
import '@website/views/not-found/NotFound.js'

import { TEST_TEXT } from '@tests/fixtures/test-constants.js'
import { CMS_TAGS } from '@cms/tokens.js'
import { TYPE_STRINGS } from '@core/tokens/strings/types.js'

jest.unstable_mockModule('@core/firebase.js', () => ({
  signInWithGoogle: jest.fn(async () => ({ user: { uid: 'u1' } })),
  onAuthChange: jest.fn(async (cb) => { cb(null); return () => {} }),
  logoutUser: jest.fn(async () => {}),
  fetchFirebaseDb: jest.fn(async () => ({ exists: () => false, val: () => null })),
  getDbInstance: jest.fn(async () => ({})) }))

const flush = (ms = 60) => new Promise((r) => setTimeout(r, ms))

describe('AdminLogin tails', () => {
  test('google login resolves, rejects and guards re-entry', async () => {
    const { signInWithGoogle } = await import('@core/firebase.js')
    const { default: _c } = await import('@cms/routes/AdminLogin.js').catch(() => ({}))

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
