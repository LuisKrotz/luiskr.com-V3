/**
 * @file docs-tails-copy-attempt-telemetry.test.js
 * @description Split from docs-tails.test.js — covers the "copy-attempt telemetry" describe.
 */
import { describe, test, expect, beforeEach, afterEach, jest } from '@jest/globals'
import { trackCopyAttempt } from '@docs/telemetry.js'
import { DOCS_STRINGS } from '@core/tokens/strings/docs.js'
import { CDN_URLS } from '@core/tokens/media/urls.js'

const flush = (ms = 40) => new Promise((r) => setTimeout(r, ms))

// ─── telemetry.ts ─────────────────────────────────────────────────────────────
describe('copy-attempt telemetry', () => {
  let origFetch
  let origBeacon

  beforeEach(() => {
    origFetch = globalThis.fetch
    origBeacon = globalThis.navigator?.sendBeacon
  })

  afterEach(() => {
    globalThis.fetch = origFetch

    if (globalThis.navigator) {
      try {
        Object.defineProperty(globalThis.navigator, 'sendBeacon', {
          value: origBeacon,
          configurable: true,
          writable: true,
        })
      } catch {
        /* navigator sealed — nothing to restore */
      }
    }

    delete globalThis.gtag
  })

  test('sendBeacon carries the record when the API exists', () => {
    const beacon = jest.fn(() => true)

    Object.defineProperty(globalThis.navigator, 'sendBeacon', {
      value: beacon,
      configurable: true,
      writable: true,
    })

    const fetchSpy = jest.fn(async () => ({}))

    globalThis.fetch = fetchSpy

    trackCopyAttempt('copy', 'src/App.tsx')

    expect(beacon).toHaveBeenCalled()

    const [url, body] = beacon.mock.calls[0]

    expect(url).toContain(`${CDN_URLS.FIREBASE_DB}/`)
    expect(url).toContain('copy-attempts')
    expect(JSON.parse(body).kind).toBe('copy')
    expect(JSON.parse(body).path).toBe('src/App.tsx')
    expect(JSON.parse(body).event).toBe(DOCS_STRINGS.EVENT_COPY_ATTEMPT)

    expect(fetchSpy).not.toHaveBeenCalled()
  })

  test('fetch keepalive posts when sendBeacon is absent or declines', () => {
    const fetchSpy = jest.fn(async () => ({}))

    globalThis.fetch = fetchSpy

    Object.defineProperty(globalThis.navigator, 'sendBeacon', {
      value: jest.fn(() => false),
      configurable: true,
      writable: true,
    })

    trackCopyAttempt('cut', 'src/main.ts')

    expect(fetchSpy).toHaveBeenCalled()
    expect(fetchSpy.mock.calls[0][1].method).toBe('POST')
  })

  test('a rejected fetch is swallowed with a devlog warn', async () => {
    globalThis.fetch = jest.fn(async () => {
      throw new Error('denied')
    })

    Object.defineProperty(globalThis.navigator, 'sendBeacon', {
      value: undefined,
      configurable: true,
      writable: true,
    })

    trackCopyAttempt('print', 'src/App.tsx')
    await flush()
  })

  test('a synchronous throw inside the transport is caught', () => {
    globalThis.fetch = jest.fn(() => {
      throw new Error('sync')
    })

    Object.defineProperty(globalThis.navigator, 'sendBeacon', {
      value: undefined,
      configurable: true,
      writable: true,
    })

    expect(() => trackCopyAttempt('copy', 'x')).not.toThrow()
  })

  test('gtag fan-out fires when a GA global exists', () => {
    const gtag = jest.fn()

    globalThis.gtag = gtag
    globalThis.fetch = jest.fn(async () => ({}))

    trackCopyAttempt('contextmenu', 'src/App.tsx')

    expect(gtag).toHaveBeenCalledWith('event', DOCS_STRINGS.EVENT_COPY_ATTEMPT, {
      kind: 'contextmenu',
      path: 'src/App.tsx',
    })
  })

  test('no fetch API at all → transport skips the POST silently', () => {
    globalThis.fetch = undefined

    Object.defineProperty(globalThis.navigator, 'sendBeacon', {
      value: undefined,
      configurable: true,
      writable: true,
    })

    expect(() => trackCopyAttempt('copy', 'src/App.tsx')).not.toThrow()
  })

  test('color-limited environments still post the full system profile', () => {
    const beacon = jest.fn(() => true)

    Object.defineProperty(globalThis.navigator, 'sendBeacon', {
      value: beacon,
      configurable: true,
      writable: true,
    })

    trackCopyAttempt('print', 'src/x.ts')

    const body = JSON.parse(beacon.mock.calls[0][1])

    expect(body).toHaveProperty('ua')
    expect(body).toHaveProperty('screen')
    expect(body).toHaveProperty('timezone')
    expect(body).toHaveProperty('ts')
  })

  test('hardwareConcurrency falls back to 0 when the hint is absent', () => {
    const desc = Object.getOwnPropertyDescriptor(globalThis.navigator, 'hardwareConcurrency')

    try {
      Object.defineProperty(globalThis.navigator, 'hardwareConcurrency', {
        value: 0,
        configurable: true,
      })
    } catch {
      /* navigator sealed — the observed arm stays covered by the ambient env */
    }

    const beacon = jest.fn(() => true)

    Object.defineProperty(globalThis.navigator, 'sendBeacon', {
      value: beacon,
      configurable: true,
      writable: true,
    })

    trackCopyAttempt('copy', 'src/x.ts')

    expect(JSON.parse(beacon.mock.calls[0][1]).cores).toBe(0)

    if (desc) {
      Object.defineProperty(globalThis.navigator, 'hardwareConcurrency', desc)
    }
  })
})
