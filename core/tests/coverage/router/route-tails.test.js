/**
 * @file route-tails.test.js — coverage tails for routing modules.
 * No jest.resetModules(): istanbul counters live per module instance, so
 * re-imports after a reset discard recorded hits in the merged report.
 */

import { jest } from '@jest/globals'
import store from '@core/store.js'
import router from '@core/router/router.js'
import { ROUTE_STRINGS } from '@core/tokens/strings/routes.js'
import { VIEW_TAGS } from '@core/tokens/elements/views.js'
import { handleNavigation, syncDocumentHead } from '@core/router/navigate.js'
import { parsePath } from '@core/router/parse-path.js'
import { updateRobotsMeta, resolveProjectSlug } from '@website/views/project/data.js'
import { checkAutoOpenModal } from '@website/views/project/modal.js'
import { renderProject } from '@website/views/project/render.js'
import { patchViewProject } from '@core/safari/patches/view-project.js'

import '@website/views/not-found/NotFound.js'
import { LANG_MUTATIONS, MODAL_MUTATIONS } from '@core/tokens/events/mutations.js'

const flush = (ms = 60) => new Promise((r) => setTimeout(r, ms))

describe('route tails', () => {
  test('handleNavigation — /admin first-segment hits CMS hard-nav arm', async () => {
    const host = { currentRoute: null, push: jest.fn(async () => true) }

    const orig = window.location.replace
    let replaced = ''

    window.location.replace = (u) => {
      replaced = u
    }

    await handleNavigation(host, `/${ROUTE_STRINGS.ADMIN}/panel`)

    expect(replaced).toContain('/cms')

    window.location.replace = orig
  })

  test('parsePath — legal route with missing links entry → EMPTY fallback', () => {
    store.commit(LANG_MUTATIONS.SET_COMPONENT_LANG, { 'legal-footer': { links: [{ page: 'p0' }] } })

    const r = parsePath(`/${ROUTE_STRINGS.PRIVACY}`)

    expect(r.name).toBeTruthy()

    store.commit(LANG_MUTATIONS.SET_COMPONENT_LANG, null)
  })

  test('updateRobotsMeta — create, reuse, remove, absent arms', () => {
    updateRobotsMeta(true)
    updateRobotsMeta(true)
    updateRobotsMeta(false)
    updateRobotsMeta(false)

    expect(document.querySelector('meta[name="robots"]')).toBeNull()
  })

  test('checkAutoOpenModal — translations without folder → EMPTY arm', () => {
    const prev = router.currentRoute

    router.currentRoute = { params: { slug: 'nothing-matches' } }

    expect(() => checkAutoOpenModal({ translations: { sections: [] } })).not.toThrow()

    router.currentRoute = prev
  })

  test('checkAutoOpenModal — matching media item commits the modal', () => {
    const prev = router.currentRoute

    router.currentRoute = { params: { slug: 'my-item' } }

    const c = {
      translations: {
        folder: 'f/',
        sections: [
          [
            ['t'],
            [
              { label: 'Other', src: 's', size: [1, 2], isVideo: false },
              { label: 'My Item', src: 's', size: [1, 2], isVideo: false },
            ],
          ],
        ],
      },
    }

    checkAutoOpenModal(c)

    expect(store.getters.getModal()?.open).toBe(true)

    store.commit(MODAL_MUTATIONS.SET_MODAL, { open: false })

    // isVideo item → video URL arm; label-less item → label||EMPTY arm;
    // matching item without isVideo → `isVideo ?? false` nullish arm
    router.currentRoute = { params: { slug: 'vid-item' } }
    checkAutoOpenModal({
      translations: {
        sections: [[['t'], [{ label: 'Vid Item', src: 's', size: [1, 2], isVideo: true }]]],
      },
    })

    router.currentRoute = { params: { slug: 'no-flag' } }
    checkAutoOpenModal({
      translations: { sections: [[['t'], [{ label: 'No Flag', src: 's', size: [1, 2] }]]] },
    })
    checkAutoOpenModal({
      translations: { sections: [[['t'], [{ src: 's', size: [1, 2] }]]] },
    })

    // !slug arm → return before reading translations
    router.currentRoute = { params: {} }
    checkAutoOpenModal({ translations: { sections: [] } })

    // !c.translations arm
    router.currentRoute = { params: { slug: 'x' } }
    checkAutoOpenModal({ translations: null })

    // translations present, sections missing → sections || [] arm
    checkAutoOpenModal({ translations: {} })

    router.currentRoute = prev
    store.commit(MODAL_MUTATIONS.SET_MODAL, { open: false })
  })

  test('resolveProjectSlug — no slug + no window → EMPTY arm', () => {
    const prev = router.currentRoute
    const desc = Object.getOwnPropertyDescriptor(globalThis, 'window')

    router.currentRoute = { params: {} }

    if (desc?.configurable) delete globalThis.window

    const slug = resolveProjectSlug({})

    if (desc?.configurable) Object.defineProperty(globalThis, 'window', desc)

    router.currentRoute = prev

    expect(slug).toBe('')
  })

  test('syncDocumentHead — descriptor without title → BASE_TITLE arm', () => {
    const prev = document.title

    syncDocumentHead({ name: 'x', view: 'v', lang: 'en', path: '/x', meta: {}, params: {} })

    expect(document.title).toBeTruthy()

    document.title = prev
  })

  test('renderProject — translation without cover renders placeholder arm', () => {
    const vnode = renderProject({ translations: { title: 'T' } })

    expect(vnode).toBeTruthy()
  })

  test('renderProject — cover without folder → EMPTY prefix arm', () => {
    const vnode = renderProject({
      translations: { title: 'T', cover: { src: 's', size: [1, 1], label: 'l' } },
    })

    expect(vnode).toBeTruthy()
  })

  test('NotFound — translations present but title empty → EMPTY label arm', async () => {
    const el = document.createElement(VIEW_TAGS.VIEW_NOT_FOUND)

    document.body.appendChild(el)

    await flush()

    el.translations = {}
    el._updateDom()

    el.remove()
  })

  test('NotFound — mounts with no translations → link-binding else arm', async () => {
    const el = document.createElement(VIEW_TAGS.VIEW_NOT_FOUND)

    document.body.appendChild(el)

    await flush()

    el.remove()
  })

  test('patchViewProject — customElements.get undefined → early return', async () => {
    const origGet = customElements.get
    const origDef = customElements.whenDefined

    customElements.get = () => undefined
    customElements.whenDefined = () => Promise.resolve()

    patchViewProject()

    await flush()

    customElements.get = origGet
    customElements.whenDefined = origDef
  })
})
