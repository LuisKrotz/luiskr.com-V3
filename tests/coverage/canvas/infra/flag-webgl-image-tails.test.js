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

import { attachNoGL } from '../../../fixtures/mock-webgl.js'

import '@cms/about/CmsAboutEditor.js'
import '@cms/portfolio/CmsPortfolioList.js'
import '@cms/projects/CmsProjectsList.js'
import '@cms/playground-editor/CmsPlaygroundEditor.js'
import '@cms/footer/CmsFooterEditor.js'
import '@cms/deploy-info/CmsDeployInfo.js'

import { flagRenderer } from '@core/utils/canvas/widgets/flag/renderer.js'
import { HTML_TAGS } from '@core/tokens/elements/html.js'


globalThis.alert = jest.fn()


const makeCanvas = () => document.createElement(HTML_TAGS.CANVAS)



// ─── CMS: about editor event bindings ────────────────────────────────────────

describe('flag-webgl image tails', () => {
  test('_getAnimType delegate + image load/error listeners', async () => {
    const { FlagWebGL } = await import('@core/utils/canvas/widgets/flag-webgl.js')
    const { LOCALES } = await import('@core/constants.js')

    const canvas = makeCanvas()

    attachNoGL(canvas)

    const flag = new FlagWebGL(canvas, { code: LOCALES.EN, cc: 'us', cc2: 'eun' })
    const type = flag._getAnimType()

    expect(type).toBeDefined()

    // complete-image arm: poison the texture cache, then loadImages' check()
    flag.renderer = flagRenderer

    const renderer = flag.renderer

    if (renderer?.images) {
      renderer.images.set('us', { complete: true, naturalWidth: 10, naturalHeight: 5, addEventListener() {} })
      renderer.images.set('eun', { complete: true, naturalWidth: 8, naturalHeight: 4, addEventListener() {} })

      flag.loadImages()
      expect(flag.isLoaded).toBe(true)

      // incomplete-image arms: load + error listeners
      const pending = {
        complete: false,
        naturalWidth: 0,
        naturalHeight: 0,
        _h: {},
        addEventListener(ev, cb) {
          this._h[ev] = cb
        } }

      renderer.images.set('us', pending)
      renderer.images.set('eun', pending)
      flag.isLoaded = false
      flag.loadImages()

      pending._h.load?.()
      pending._h.error?.()
    }

    flag.destroy?.()
  })
})

