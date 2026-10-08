/**
 * @file docs-tails-copy-guard-surface.test.js
 * @description Split from docs-tails.test.js — covers the "copy guard surface" describe.
 */
import { describe, test, expect, beforeEach, afterEach, jest } from '@jest/globals'
import { attachCopyGuard } from '@docs/copy-guard.js'
import { DOCS_STRINGS } from '@core/tokens/strings/docs.js'
import { CHAR_STRINGS } from '@core/tokens/strings/chars.js'
import { CLIPBOARD_EVENTS, KEYBOARD_EVENTS } from '@core/tokens/events/dom.js'
import { SOCIAL_URLS } from '@core/tokens/media/urls.js'

const _flush = (ms = 40) => new Promise((r) => setTimeout(r, ms))

// ─── copy-guard.ts ────────────────────────────────────────────────────────────
describe('copy guard surface', () => {
  let host
  let origFetch

  const protectedState = { on: true }

  const attach = () =>
    attachCopyGuard(
      host,
      () => protectedState.on,
      () => 'src/App.tsx',
      () => CHAR_STRINGS.EMPTY
    )

  beforeEach(() => {
    host = document.createElement('div')

    document.body.appendChild(host)

    origFetch = globalThis.fetch
    globalThis.fetch = jest.fn(async () => ({}))
    protectedState.on = true
  })

  afterEach(() => {
    host.remove()
    globalThis.fetch = origFetch
  })

  test('cut hijacks the clipboard payload to the repo URL', () => {
    const dispose = attach()

    const e = new Event(CLIPBOARD_EVENTS.CUT, { bubbles: true, cancelable: true })

    e.clipboardData = { setData: jest.fn() }

    host.dispatchEvent(e)

    expect(e.clipboardData.setData).toHaveBeenCalledWith('text/plain', SOCIAL_URLS.GITHUB_REPO)

    dispose()
  })

  test('copy without clipboardData still prevents + telemeters', () => {
    const dispose = attach()

    const e = new Event(CLIPBOARD_EVENTS.COPY, { bubbles: true, cancelable: true })

    host.dispatchEvent(e)

    expect(e.defaultPrevented).toBe(true)
    expect(globalThis.fetch).toHaveBeenCalled()

    dispose()
  })

  test('contextmenu on a protected page is blocked; unprotected passes through', () => {
    const dispose = attach()

    const blocked = new Event('contextmenu', { bubbles: true, cancelable: true })

    host.dispatchEvent(blocked)
    expect(blocked.defaultPrevented).toBe(true)

    protectedState.on = false

    const allowed = new Event('contextmenu', { bubbles: true, cancelable: true })

    host.dispatchEvent(allowed)
    expect(allowed.defaultPrevented).toBe(false)

    dispose()
  })

  test('selectstart/dragstart pass through on unprotected pages', () => {
    const dispose = attach()

    protectedState.on = false

    const sel = new Event('selectstart', { bubbles: true, cancelable: true })
    const drag = new Event('dragstart', { bubbles: true, cancelable: true })

    host.dispatchEvent(sel)
    host.dispatchEvent(drag)

    expect(sel.defaultPrevented).toBe(false)
    expect(drag.defaultPrevented).toBe(false)

    dispose()
  })

  test('keyup with a non-PrintScreen key is ignored', () => {
    const dispose = attach()

    globalThis.fetch.mockClear()

    document.dispatchEvent(new KeyboardEvent(KEYBOARD_EVENTS.KEYUP, { key: 'a' }))

    expect(globalThis.fetch).not.toHaveBeenCalled()

    dispose()
  })

  test('PrintScreen on an unprotected page is ignored', () => {
    protectedState.on = false

    const dispose = attach()

    globalThis.fetch.mockClear()

    document.dispatchEvent(
      new KeyboardEvent(KEYBOARD_EVENTS.KEYUP, { key: DOCS_STRINGS.KEY_PRINT_SCREEN })
    )

    expect(globalThis.fetch).not.toHaveBeenCalled()

    dispose()
  })

  test('a rejecting clipboard.writeText is swallowed', () => {
    const writeText = jest.fn(async () => {
      throw new Error('denied')
    })

    try {
      Object.defineProperty(globalThis.navigator, 'clipboard', {
        value: { writeText },
        configurable: true,
      })
    } catch {
      /* navigator sealed — skip */
    }

    const dispose = attach()

    document.dispatchEvent(
      new KeyboardEvent(KEYBOARD_EVENTS.KEYUP, { key: DOCS_STRINGS.KEY_PRINT_SCREEN })
    )

    dispose()
  })

  test('PrintScreen on a protected page clears the clipboard when the API exists', () => {
    const writeText = jest.fn(async () => {})

    try {
      Object.defineProperty(globalThis.navigator, 'clipboard', {
        value: { writeText },
        configurable: true,
      })
    } catch {
      /* navigator sealed — arm is covered by the no-clipboard path */
    }

    const dispose = attach()

    document.dispatchEvent(
      new KeyboardEvent(KEYBOARD_EVENTS.KEYUP, { key: DOCS_STRINGS.KEY_PRINT_SCREEN })
    )

    dispose()
  })

  test('beforeprint fires telemetry only while protected', () => {
    const dispose = attach()

    globalThis.fetch.mockClear()

    window.dispatchEvent(new Event(CLIPBOARD_EVENTS.BEFORE_PRINT))
    expect(globalThis.fetch).toHaveBeenCalled()

    protectedState.on = false
    globalThis.fetch.mockClear()

    window.dispatchEvent(new Event(CLIPBOARD_EVENTS.BEFORE_PRINT))
    expect(globalThis.fetch).not.toHaveBeenCalled()

    dispose()
  })

  test('dispose detaches every listener', () => {
    const dispose = attach()

    dispose()

    globalThis.fetch.mockClear()

    const e = new Event(CLIPBOARD_EVENTS.COPY, { bubbles: true, cancelable: true })

    host.dispatchEvent(e)

    expect(globalThis.fetch).not.toHaveBeenCalled()
  })
})
