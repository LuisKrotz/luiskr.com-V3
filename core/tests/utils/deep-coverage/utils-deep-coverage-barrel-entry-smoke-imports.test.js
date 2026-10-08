/**
 * @file utils-deep-coverage-barrel-entry-smoke-imports.test.js
 * @description Split from utils-deep-coverage.test.js — covers the "barrel + entry smoke imports" describe.
 */
import { describe, test, expect, jest } from '@jest/globals'
import { TYPE_STRINGS } from '@core/tokens/strings/types.js'

const _flush = (ms = 0) => new Promise((r) => setTimeout(r, ms))

// ─── barrels / entry smoke imports ───────────────────────────────────────────
describe('barrel + entry smoke imports', () => {
  test('re-export barrels import cleanly', async () => {
    const core = await import('@core/index.js')

    expect(core.TYPE_STRINGS).toBeTruthy()

    await import('@core/utils/index.js')
    await import('@core/utils/dom.js')
    await import('@core/utils/index.js')
    await import('@core/constants.js')
  })

  test('cms firebase mock implements the full firebase surface', async () => {
    const mock = await import('@cms/dev/firebase-mock.js')

    const origFetch = globalThis.fetch

    globalThis.fetch = jest.fn(async () => ({
      ok: true,
      json: async () => ({ translations: { en: { APP: { foo: 'x' } } } }),
    }))

    const r = mock.ref(mock.getDatabase(), 'translations/en/APP')
    const child = mock.child(r, 'foo')
    const snap = await mock.get(child)

    expect(snap.exists()).toBe(true)
    expect(snap.val()).toBe('x')

    await mock.set(r, 1)
    await mock.remove(r)
    await mock.update(r, {})

    const unsub = await mock.onAuthChange((u) => expect(u.uid).toBe('cms-mock'))

    expect(typeof unsub).toBe(TYPE_STRINGS.FUNCTION)
    await mock.getDbInstance()
    await mock.signInWithGoogle()
    await mock.logoutUser()

    const node = await mock.fetchFirebaseDb('translations/en/APP/foo')

    expect(node).toBe('x')

    globalThis.fetch = origFetch
  })
})
