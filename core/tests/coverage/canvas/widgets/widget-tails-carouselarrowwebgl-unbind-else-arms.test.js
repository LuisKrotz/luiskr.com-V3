/**
 * @file widget-tails-carouselarrowwebgl-unbind-else-arms.test.js
 * @description Split from widget-tails.test.js — covers the "CarouselArrowWebGL — unbind else-arms" describe.
 */
import { describe, test, expect } from '@jest/globals'
import { CarouselArrowWebGL } from '@core/utils/canvas/widgets/carousel-controls.js'
import { attachMockGL } from '@tests/fixtures/mock-webgl.js'
import { ARROW_TYPES } from '@core/constants.js'
import { HTML_TAGS } from '@core/tokens/elements/html.js'
import { TYPE_STRINGS } from '@core/tokens/strings/types.js'

const makeCanvas = () => document.createElement(HTML_TAGS.CANVAS)

const _lang = (code, cc, cc2 = null) => ({ code, cc, cc2 })

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
