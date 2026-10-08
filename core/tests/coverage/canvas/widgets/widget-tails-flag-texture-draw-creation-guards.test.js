/**
 * @file widget-tails-flag-texture-draw-creation-guards.test.js
 * @description Split from widget-tails.test.js — covers the "flag texture/draw — creation guards" describe.
 */
import { describe, test, expect } from '@jest/globals'
import { flagTexture } from '@core/utils/canvas/widgets/flag/texture.js'
import { drawFlag } from '@core/utils/canvas/widgets/flag/draw.js'
import { FlagRenderer } from '@core/utils/canvas/widgets/flag/renderer.js'
import { createMockGL } from '@tests/fixtures/mock-webgl.js'
import { LOCALES } from '@core/constants.js'
import { HTML_TAGS } from '@core/tokens/elements/html.js'
import { TYPE_STRINGS } from '@core/tokens/strings/types.js'
import { WEBGL_STRINGS } from '@core/tokens/strings/webgl.js'

const makeCanvas = () => document.createElement(HTML_TAGS.CANVAS)

const lang = (code, cc, cc2 = null) => ({ code, cc, cc2 })

// GL stub whose program creation fails — drives the `if (!built)` fallback arm.
const _makeProgramFailGL = () =>
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
      set: () => true,
    }
  )

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
        set: () => true,
      }
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
      return String(type) === WEBGL_STRINGS.CONTEXT_2D
        ? { drawImage: () => {} }
        : orig.call(this, type)
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

    const flag = {
      lang: lang(LOCALES.EN, 'us'),
      canvas: makeCanvas(),
      ctx: null,
      _splitPoint: () => 0.5,
    }

    expect(drawFlag(r, flag, 1)).toBe(false)
  })
})
