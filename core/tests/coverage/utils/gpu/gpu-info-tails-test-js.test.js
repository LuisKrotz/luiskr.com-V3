/**
 * @file gpu-info-tails-test-js.test.js
 * @description Split from coverage-tails.test.js — covers the "gpu-info tails" describe.
 */
import { jest } from '@jest/globals'
import '@core/utils/data/sanitize.js'

import { glContextOptions } from '@core/utils/gpu/gpu-info.js'

import '@website/components/feedback/CookieBanner.js'
import '@website/components/home/ContactSection.js'
import '@website/views/not-found/NotFound.js'
import { CHAR_STRINGS } from '@core/tokens/strings/chars.js'
import { TYPE_STRINGS } from '@core/tokens/strings/types.js'

jest.unstable_mockModule('@core/firebase.js', () => ({
  signInWithGoogle: jest.fn(async () => ({ user: { uid: 'u1' } })),
  onAuthChange: jest.fn(async (cb) => {
    cb(null)
    return () => {}
  }),
  logoutUser: jest.fn(async () => {}),
  fetchFirebaseDb: jest.fn(async () => ({ exists: () => false, val: () => null })),
  getDbInstance: jest.fn(async () => ({})),
}))

describe('gpu-info tails', () => {
  test('renderer classification via debug extension', async () => {
    const fakeGl = {
      getExtension: (name) => (name ? { UNMASKED_RENDERER_WEBGL: 1 } : null),
      getParameter: () => 'Apple M3',
    }

    const proto = window.HTMLCanvasElement.prototype
    const prev = proto.getContext

    proto.getContext = () => fakeGl

    jest.resetModules()
    const { getGPUInfo } = await import('@core/utils/gpu/gpu-info.js')

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
    const { getGPUInfo } = await import('@core/utils/gpu/gpu-info.js')

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
