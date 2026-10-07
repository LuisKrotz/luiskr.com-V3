/**
 * @file webgl-widgets.test.js
 * @description Lifecycle coverage for the shared-renderer WebGL widgets:
 * FlagWebGL (language flags) and SkeletonWebGL (shimmer skeleton layers),
 * including the pooled renderers, the purge/restore contract and the
 * syncSkeletonLayer/destroySkeletonLayer helpers.
 */
import { describe, test, expect, beforeEach, afterEach, jest } from '@jest/globals'
import { FlagWebGL } from '@/utils/canvas/widgets/flag-webgl.js'
import {
  SkeletonWebGL,
  syncSkeletonLayer,
  destroySkeletonLayer,
} from '@/utils/canvas/loaders/skeleton-webgl.js'
import { createMockGL, createMock2D } from '../../fixtures/mock-webgl.js'
import { TEST_GPU } from '../../fixtures/test-constants.js'
import store from '@/core/store.js'
import { LOCALES } from '@/core/constants.js'
import { PREF_MUTATIONS } from '@/core/tokens/events/mutations.js'
import { WEBGL_STRINGS } from '@/core/tokens/strings/webgl.js'
import { STATE_CLASSES } from '@/core/tokens/classes/state.js'
import { HTML_TAGS } from '@/core/tokens/elements/html.js'
import { FLAG_DIMENSIONS } from '@/core/tokens/media/dimensions.js'
import { GL_EVENTS, WINDOW_EVENTS } from '@/core/tokens/events/dom.js'
import { TYPE_STRINGS } from '@/core/tokens/strings/types.js'
import { STATE_STRINGS } from '@/core/tokens/strings/state.js'
import { SKELETON_CLASSES } from '@/core/tokens/classes/skeleton.js'

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

// ─── SkeletonWebGL ───────────────────────────────────────────────────────────

describe('SkeletonWebGL', () => {
  const makeHost = () => {
    const host = document.createElement(HTML_TAGS.DIV)
    const root = document.createElement(HTML_TAGS.DIV)
    const content = document.createElement(HTML_TAGS.DIV)

    host.getBoundingClientRect = () => ({ left: 0, top: 0, width: 400, height: 300 })

    root.appendChild(content)
    host.appendChild(root)
    document.body.appendChild(host)

    return { host, root, content }
  }

  test('acquires the renderer and installs the layer canvas', () => {
    const { host, root, content } = makeHost()
    const layer = new SkeletonWebGL(host, root, content)

    expect(layer.useWebGL).toBe(true)
    expect(layer.canvas).toBeTruthy()
    expect(host.classList.contains(SKELETON_CLASSES.HAS_SKELETON_LAYER)).toBe(true)

    layer.destroy()
  })

  test('falls back to null canvas when no renderer can be acquired', () => {
    const proto = window.HTMLCanvasElement?.prototype || HTMLCanvasElement.prototype

    proto.getContext = () => null

    const { host, root, content } = makeHost()
    const layer = new SkeletonWebGL(host, root, content)

    expect(layer.canvas).toBeNull()

    layer.destroy()
  })

  test('_parseCssColor handles hex, rgb and color(srgb) syntax', () => {
    const { host, root, content } = makeHost()
    const layer = new SkeletonWebGL(host, root, content)

    expect(layer._parseCssColor('#ff0000')).toEqual([1, 0, 0])
    expect(layer._parseCssColor('#f00')).toEqual([1, 0, 0])
    expect(layer._parseCssColor('rgb(255, 0, 0)')).toEqual([1, 0, 0])
    expect(layer._parseCssColor('rgba(0, 255, 0, 0.5)')).toEqual([0, 1, 0])
    expect(layer._parseCssColor('color(srgb 1 0 0)')).toEqual([1, 0, 0])
    expect(layer._parseCssColor('bogus')).toBeNull()
    expect(layer._parseCssColor(42)).toBeNull()

    layer.destroy()
  })

  test('refresh measures skeleton placeholders into rect data', () => {
    const { host, root, content } = makeHost()
    const layer = new SkeletonWebGL(host, root, content)

    layer.base = [0.1, 0.1, 0.1]
    layer.ink = [0.9, 0.9, 0.9]

    const node = document.createElement(HTML_TAGS.DIV)

    node.className = SKELETON_CLASSES.SKELETON_BLOCK
    node.getBoundingClientRect = () => ({ left: 10, top: 20, width: 100, height: 40 })
    content.appendChild(node)

    layer.refresh()

    expect(layer.rects).toHaveLength(1)
    expect(layer.rects[0].w).toBe(100)
    expect(layer.rectData[0]).toBeDefined()

    layer.destroy()
  })

  test('refresh skips when no skeleton placeholders exist', () => {
    const { host, root, content } = makeHost()
    const layer = new SkeletonWebGL(host, root, content)

    layer.refresh()

    expect(layer.rects).toHaveLength(0)

    layer.destroy()
  })

  test('purge pauses rendering and restore resumes it', () => {
    const { host, root, content } = makeHost()
    const layer = new SkeletonWebGL(host, root, content)

    layer.purge()

    expect(layer._paused).toBe(true)

    layer.restore()

    expect(layer._paused).toBe(false)

    layer.destroy()
  })

  test('resolve animates the reveal then cleans up', async () => {
    const { host, root, content } = makeHost()
    const layer = new SkeletonWebGL(host, root, content)

    layer.base = [0.1, 0.1, 0.1]
    layer.ink = [0.9, 0.9, 0.9]
    layer.resolve()

    expect(layer.resolveStart).toBeGreaterThan(0)

    await flushFrames(60)

    layer.destroy()
  })

  test('dark mode samples the dark ink alpha', () => {
    document.documentElement.classList.add(STATE_CLASSES.DARK_MODE)

    const { host, root, content } = makeHost()
    const layer = new SkeletonWebGL(host, root, content)

    layer._sampleTheme()

    layer.destroy()
  })

  test('software rasterizers take the CSS fallback and the ref is returned', () => {
    const { host, root, content } = makeHost()
    const probe = new SkeletonWebGL(host, root, content)
    const renderer = probe.renderer

    probe.destroy()

    const swGL = new Proxy(
      {},
      {
        get(_t, prop) {
          if (typeof prop === TYPE_STRINGS.STRING && prop === prop.toUpperCase()) return 1

          return (...args) => {
            if (prop === 'getExtension') {
              return { UNMASKED_RENDERER_WEBGL: 1, loseContext: () => {} }
            }
            if (prop === 'getParameter') return TEST_GPU.SOFTWARE_RENDERER

            return [
              'createShader',
              'createProgram',
              'createBuffer',
              'getUniformLocation',
              'getAttribLocation',
            ].includes(prop)
              ? { id: args.length }
              : undefined
          }
        },
        set: () => true,
      }
    )

    const proto = window.HTMLCanvasElement?.prototype || HTMLCanvasElement.prototype

    proto.getContext = (type) => (/webgl/i.test(String(type)) ? swGL : null)

    const layer = new SkeletonWebGL(host, root, content)

    expect(layer.canvas).toBeNull()
    expect(renderer.lost).toBe(true)
    expect(renderer.refs).toBe(0)

    renderer._dispose()

    expect(renderer.lost).toBe(false)

    layer.destroy()
  })

  test('context loss marks the renderer; stale canvas events are ignored', () => {
    const { host, root, content } = makeHost()
    const layer = new SkeletonWebGL(host, root, content)
    const renderer = layer.renderer
    const live = renderer.canvas

    live.dispatchEvent(new window.Event(GL_EVENTS.WEBGL_CONTEXT_LOST, { cancelable: true }))

    expect(renderer.lost).toBe(true)
    expect(renderer.gl).toBeNull()

    layer.destroy()

    const layer2 = new SkeletonWebGL(host, root, content)
    const oldLive = layer2.renderer.canvas

    layer2.destroy()

    const layer3 = new SkeletonWebGL(host, root, content)

    oldLive.dispatchEvent(new window.Event(GL_EVENTS.WEBGL_CONTEXT_LOST, { cancelable: true }))

    expect(layer3.renderer.lost).toBe(false)

    layer3.destroy()
  })

  test('shader compile failure keeps the widget in the fallback path', () => {
    const proto = window.HTMLCanvasElement?.prototype || HTMLCanvasElement.prototype
    const failingGL = new Proxy(
      {},
      {
        get(_t, prop) {
          if (typeof prop === TYPE_STRINGS.STRING && prop === prop.toUpperCase()) return 1

          return (...args) => {
            if (prop === 'getShaderParameter') return false
            if (prop === 'getShaderInfoLog') return 'compile failed'

            return [
              'createShader',
              'createProgram',
              'createBuffer',
              'getUniformLocation',
              'getAttribLocation',
            ].includes(prop)
              ? { id: args.length }
              : undefined
          }
        },
        set: () => true,
      }
    )

    proto.getContext = (type) => (/webgl/i.test(String(type)) ? failingGL : null)

    const { host, root, content } = makeHost()
    const layer = new SkeletonWebGL(host, root, content)

    expect(layer.canvas).toBeNull()

    layer.destroy()
  })

  test('refresh classifies text-like placeholders by selector and height', () => {
    const { host, root, content } = makeHost()
    const layer = new SkeletonWebGL(host, root, content)

    layer.base = [0.1, 0.1, 0.1]
    layer.ink = [0.9, 0.9, 0.9]

    const textNode = document.createElement(HTML_TAGS.DIV)

    textNode.className = SKELETON_CLASSES.SKELETON_BLOCK
    textNode.getBoundingClientRect = () => ({ left: 0, top: 0, width: 100, height: 16 })

    const mediaNode = document.createElement(HTML_TAGS.DIV)

    mediaNode.className = SKELETON_CLASSES.SKELETON_BLOCK
    mediaNode.getBoundingClientRect = () => ({ left: 0, top: 30, width: 100, height: 200 })

    content.appendChild(textNode)
    content.appendChild(mediaNode)

    layer.refresh()

    expect(layer.rects).toHaveLength(2)

    layer.destroy()
  })

  test('_scheduleRefresh no-ops when paused, unscheduled, or without WebGL', async () => {
    const { host, root, content } = makeHost()
    const layer = new SkeletonWebGL(host, root, content)

    layer.useWebGL = false
    layer._scheduleRefresh()

    expect(layer._refreshId).toBeFalsy()

    layer.useWebGL = true
    layer._scheduleRefresh()

    expect(layer._refreshId).toBeTruthy()

    await flushFrames(40)

    layer.destroy()
  })
})

// ─── syncSkeletonLayer / destroySkeletonLayer helpers ────────────────────────

describe('syncSkeletonLayer helpers', () => {
  const makeComponent = () => {
    const el = document.createElement(HTML_TAGS.DIV)
    const shadow = el.attachShadow({ mode: STATE_STRINGS.OPEN })
    const content = document.createElement(HTML_TAGS.DIV)

    el._contentNode = content
    shadow.appendChild(content)
    document.body.appendChild(el)

    return { el, content }
  }

  test('creates a layer only when skeleton placeholders exist', () => {
    const { el, content } = makeComponent()

    syncSkeletonLayer(el)

    expect(el._skeletonLayer).toBeUndefined()

    const skel = document.createElement(HTML_TAGS.DIV)

    skel.className = SKELETON_CLASSES.SKELETON_BLOCK
    content.appendChild(skel)

    syncSkeletonLayer(el)

    expect(el._skeletonLayer).toBeTruthy()

    destroySkeletonLayer(el)

    expect(el._skeletonLayer).toBeNull()
  })

  test('resolve path when placeholders are removed', () => {
    const { el, content } = makeComponent()
    const skel = document.createElement(HTML_TAGS.DIV)

    skel.className = SKELETON_CLASSES.SKELETON_BLOCK
    content.appendChild(skel)

    syncSkeletonLayer(el)

    const layer = el._skeletonLayer

    content.innerHTML = ''

    syncSkeletonLayer(el)

    expect(el._skeletonLayer).toBeNull()
    expect(layer.resolveStart).toBeGreaterThan(0)
  })

  test('no-ops on components without a content node', () => {
    expect(() => syncSkeletonLayer({})).not.toThrow()
    expect(() => destroySkeletonLayer({})).not.toThrow()
  })
})

// ─── skeleton-webgl tails ────────────────────────────────────────────────────

describe('skeleton-webgl tails', () => {
  const makeHost = () => {
    const host = document.createElement(HTML_TAGS.DIV)
    const root = document.createElement(HTML_TAGS.DIV)
    const content = document.createElement(HTML_TAGS.DIV)

    host.getBoundingClientRect = () => ({ left: 0, top: 0, width: 400, height: 300 })

    root.appendChild(content)
    host.appendChild(root)
    document.body.appendChild(host)

    return { host, root, content }
  }

  const makeSkel = (cls, rect) => {
    const el = document.createElement(HTML_TAGS.DIV)

    el.className = cls
    el.getBoundingClientRect = () => rect

    return el
  }

  const drainRenderer = (host, root, content) => {
    const probe = new SkeletonWebGL(host, root, content)
    const renderer = probe.renderer

    while (renderer && renderer.refs > 0) renderer.release()

    probe.destroy()
  }

  test('renderer init survives a throwing getContext and a throwing renderer probe', () => {
    const proto = window.HTMLCanvasElement?.prototype || HTMLCanvasElement.prototype
    const { host, root, content } = makeHost()

    drainRenderer(host, root, content)

    proto.getContext = (type) => {
      if (/webgl/i.test(String(type))) throw new Error('no-gpu')

      return mock2D
    }

    const layer = new SkeletonWebGL(host, root, content)

    expect(layer.canvas).toBeNull()

    layer.destroy()

    const throwing = new Proxy(mockGL, {
      get: (t, p) =>
        p === 'getParameter'
          ? () => {
              throw new Error('no-info')
            }
          : t[p],
    })

    proto.getContext = (type) => (/webgl/i.test(String(type)) ? throwing : mock2D)

    const layer2 = new SkeletonWebGL(host, root, content)

    expect(layer2.useWebGL).toBe(true)

    layer2.destroy()
  })

  test('program link failure drops the layer into the fallback path', () => {
    const proto = window.HTMLCanvasElement?.prototype || HTMLCanvasElement.prototype
    const { host, root, content } = makeHost()

    drainRenderer(host, root, content)

    const failLink = new Proxy(mockGL, {
      get: (t, p) => (p === 'getProgramParameter' ? () => false : t[p]),
    })

    proto.getContext = (type) => (/webgl/i.test(String(type)) ? failLink : mock2D)

    const layer = new SkeletonWebGL(host, root, content)

    expect(layer.canvas).toBeNull()

    layer.destroy()
  })

  test('renderer acquire skips init while lost and dispose covers resource-less arms', () => {
    const { host, root, content } = makeHost()
    const a = new SkeletonWebGL(host, root, content)
    const b = new SkeletonWebGL(host, root, content)
    const renderer = a.renderer

    b.destroy()

    renderer.gl = null
    renderer.lost = true

    expect(renderer.acquire()).toBeNull()

    renderer.program = null
    renderer.quadBuffer = null
    renderer.lost = false
    renderer.gl = mockGL
    renderer._dispose()

    expect(renderer.lost).toBe(false)

    a.destroy()
  })

  test('renderer draw blits frames and early-returns without a gl context', () => {
    const { host, root, content } = makeHost()
    const layer = new SkeletonWebGL(host, root, content)

    content.appendChild(
      makeSkel(SKELETON_CLASSES.SKELETON_BLOCK, { left: 0, top: 0, width: 800, height: 600 })
    )

    layer.base = [0.1, 0.1, 0.1]
    layer.ink = [0.9, 0.9, 0.9]
    layer.refresh()

    const renderer = layer.renderer

    expect(renderer.draw(layer, 0.5, 0)).toBe(true)
    expect(renderer.draw(layer, 0.6, 0.5)).toBe(true)

    const gl = renderer.gl

    renderer.gl = null

    expect(renderer.draw(layer, 0.7, 0)).toBe(false)

    renderer.gl = gl

    layer.destroy()
  })

  test('_init returns early without document and releases the ref without a 2d context', () => {
    const proto = window.HTMLCanvasElement?.prototype || HTMLCanvasElement.prototype
    const { host, root, content } = makeHost()
    const doc = globalThis.document

    delete globalThis.document

    const layer = new SkeletonWebGL(host, root, content)

    globalThis.document = doc

    expect(layer.useWebGL).toBe(false)

    layer.destroy()

    proto.getContext = (type) => (/webgl/i.test(String(type)) ? mockGL : null)

    const layer2 = new SkeletonWebGL(host, root, content)

    expect(layer2.canvas).toBeNull()

    layer2.destroy()
  })

  test('ResizeObserver observes host and placeholders and triggers scheduled refresh', () => {
    const observed = []

    globalThis.ResizeObserver = class {
      constructor(cb) {
        this.cb = cb
      }
      observe(el) {
        observed.push(el)
      }
      unobserve() {}
      disconnect() {}
    }

    const { host, root, content } = makeHost()

    content.appendChild(
      makeSkel(SKELETON_CLASSES.SKELETON_BLOCK, { left: 0, top: 0, width: 100, height: 40 })
    )

    const layer = new SkeletonWebGL(host, root, content)

    expect(observed.length).toBeGreaterThan(1)

    layer._ro.cb()

    expect(layer._refreshId).toBeTruthy()

    delete globalThis.ResizeObserver

    layer.destroy()
  })

  test('idle-start begins the loop and destroy cancels a pending idle handle', () => {
    globalThis.requestIdleCallback = (cb) => {
      cb()
      return 1
    }
    globalThis.cancelIdleCallback = jest.fn()

    const { host, root, content } = makeHost()
    const layer = new SkeletonWebGL(host, root, content)

    expect(layer.animId).toBeTruthy()

    globalThis.requestIdleCallback = () => 7

    const layer2 = new SkeletonWebGL(host, root, content)

    layer2.destroy()

    expect(globalThis.cancelIdleCallback).toHaveBeenCalledWith(7)

    delete globalThis.requestIdleCallback
    delete globalThis.cancelIdleCallback

    layer.destroy()
  })

  test('window resize triggers a refresh through the bound listener', () => {
    const { host, root, content } = makeHost()
    const layer = new SkeletonWebGL(host, root, content)
    const spy = jest.spyOn(layer, 'refresh')

    window.dispatchEvent(new Event(WINDOW_EVENTS.RESIZE))

    expect(spy).toHaveBeenCalled()

    layer.destroy()
  })

  test('refresh guards and per-rect palette arms cover text rows, fallbacks and dpr', () => {
    const { host, root, content } = makeHost()
    const layer = new SkeletonWebGL(host, root, content)

    layer.useWebGL = false
    layer.refresh()
    layer.useWebGL = true
    layer.resolveStart = 1
    layer.refresh()
    layer.resolveStart = 0

    const origGCS = globalThis.getComputedStyle

    globalThis.getComputedStyle = (el) => ({
      lineHeight: el._lh || '',
      getPropertyValue: () => '',
    })

    const textRow = makeSkel(SKELETON_CLASSES.SKELETON_TITLE_SM, {
      left: 0,
      top: 0,
      width: 100,
      height: 20,
    })

    textRow._lh = '10px'

    const textNoLh = makeSkel(SKELETON_CLASSES.SKELETON_TITLE_SM, {
      left: 0,
      top: 30,
      width: 100,
      height: 16,
    })
    const zeroText = makeSkel(SKELETON_CLASSES.SKELETON_TITLE_SM, {
      left: 0,
      top: 60,
      width: 100,
      height: 0,
    })
    const media = makeSkel(SKELETON_CLASSES.SKELETON_BLOCK, {
      left: 0,
      top: 90,
      width: 100,
      height: 200,
    })

    content.appendChild(textRow)
    content.appendChild(textNoLh)
    content.appendChild(zeroText)
    content.appendChild(media)

    layer.base = [0.1, 0.1, 0.1]
    layer.ink = [0.9, 0.9, 0.9]

    layer.refresh()
    layer.refresh()

    expect(layer.rects.length).toBeGreaterThan(0)

    const dprDesc = Object.getOwnPropertyDescriptor(window, 'devicePixelRatio')

    Object.defineProperty(window, 'devicePixelRatio', { value: undefined, configurable: true })

    layer.refresh()

    Object.defineProperty(window, 'devicePixelRatio', dprDesc)

    layer.host = null
    layer.refresh()

    globalThis.getComputedStyle = origGCS

    layer.destroy()
  })

  test('_loop covers the stopped, paused, frame-skip, reduced and resolve-complete arms', () => {
    const { host, root, content } = makeHost()
    const layer = new SkeletonWebGL(host, root, content)

    layer.useWebGL = false
    layer._loop()
    layer.useWebGL = true

    layer._paused = true
    layer._frame = 0
    layer._loop()
    layer._frame = 1
    layer._loop()
    layer.resolveStart = 1
    layer._loop()
    layer.resolveStart = 0
    layer._paused = false

    store.commit(PREF_MUTATIONS.SET_REDUCED_MOTION, true)

    layer._frame = 1
    layer._loop()

    expect(layer.animId).toBeNull()

    layer.resolveStart = performance.now()
    layer._frame = 1
    layer._loop()
    layer.resolveStart = performance.now() - 1000
    layer._loop()

    expect(layer.canvas).toBeNull()
  })

  test('_render guards empty rects and draws through the shared renderer', () => {
    const { host, root, content } = makeHost()
    const layer = new SkeletonWebGL(host, root, content)

    layer._render(0, 0)

    layer.canvas.width = 100
    layer.canvas.height = 100
    layer.rects = [{}]
    layer.rectData = new Float32Array(4)
    layer.metaData = new Float32Array(4)
    layer.skelBaseData = new Float32Array(4)
    layer.skelInkData = new Float32Array(4)
    layer.inkAlpha = 0.1
    layer.ctx = mock2D
    layer._render(0, 0)

    layer.renderer.gl = null
    layer._render(0, 0)

    expect(layer.canvas).toBeNull()
  })

  test('resolve() covers repeated calls, the helper timeout and non-WebGL arms', async () => {
    const { host, root, content } = makeHost()
    const layer = new SkeletonWebGL(host, root, content)

    layer.resolve()
    layer.resolve()

    expect(layer.resolveStart).toBeGreaterThan(0)

    const layer2 = new SkeletonWebGL(host, root, content)

    layer2.useWebGL = false
    layer2.resolve()

    const layer3 = new SkeletonWebGL(host, root, content)

    layer3.animId = requestAnimationFrame(() => {})
    layer3.resolve()

    expect(layer3.resolveStart).toBeGreaterThan(0)

    await flushFrames(600)

    layer2.destroy()
    layer3.destroy()
  })

  test('_loop cancels its own frame under reduced motion without a resolve', () => {
    const { host, root, content } = makeHost()
    const layer = new SkeletonWebGL(host, root, content)

    layer.useWebGL = true
    layer._frame = 1

    store.commit(PREF_MUTATIONS.SET_REDUCED_MOTION, true)
    layer._loop()

    expect(layer.animId).toBeNull()

    store.commit(PREF_MUTATIONS.SET_REDUCED_MOTION, false)

    layer.destroy()
  })

  test('syncSkeletonLayer refreshes an existing layer and skips a dead one', () => {
    const el = document.createElement(HTML_TAGS.DIV)
    const shadow = el.attachShadow({ mode: STATE_STRINGS.OPEN })
    const content = document.createElement(HTML_TAGS.DIV)

    el._contentNode = content
    shadow.appendChild(content)
    document.body.appendChild(el)

    const skel = makeSkel(SKELETON_CLASSES.SKELETON_BLOCK, {
      left: 0,
      top: 0,
      width: 100,
      height: 40,
    })

    content.appendChild(skel)

    syncSkeletonLayer(el)

    const layer = el._skeletonLayer
    const spy = jest.spyOn(layer, 'refresh')

    syncSkeletonLayer(el)

    expect(spy).toHaveBeenCalled()

    layer.useWebGL = false
    syncSkeletonLayer(el)

    expect(spy).toHaveBeenCalledTimes(1)

    destroySkeletonLayer(el)
    el.remove()
  })
})
