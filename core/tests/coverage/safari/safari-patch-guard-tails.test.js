/**
 * @file safari-patch-guard-tails.test.js
 * @description Split from coverage-tails-7.test.js — covers the "safari patch guard tails" describe.
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
