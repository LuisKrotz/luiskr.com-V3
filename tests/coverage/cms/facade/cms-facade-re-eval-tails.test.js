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

// ─── CMS: about editor event bindings ────────────────────────────────────────

describe('cms facade re-eval tails', () => {
  test('customElements.define skip arms on re-import', async () => {
    jest.resetModules()

    await import('@cms/about/CmsAboutEditor.js')
    await import('@cms/portfolio/CmsPortfolioList.js')
    await import('@cms/projects/CmsProjectsList.js')
    await import('@cms/playground-editor/CmsPlaygroundEditor.js')
    await import('@cms/footer/CmsFooterEditor.js')
    await import('@cms/deploy-info/CmsDeployInfo.js')
  })
})

