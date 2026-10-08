/**
 * @file cms-facade-re-eval-tails.test.js
 * @description Split from coverage-tails-7.test.js — covers the "cms facade re-eval tails" describe.
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
