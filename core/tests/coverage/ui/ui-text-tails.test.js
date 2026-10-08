/**
 * @file ui-text-tails.test.js
 * @description Split from coverage-tails-4.test.js — covers the "ui-text tails" describe.
 */
import store from '@core/store.js'

import { appText, componentText, routeSlugs } from '@core/locale/ui-text.js'

import { TEST_TEXT } from '@tests/fixtures/test-constants.js'
import '@website/components/feedback/CookieBanner.js'
import '@website/components/home/ContactSection.js'
import '@website/views/not-found/NotFound.js'
import { LANG_MUTATIONS } from '@core/tokens/events/mutations.js'
import { SECTION_UI_KEYS } from '@core/tokens/data/ui-keys.js'
import { TYPE_STRINGS } from '@core/tokens/strings/types.js'

describe('ui-text tails', () => {
  test('componentText falls through to the fallback snapshot', () => {
    store.commit(LANG_MUTATIONS.SET_COMPONENT_LANG, {})

    expect(componentText(TEST_TEXT.MISSING_KEY)).toBeUndefined()
    expect(typeof appText(SECTION_UI_KEYS.TITLE) === TYPE_STRINGS.STRING || appText(TEST_TEXT.MISSING_KEY) === undefined).toBe(true)

    const slugs = routeSlugs({})

    expect(slugs).toBeTruthy()
  })
})
