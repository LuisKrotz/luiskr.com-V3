/**
 * @file mosaic-projecthref-tails.test.js
 * @description Coverage tails for components/home/mosaic/interactions.ts —
 * projectHref's non-English locale prefix arm (every existing exercise runs
 * under the default `en` locale, so the `/<loc>` prefix branch was dark).
 */
import { describe, test, expect, afterEach } from '@jest/globals'
import { projectHref } from '@website/components/home/mosaic/interactions.js'
import store from '@core/store.js'
import { LANG_MUTATIONS } from '@core/tokens/events/mutations.js'
import { LOCALES, ROUTE_PATHS } from '@core/constants.js'
import { TEST_PROJECTS } from '@tests/fixtures/test-constants.js'

describe('projectHref locale prefix tails', () => {
  afterEach(() => {
    store.commit(LANG_MUTATIONS.SET_LANG, LOCALES.EN)
  })

  test('prefixes the portfolio URL with the active locale', () => {
    store.commit(LANG_MUTATIONS.SET_LANG, LOCALES.BR)

    expect(projectHref({ link: TEST_PROJECTS.SLUG_MINIMELISSA })).toBe(
      `${ROUTE_PATHS.ROOT}${LOCALES.BR}${ROUTE_PATHS.PORTFOLIO}${TEST_PROJECTS.SLUG_MINIMELISSA}`
    )
  })
})
