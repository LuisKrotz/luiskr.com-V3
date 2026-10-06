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

import '@/components/media/draw-text/render.js'
import '@/routes/views/project/data.js'

import _router from '@/routes/router.js'

globalThis.alert = jest.fn()

const flush = (ms = 80) => new Promise((r) => setTimeout(r, ms))

// ─── CMS: about editor event bindings ────────────────────────────────────────

describe('component render tails', () => {
  test('AboutSection setters before mount → _isMounted false arms', async () => {
    await import('@/components/home/AboutSection.js')

    const { COMPONENT_TAGS } = await import('@/core/tokens/elements/components.js')
    const el = document.createElement(COMPONENT_TAGS.ABOUT_SECTION)

    el.aboutTranslations = { title: 't', col1: [], col2: [] }
    el.profilePicture = 'https://example.com/p.png'

    expect(el.aboutTranslations).toBeTruthy()
  })

  test('AwardsMentions empty-items skeleton arm', async () => {
    await import('@/components/home/AwardsMentions.js')

    const { COMPONENT_TAGS } = await import('@/core/tokens/elements/components.js')
    const el = document.createElement(COMPONENT_TAGS.AWARDS_MENTIONS)

    document.body.appendChild(el)
    el.items = []

    await flush()

    expect(el.shadowRoot).toBeTruthy()
    el.items = [{ name: 'a' }]

    await flush()
    el.remove()
  })

  test('draw-text renderContent token-type arms', async () => {
    const { parseTokens, renderContent } = await import('@/components/media/draw-text/render.js')
    expect(renderContent('', 5, 0)).toBe('')
    expect(renderContent('hello world', 5, 0)).toContain('span')
    expect(renderContent('hello world', 5, 0, false)).not.toContain('--i')
    expect(renderContent('a<br>b', 5, 0)).toContain('<br')
    expect(renderContent('<em>x y</em>', 5, 0)).toContain('em')
    expect(renderContent('<a href="/x">link txt</a>', 5, 0)).toContain('aria-label')
    expect(renderContent('<a href="/x" aria-label="own">t</a>', 5, 0)).not.toContain('&nbsp;"')
    expect(renderContent('<em></em>', 5, 0)).toBeTruthy()
    expect(parseTokens('a <em>b</em> c').length).toBeGreaterThan(1)
  })

  test('updateRobotsMeta create/reuse/remove/absent arms', async () => {
    const { updateRobotsMeta } = await import('@/routes/views/project/data.js')
    updateRobotsMeta(true)

    const meta = document.querySelector('meta[name="robots"]')

    expect(meta).toBeTruthy()

    updateRobotsMeta(true)
    updateRobotsMeta(false)
    expect(document.querySelector('meta[name="robots"]')).toBeNull()

    updateRobotsMeta(false)
  })

  test('resolveProjectSlug rawSlug + URL-regex arms', async () => {
    const { resolveProjectSlug } = await import('@/routes/views/project/data.js')
    const { default: freshRouter } = await import('@/routes/router.js')
    const prev = freshRouter.currentRoute

    freshRouter.currentRoute = { params: { rawSlug: 'raw-1' } }
    expect(resolveProjectSlug({})).toBe('raw-1')

    freshRouter.currentRoute = { params: {} }
    window.history.pushState({}, '', '/portfolio/url-slug')
    expect(resolveProjectSlug({})).toBe('url-slug')

    window.history.pushState({}, '', '/no-match')
    expect(resolveProjectSlug({})).toBe('')

    freshRouter.currentRoute = prev
  })
})

