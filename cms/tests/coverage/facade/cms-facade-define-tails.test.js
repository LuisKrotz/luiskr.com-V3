/**
 * @file cms-facade-define-tails.test.js
 * @description Split from coverage-tails-7.test.js — covers the "cms facade define tails" describe.
 */
import { jest } from '@jest/globals'
import { CMS_TAGS } from '@cms/tokens.js'

import '@core/constants.js'

import '@cms/about/CmsAboutEditor.js'
import '@cms/portfolio/CmsPortfolioList.js'
import '@cms/projects/CmsProjectsList.js'
import '@cms/playground-editor/CmsPlaygroundEditor.js'
import '@cms/footer/CmsFooterEditor.js'
import '@cms/deploy-info/CmsDeployInfo.js'

globalThis.alert = jest.fn()

describe('cms facade define tails', () => {
  test('customElements.define runs when registry reports empty', async () => {
    const getSpy = jest.spyOn(customElements, 'get').mockReturnValue(undefined)
    const defined = []
    const origDefine = customElements.define.bind(customElements)
    const defineSpy = jest.spyOn(customElements, 'define').mockImplementation((name, ctor) => {
      defined.push(name)

      try {
        origDefine(name, ctor)
      } catch {
        // duplicate registration — the spy still recorded the call
      }
    })

    jest.resetModules()
    await import('@cms/about/CmsAboutEditor.js')
    await import('@cms/portfolio/CmsPortfolioList.js')
    await import('@cms/projects/CmsProjectsList.js')
    await import('@cms/playground-editor/CmsPlaygroundEditor.js')
    await import('@cms/footer/CmsFooterEditor.js')
    await import('@cms/deploy-info/CmsDeployInfo.js')

    getSpy.mockRestore()
    defineSpy.mockRestore()

    expect(defined).toEqual(
      expect.arrayContaining([
        CMS_TAGS.CMS_ABOUT_EDITOR,
        CMS_TAGS.CMS_PORTFOLIO_LIST,
      ])
    )
  })
})
