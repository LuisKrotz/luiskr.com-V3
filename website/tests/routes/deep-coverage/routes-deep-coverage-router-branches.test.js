/**
 * @file routes-deep-coverage-router-branches.test.js
 * @description Split from routes-deep-coverage.test.js — covers the "router branches" describe.
 */
import { describe, test, expect, jest, beforeEach, afterEach } from '@jest/globals'
import router from '@core/router/router.js'
import { WINDOW_EVENTS } from '@core/tokens/events/dom.js'

import { ROUTE_NAMES } from '@core/constants.js'

const _flush = (ms = 0) => new Promise((r) => setTimeout(r, ms))

let origFetch
let cleanups = []

beforeEach(() => {
  origFetch = globalThis.fetch
  window.scrollTo = jest.fn()
})

afterEach(() => {
  globalThis.fetch = origFetch
  cleanups.forEach((c) => c())
  cleanups = []
})

// Revalidation payload identical → snapshot kept, no onUpdate.
const _mockStableFetch = () => {
  globalThis.fetch = jest.fn(async () => ({ ok: true, json: async () => null }))
}

// ─── router ──────────────────────────────────────────────────────────────────
describe('router branches', () => {
  test('match() aliases parsePath and notifies subscribers on nav', async () => {
    window.scrollTo = jest.fn()

    const hits = []
    const unsub = router.subscribe((to) => hits.push(to))

    await router.handleNavigation('/')

    expect(hits.length).toBeGreaterThan(0)
    expect(router.match('/').name).toBeTruthy()
    expect(router.match('/unknown-path-xyz').name).toBe(ROUTE_NAMES.NOT_FOUND)

    unsub()
  })

  test('before-hooks can redirect the navigation', async () => {
    window.scrollTo = jest.fn()

    router.beforeHooks.push((to) => (to?.path === '/unknown-path-abc' ? '/' : undefined))

    await router.push('/unknown-path-abc')

    expect(router.currentRoute.path).toBe('/')

    router.beforeHooks.length = 0
  })

  test('after-hooks run and {path} redirect objects resolve', async () => {
    window.scrollTo = jest.fn()

    const after = []

    router.afterHooks.push((to) => after.push(to.path))
    await router.push('/')

    expect(after).toContain('/')

    router.beforeHooks.push((to) => (to?.path === '/elsewhere' ? { path: '/' } : undefined))
    await router.push('/elsewhere')

    expect(router.currentRoute.path).toBe('/')

    router.beforeHooks.length = 0
    router.afterHooks.length = 0
  })

  test('replace mode swaps history state instead of pushing', async () => {
    window.scrollTo = jest.fn()

    const replace = jest.spyOn(window.history, 'replaceState')

    await router.handleNavigation('/', true)

    expect(replace).toHaveBeenCalled()

    replace.mockRestore()
  })

  test('popstate re-runs navigation on the current location', async () => {
    window.scrollTo = jest.fn()

    const spy = jest.spyOn(router, 'handleNavigation')

    window.dispatchEvent(new window.Event(WINDOW_EVENTS.POPSTATE))

    expect(spy).toHaveBeenCalled()

    spy.mockRestore()
  })
})
