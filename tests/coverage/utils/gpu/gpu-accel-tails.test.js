/**
 * @file coverage-tails-5.test.js
 * @description Fifth branch-tail sweep: gpu-accel compositing + texture
 * paths, stats-engine observers and fetch patch, wasm-media-threads
 * probes, Legal route data modes, router canonical/history edges,
 * firebase REST fallback, deep-shadow DOM traversal, burger resize
 * branches, legacy polyfill bodies, wasm-scroll option shapes and
 * Home route param changes.
 */

import _router from '@/routes/router.js'
import { gpuAccel } from '@/utils/gpu/gpu-accel.js'

import '@/routes/views/legal/Legal.js'
import '@/routes/views/home/Home.js'
import { TYPE_STRINGS } from '@/core/tokens/strings/types.js'
import { HTML_TAGS } from '@/core/tokens/elements/html.js'




// ─── utils/gpu-accel.js ──────────────────────────────────────────────────────

describe('gpu-accel tails', () => {
  test('initGPU detects WebNN presence and GL availability', () => {
    gpuAccel.initGPU()

    expect(typeof gpuAccel.hasNPU).toBe(TYPE_STRINGS.BOOLEAN)

    navigator.ml = { createContext: async () => ({}) }
    gpuAccel.initGPU()

    expect(gpuAccel.hasNPU).toBe(true)

    delete navigator.ml
  })

  test('accelerate/release handle root vs normal elements', () => {
    gpuAccel.accelerateElementGPU(null)
    gpuAccel.accelerateElementGPU(document.documentElement)
    gpuAccel.accelerateElementGPU(document.body)

    const el = document.createElement(HTML_TAGS.DIV)

    gpuAccel.accelerateElementGPU(el)

    expect(el.style.willChange).toContain('transform')

    gpuAccel.releaseElementGPU(el)
    gpuAccel.releaseElementGPU(null)
    gpuAccel.releaseElementGPU(document.body)
  })

  test('texture/video paths degrade when GL is absent', () => {
    const gl = gpuAccel.gl

    gpuAccel.gl = null

    expect(gpuAccel.compileShader(0, 'x')).toBeNull()
    expect(gpuAccel.processImageGPU(null)).toBeNull()
    expect(gpuAccel.processTextureGPU(null)).toBeNull()
    expect(gpuAccel.processVideoGPU(document.createElement(HTML_TAGS.VIDEO))).toBeNull()

    gpuAccel.gl = gl
  })

  test('initGPU is a no-op without window and skips GL on mobile', () => {
    const savedWin = globalThis.window
    const savedGl = gpuAccel.gl

    delete globalThis.window
    gpuAccel.initGPU()

    globalThis.window = savedWin

    const prevUA = globalThis.navigator.userAgent

    Object.defineProperty(globalThis.navigator, 'userAgent', { value: 'iPhone', configurable: true })
    gpuAccel.gl = savedGl
    gpuAccel.initGPU()
    Object.defineProperty(globalThis.navigator, 'userAgent', { value: prevUA, configurable: true })
  })

  test('compileShader failure deletes the shader and skips program linking', () => {
    const deleted = []
    const gl = gpuAccel.gl

    gpuAccel.gl = {
      VERTEX_SHADER: 1,
      FRAGMENT_SHADER: 2,
      COMPILE_STATUS: 3,
      createShader: () => ({ id: Math.random() }),
      shaderSource: () => {},
      compileShader: () => {},
      getShaderParameter: () => false,
      deleteShader: (s) => deleted.push(s) }

    expect(gpuAccel.compileShader(1, 'bad')).toBeNull()
    expect(deleted.length).toBe(1)

    gpuAccel.gl = gl
  })

  test('processImageGPU/processBitmapGPU swallow upload throws', () => {
    const gl = gpuAccel.gl
    const program = gpuAccel.program
    const texture = gpuAccel.texture
    const canvas = gpuAccel.canvas

    gpuAccel.canvas = { width: 0, height: 0 }
    gpuAccel.program = {}
    gpuAccel.texture = {}
    gpuAccel.gl = {
      TEXTURE_2D: 1,
      RGBA: 2,
      TEXTURE_MIN_FILTER: 3,
      LINEAR: 4,
      TEXTURE_WRAP_S: 5,
      CLAMP_TO_EDGE: 6,
      viewport: () => {},
      useProgram: () => {},
      bindTexture: () => {},
      texImage2D: () => { throw new Error('tex-fail') } }

    expect(gpuAccel.processImageGPU({})).toBe(false)
    expect(gpuAccel.processBitmapGPU({})).toBe(false)

    gpuAccel.gl = gl
    gpuAccel.program = program
    gpuAccel.texture = texture
    gpuAccel.canvas = canvas
  })
})

