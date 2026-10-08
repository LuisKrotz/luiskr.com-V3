/**
 * @file wasm-utils-gpu-accel.test.js
 * @description Split from wasm-utils.test.js — covers the "gpu-accel" describe.
 */
import { gpuAccel } from '@core/utils/gpu/gpu-accel.js'
import { attachMockGL } from '@tests/fixtures/mock-webgl.js'
import { TYPE_STRINGS } from '@core/tokens/strings/types.js'
import { HTML_TAGS } from '@core/tokens/elements/html.js'
import { ATTR_VALUES } from '@core/tokens/attrs/values.js'

// The shared setup rAF stub calls cb() with no timestamp — wasm-scroll's
// easing math needs `now`. Re-stub here to pass monotonic timestamps.
const _raf = globalThis.requestAnimationFrame

const _installTimedRaf = () => {
  globalThis.requestAnimationFrame = (cb) => {
    const id = setTimeout(() => cb(performance.now() + 30), 5)

    if (id && typeof id.unref === TYPE_STRINGS.FUNCTION) id.unref()

    return id
  }
}

// ─── gpu-accel ───────────────────────────────────────────────────────────────
describe('gpu-accel', () => {
  test('lazily creates the GL context on first use', () => {
    const origCreate = document.createElement.bind(document)

    document.createElement = (tag, ...rest) => {
      const el = origCreate(tag, ...rest)

      if (tag === HTML_TAGS.CANVAS) attachMockGL(el)

      return el
    }

    gpuAccel._ready = false
    gpuAccel.initGPU()

    document.createElement = origCreate

    // Mark ready so later tests don't re-init against the unpatched DOM
    gpuAccel._ready = true

    expect(gpuAccel.gl).toBeTruthy()
  })

  test('processImageGPU/VideoGPU/BitmapGPU return null or drive the texture path', () => {
    const img = document.createElement(HTML_TAGS.IMG)

    expect(gpuAccel.processImageGPU(null)).toBeNull()

    const video = document.createElement(HTML_TAGS.VIDEO)

    Object.defineProperty(video, 'readyState', { value: 4, configurable: true })

    // gl exists (created in the previous test) → the texture path returns true
    expect(gpuAccel.processVideoGPU(video, 10, 10)).toBe(true)
    expect(gpuAccel.processImageGPU(img, 10, 10)).toBe(true)
    expect(gpuAccel.processTextureGPU(img, 10, 10)).toBe(true)
    expect(gpuAccel.processBitmapGPU({}, 10, 10)).toBe(true)
  })

  test('processBitmapGPU returns null without a bitmap and false on upload failure', () => {
    const video = document.createElement(HTML_TAGS.VIDEO)

    Object.defineProperty(video, 'readyState', { value: 4, configurable: true })

    const origUp = gpuAccel._uploadTextureAndDraw
    const origGl = gpuAccel.gl

    gpuAccel.gl = null

    expect(gpuAccel.processBitmapGPU({}, 10, 10)).toBeNull()
    expect(gpuAccel.processVideoGPU(video, 10, 10)).toBeNull()
    expect(gpuAccel.processImageGPU({}, 10, 10)).toBeNull()

    gpuAccel.gl = origGl

    expect(gpuAccel.processBitmapGPU(null, 10, 10)).toBeNull()
    expect(gpuAccel.processVideoGPU(null, 10, 10)).toBeNull()

    Object.defineProperty(video, 'readyState', { value: 1, configurable: true })
    expect(gpuAccel.processVideoGPU(video, 10, 10)).toBeNull()
    Object.defineProperty(video, 'readyState', { value: 4, configurable: true })

    gpuAccel._uploadTextureAndDraw = () => {
      throw new Error('tex')
    }

    expect(gpuAccel.processVideoGPU(video, 10, 10)).toBe(false)
    expect(gpuAccel.processBitmapGPU({}, 10, 10)).toBe(false)
    expect(gpuAccel.processImageGPU({}, 10, 10)).toBe(false)

    gpuAccel._uploadTextureAndDraw = origUp
  })

  test('initGPU survives a failed shader compile', () => {
    const origCompile = gpuAccel.compileShader
    const origCreate = document.createElement.bind(document)

    document.createElement = (tag, ...rest) => {
      const el = origCreate(tag, ...rest)

      if (tag === HTML_TAGS.CANVAS) attachMockGL(el)

      return el
    }

    gpuAccel.compileShader = () => null
    gpuAccel._ready = false
    gpuAccel.initGPU()
    gpuAccel.compileShader = origCompile

    document.createElement = origCreate

    gpuAccel._ready = true
  })

  test('accelerate/release toggle the compositor class on the element', () => {
    const el = document.createElement(HTML_TAGS.DIV)

    gpuAccel.accelerateElementGPU(el)

    expect(el.style.willChange).toContain('transform')

    gpuAccel.releaseElementGPU(el)

    expect(el.style.willChange).toBe(ATTR_VALUES.AUTO)
  })
})
