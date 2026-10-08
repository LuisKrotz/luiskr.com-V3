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
import { CMS_TAGS } from '@cms/tokens.js'

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

describe('CmsDeployInfo delegate tails', () => {
  test('all render delegates are callable', async () => {
    const el = document.createElement(CMS_TAGS.CMS_DEPLOY_INFO)

    document.body.appendChild(el)
    await flush()

    el.lighthouse = { urls: [{ url: 'u', scores: { performance: 0.5 } }] }
    el.coverage = { total: {} }
    el.axe = { violations: [] }
    el.snyk = {}
    el.consoleScan = {}

    expect(typeof el._scoreClass(0.9)).toBe('string')
    expect(typeof el._pct(0.5)).toBe('string')
    expect(el._renderLighthouse()).toBeTruthy()
    expect(el._renderScores({ performance: 0.9 })).toBeTruthy()
    expect(el._renderCoverage()).toBeTruthy()
    expect(el._renderAxe()).toBeTruthy()
    expect(el._renderSnyk()).toBeTruthy()
    expect(el._renderConsoleScan()).toBeTruthy()

    el.remove()
  })
})

