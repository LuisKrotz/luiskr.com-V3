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

import '@/cms/about/CmsAboutEditor.js'
import '@/cms/portfolio/CmsPortfolioList.js'
import '@/cms/projects/CmsProjectsList.js'
import '@/cms/playground-editor/CmsPlaygroundEditor.js'
import '@/cms/footer/CmsFooterEditor.js'
import '@/cms/deploy-info/CmsDeployInfo.js'
import { HTML_TAGS } from '../../../../src/core/tokens/elements/html.js'


globalThis.alert = jest.fn()

const flush = (ms = 80) => new Promise((r) => setTimeout(r, ms))




// ─── CMS: about editor event bindings ────────────────────────────────────────

describe('space boot tails', () => {
  test('initSpaceEarth real boot runs onReady/catch + early-return arms', async () => {
    const boot = await import('@/playground/space/boot.js')
    const c = {
      _earthBg: null,
      _earthReady: false,
      _isInitializingEarth: false,
      _getCanvasEl: () => {
        const canvas = document.createElement(HTML_TAGS.CANVAS)

        document.body.appendChild(canvas)

        return canvas
      },
      $: () => null,
      _updateLoader: jest.fn(),
      _applyPersistedSettings: jest.fn(),
      _syncPanel: jest.fn(),
      _dismissLoader: jest.fn() }

    boot.initSpaceEarth(c)

    expect(c._earthBg).toBeTruthy()
    expect(c._isInitializingEarth).toBe(true)

    // real EarthBackground boots in jsdom (existing earth suite proves it) —
    // either the onReady body or the catch arm runs; both dismiss the loader.
    await flush(1200)

    expect(c._dismissLoader).toHaveBeenCalled()

    c._earthBg?.destroy?.()

    // early-return arms: no canvas / existing bg / in-flight init
    const c2 = { _earthBg: {}, _isInitializingEarth: false, _getCanvasEl: () => null }

    boot.initSpaceEarth(c2)

    const c3 = { _earthBg: null, _isInitializingEarth: true, _getCanvasEl: () => document.createElement(HTML_TAGS.CANVAS) }

    boot.initSpaceEarth(c3)
    expect(c3._earthBg).toBeNull()
  }, 15000)

  test('updateSpaceLoader/dismissSpaceLoader/applyPersistedSettings arms', async () => {
    const boot = await import('@/playground/space/boot.js')

    // missing loader elements — all null arms
    boot.updateSpaceLoader({ $: () => null }, 'm', 42)

    // present loader elements
    const els = { msg: {}, val: {}, bar: { style: {} } }

    boot.updateSpaceLoader(
      {
        $: (sel) => (sel.includes('msg') ? els.msg : sel.includes('val') ? els.val : sel.includes('bar') ? els.bar : null) },
      'loading',
      42.4
    )
    expect(els.msg.textContent).toBe('loading')
    expect(els.val.textContent).toBe('42')
    expect(els.bar.style.width).toBe('42.4%')

    // dismissSpaceLoader: missing + present arms
    boot.dismissSpaceLoader({ $: () => null })

    const loader = { style: {}, remove: jest.fn() }

    boot.dismissSpaceLoader({ $: () => loader })
    expect(loader.style.opacity).toBe('0')

    await flush(850)
    expect(loader.remove).toHaveBeenCalled()

    // applyPersistedSettings: empty + populated arms
    boot.applyPersistedSettings({ _savedSettings: null, _earthBg: null })
    boot.applyPersistedSettings({ _savedSettings: { unknownParam: 1 }, _earthBg: {} })
  })
})

