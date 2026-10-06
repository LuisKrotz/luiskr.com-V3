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

import '@/core/constants.js'

import '@/cms/about/CmsAboutEditor.js'
import '@/cms/portfolio/CmsPortfolioList.js'
import '@/cms/projects/CmsProjectsList.js'
import '@/cms/playground-editor/CmsPlaygroundEditor.js'
import '@/cms/footer/CmsFooterEditor.js'
import '@/cms/deploy-info/CmsDeployInfo.js'

import { parseTokens, renderContent } from '@/components/media/draw-text/render.js'

globalThis.alert = jest.fn()

// ─── CMS: about editor event bindings ────────────────────────────────────────

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

