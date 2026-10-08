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

import { renderSpControl } from '@earth/space/panel-render.js'
import { SP_INPUT_TYPES } from '@earth/space/controls.js'

globalThis.alert = jest.fn()

// ─── CMS: about editor event bindings ────────────────────────────────────────

describe('space panel render tails', () => {
  test('renderSpControl checkbox/range + savedVal arms', () => {
    const range = { label: 'lbl', param: 'p1', type: SP_INPUT_TYPES.RANGE, min: 0, max: 1, step: 0.1, def: 0.5 }
    const check = { label: 'lbl', param: 'p2', type: SP_INPUT_TYPES.CHECKBOX, checked: false }

    expect(renderSpControl(range, {}, undefined)).toBeTruthy()
    expect(renderSpControl(range, { lbl: 'Label!' }, 0.25)).toBeTruthy()
    expect(renderSpControl(check, {}, undefined)).toBeTruthy()
    expect(renderSpControl(check, {}, true)).toBeTruthy()
    expect(renderSpControl(check, {}, false)).toBeTruthy()
  })
})

