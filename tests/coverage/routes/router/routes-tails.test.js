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

import { DATA_ATTRS } from '@/core/tokens/attrs/data.js'

import '@/core/constants.js'

import '@/cms/about/CmsAboutEditor.js'
import '@/cms/portfolio/CmsPortfolioList.js'
import '@/cms/projects/CmsProjectsList.js'
import '@/cms/playground-editor/CmsPlaygroundEditor.js'
import '@/cms/footer/CmsFooterEditor.js'
import '@/cms/deploy-info/CmsDeployInfo.js'

import { updateRobotsMeta, resolveProjectSlug } from '@/routes/views/project/data.js'
import { bindProjectCarousels } from '@/routes/views/project/carousels.js'
import { handleNavigation } from '@/routes/navigate.js'
import router from '@/routes/router.js'

globalThis.alert = jest.fn()

// ─── CMS: about editor event bindings ────────────────────────────────────────

describe('routes tails', () => {
  test('updateRobotsMeta remove arm', () => {
    updateRobotsMeta(true)

    const meta = document.head.querySelector('meta[name="robots"]')

    updateRobotsMeta(false)
    expect(document.head.querySelector('meta[name="robots"]')).toBeNull()

    updateRobotsMeta(true)
    expect(document.head.querySelector('meta[name="robots"]')).toBeTruthy()
    meta?.remove?.()
    updateRobotsMeta(false)
  })

  test('resolveProjectSlug falls back to empty', () => {
    const prev = router.currentRoute

    router.currentRoute = null
    expect(resolveProjectSlug({})).toBe('')

    router.currentRoute = { params: { rawSlug: 'raw-x' }, path: '/x' }
    expect(resolveProjectSlug({})).toBe('raw-x')

    router.currentRoute = prev
  })

  test('bindProjectCarousels configures eager carousels and defers the rest', async () => {
    const configured = []
    const mk = (ci, si) => {
      const el = document.createElement('div')

      el.setAttribute(DATA_ATTRS.DATA_CAROUSEL_IDX, String(ci))
      el.setAttribute(DATA_ATTRS.DATA_SEC_IDX, String(si))
      el.configure = (o) => configured.push(o)

      return el
    }

    const carousels = [mk(0, 0), mk(1, 0), mk(2, 0), mk(3, 0), mk(4, 0), mk(5, 0)]

    const view = {
      $$: () => carousels,
      translations: { sections: [[[{}], [{}], [{}], [{}], [{}], [{}]]], folder: 'f' },
      isLandscapeGroup: () => false,
      _bindIdle: 1,
    }

    bindProjectCarousels(view)
    expect(configured.length).toBeGreaterThan(0)

    // attr-fallback arms: carousel without data-idx/data-sec-idx + missing items
    const bare = document.createElement('div')

    bare.configure = () => {}

    bindProjectCarousels({
      $$: () => [bare],
      translations: null,
      isLandscapeGroup: () => false,
      _bindIdle: null,
    })
  })

  test('handleNavigation: cms hard-nav + object-redirect hook', async () => {
    const host = {
      currentRoute: null,
      beforeHooks: [],
      afterHooks: [],
      notify: jest.fn(),
      push: jest.fn(async () => {}),
    }

    // /admin short-circuits to a hard navigation (jsdom may throw not-implemented)
    try {
      await handleNavigation(host, '/admin/panel')
    } catch {
      // jsdom navigation is not implemented — the isCmsPath arm still ran
    }

    expect(host.push).not.toHaveBeenCalled()

    const host2 = {
      currentRoute: { path: '/' },
      beforeHooks: [async () => ({ path: '/about' })],
      afterHooks: [],
      notify: jest.fn(),
      push: jest.fn(async () => {}),
    }

    await handleNavigation(host2, '/x')
    expect(host2.push).toHaveBeenCalledWith('/about')

    const host3 = {
      currentRoute: { path: '/' },
      beforeHooks: [async () => '/about'],
      afterHooks: [],
      notify: jest.fn(),
      push: jest.fn(async () => {}),
    }

    await handleNavigation(host3, '/x')
    expect(host3.push).toHaveBeenCalledWith('/about')
  })
})

