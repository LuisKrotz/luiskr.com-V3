/**
 * @file i18n-localepath-edge-arms.test.js
 * @description Split from i18n.test.js — covers the "localePath edge arms" describe.
 */
import { LANG_SLUGS, localePath } from '@core/i18n.js'
import { SECTION_IDS } from '@core/tokens/ids/sections.js'

describe('localePath edge arms', () => {
  test('defaults the lang argument and falls back to English slugs', () => {
    const viaDefault = localePath(SECTION_IDS.ABOUT)

    expect(viaDefault).toBe(`/${LANG_SLUGS.en.about}`)

    const viaUnknown = localePath(SECTION_IDS.ABOUT, 'qq')

    expect(viaUnknown).toBe(`/qq/${LANG_SLUGS.en.about}`)
  })
})
