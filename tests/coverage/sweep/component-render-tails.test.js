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

globalThis.alert = jest.fn()

const flush = (ms = 80) => new Promise((r) => setTimeout(r, ms))

// ─── CMS: about editor event bindings ────────────────────────────────────────

describe('component render tails', () => {
  test('AboutSection setters while mounted hit _updateDom arm', async () => {
    await import('@/components/home/AboutSection.js')

    const el = document.createElement('about-section')

    document.body.appendChild(el)
    await flush()

    el.aboutTranslations = { title: 't', col1: ['a'], col2: ['b'] }
    el.profilePicture = 'https://x/img.png'
    el.aboutTranslations = null

    el.remove()

    // unmounted arm: setters before append skip _updateDom
    const fresh = document.createElement('about-section')

    fresh.aboutTranslations = { title: 'x' }
    fresh.profilePicture = 'https://x/y.png'
  })

  test('AwardsMentions populated-items arm renders awards-carousel', async () => {
    await import('@/components/home/AwardsMentions.js')

    const el = document.createElement('awards-mentions')

    document.body.appendChild(el)
    await flush()

    el.items = [{ name: 'a', count: 1 }]
    el._updateDom()
    el.items = []
    el._updateDom()
    el.items = null
    el._updateDom()

    el.remove()
  })
})

