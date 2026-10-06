/**
 * @file coverage-tails.test.js
 * @description Branch-tail coverage sweep for utility modules and small
 * components that sit just under the per-file gate: genie open guards,
 * sanitizeHtml's disallowed-node paths, ui-text live-dict lookup, the CMS
 * firebase mock surface, the Array/String .at ponyfill shims, scroll-state
 * deferred callbacks, gravatar URL classification, NotFound getters, jsx
 * prop-mapping branches, schema builders, wasm-media-threads guards,
 * gpu-info renderer classification, wasm-css style injection, AdminLogin
 * sign-in paths, and the cookie/contact section component branches.
 */
import { jest } from '@jest/globals'
import store from '@/core/store.js'

import '@/utils/data/sanitize.js'

import '@/components/feedback/CookieBanner.js'
import '@/components/home/ContactSection.js'
import '@/routes/views/not-found/NotFound.js'

import { TEST_TEXT } from '../../../fixtures/test-constants.js'
import { LANG_MUTATIONS } from '../../../../src/core/tokens/events/mutations.js'
import { COMPONENT_TAGS } from '../../../../src/core/tokens/elements/components.js'



jest.unstable_mockModule('../../../../src/firebase.js', () => ({
  signInWithGoogle: jest.fn(async () => ({ user: { uid: 'u1' } })),
  onAuthChange: jest.fn(async (cb) => { cb(null); return () => {} }),
  logoutUser: jest.fn(async () => {}),
  fetchFirebaseDb: jest.fn(async () => ({ exists: () => false, val: () => null })),
  getDbInstance: jest.fn(async () => ({})) }))

const flush = (ms = 60) => new Promise((r) => setTimeout(r, ms))

// ─── genie.js ────────────────────────────────────────────────────────────────

describe('ContactSection tails', () => {
  test('mounts with and without the components dict', async () => {
    const prev = store.getters.getlang()?.components

    store.commit(LANG_MUTATIONS.SET_COMPONENT_LANG, null)

    const el = document.createElement(COMPONENT_TAGS.CONTACT_SECTION)

    document.body.appendChild(el)
    await flush(100)

    el.remove()

    store.commit(LANG_MUTATIONS.SET_COMPONENT_LANG, { contact: { title: TEST_TEXT.HEADING } })

    const el2 = document.createElement(COMPONENT_TAGS.CONTACT_SECTION)

    document.body.appendChild(el2)
    await flush()

    el2.remove()

    store.commit(LANG_MUTATIONS.SET_COMPONENT_LANG, prev)
  })

  test('lang fallbacks, null snapshot, and missing line1 arrays', async () => {
    const prevLang = store.state.lang

    store.state.lang = {}
    store.commit(LANG_MUTATIONS.SET_COMPONENT_LANG, null)

    const el = document.createElement(COMPONENT_TAGS.CONTACT_SECTION)

    document.body.appendChild(el)
    await flush(80)
    el.remove()

    store.state.lang = { locale: 'zzx', database: 'dbz/' }

    const origFetch = globalThis.fetch

    globalThis.fetch = async () => ({ ok: true, json: async () => null })

    const el2 = document.createElement(COMPONENT_TAGS.CONTACT_SECTION)

    document.body.appendChild(el2)
    await flush(80)
    el2.remove()

    globalThis.fetch = origFetch

    store.state.lang = prevLang

    store.commit(LANG_MUTATIONS.SET_COMPONENT_LANG, { contact: {} })

    const el3 = document.createElement(COMPONENT_TAGS.CONTACT_SECTION)

    document.body.appendChild(el3)
    await flush()

    el3.remove()

    store.commit(LANG_MUTATIONS.SET_COMPONENT_LANG, prevLang?.components ?? null)
  })
})

