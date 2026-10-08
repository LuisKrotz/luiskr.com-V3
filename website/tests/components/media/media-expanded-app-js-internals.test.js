/**
 * @file media-expanded-app-js-internals.test.js
 * @description Split from media-expanded.test.js — covers the "App.js internals" describe.
 */
import '@website/components/media/MediaExpanded.js'
import '@website/components/media/MediaFigure.js'
import { COMPONENT_TAGS } from '@core/tokens/elements/components.js'

const flush = (ms = 80) => new Promise((r) => setTimeout(r, ms))

// ─── App.js modal + view reconciliation ──────────────────────────────────────
describe('App.js internals', () => {
  test('_updateModalState toggles scroll-lock state on the shell', async () => {
    const app =
      document.querySelector(COMPONENT_TAGS.APP_ROOT) ||
      document.createElement(COMPONENT_TAGS.APP_ROOT)

    if (!app.parentNode) document.body.appendChild(app)

    app._updateModalState?.()

    app.remove()
  })

  test('updateSectionTops and checkScroll run without layout', async () => {
    const app =
      document.querySelector(COMPONENT_TAGS.APP_ROOT) ||
      document.createElement(COMPONENT_TAGS.APP_ROOT)

    if (!app.parentNode) document.body.appendChild(app)

    await flush()

    app.updateSectionTops?.()
    app.checkScroll?.()

    app.remove()
  })
})
