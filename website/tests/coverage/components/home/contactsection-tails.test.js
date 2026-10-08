/**
 * @file contactsection-tails.test.js
 * @description Split from coverage-tails-4.test.js — covers the "ContactSection tails" describe.
 */
import store from '@core/store.js'

import '@website/components/feedback/CookieBanner.js'
import '@website/components/home/ContactSection.js'
import '@website/views/not-found/NotFound.js'
import { LANG_MUTATIONS } from '@core/tokens/events/mutations.js'
import { COMPONENT_TAGS } from '@core/tokens/elements/components.js'

const flush = (ms = 80) => new Promise((r) => setTimeout(r, ms))

describe('ContactSection tails', () => {
  test('mounts with and without component translations', async () => {
    store.commit(LANG_MUTATIONS.SET_COMPONENT_LANG, null)

    const el = document.createElement(COMPONENT_TAGS.CONTACT_SECTION)

    document.body.appendChild(el)
    await flush(120)

    el.onStoreUpdate?.()

    el.remove()
  })
})
