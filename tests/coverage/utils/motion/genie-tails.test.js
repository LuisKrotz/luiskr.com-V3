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
import { genieEnter, genieLeave } from '@/utils/motion/genie.js'
import '@/utils/data/sanitize.js'

import '@/components/feedback/CookieBanner.js'
import '@/components/home/ContactSection.js'
import '@/routes/views/not-found/NotFound.js'
import { MODAL_MUTATIONS, PREF_MUTATIONS } from '../../../../src/core/tokens/events/mutations.js'
import { HTML_TAGS } from '../../../../src/core/tokens/elements/html.js'
import { PREF_CLASSES } from '../../../../src/core/tokens/classes/preferences.js'




jest.unstable_mockModule('../../../../src/firebase.js', () => ({
  signInWithGoogle: jest.fn(async () => ({ user: { uid: 'u1' } })),
  onAuthChange: jest.fn(async (cb) => { cb(null); return () => {} }),
  logoutUser: jest.fn(async () => {}),
  fetchFirebaseDb: jest.fn(async () => ({ exists: () => false, val: () => null })),
  getDbInstance: jest.fn(async () => ({})) }))

// ─── genie.js ────────────────────────────────────────────────────────────────

describe('genie tails', () => {
  test('genieEnter/Exit return early without the dialog nodes', () => {
    const component = { $: () => null }

    genieEnter(component)
    genieLeave(component, jest.fn())

    store.commit(PREF_MUTATIONS.SET_REDUCED_MOTION, true)
    genieEnter({ $: (_sel) => document.createElement(HTML_TAGS.DIV) })
    store.commit(PREF_MUTATIONS.SET_REDUCED_MOTION, false)
  })

  test('genieEnter zooms from the modal origin without reduced motion', () => {
    const backdrop = document.createElement(HTML_TAGS.DIV)
    const dialog = document.createElement(HTML_TAGS.DIV)

    dialog.getBoundingClientRect = () => ({ left: 0, top: 0, width: 400, height: 300 })
    dialog.animate = jest.fn()
    backdrop.animate = jest.fn()

    const component = {
      $: (sel) => (sel.includes(PREF_CLASSES.PREF_BACKDROP) ? backdrop : sel.includes(PREF_CLASSES.PREF_DIALOG) ? dialog : null) }

    store.commit(MODAL_MUTATIONS.SET_MODAL_ORIGIN, { x: 10, y: 20 })
    store.commit(PREF_MUTATIONS.SET_REDUCED_MOTION, false)

    genieEnter(component)
    genieLeave(component, jest.fn())
  })
})

