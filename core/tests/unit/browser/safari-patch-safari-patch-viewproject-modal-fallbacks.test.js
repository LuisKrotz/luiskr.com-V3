/**
 * @file safari-patch-safari-patch-viewproject-modal-fallbacks.test.js
 * @description Split from safari-patch.test.js — covers the "safari-patch — ViewProject modal fallbacks" describe.
 */
import { describe, test, expect, beforeAll, afterAll } from '@jest/globals'
import '@website/components/carousel/CustomCarousel.js'
import '@website/components/media/MediaFigure.js'
import '@website/components/media/MediaExpanded.js'
import '@website/views/project/Project.js'
import store from '@core/store.js'
import { STATE_CLASSES } from '@core/tokens/classes/state.js'
import { COMPONENT_TAGS } from '@core/tokens/elements/components.js'
import { ATTR_VALUES } from '@core/tokens/attrs/values.js'
import { HTML_TAGS } from '@core/tokens/elements/html.js'
import { VIEW_TAGS } from '@core/tokens/elements/views.js'
import { MODAL_CLASSES } from '@core/tokens/classes/modal.js'
import { MODAL_MUTATIONS } from '@core/tokens/events/mutations.js'

// The patch registers whenDefined() callbacks at module-eval — the component
// imports above ensure the tags already resolve when it installs.
beforeAll(async () => {
  await import('@core/safari/patch.js')
  await new Promise((resolve) => setTimeout(resolve, 20))
})

afterAll(() => {
  document.documentElement.classList.remove(STATE_CLASSES.IS_SAFARI)
})

const cls = (tag) => customElements.get(tag)

const tick = () => new Promise((resolve) => setTimeout(resolve, 20))

// Bound after each module-registry reset so commits always reach the store
// instance the currently-installed prototype patches close over.
let activeStore = store

describe('safari-patch — ViewProject modal fallbacks', () => {
  const patched = () => cls(VIEW_TAGS.VIEW_PROJECT).prototype._updateModalDOM

  test('above resolved via document.querySelector when $ misses', async () => {
    const above = document.createElement(HTML_TAGS.DIV)

    above.classList.add(MODAL_CLASSES.MODAL_ABOVE)
    document.body.appendChild(above)

    const ctx = { $: () => null, shadowRoot: null }

    activeStore.commit(MODAL_MUTATIONS.SET_MODAL, {
      open: true,
      media: { source: 's.jpg', isVideo: false },
    })

    patched().call(ctx)

    activeStore.commit(MODAL_MUTATIONS.SET_MODAL, { open: false })

    patched().call(ctx)

    above.remove()
  })

  test('open modal with no transform uses 0 and existing expanded is reused', async () => {
    const above = document.createElement(HTML_TAGS.DIALOG)
    const below = { style: {} }
    const ctx = {
      $: (sel) =>
        sel.includes(MODAL_CLASSES.MODAL_ABOVE)
          ? above
          : sel.includes(MODAL_CLASSES.MODAL_BELOW)
            ? below
            : null,
      shadowRoot: document.createDocumentFragment(),
    }

    activeStore.commit(MODAL_MUTATIONS.SET_MODAL, {
      open: true,
      media: { source: 's.jpg', isVideo: false },
    })

    patched().call(ctx)

    expect(below.style.transform).toContain('0')
    expect(above.querySelector(COMPONENT_TAGS.MEDIA_EXPANDED)).not.toBeNull()

    // second call — same media → existing expanded element is kept
    patched().call(ctx)
    expect(above.querySelector(COMPONENT_TAGS.MEDIA_EXPANDED)).not.toBeNull()

    // third call — different source → element replaced
    activeStore.commit(MODAL_MUTATIONS.SET_MODAL, {
      open: true,
      media: { source: 'other.jpg', isVideo: false },
    })
    patched().call(ctx)

    activeStore.commit(MODAL_MUTATIONS.SET_MODAL, { open: false })
    above.remove()
  })

  test('open modal with missing media uses empty fallbacks', async () => {
    const above = document.createElement(HTML_TAGS.DIALOG)
    const ctx = {
      $: (sel) => (sel.includes(MODAL_CLASSES.MODAL_ABOVE) ? above : null),
      shadowRoot: document.createDocumentFragment(),
    }

    activeStore.commit(MODAL_MUTATIONS.SET_MODAL, { open: true, transform: 5 })
    patched().call(ctx)

    expect(above.querySelector(COMPONENT_TAGS.MEDIA_EXPANDED)).not.toBeNull()

    activeStore.commit(MODAL_MUTATIONS.SET_MODAL, { open: false })
    above.remove()
  })

  test('close path tolerates a non-dialog element without close()', async () => {
    const above = document.createElement(HTML_TAGS.DIV)

    above.open = false

    const ctx = {
      $: (sel) => (sel.includes(MODAL_CLASSES.MODAL_ABOVE) ? above : null),
      shadowRoot: document.createDocumentFragment(),
    }

    activeStore.commit(MODAL_MUTATIONS.SET_MODAL, { open: false })
    patched().call(ctx)

    expect(above.style.display).toBe(ATTR_VALUES.NONE)
  })

  test('close path swallows a throwing close()', async () => {
    const above = document.createElement(HTML_TAGS.DIV)

    above.open = true
    above.close = () => {
      throw new Error('polyfill-bug')
    }

    const ctx = {
      $: (sel) => (sel.includes(MODAL_CLASSES.MODAL_ABOVE) ? above : null),
      shadowRoot: document.createDocumentFragment(),
    }

    activeStore.commit(MODAL_MUTATIONS.SET_MODAL, { open: false })
    patched().call(ctx)

    expect(above.open).toBe(false)
  })

  test('modal paths tolerate a missing above element entirely', async () => {
    const ctx = { $: () => null, shadowRoot: null }

    activeStore.commit(MODAL_MUTATIONS.SET_MODAL, {
      open: true,
      media: { source: 's.jpg', isVideo: false },
    })
    patched().call(ctx)

    activeStore.commit(MODAL_MUTATIONS.SET_MODAL, { open: false })
    patched().call(ctx)
  })

  test('onDestroy without an orphan is a no-op', async () => {
    const el = document.createElement(VIEW_TAGS.VIEW_PROJECT)
    document.body.appendChild(el)
    await tick()

    el.remove()
    await tick()
  })
})
