/**
 * @file safari-patch-safari-patch-viewproject-updatemodaldom-patch.test.js
 * @description Split from safari-patch.test.js — covers the "safari-patch — ViewProject _updateModalDOM patch" describe.
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
import { STATE_STRINGS } from '@core/tokens/strings/state.js'

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
let _activeStore = store

describe('safari-patch — ViewProject _updateModalDOM patch', () => {
  const patched = () => cls(VIEW_TAGS.VIEW_PROJECT).prototype._updateModalDOM

  test('open modal: dialog moved to body, styled fullscreen, media-expanded injected', () => {
    const above = document.createElement(HTML_TAGS.DIALOG)
    const below = { style: {} }
    const ctx = {
      $: (sel) => {
        if (sel.includes(MODAL_CLASSES.MODAL_ABOVE)) return above
        if (sel.includes(MODAL_CLASSES.MODAL_BELOW)) return below
        return null
      },
      shadowRoot: document.createDocumentFragment(),
    }

    store.commit(MODAL_MUTATIONS.SET_MODAL, {
      open: true,
      transform: 42,
      media: { source: 's.mp4', thumb: 't.jpg', alt: 'a', width: 10, height: 10, isVideo: true },
    })

    patched().call(ctx)

    expect(document.body.contains(above)).toBe(true)
    expect(above.style.position).toBe(STATE_STRINGS.FIXED)
    expect(above.open).toBe(true)
    expect(above.querySelector(COMPONENT_TAGS.MEDIA_EXPANDED)).not.toBeNull()
    expect(below.style.transform).toContain('42')

    above.remove()
  })

  test('closed modal: clears transform, closes dialog, reparents to shadow', () => {
    const above = document.createElement(HTML_TAGS.DIALOG)
    above.open = true
    const shadow = document.createDocumentFragment()
    const below = { style: { transform: 'translateY(-9px)' } }
    const ctx = {
      $: (sel) => {
        if (sel.includes(MODAL_CLASSES.MODAL_ABOVE)) return above
        if (sel.includes(MODAL_CLASSES.MODAL_BELOW)) return below
        return null
      },
      shadowRoot: shadow,
    }

    store.commit(MODAL_MUTATIONS.SET_MODAL, { open: false })

    patched().call(ctx)

    expect(below.style.transform).toBe(ATTR_VALUES.EMPTY)
    expect(above.open).toBe(false)
    expect(above.hasAttribute(STATE_STRINGS.OPEN)).toBe(false)
    expect(shadow.contains(above) || above.parentNode === shadow).toBeTruthy()
  })

  test('onDestroy removes orphaned modal dialogs from document.body', async () => {
    const el = document.createElement(VIEW_TAGS.VIEW_PROJECT)
    document.body.appendChild(el)
    await tick()

    const orphan = document.createElement(HTML_TAGS.DIALOG)
    orphan.classList.add(MODAL_CLASSES.MODAL_ABOVE)
    document.body.appendChild(orphan)

    el.remove()
    await tick()

    expect(document.body.contains(orphan)).toBe(false)
  })
})
