/**
 * @file docs-tails-onmounted-empty-docs-path.test.js
 * @description Coverage tail for experiments/docs/Docs.tsx — onMounted's
 * `router.currentRoute?.params?.docsPath || EMPTY` fallback arm: mounts in
 * the main suite always carry a docsPath, so the empty-path arm was dark.
 */
import { describe, test, expect } from '@jest/globals'
import router from '@core/router/router.js'
import { mount } from '@tests/fixtures/test-constants.js'
import { CHAR_STRINGS } from '@core/tokens/strings/chars.js'
import { ROUTE_NAMES } from '@core/tokens/routes/names.js'
import { ROUTE_PATHS } from '@core/tokens/routes/paths.js'

describe('Docs onMounted empty docsPath arm', () => {
  test('onMounted resolves EMPTY when the route carries no docsPath param', async () => {
    const prev = router.currentRoute

    router.currentRoute = {
      name: ROUTE_NAMES.DOCS,
      path: ROUTE_PATHS.DOCS,
      meta: { docsRoute: true },
    }

    let cleanup

    try {
      const { ViewDocs } = await import('@docs/Docs.js')

      const view = new ViewDocs()
      cleanup = mount(view)

      view.onMounted()

      expect(view.docsPath).toBe(CHAR_STRINGS.EMPTY)
    } finally {
      cleanup?.()
      router.currentRoute = prev
    }
  })

  test('onMounted resolves EMPTY when currentRoute itself is undefined', async () => {
    const prev = router.currentRoute

    router.currentRoute = undefined

    let cleanup

    try {
      const { ViewDocs } = await import('@docs/Docs.js')

      const view = new ViewDocs()

      view.onMounted()
      cleanup = mount(view)

      expect(view.docsPath).toBe(CHAR_STRINGS.EMPTY)
    } finally {
      cleanup?.()
      router.currentRoute = prev
    }
  })
})
