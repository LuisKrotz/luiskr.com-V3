/**
 * @file skeleton-measure-tails.test.js
 * @description Coverage tails for skeleton measure/init edges: host-bounds
 * clipping (the overlay canvas may never bleed into sibling components),
 * padding-box offsets, ResizeObserver re-sync after content rebuilds, the
 * display:contents client-box fallback, and the immediate first-frame paint.
 */
import { describe, test, expect, beforeEach, afterEach, jest } from '@jest/globals'
import { SkeletonWebGL } from '@core/utils/canvas/loaders/skeleton-webgl.js'
import { skeletonRenderer } from '@core/utils/canvas/loaders/skeleton/renderer.js'
import { createMockGL, createMock2D } from '../../../fixtures/mock-webgl.js'
import { SKELETON_CLASSES } from '@core/tokens/classes/skeleton.js'
import { HTML_TAGS } from '@core/tokens/elements/html.js'
import { WEBGL_STRINGS } from '@core/tokens/strings/webgl.js'

let mockGL
let mock2D
let origGetContext

beforeEach(() => {
  mockGL = createMockGL()
  mock2D = createMock2D()

  const proto = window.HTMLCanvasElement?.prototype || HTMLCanvasElement.prototype

  origGetContext = proto.getContext

  proto.getContext = function patchedGetContext(type) {
    if (String(type) === WEBGL_STRINGS.CONTEXT_2D) return mock2D
    if (/webgl/i.test(String(type))) return mockGL

    return null
  }
})

afterEach(() => {
  const proto = window.HTMLCanvasElement?.prototype || HTMLCanvasElement.prototype

  proto.getContext = origGetContext
})

const makeHost = (rect = { left: 0, top: 0, width: 400, height: 300 }) => {
  const host = document.createElement(HTML_TAGS.DIV)
  const root = document.createElement(HTML_TAGS.DIV)
  const content = document.createElement(HTML_TAGS.DIV)

  host.getBoundingClientRect = () => rect

  root.appendChild(content)
  host.appendChild(root)
  document.body.appendChild(host)

  return { host, root, content }
}

const makeSkel = (rect) => {
  const el = document.createElement(HTML_TAGS.DIV)

  el.className = SKELETON_CLASSES.SKELETON_BLOCK
  el.getBoundingClientRect = () => rect

  return el
}

describe('skeleton measure tails', () => {
  test('rects are clipped to the host box so the canvas cannot bleed into siblings', () => {
    const { host, root, content } = makeHost()

    Object.defineProperty(host, 'clientWidth', { value: 400, configurable: true })
    Object.defineProperty(host, 'clientHeight', { value: 300, configurable: true })

    const layer = new SkeletonWebGL(host, root, content)

    layer.base = [0.1, 0.1, 0.1]
    layer.ink = [0.9, 0.9, 0.9]

    const overflow = makeSkel({ left: 300, top: 200, width: 400, height: 400 })
    const outside = makeSkel({ left: -500, top: -500, width: 100, height: 40 })

    content.appendChild(overflow)
    content.appendChild(outside)

    layer.refresh()

    expect(layer.rects).toHaveLength(1)
    expect(layer.rects[0].x).toBe(300)
    expect(layer.rects[0].y).toBe(200)
    expect(layer.rects[0].w).toBe(100)
    expect(layer.rects[0].h).toBe(100)

    layer.destroy()
    host.remove()
  })

  test('host border offsets shift rects into padding-box coordinates', () => {
    const { host, root, content } = makeHost()

    Object.defineProperty(host, 'clientLeft', { value: 5, configurable: true })
    Object.defineProperty(host, 'clientTop', { value: 7, configurable: true })
    Object.defineProperty(host, 'clientWidth', { value: 390, configurable: true })
    Object.defineProperty(host, 'clientHeight', { value: 286, configurable: true })

    const layer = new SkeletonWebGL(host, root, content)

    layer.base = [0.1, 0.1, 0.1]
    layer.ink = [0.9, 0.9, 0.9]

    content.appendChild(makeSkel({ left: 15, top: 27, width: 100, height: 40 }))

    layer.refresh()

    expect(layer.rects[0].x).toBe(10)
    expect(layer.rects[0].y).toBe(20)

    layer.destroy()
    host.remove()
  })

  test('display:contents hosts fall back to the border box for clipping', () => {
    const { host, root, content } = makeHost()

    Object.defineProperty(host, 'clientWidth', { value: 0, configurable: true })
    Object.defineProperty(host, 'clientHeight', { value: 0, configurable: true })

    const layer = new SkeletonWebGL(host, root, content)

    layer.base = [0.1, 0.1, 0.1]
    layer.ink = [0.9, 0.9, 0.9]

    content.appendChild(makeSkel({ left: 10, top: 20, width: 100, height: 40 }))

    layer.refresh()

    expect(layer.rects).toHaveLength(1)
    expect(layer.rects[0].w).toBe(100)

    layer.destroy()
    host.remove()
  })

  test('observer set re-syncs to live placeholders after a content rebuild', () => {
    const observed = []
    const unobserved = []

    globalThis.ResizeObserver = class {
      constructor(cb) {
        this.cb = cb
      }
      observe(el) {
        observed.push(el)
      }
      unobserve(el) {
        unobserved.push(el)
      }
      disconnect() {}
    }

    const { host, root, content } = makeHost()
    const stale = makeSkel({ left: 0, top: 0, width: 100, height: 40 })

    content.appendChild(stale)

    const layer = new SkeletonWebGL(host, root, content)

    layer.base = [0.1, 0.1, 0.1]
    layer.ink = [0.9, 0.9, 0.9]

    const fresh = makeSkel({ left: 0, top: 0, width: 100, height: 40 })

    content.replaceChildren(fresh)

    layer.refresh()

    expect(unobserved).toContain(stale)
    expect(observed).toContain(fresh)

    // Second measure with the same live node keeps the observation and hits
    // the style-cache warm path instead of re-reading computed styles.
    observed.length = 0

    layer.refresh()

    expect(observed).not.toContain(fresh)

    delete globalThis.ResizeObserver

    layer.destroy()
    host.remove()
  })

  test('the first frame paints immediately instead of waiting for the idle loop', () => {
    const themeSpy = jest
      .spyOn(SkeletonWebGL.prototype, '_sampleTheme')
      .mockImplementation(function mockTheme() {
        this.base = [0.1, 0.1, 0.1]
        this.ink = [0.9, 0.9, 0.9]
        this.inkAlpha = 1
      })
    const drawSpy = jest.spyOn(skeletonRenderer, 'draw')

    const { host, root, content } = makeHost()

    content.appendChild(makeSkel({ left: 0, top: 0, width: 100, height: 40 }))

    const layer = new SkeletonWebGL(host, root, content)

    expect(layer.useWebGL).toBe(true)
    expect(drawSpy).toHaveBeenCalled()

    drawSpy.mockRestore()
    themeSpy.mockRestore()

    layer.destroy()
    host.remove()
  })
})
