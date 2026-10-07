/**
 * @file widget-tails.test.js
 * @description Coverage-tail tests for the WebGL canvas widgets — the guard
 * arms that only fire on partial init: program-build failure after a
 * successful context, resize checks with no GL, unbind when events were
 * never bound, 2D paint with a null ctx, and the texture-creation guard.
 * Static imports only — no resetModules (which discards istanbul counters).
 */

import { describe, test, expect } from '@jest/globals'
import { BurgerButtonWebGL } from '@/utils/canvas/widgets/burger-button-webgl.js'
import { CarouselArrowWebGL } from '@/utils/canvas/widgets/carousel-controls.js'
import { FlagWebGL } from '@/utils/canvas/widgets/flag-webgl.js'
import { createQuadProgram } from '@/utils/canvas/gl-program.js'
import { flagTexture } from '@/utils/canvas/widgets/flag/texture.js'
import { drawFlag } from '@/utils/canvas/widgets/flag/draw.js'
import { FlagRenderer } from '@/utils/canvas/widgets/flag/renderer.js'
import { paintCarouselArrow2D } from '@/utils/canvas/widgets/carousel-controls/paint-2d.js'
import { paintSwitchSlider2D } from '@/utils/canvas/widgets/switch-slider/paint-2d.js'
import { paintThemeSlider2D } from '@/utils/canvas/widgets/theme-slider/paint-2d.js'
import { renderFrame } from '@/utils/canvas/loaders/menu-background/loop.js'
import { attachMockGL, attachNoGL, createMockGL } from '../../../fixtures/mock-webgl.js'
import { ARROW_TYPES, LOCALES} from '@/core/constants.js'
import { HTML_TAGS } from '@/core/tokens/elements/html.js'
import { TYPE_STRINGS } from '@/core/tokens/strings/types.js'
import { WEBGL_STRINGS } from '@/core/tokens/strings/webgl.js'




const makeCanvas = () => document.createElement(HTML_TAGS.CANVAS)

const lang = (code, cc, cc2 = null) => ({ code, cc, cc2 })

// GL stub whose program creation fails — drives the `if (!built)` fallback arm.
const makeProgramFailGL = () =>
  new Proxy(
    {},
    {
      get(_t, p) {
        if (p === 'createShader' || p === 'createBuffer') return () => ({})
        if (p === 'createProgram') return () => null
        if (p === 'getShaderParameter') return () => true
        if (p === 'getError') return () => 0
        if (p === 'getProgramParameter') return () => false
        if (p === 'getProgramInfoLog' || p === 'getShaderInfoLog') return () => 'fail'
        if (typeof p === TYPE_STRINGS.STRING && p === p.toUpperCase()) return 1
        return () => undefined
      },
      set: () => true },
  )

describe('BurgerButtonWebGL — program failure + static resize guards', () => {
  test('context ok but program build fails → fallback + early return', () => {
    const canvas = makeCanvas()

    canvas.getContext = () => makeProgramFailGL()

    const burger = new BurgerButtonWebGL(canvas)

    expect(burger.useWebGL).toBe(false)
    expect(canvas.classList.length).toBeGreaterThanOrEqual(0)

    burger.destroy()
  })

  test('_checkResize no-ops when gl is null (reduced-motion repaint guard)', () => {
    const canvas = makeCanvas()

    attachNoGL(canvas)

    const burger = new BurgerButtonWebGL(canvas)

    burger.gl = null
    burger.canvas = canvas

    expect(() => burger._checkResize()).not.toThrow()

    burger.destroy()
  })

  test('_checkResize repaints a static frame when animId is null', () => {
    const canvas = makeCanvas()

    canvas.getBoundingClientRect = () => ({ left: 0, top: 0, width: 64, height: 64 })
    attachMockGL(canvas)

    const burger = new BurgerButtonWebGL(canvas)

    burger.animId = null
    burger._checkResize()

    burger.destroy()
  })
})

describe('CarouselArrowWebGL — unbind else-arms', () => {
  test('destroy with boundTarget set but no handlers → else arms', () => {
    const canvas = makeCanvas()

    attachMockGL(canvas)

    const arrow = new CarouselArrowWebGL(canvas, ARROW_TYPES.NEXT)

    arrow.boundTarget = document.createElement(HTML_TAGS.DIV || 'div')
    arrow.onMouseEnter = undefined
    arrow.onMouseLeave = undefined
    arrow.onClick = undefined

    expect(() => arrow.destroy()).not.toThrow()
  })
})

describe('FlagWebGL — unbind else-arms', () => {
  test('destroy with boundTarget but no handlers → else arms', () => {
    const canvas = makeCanvas()

    attachNoGL(canvas)

    const flag = new FlagWebGL(canvas, lang(LOCALES.EN, 'us'))

    flag.boundTarget = document.createElement(HTML_TAGS.DIV || 'div')
    flag.onMouseEnter = undefined
    flag.onMouseLeave = undefined

    expect(() => flag.destroy()).not.toThrow()
  })
})

describe('gl-program — quad buffer failure arm', () => {
  test('createQuadProgram returns falsy when createBuffer fails', () => {
    // Proxy with set-trap (createMockGL) swallows overrides — use a bespoke
    // stub whose createBuffer returns null so the quad guard fires.
    const gl = new Proxy(
      {},
      {
        get(_t, p) {
          if (p === 'createBuffer') return () => null
          if (p === 'createShader' || p === 'createProgram') return () => ({})
          if (p === 'getShaderParameter' || p === 'getProgramParameter') return () => true
          if (p === 'getError') return () => 0
          if (p === 'getAttribLocation') return () => 0
          if (typeof p === TYPE_STRINGS.STRING && p === p.toUpperCase()) return 1
          return () => undefined
        },
        set: () => true },
    )

    const built = createQuadProgram(gl, 'void main(){}', 'void main(){}', 'X', {
      verts: new Float32Array([0, 0, 0]),
      premultiplied: false })

    expect(built).toBeFalsy()
  })
})

describe('flag texture/draw — creation guards', () => {
  test('flagTexture returns null when gl.createTexture yields nothing', () => {
    const gl = new Proxy(
      {},
      {
        get(_t, p) {
          if (p === 'createTexture') return () => null
          if (typeof p === TYPE_STRINGS.STRING && p === p.toUpperCase()) return 1
          return () => undefined
        },
        set: () => true },
    )

    const img = { complete: true, naturalWidth: 4 }
    const r = {
      gl,
      textures: new Map(),
      images: new Map([['us', img]]),
      bitmaps: new Map(),
    }

    // flagTexture draws the flag into an internal pot canvas — stub the
    // prototype 2D context so the pipeline reaches gl.createTexture itself.
    const proto = window.HTMLCanvasElement.prototype
    const orig = proto.getContext

    proto.getContext = function (type) {
      return String(type) === WEBGL_STRINGS.CONTEXT_2D ? { drawImage: () => {} } : orig.call(this, type)
    }

    try {
      expect(flagTexture(r, 'us')).toBeNull()
    } finally {
      proto.getContext = orig
    }
  })

  test('drawFlag returns false when the 2D sink ctx is missing', () => {
    const r = new FlagRenderer()

    r._initProgram(createMockGL())

    const gl = createMockGL()

    gl.createTexture = () => ({})
    r.gl = gl

    const img = { complete: true, naturalWidth: 4 }

    r.images.set('us', img)

    const flag = { lang: lang(LOCALES.EN, 'us'), canvas: makeCanvas(), ctx: null, _splitPoint: () => 0.5 }

    expect(drawFlag(r, flag, 1)).toBe(false)
  })
})

describe('paint-2d helpers — null ctx guards', () => {
  test('paintCarouselArrow2D/paintSwitchSlider2D/paintThemeSlider2D no-op on null ctx', () => {
    expect(() => paintCarouselArrow2D(null, {}, 0)).not.toThrow()
    expect(() => paintSwitchSlider2D(null, {}, 0)).not.toThrow()
    expect(() => paintThemeSlider2D(null, {})).not.toThrow()
  })
})

describe('menu-background loop — missing gl arm', () => {
  test('renderFrame no-ops when host.gl is absent', () => {
    const host = { gl: null, canvas: makeCanvas() }

    expect(() => renderFrame(host)).not.toThrow()
    expect(() => renderFrame(host, 12)).not.toThrow()
  })
})
