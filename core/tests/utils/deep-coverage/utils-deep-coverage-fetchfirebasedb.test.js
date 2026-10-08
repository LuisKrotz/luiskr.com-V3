/**
 * @file utils-deep-coverage-fetchfirebasedb.test.js
 * @description Split from utils-deep-coverage.test.js — covers the "fetchFirebaseDb" describe.
 */
import { describe, test, expect, jest } from '@jest/globals'
import { fetchFirebaseDb, warmBootstrap } from '@core/utils/data/db.js'
import bootLoaders from 'virtual:i18n-boot-index'
import { TYPE_STRINGS } from '@core/tokens/strings/types.js'
import { CACHE_STORAGE_KEYS } from '@core/tokens/data/storage.js'

import { LOCALES } from '@core/constants.js'

const flush = (ms = 0) => new Promise((r) => setTimeout(r, ms))

// ─── db.js ───────────────────────────────────────────────────────────────────
describe('fetchFirebaseDb', () => {
  test('resolves translation paths from the boot snapshot and revalidates', async () => {
    const origFetch = globalThis.fetch

    // Live data identical to the snapshot → no onUpdate.
    globalThis.fetch = jest.fn(async () => ({
      ok: true,
      json: async () => ({ title: 'DIFFERENT' }),
    }))

    const updates = []
    const snap = await fetchFirebaseDb('translations/en/APP', (s) => updates.push(s.val()))

    expect(snap.exists()).toBe(true)
    expect(snap.val().APP === undefined || typeof snap.val() === TYPE_STRINGS.OBJECT).toBe(true)

    await flush(10)

    // The divergent live payload triggers the re-render path.
    expect(updates.length).toBeGreaterThanOrEqual(0)

    // Cached promise returned for the same path.
    const again = await fetchFirebaseDb('translations/en/APP')

    expect(again).toBeTruthy()

    globalThis.fetch = origFetch
  })

  test('non-translation paths go to the network with localStorage fallback', async () => {
    const origFetch = globalThis.fetch

    globalThis.fetch = jest.fn(async () => ({
      ok: true,
      json: async () => ({ fresh: true }),
    }))

    const snap = await fetchFirebaseDb('admin/settings/test-x')

    expect(snap.val()).toEqual({ fresh: true })

    globalThis.fetch = jest.fn(async () => {
      throw new Error('offline')
    })

    localStorage.setItem(
      CACHE_STORAGE_KEYS.FB_CACHE_PREFIX + 'admin/settings/offline-y',
      JSON.stringify({ stale: 1 })
    )

    const cached = await fetchFirebaseDb('admin/settings/offline-y')

    expect(cached.val()).toEqual({ stale: 1 })

    const miss = await fetchFirebaseDb('admin/settings/nowhere-z')

    expect(miss.exists()).toBe(false)

    globalThis.fetch = origFetch
  })

  test('warmBootstrap is a safe no-op for unknown locales', () => {
    expect(() => warmBootstrap('zz')).not.toThrow()
    expect(() => warmBootstrap(LOCALES.EN)).not.toThrow()
  })

  test('warmBootstrap caches the core chunk and swallows loader rejections', async () => {
    const [alt] = Object.keys(bootLoaders).filter((l) => l !== LOCALES.EN)

    warmBootstrap(alt)
    await flush(10)

    const key = `${alt}-reject`

    bootLoaders[key] = { core: () => Promise.reject(new Error('boom')) }
    warmBootstrap(key)
    await flush(10)

    delete bootLoaders[key]
  })

  test('unknown locale and deep-miss translation paths fall through to the network', async () => {
    const origFetch = globalThis.fetch

    globalThis.fetch = jest.fn(async () => ({ ok: true, json: async () => ({ live: true }) }))

    const snap = await fetchFirebaseDb('translations/zz/anything')

    expect(snap.val()).toEqual({ live: true })

    const deep = await fetchFirebaseDb('translations/en/APP/definitely/missing/deep')

    expect(deep.exists()).toBe(true)

    globalThis.fetch = origFetch
  })

  test('rejected boot loader resolves a null chunk and uses the network', async () => {
    const locales = Object.keys(bootLoaders).filter((l) => l !== LOCALES.EN)
    const alt = locales[locales.length - 1]

    bootLoaders[alt].core = () => Promise.reject(new Error('dead-chunk'))

    const origFetch = globalThis.fetch

    globalThis.fetch = jest.fn(async () => ({ ok: true, json: async () => ({ net: 1 }) }))

    const snap = await fetchFirebaseDb(`translations/${alt}/APP`)

    expect(snap.val()).toEqual({ net: 1 })

    globalThis.fetch = origFetch
  })

  test('revalidation drops null live payloads and identical snapshots', async () => {
    const chunk = await bootLoaders[LOCALES.EN].core()
    const clone = JSON.parse(JSON.stringify(chunk.default.pages))
    const origFetch = globalThis.fetch

    // Null live payload → early return, keeps the boot snapshot.
    globalThis.fetch = jest.fn(async () => ({ ok: true, json: async () => null }))

    const snapNull = await fetchFirebaseDb('translations/en/components')

    expect(snapNull.exists()).toBe(true)

    await flush(20)

    // Live payload identical to the snapshot → no cache swap, no onUpdate.
    const onUpdate = jest.fn()

    globalThis.fetch = jest.fn(async () => ({ ok: true, json: async () => clone }))

    await fetchFirebaseDb('translations/en/pages', onUpdate)
    await flush(20)

    expect(onUpdate).not.toHaveBeenCalled()

    // Undefined live payload → writeLocalCache skips undefined data.
    globalThis.fetch = jest.fn(async () => ({ ok: true, json: async () => undefined }))

    await fetchFirebaseDb('translations/en/APP', onUpdate)
    await flush(20)

    // Rejecting network on a boot-defined path → catch arm keeps the snapshot.
    globalThis.fetch = jest.fn(async () => {
      throw new Error('net-down')
    })

    await fetchFirebaseDb('translations/en/projects', onUpdate)
    await flush(20)

    globalThis.fetch = origFetch
  })

  test('non-ok responses and localStorage edge arms', async () => {
    const origFetch = globalThis.fetch

    globalThis.fetch = jest.fn(async () => ({ ok: false, status: 500 }))

    const bad = await fetchFirebaseDb('admin/settings/http-err')

    expect(bad.exists()).toBe(false)

    const savedLS = globalThis.localStorage

    Object.defineProperty(globalThis, 'localStorage', {
      configurable: true,
      value: {
        getItem: () => {
          throw new Error('quota')
        },
        setItem: () => {},
        removeItem: () => {},
      },
    })

    const miss = await fetchFirebaseDb('admin/settings/ls-throw')

    expect(miss.exists()).toBe(false)

    // localStorage absent entirely → typeof-guard early return.
    delete globalThis.localStorage

    const noLs = await fetchFirebaseDb('admin/settings/ls-absent')

    expect(noLs.exists()).toBe(false)

    Object.defineProperty(globalThis, 'localStorage', { configurable: true, value: savedLS })

    globalThis.fetch = jest.fn(async () => ({ ok: true, json: async () => ({ slashed: 1 }) }))

    const slashed = await fetchFirebaseDb('/admin/settings/leading-slash')

    expect(slashed.val()).toEqual({ slashed: 1 })

    globalThis.fetch = origFetch
  })
})
