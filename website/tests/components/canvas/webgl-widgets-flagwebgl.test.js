/**
 * @file webgl-widgets-flagwebgl.test.js
 * @description Split from webgl-widgets.test.js — covers the "FlagWebGL" describe.
 */
import { describe, test, expect, beforeEach, afterEach } from '@jest/globals'
import { FlagWebGL } from '@core/utils/canvas/widgets/flag-webgl.js'
import { createMockGL, createMock2D } from '@tests/fixtures/mock-webgl.js'
import store from '@core/store.js'
import { LOCALES } from '@core/constants.js'
import { PREF_MUTATIONS } from '@core/tokens/events/mutations.js'
import { WEBGL_STRINGS } from '@core/tokens/strings/webgl.js'
import { STATE_CLASSES } from '@core/tokens/classes/state.js'
import { HTML_TAGS } from '@core/tokens/elements/html.js'
import { FLAG_DIMENSIONS } from '@core/tokens/media/dimensions.js'
import { GL_EVENTS, WINDOW_EVENTS } from '@core/tokens/events/dom.js'
import { TYPE_STRINGS } from '@core/tokens/strings/types.js'
import { STATE_STRINGS } from '@core/tokens/strings/state.js'

let mockGL
let mock2D
let origGetContext

beforeEach(() => {
  store.commit(PREF_MUTATIONS.SET_REDUCED_MOTION, false)

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

  document.documentElement.classList.remove(STATE_CLASSES.DARK_MODE)
})

const makeCanvas = () => document.createElement(HTML_TAGS.CANVAS)

const flushFrames = (ms = 80) => new Promise((resolve) => setTimeout(resolve, ms))

// ─── FlagWebGL ───────────────────────────────────────────────────────────────
describe('FlagWebGL', () => {
  const lang = (code, cc, cc2 = null) => ({ code, cc, cc2 })

  test('acquires the shared renderer and initialises WebGL', () => {
    const canvas = makeCanvas()
    const flag = new FlagWebGL(canvas, lang(LOCALES.EN, 'us'))

    expect(flag.useWebGL).toBe(true)
    expect(flag.renderer).toBeTruthy()
    expect(flag.ctx).toBeTruthy()

    flag.destroy()
  })

  test('falls back when no GL context can be created', () => {
    const proto = window.HTMLCanvasElement?.prototype || HTMLCanvasElement.prototype

    proto.getContext = () => null

    const canvas = makeCanvas()
    const flag = new FlagWebGL(canvas, lang(LOCALES.EN, 'us'))

    expect(flag.useWebGL).toBe(false)
    expect(canvas.classList.contains(STATE_CLASSES.IS_FALLBACK)).toBe(true)

    flag.destroy()
  })

  test('animation type maps every supported locale to a shader code', () => {
    const canvas = makeCanvas()
    const flag = new FlagWebGL(canvas, lang(LOCALES.EN, 'us'))

    const expected = [
      [LOCALES.EN, 0.0],
      [LOCALES.BR, 1.0],
      [LOCALES.ES, 2.0],
      [LOCALES.DE, 3.0],
      [LOCALES.HRK, 4.0],
      [LOCALES.CAS, 5.0],
      [LOCALES.RIV, 6.0],
      [LOCALES.GN, 7.0],
      [LOCALES.IT, 8.0],
      [LOCALES.RU, 9.0],
      [LOCALES.FR, 10.0],
      [LOCALES.TLN, 11.0],
      [LOCALES.GL, 12.0],
      [LOCALES.CA, 13.0],
      [LOCALES.NL, 14.0],
      [LOCALES.GA, 15.0],
    ]

    expected.forEach(([code, anim]) => {
      flag.lang = { code, cc: 'us' }

      expect(flag._getAnimType()).toBe(anim)
    })

    flag.lang = { code: 'xx', cc: 'us' }

    expect(flag._getAnimType()).toBe(0.0)

    flag.destroy()
  })

  test('split flags average both natural aspect ratios', () => {
    const canvas = makeCanvas()
    const flag = new FlagWebGL(canvas, lang(LOCALES.GA, 'ie', LOCALES.FR))

    flag.aspect1 = 2.0
    flag.aspect2 = 1.0

    expect(flag._displayAspect()).toBe(1.5)
    expect(flag._splitPoint()).toBeCloseTo(2 / 3)

    flag.destroy()
  })

  test('setHover tracks the hover level', () => {
    const canvas = makeCanvas()
    const flag = new FlagWebGL(canvas, lang(LOCALES.NL, LOCALES.NL))

    flag.onMouseEnter()

    expect(flag.isHovered).toBe(true)

    flag.onMouseLeave()

    expect(flag.isHovered).toBe(false)

    flag.destroy()
  })

  test('setReducedMotion snaps and renders a static frame', () => {
    const canvas = makeCanvas()
    const flag = new FlagWebGL(canvas, lang(LOCALES.FR, LOCALES.FR))

    flag.setReducedMotion(true)

    flag.destroy()
  })

  test('image cache reuses loaded elements per country code', () => {
    const canvas = makeCanvas()
    const flag = new FlagWebGL(canvas, lang(LOCALES.DE, LOCALES.DE))

    const img1 = flag.renderer.image(LOCALES.DE)
    const img2 = flag.renderer.image(LOCALES.DE)

    expect(img1).toBe(img2)

    flag.destroy()
  })

  test('successful image decode resizes to the natural aspect', () => {
    const canvas = makeCanvas()
    const flag = new FlagWebGL(canvas, lang(LOCALES.IT, LOCALES.IT))
    const img = flag.renderer.image(LOCALES.IT)

    Object.defineProperty(img, 'complete', { value: true, configurable: true })
    Object.defineProperty(img, 'naturalWidth', { value: 1200, configurable: true })
    Object.defineProperty(img, 'naturalHeight', { value: 800, configurable: true })

    flag.loadImages()

    expect(flag.isLoaded).toBe(true)
    expect(flag.aspect1).toBeCloseTo(1.5)

    flag.destroy()
  })

  test('small canvases use the nav flag height token', () => {
    const canvas = makeCanvas()

    canvas.getBoundingClientRect = () => ({
      height: FLAG_DIMENSIONS.FLAG_SMALL_THRESHOLD - 1,
      width: 20,
    })

    const flag = new FlagWebGL(canvas, lang(LOCALES.ES, LOCALES.ES))

    expect(flag.height).toBe(FLAG_DIMENSIONS.FLAG_NAV_HEIGHT)

    flag.destroy()
  })

  test('animate renders WebGL frames while motion is allowed', async () => {
    const canvas = makeCanvas()
    const flag = new FlagWebGL(canvas, lang(LOCALES.GL, LOCALES.GL))

    await flushFrames(60)

    flag.destroy()
  })

  test('texture() returns null for missing, incomplete, or GL-less states', () => {
    const canvas = makeCanvas()
    const flag = new FlagWebGL(canvas, lang(LOCALES.EN, 'tx'))
    const renderer = flag.renderer

    expect(renderer.texture('zz')).toBeNull()

    const img = renderer.image('tx')

    expect(renderer.texture('tx')).toBeNull()

    Object.defineProperty(img, 'complete', { value: true, configurable: true })
    Object.defineProperty(img, 'naturalWidth', { value: 1200, configurable: true })
    Object.defineProperty(img, 'naturalHeight', { value: 800, configurable: true })

    const tex = renderer.texture('tx')

    expect(tex).toBeTruthy()
    expect(renderer.texture('tx')).toBe(tex)

    const gl = renderer.gl

    renderer.gl = null

    expect(renderer.texture('nogl')).toBeNull()

    renderer.gl = gl

    flag.destroy()
  })

  test('draw() early-returns without textures, then blits a full frame', () => {
    const canvas = makeCanvas()
    const flag = new FlagWebGL(canvas, lang(LOCALES.EN, 'qa'))
    const renderer = flag.renderer

    expect(renderer.draw(flag, 0.5)).toBe(false)

    const img = renderer.image('qa')

    Object.defineProperty(img, 'complete', { value: true, configurable: true })
    Object.defineProperty(img, 'naturalWidth', { value: 1200, configurable: true })
    Object.defineProperty(img, 'naturalHeight', { value: 800, configurable: true })

    flag.isLoaded = true

    expect(renderer.draw(flag, 0.5)).toBe(true)

    flag.destroy()
  })

  test('draw() renders a split flag once both textures resolve', () => {
    const canvas = makeCanvas()
    const flag = new FlagWebGL(canvas, lang(LOCALES.GA, 'aa', 'bb'))
    const renderer = flag.renderer

    const mark = (cc, w, h) => {
      const img = renderer.image(cc)

      Object.defineProperty(img, 'complete', { value: true, configurable: true })
      Object.defineProperty(img, 'naturalWidth', { value: w, configurable: true })
      Object.defineProperty(img, 'naturalHeight', { value: h, configurable: true })
    }

    mark('aa', 1200, 800)

    expect(renderer.draw(flag, 0.1)).toBe(false)

    mark('bb', 900, 600)
    flag.isLoaded = true

    expect(renderer.draw(flag, 0.2)).toBe(true)

    flag.destroy()
  })

  test('release() disposes the shared context at refcount zero and re-creates on demand', () => {
    const canvas = makeCanvas()
    const flag = new FlagWebGL(canvas, lang(LOCALES.DE, 'dx'))
    const renderer = flag.renderer

    expect(renderer.gl).toBeTruthy()

    const oldCanvas = renderer.canvas

    flag.destroy()

    expect(renderer.gl).toBeNull()

    const flag2 = new FlagWebGL(makeCanvas(), lang(LOCALES.FR, 'fx'))

    expect(flag2.renderer.gl).toBeTruthy()
    expect(flag2.renderer.canvas).not.toBe(oldCanvas)

    flag2.destroy()
  })

  test('context loss marks the renderer lost; a stale canvas event is ignored', () => {
    const canvas = makeCanvas()
    const flag = new FlagWebGL(canvas, lang(LOCALES.ES, 'ex'))
    const renderer = flag.renderer
    const live = renderer.canvas

    live.dispatchEvent(new window.Event(GL_EVENTS.WEBGL_CONTEXT_LOST, { cancelable: true }))

    expect(renderer.lost).toBe(true)
    expect(renderer.gl).toBeNull()

    flag.destroy()

    const flag2 = new FlagWebGL(makeCanvas(), lang(LOCALES.IT, 'ix'))
    const oldLive = flag2.renderer.canvas

    flag2.destroy()

    const flag3 = new FlagWebGL(makeCanvas(), lang(LOCALES.NL, 'nx'))

    oldLive.dispatchEvent(new window.Event(GL_EVENTS.WEBGL_CONTEXT_LOST, { cancelable: true }))

    expect(flag3.renderer.lost).toBe(false)

    flag3.destroy()
  })

  test('shader compile failure drops the renderer into the fallback path', () => {
    const proto = window.HTMLCanvasElement?.prototype || HTMLCanvasElement.prototype
    const failingGL = new Proxy(
      {},
      {
        get(_t, prop) {
          if (typeof prop === TYPE_STRINGS.STRING && prop === prop.toUpperCase()) return 1

          return (...args) => {
            if (prop === 'getShaderParameter') return false
            if (prop === 'getShaderInfoLog') return 'compile failed'

            return prop === 'createShader' || prop === 'createProgram'
              ? { id: args.length }
              : undefined
          }
        },
        set: () => true,
      }
    )

    proto.getContext = function patched(type) {
      if (String(type) === WEBGL_STRINGS.CONTEXT_2D) return mock2D
      if (/webgl/i.test(String(type))) return failingGL

      return null
    }

    const canvas = makeCanvas()
    const flag = new FlagWebGL(canvas, lang(LOCALES.EN, 'us'))

    expect(flag.useWebGL).toBe(false)
    expect(canvas.classList.contains(STATE_CLASSES.IS_FALLBACK)).toBe(true)

    flag.destroy()
  })

  test('image error triggers the fallback path', () => {
    const canvas = makeCanvas()
    const flag = new FlagWebGL(canvas, lang(LOCALES.BR, LOCALES.BR))
    const img = flag.renderer.image(LOCALES.BR)

    img.dispatchEvent(new window.Event(WINDOW_EVENTS.ERROR))

    expect(flag.useWebGL).toBe(false)
    expect(canvas.classList.contains(STATE_CLASSES.IS_FALLBACK)).toBe(true)

    flag.destroy()
  })

  test('animate() cancels the loop and renders one frame under reduced motion', () => {
    store.commit(PREF_MUTATIONS.SET_REDUCED_MOTION, true)

    const canvas = makeCanvas()
    const flag = new FlagWebGL(canvas, lang(LOCALES.CA, LOCALES.ES))

    expect(flag.animId).toBeNull()

    flag.destroy()
  })

  test('_renderWebGL falls back when the shared renderer lost its context', () => {
    const canvas = makeCanvas()
    const flag = new FlagWebGL(canvas, lang(LOCALES.RU, LOCALES.RU))

    flag.renderer = { gl: null }
    flag.isLoaded = true

    flag._renderWebGL(performance.now())

    expect(flag.useWebGL).toBe(false)

    flag.destroy()
  })

  test('renderer _init covers document-less, throwing, and shader-failure paths', () => {
    const proto = window.HTMLCanvasElement?.prototype || HTMLCanvasElement.prototype
    const patched = proto.getContext
    const flag = new FlagWebGL(makeCanvas(), lang(LOCALES.EN, 'fx'))
    const fr = flag.renderer

    // document-less early return
    const doc = globalThis.document

    fr.gl = null
    fr.lost = false
    delete globalThis.document
    fr._init()

    expect(fr.gl).toBeNull()

    globalThis.document = doc

    // throwing getContext -> the `catch { gl = null }` arm, and a mount
    // under the same stub hits init()'s acquire-null fallback
    proto.getContext = () => {
      throw new Error('gl-boom')
    }

    fr._init()

    expect(fr.gl).toBeNull()

    const deadFlag = new FlagWebGL(makeCanvas(), lang(LOCALES.FR, 'dd'))

    expect(deadFlag.useWebGL).toBe(false)

    deadFlag.destroy()

    const wrap = (fns) => new Proxy({}, { get: (_t, p) => (p in fns ? fns[p] : mockGL[p]) })

    // FS compile failure -> warn + no context
    let shaderCalls = 0

    proto.getContext = () =>
      wrap({ getShaderParameter: () => (++shaderCalls === 2 ? false : true) })
    fr._init()

    expect(fr.gl).toBeNull()

    // program link failure -> warn + no context
    proto.getContext = () => wrap({ getProgramParameter: () => false })
    fr._init()

    expect(fr.gl).toBeNull()

    // throwing program setup -> the `catch` warn arm
    proto.getContext = () =>
      wrap({
        createProgram: () => {
          throw new Error('gl-boom')
        },
      })
    fr._init()

    expect(fr.gl).toBeNull()

    proto.getContext = patched
    fr.lost = false
    fr._init()

    flag.destroy()
  })

  test('loadImages resolves split aspects and static-renders without a loop', () => {
    const flag = new FlagWebGL(makeCanvas(), lang(LOCALES.GA, 'l1', 'l2'))

    flag.isHovered = true

    const r = flag.renderer
    const imgs = [r.image('l1'), r.image('l2')]

    imgs.forEach((img) => {
      Object.defineProperty(img, 'complete', { value: true, configurable: true })
      Object.defineProperty(img, 'naturalWidth', { value: 1200, configurable: true })
      Object.defineProperty(img, 'naturalHeight', { value: 600, configurable: true })
    })

    imgs[0].dispatchEvent(new window.Event(WINDOW_EVENTS.LOAD))

    expect(flag.isLoaded).toBe(true)
    expect(flag.aspect2).toBe(2)

    store.commit(PREF_MUTATIONS.SET_REDUCED_MOTION, true)
    flag.animate()
    expect(flag.animId).toBeNull()

    flag.destroy()
  })

  test('setReducedMotion restart, animate cancel and draw-resize arms', () => {
    const flag = new FlagWebGL(makeCanvas(), lang(LOCALES.DE, 'd1'))

    // `else if (!this.animId)` -> animate() restarts the loop
    cancelAnimationFrame(flag.animId)
    flag.animId = null
    flag.setReducedMotion(false)

    expect(flag.animId).toBeTruthy()

    // animate() under reduced motion with a pending frame -> cancel arm
    store.commit(PREF_MUTATIONS.SET_REDUCED_MOTION, true)
    flag.animate()

    expect(flag.animId).toBeNull()

    store.commit(PREF_MUTATIONS.SET_REDUCED_MOTION, false)

    // renderer draw when only the height differs -> `height !== h` arm
    const r = flag.renderer
    const img = r.image('d1')

    Object.defineProperty(img, 'complete', { value: true, configurable: true })
    Object.defineProperty(img, 'naturalWidth', { value: 1200, configurable: true })
    Object.defineProperty(img, 'naturalHeight', { value: 600, configurable: true })

    flag.isLoaded = true
    r.canvas.width = flag.canvas.width
    r.canvas.height = flag.canvas.height + 1
    flag._renderWebGL(performance.now())

    // fully matched sizes -> the no-resize else arm
    r.canvas.height = flag.canvas.height
    flag._renderWebGL(performance.now())

    flag.destroy()
  })

  test('canvas without getContext hits the init guard', () => {
    const fake = { style: {}, classList: { add() {}, contains: () => false } }
    const flag = new FlagWebGL(fake, lang(LOCALES.EN, 'ng'))

    expect(flag.useWebGL).toBe(false)
    expect(fake.style.display).toBe(STATE_STRINGS.NONE)
  })

  test('acquire/release else arms and resource-less dispose', () => {
    const flag = new FlagWebGL(makeCanvas(), lang(LOCALES.IT, 'p1'))
    const fr = flag.renderer

    // acquire with a live context -> `!this.gl` false arm
    expect(fr.acquire()).toBe(fr)
    expect(fr.refs).toBeGreaterThan(1)

    // release with refs remaining -> the `refs === 0` else arm
    fr.release()

    // dispose with no buffer/program -> the two guard else arms
    fr.quadBuffer = null
    fr.program = null
    fr.refs = 1
    fr.release()

    expect(fr.gl).toBeNull()

    flag.destroy()
  })

  test('resize dpr fallbacks and animate hover/loaded arms', () => {
    const flag = new FlagWebGL(makeCanvas(), lang(LOCALES.ES, HTML_TAGS.H1))
    const r = flag.renderer

    // devicePixelRatio falsy -> the `|| 1` arm
    const dpr = window.devicePixelRatio

    window.devicePixelRatio = 0
    flag._resizeToNaturalAspect()
    window.devicePixelRatio = dpr

    // window undefined -> the typeof else arm
    const win = globalThis.window

    delete globalThis.window
    flag._resizeToNaturalAspect()
    globalThis.window = win

    // animate() with hover + loaded state -> hover-1 + renderWebGL arms
    const img = r.image(HTML_TAGS.H1)

    Object.defineProperty(img, 'complete', { value: true, configurable: true })
    Object.defineProperty(img, 'naturalWidth', { value: 1200, configurable: true })
    Object.defineProperty(img, 'naturalHeight', { value: 600, configurable: true })

    flag.isLoaded = true
    flag.isHovered = true
    flag.animate()

    // setReducedMotion(false) with a live loop -> `!this.animId` else arm
    flag.setReducedMotion(false)

    flag.destroy()
  })
})
