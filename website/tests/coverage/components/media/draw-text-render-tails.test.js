/**
 * @file draw-text-render-tails.test.js
 * @description Split from coverage-tails-7.test.js — covers the "draw-text render tails" describe.
 */
import { jest } from '@jest/globals'

import '@core/constants.js'

import '@cms/about/CmsAboutEditor.js'
import '@cms/portfolio/CmsPortfolioList.js'
import '@cms/projects/CmsProjectsList.js'
import '@cms/playground-editor/CmsPlaygroundEditor.js'
import '@cms/footer/CmsFooterEditor.js'
import '@cms/deploy-info/CmsDeployInfo.js'

import { parseTokens, renderContent } from '@website/components/media/draw-text/render.js'

globalThis.alert = jest.fn()

describe('draw-text render tails', () => {
  test('renderContent empty + plain-word + capped-delay arms', () => {
    expect(renderContent('', 0, 0)).toBe('')
    expect(renderContent('a b', 10, 0, false)).not.toContain('--i:')
    expect(renderContent('a', 9000, 0)).toBeTruthy()
    expect(renderContent('x<br>y', 10, 5)).toBeTruthy()
    expect(renderContent('<b class="z">bold</b> tail', 10, 0)).toBeTruthy()
  })

  test('parseTokens tag/attr/empty-inner arms', () => {
    const toks = parseTokens('<i></i> a <br> b')

    expect(toks.length).toBeGreaterThan(1)
  })
})
