/**
 * @file space-panel-render-tails.test.js
 * @description Split from coverage-tails-7.test.js — covers the "space panel render tails" describe.
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

describe('space panel render tails', () => {
  test('renderSpControl checkbox/range + savedVal arms', () => {
    const range = {
      label: 'lbl',
      param: 'p1',
      type: SP_INPUT_TYPES.RANGE,
      min: 0,
      max: 1,
      step: 0.1,
      def: 0.5,
    }
    const check = { label: 'lbl', param: 'p2', type: SP_INPUT_TYPES.CHECKBOX, checked: false }

    expect(renderSpControl(range, {}, undefined)).toBeTruthy()
    expect(renderSpControl(range, { lbl: 'Label!' }, 0.25)).toBeTruthy()
    expect(renderSpControl(check, {}, undefined)).toBeTruthy()
    expect(renderSpControl(check, {}, true)).toBeTruthy()
    expect(renderSpControl(check, {}, false)).toBeTruthy()
  })
})
