/**
 * @file widget-tails-paint-2d-helpers-null-ctx-guards.test.js
 * @description Split from widget-tails.test.js — covers the "paint-2d helpers — null ctx guards" describe.
 */
import { describe, test, expect } from '@jest/globals'
import { paintCarouselArrow2D } from '@core/utils/canvas/widgets/carousel-controls/paint-2d.js'
import { paintSwitchSlider2D } from '@core/utils/canvas/widgets/switch-slider/paint-2d.js'
import { paintThemeSlider2D } from '@core/utils/canvas/widgets/theme-slider/paint-2d.js'
import { HTML_TAGS } from '@core/tokens/elements/html.js'
import { TYPE_STRINGS } from '@core/tokens/strings/types.js'

const _makeCanvas = () => document.createElement(HTML_TAGS.CANVAS)

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

describe('paint-2d helpers — null ctx guards', () => {
  test('paintCarouselArrow2D/paintSwitchSlider2D/paintThemeSlider2D no-op on null ctx', () => {
    expect(() => paintCarouselArrow2D(null, {}, 0)).not.toThrow()
    expect(() => paintSwitchSlider2D(null, {}, 0)).not.toThrow()
    expect(() => paintThemeSlider2D(null, {})).not.toThrow()
  })
})
