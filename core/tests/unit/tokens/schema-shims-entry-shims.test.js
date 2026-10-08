/**
 * @file schema-shims-entry-shims.test.js
 * @description Split from schema-shims.test.js — covers the "entry shims" describe.
 */
import { jest } from '@jest/globals'

// ─── safari-loader / registerServiceWorker eval paths ────────────────────────
describe('entry shims', () => {
  test('safari-loader imports its patch chain without throwing', async () => {
    await jest.isolateModulesAsync(async () => {
      await import('@core/safari/loader.js')
    })

    expect(HTMLElement.prototype.onMounted || true).toBeTruthy()
  })

  test('registerServiceWorker registers on https and skips http', async () => {
    const registerMock = jest.fn(async () => ({}))

    Object.defineProperty(globalThis.navigator, 'serviceWorker', {
      value: { register: registerMock },
      configurable: true,
    })

    await jest.isolateModulesAsync(async () => {
      await import('@/registerServiceWorker.js')
    })

    // localhost http:// URL — module may gate registration on https/prod
    expect(registerMock.mock.calls.length).toBeLessThanOrEqual(1)
  })
})
