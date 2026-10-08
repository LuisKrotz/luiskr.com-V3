/**
 * @file docs-tails-docs-gl-strip.test.js
 * @description Split from docs-tails.test.js — covers the "docs GL strip" describe.
 */
import { describe, test, expect, beforeEach, afterEach } from '@jest/globals'
import { mountDocsGlStrip } from '@docs/gl-strip.js'
import { createMockGL } from '@tests/fixtures/mock-webgl.js'
import { DOCS_CLASSES } from '@core/tokens/classes/docs.js'
import { GL_EVENTS } from '@core/tokens/events/dom.js'
import { HTML_TAGS } from '@core/tokens/elements/html.js'

const flush = (ms = 40) => new Promise((r) => setTimeout(r, ms))

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

    expect(
      mountDocsGlStrip(document.createElement(HTML_TAGS.CANVAS), document.createElement('div'))
    ).toBe(null)

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
