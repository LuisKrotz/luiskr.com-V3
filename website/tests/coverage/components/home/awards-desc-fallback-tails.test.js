/**
 * @file awards-desc-fallback-tails.test.js
 * @description Covers the `|| DOCS_STRINGS.DESC_FALLBACK` arm in the awards
 * footer docs entry. componentText resolves via `live ?? FALLBACK`, so an
 * empty-string CMS value is a deliberate (falsy) hit that falls straight
 * through to the literal fallback — no module mock needed.
 */

import { describe, test, expect, afterEach } from '@jest/globals'
import { mount } from '@tests/fixtures/test-constants.js'
import store from '@core/store.js'
import { AwardsMentions } from '@website/components/home/AwardsMentions.js'
import { DOCS_STRINGS } from '@core/tokens/strings/docs.js'
import { FOOTER_CLASSES } from '@core/tokens/classes/footer.js'
import { LANG_MUTATIONS } from '@core/tokens/events/mutations.js'

describe('AwardsMentions — docs entry fallback arm', () => {
  afterEach(() => {
    store.commit(LANG_MUTATIONS.SET_COMPONENT_LANG, null)
  })

  test('description falls back to the literal when the CMS ships an empty string', () => {
    store.commit(LANG_MUTATIONS.SET_COMPONENT_LANG, {
      [DOCS_STRINGS.CMS_COMPONENT]: { description: '' },
    })

    const el = new AwardsMentions()
    const cleanup = mount(el)

    const desc = el.shadowRoot.querySelector(`.${FOOTER_CLASSES.FOOTER_DOCS_DESC}`)

    expect(desc.textContent).toBe(DOCS_STRINGS.DESC_FALLBACK)

    cleanup()
  })
})
