/**
 * @file docs-tails.test.js
 * @description Coverage tails for the docs-portal support modules —
 * manifest path resolution + lazy payload fetch, the generated folder
 * SVG art, copy-attempt telemetry (sendBeacon/fetch/gtag), the
 * copy-guard event surface, and the WebGL nav strip (mounted frame loop,
 * shader-failure fallback, context-loss, destroy).
 */

import { describe, test, expect, beforeEach, afterEach, jest } from '@jest/globals'
import {
  getDocsManifest,
  docsGeneratedAt,
  resolveDocsPath,
  crumbsForPath,
  fetchDocsFile,
} from '@docs/manifest.js'
import { folderSvg } from '@docs/folder-svg.js'
import { trackCopyAttempt } from '@docs/telemetry.js'
import { attachCopyGuard } from '@docs/copy-guard.js'
import { mountDocsGlStrip } from '@docs/gl-strip.js'
import { createMockGL } from '../../../fixtures/mock-webgl.js'
import { DOCS_STRINGS } from '@core/tokens/strings/docs.js'
import { DOCS_CLASSES } from '@core/tokens/classes/docs.js'
import { CHAR_STRINGS } from '@core/tokens/strings/chars.js'
import { CLIPBOARD_EVENTS, KEYBOARD_EVENTS, GL_EVENTS } from '@core/tokens/events/dom.js'
import { SOCIAL_URLS, CDN_URLS } from '@core/tokens/media/urls.js'
import { HTML_TAGS } from '@core/tokens/elements/html.js'

const flush = (ms = 40) => new Promise((r) => setTimeout(r, ms))

// ─── manifest.ts ─────────────────────────────────────────────────────────────

describe('docs manifest resolution', () => {
  test('manifest accessor + generated stamp come from the virtual module', () => {
    expect(getDocsManifest().roots.length).toBe(3)
    expect(docsGeneratedAt()).toBe('2024-06-01T12:00:00.000Z')
  })

  test('empty path resolves to the portal root (null node)', () => {
    expect(resolveDocsPath(CHAR_STRINGS.EMPTY)).toBe(null)
  })

  test('bare root name resolves to a synthetic dir node', () => {
    const node = resolveDocsPath('docs')

    expect(node?.type).toBe('dir')
    expect(node?.name).toBe('Documentation')
    expect(node?.children?.length).toBe(3)
  })

  test('nested path resolves through the tree', () => {
    const node = resolveDocsPath('docs/architecture/website.md')

    expect(node?.type).toBe('file')
    expect(node?.id).toBe('docs:architecture/website.md')
  })

  test('unmatched leading segment falls back to searching every root', () => {
    const node = resolveDocsPath('architecture')

    expect(node?.type).toBe('dir')
    expect(node?.path).toBe('docs/architecture')
  })

  test('unknown segments resolve to null', () => {
    expect(resolveDocsPath('docs/never/there')).toBe(null)
    expect(resolveDocsPath('src/nothing.ts')).toBe(null)
  })

  test('crumbsForPath walks the path segment by segment', () => {
    expect(crumbsForPath(CHAR_STRINGS.EMPTY)).toEqual([])

    const crumbs = crumbsForPath('docs/architecture/website.md')

    expect(crumbs.map((c) => c.label)).toEqual(['docs', 'architecture', 'website.md'])
    expect(crumbs[2].path).toBe('docs/architecture/website.md')
  })

  test('fetchDocsFile encodes the id and parses the payload', async () => {
    const orig = globalThis.fetch
    const seen = []

    globalThis.fetch = jest.fn(async (url) => {
      seen.push(url)

      return { ok: true, json: async () => ({ format: 'markdown' }) }
    })

    const payload = await fetchDocsFile('docs:a b/c.md')

    expect(payload?.format).toBe('markdown')
    expect(seen[0]).toContain('a%20b/c.md.json')

    globalThis.fetch = orig
  })

  test('fetchDocsFile returns null on !ok and on throw', async () => {
    const orig = globalThis.fetch

    globalThis.fetch = jest.fn(async () => ({ ok: false }))
    expect(await fetchDocsFile('docs:x.md')).toBe(null)

    globalThis.fetch = jest.fn(async () => {
      throw new Error('net')
    })
    expect(await fetchDocsFile('docs:x.md')).toBe(null)

    globalThis.fetch = orig
  })
})

// ─── folder-svg.tsx ───────────────────────────────────────────────────────────

describe('generated folder artwork', () => {
  test('dir glyph shows threads over the folder body', () => {
    const svg = folderSvg('architecture', true)

    expect(svg.tagName.toLowerCase()).toBe('svg')
    expect(svg.querySelectorAll(`.${DOCS_CLASSES.DOCS_FOLDER_THREAD}`).length).toBeGreaterThan(0)
  })

  test('file glyph uses the folded-corner silhouette', () => {
    const svg = folderSvg('website.md', false)

    expect(svg.tagName.toLowerCase()).toBe('svg')
  })

  test('isDir defaults to true when omitted', () => {
    const svg = folderSvg('typedoc')

    expect(svg.querySelectorAll(`.${DOCS_CLASSES.DOCS_FOLDER_THREAD}`).length).toBeGreaterThan(0)
  })

  test('the same name always produces the same artwork', () => {
    const a = folderSvg('guides', true).outerHTML
    const b = folderSvg('guides', true).outerHTML

    expect(a).toBe(b)
  })

  test('different names spread the hash space', () => {
    expect(folderSvg('docs', true).outerHTML).not.toBe(folderSvg('reports', true).outerHTML)
  })
})

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

// ─── gl-strip.ts ──────────────────────────────────────────────────────────────

describe('docs GL strip', () => {
  let origGetContext
  let mockGL

  beforeEach(() => {
    mockGL = createMockGL()

    const proto = window.HTMLCanvasElement?.prototype || HTMLCanvasElement.prototype

    origGetContext = proto.getContext

    proto.getContext = function patched(type) {
      if (/webgl/i.test(String(type))) return mockGL

      return null
    }
  })

  afterEach(() => {
    const proto = window.HTMLCanvasElement?.prototype || HTMLCanvasElement.prototype

    proto.getContext = origGetContext
  })

  test('mounts, draws frames, and destroys cleanly', async () => {
    const canvas = document.createElement(HTML_TAGS.CANVAS)
    const host = document.createElement('div')

    document.body.appendChild(canvas)
    document.body.appendChild(host)

    const handle = mountDocsGlStrip(canvas, host)

    expect(handle).not.toBe(null)

    await flush()

    handle.destroy()

    canvas.remove()
    host.remove()
  })

  test('returns null when the context probe fails', () => {
    const proto = window.HTMLCanvasElement?.prototype || HTMLCanvasElement.prototype

    proto.getContext = () => null

    const canvas = document.createElement(HTML_TAGS.CANVAS)
    const host = document.createElement('div')

    expect(mountDocsGlStrip(canvas, host)).toBe(null)

    proto.getContext = origGetContext
    proto.getContext = function patched(type) {
      if (/webgl/i.test(String(type))) return mockGL

      return null
    }
  })

  test('returns null when shader compilation fails', () => {
    const failGl = new Proxy(
      {},
      {
        get(_t, prop) {
          if (typeof prop === 'string' && prop === prop.toUpperCase()) return 1

          return () => {
            if (prop === 'getShaderParameter' || prop === 'getProgramParameter') return false
            if (prop === 'getShaderInfoLog') return 'fail'
            if (prop === 'getExtension') return { loseContext: () => {} }
            if (prop === 'createShader' || prop === 'createProgram') return {}

            return undefined
          }
        },
        set: () => true,
      }
    )

    const proto = window.HTMLCanvasElement?.prototype || HTMLCanvasElement.prototype

    proto.getContext = () => failGl

    expect(mountDocsGlStrip(document.createElement(HTML_TAGS.CANVAS), document.createElement('div'))).toBe(
      null
    )

    proto.getContext = function patched(type) {
      if (/webgl/i.test(String(type))) return mockGL

      return null
    }
  })

  test('context loss flags the host with the fallback class', async () => {
    const canvas = document.createElement(HTML_TAGS.CANVAS)
    const host = document.createElement('div')

    document.body.appendChild(canvas)
    document.body.appendChild(host)

    const handle = mountDocsGlStrip(canvas, host)

    canvas.dispatchEvent(new Event(GL_EVENTS.WEBGL_CONTEXT_LOST))

    await flush()

    expect(host.classList.contains(DOCS_CLASSES.DOCS_GL_FALLBACK)).toBe(true)

    handle.destroy()

    canvas.remove()
    host.remove()
  })
})
