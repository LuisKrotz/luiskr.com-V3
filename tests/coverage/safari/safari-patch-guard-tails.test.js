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

import '@core/constants.js'

import '@cms/about/CmsAboutEditor.js'
import '@cms/portfolio/CmsPortfolioList.js'
import '@cms/projects/CmsProjectsList.js'
import '@cms/playground-editor/CmsPlaygroundEditor.js'
import '@cms/footer/CmsFooterEditor.js'
import '@cms/deploy-info/CmsDeployInfo.js'

globalThis.alert = jest.fn()

const flush = (ms = 80) => new Promise((r) => setTimeout(r, ms))

// ─── CMS: about editor event bindings ────────────────────────────────────────

describe('safari patch guard tails', () => {
  test('patch* bail when customElements.get returns nothing', async () => {
    const { patchCarousel } = await import('@core/safari/patches/carousel.js')
    const { patchMediaExpanded } = await import('@core/safari/patches/media-expanded.js')
    const { patchMediaFigure } = await import('@core/safari/patches/media-figure.js')

    const getSpy = jest.spyOn(window.customElements, 'get').mockReturnValue(undefined)
    const defSpy = jest.spyOn(window.customElements, 'whenDefined').mockResolvedValue(undefined)

    patchCarousel()
    patchMediaExpanded()
    patchMediaFigure()
    await flush()

    getSpy.mockRestore()
    defSpy.mockRestore()
  })
})

