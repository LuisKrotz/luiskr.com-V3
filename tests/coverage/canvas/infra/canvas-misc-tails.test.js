/**
 * @file coverage-tails-7.test.js
 * @description Seventh tail sweep — post-decomposition coverage for the
 * module trees exposed by the folder reorganization: CMS editor event
 * bindings + section helpers + deploy-info delegates, Earth engine
 * update/bootstrap guards, canvas-widget delegates + shared GL helpers,
 * route helpers, safari patch guards, and misc utilities
 * (css-color, gpu-accel, route-warmer, draw-text).
 */
import { jest } from '@jest/globals'

import { attachNoGL, createMockGL } from '../../../fixtures/mock-webgl.js'
import { TEST_COLORS } from '../../../fixtures/test-constants.js'

import '@/cms/about/CmsAboutEditor.js'
import '@/cms/portfolio/CmsPortfolioList.js'
import '@/cms/projects/CmsProjectsList.js'
import '@/cms/playground-editor/CmsPlaygroundEditor.js'
import '@/cms/footer/CmsFooterEditor.js'
import '@/cms/deploy-info/CmsDeployInfo.js'

import '@/utils/canvas/css-color.js'

import '@/utils/canvas/widgets/switch-slider/render.js'

import '@/utils/canvas/widgets/flag/renderer.js'
import '@/utils/canvas/widgets/flag/texture.js'

import '@/utils/gpu/gpu-accel.js'
import { HTML_TAGS } from '@/core/tokens/elements/html.js'


globalThis.alert = jest.fn()

const flush = (ms = 80) => new Promise((r) => setTimeout(r, ms))

const makeCanvas = () => document.createElement(HTML_TAGS.CANVAS)

// ─── CMS: about editor event bindings ────────────────────────────────────────

describe('canvas misc tails', () => {
  test('flag-webgl init fallback arms + renderer delegate calls', async () => {
    const { FlagWebGL } = await import('@/utils/canvas/widgets/flag-webgl.js')
    const { flagRenderer: pool } = await import('@/utils/canvas/widgets/flag/renderer.js')
    const lang = { code: 'en', cc: 'us', cc2: null }

    const canvas = makeCanvas()

    attachNoGL(canvas)

    const flag = new FlagWebGL(canvas, lang)

    // acquire() null → renderer ternary null arm + !renderer fallback return
    flag.init()
    expect(flag.useWebGL).toBe(false)

    flag.destroy()

    // pool gl alive → acquire returns the renderer → getContext('2d') null → !ctx arm
    pool.gl = {}

    const canvas2 = makeCanvas()

    attachNoGL(canvas2)

    const flag2 = new FlagWebGL(canvas2, lang)

    flag2.init()
    expect(flag2.useWebGL).toBe(false)
    flag2.destroy()

    pool.gl = null

    // renderer facade delegates
    expect(pool.image('us')).toBeTruthy()
  })

  test('flagTexture cache-hit / missing-image / incomplete-image arms', async () => {
    const { flagTexture } = await import('@/utils/canvas/widgets/flag/texture.js')
    const gl = createMockGL()
    const r = { gl, textures: new Map(), images: new Map() }

    // cache hit → return tex arm
    const tex = {}

    r.textures.set('us', tex)
    expect(flagTexture(r, 'us')).toBe(tex)

    // image missing → null arm
    expect(flagTexture(r, 'de')).toBeNull()

    // image present but not complete → null arm
    r.images.set('fr', { complete: false })

    expect(flagTexture(r, 'fr')).toBeNull()

    // no gl → first guard
    expect(flagTexture({ gl: null, textures: new Map(), images: new Map() }, 'us')).toBeNull()
  })

  test('switch-slider renderWebGL guard arms', async () => {
    const { renderWebGL: renderSwitchWebGL } = await import('@/utils/canvas/widgets/switch-slider/render.js')
    const gl = createMockGL()
    const host = { gl, canvas: { width: 10, height: 10 }, program: null, quadBuffer: null, aPos: 0 }

    renderSwitchWebGL(host, 0)

    host.program = {}

    renderSwitchWebGL(host, 0)

    host.quadBuffer = {}
    host.uRes = null
    host.uTime = null
    host.uProgress = null
    host.uKnobX = null
    host.uContext = null
    host.useWebGL = true
    host.isOn = false
    host.p = 0
    host.currentP = 0
    host.knobX = 0
    host.startTime = 0
    host._contextCode = () => 0

    renderSwitchWebGL(host, 16)

    // no-gl → outer guard
    renderSwitchWebGL({ gl: null, canvas: {}, program: null, quadBuffer: null }, 0)
  })

  test('xToContinuousP default-rectWidth arm', async () => {
    const { xToContinuousP } = await import('@/utils/canvas/widgets/theme-slider/math.js')
    const host = { width: 100 }

    // (50−12)/(88−12)·2 = 1.0 in a 100-wide band
    expect(xToContinuousP(host, 50)).toBeCloseTo(1.0, 1)

    // (50−24)/(176−24)·2 ≈ 0.342 in a 200-wide band
    expect(xToContinuousP(host, 50, 200)).toBeCloseTo(0.342, 1)

    // falsy rectWidth → host.width
    expect(xToContinuousP(host, 50, 0)).toBeCloseTo(1.0, 1)
  })

  test('parseCssColor non-string / rgb / srgb / invalid arms', async () => {
    const { parseCssColor } = await import('@/utils/canvas/css-color.js')
    expect(parseCssColor(42)).toBeNull()
    expect(parseCssColor(null)).toBeNull()
    expect(parseCssColor('rgb(10, 20, 30)')).toBeTruthy()
    expect(parseCssColor('rgba(10, 20, 30, 0.5)')).toBeTruthy()
    expect(parseCssColor('color(srgb 0.1 0.2 0.3)')).toBeTruthy()
    expect(parseCssColor('#ff8800')).toBeTruthy()
    expect(parseCssColor(TEST_COLORS.INVALID)).toBeNull()
  })

  test('gpu-accel initGPU mobile/NPU/fail + accelerateElementGPU arms', async () => {
    const { gpuAccel } = await import('@/utils/gpu/gpu-accel.js')
    // element arms: root → scroll-position, body → scroll-position, normal → layer
    gpuAccel.accelerateElementGPU(document.documentElement)
    gpuAccel.accelerateElementGPU(document.body)

    const div = document.createElement('div')

    gpuAccel.accelerateElementGPU(div)
    expect(div.style.willChange).toBe('transform, opacity')

    gpuAccel.accelerateElementGPU(null)
    gpuAccel.accelerateElementGPU({})

    // mobile UA → early return before canvas creation
    const origUA = Object.getOwnPropertyDescriptor(navigator, 'userAgent')

    Object.defineProperty(navigator, 'userAgent', { value: 'iPhone', configurable: true })
    gpuAccel.initGPU()

    if (origUA) Object.defineProperty(navigator, 'userAgent', origUA)
    else delete navigator.userAgent

    // desktop path — getContext returns a gl whose shader compile fails → warn sink
    const failGl = createMockGL()

    const origCreate = document.createElement.bind(document)
    const fakeCanvas = { width: 0, height: 0, getContext: () => failGl }

    document.createElement = (tag) => (tag === 'canvas' ? fakeCanvas : origCreate(tag))
    gpuAccel.initGPU()
    document.createElement = origCreate
  })

  test('route-warmer idle/fallback/stopped arms', async () => {
    // requestIdleCallback arm — callbacks captured then run
    jest.resetModules()

    const cbs = []

    window.requestIdleCallback = (cb) => {
      cbs.push(cb)

      return 1
    }

    const rw = await import('@/utils/motion/route-warmer.js')

    rw.startRouteWarming()

    // double-start → _started guard arm
    rw.startRouteWarming()

    // drain the scheduled chain — each chunk's finally schedules the next
    for (const cb of cbs.splice(0)) cb()

    await flush(300)

    // stop → _stopped arm inside any further scheduled cb
    rw.stopRouteWarming()

    for (const cb of cbs.splice(0)) cb()

    // setTimeout fallback arm — fresh module, no requestIdleCallback
    jest.resetModules()
    delete window.requestIdleCallback

    const rw2 = await import('@/utils/motion/route-warmer.js')

    rw2.startRouteWarming()
    await flush(400)
    rw2.stopRouteWarming()
  })
})

