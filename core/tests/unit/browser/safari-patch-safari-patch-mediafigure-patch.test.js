/**
 * @file safari-patch-safari-patch-mediafigure-patch.test.js
 * @description Split from safari-patch.test.js — covers the "safari-patch — MediaFigure patch" describe.
 */
import { describe, test, expect, beforeAll, afterAll, jest } from '@jest/globals'
import '@website/components/carousel/CustomCarousel.js'
import '@website/components/media/MediaFigure.js'
import '@website/components/media/MediaExpanded.js'
import '@website/views/project/Project.js'
import store from '@core/store.js'
import { STATE_CLASSES } from '@core/tokens/classes/state.js'
import { COMPONENT_TAGS } from '@core/tokens/elements/components.js'
import { TYPE_STRINGS } from '@core/tokens/strings/types.js'
import { MEDIA_CLASSES } from '@core/tokens/classes/media.js'

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

const _tick = () => new Promise((resolve) => setTimeout(resolve, 20))

// Bound after each module-registry reset so commits always reach the store
// instance the currently-installed prototype patches close over.
let _activeStore = store

describe('safari-patch — MediaFigure patch', () => {
  const proto = () => cls(COMPONENT_TAGS.MEDIA_FIGURE).prototype

  test('loadHighRes early-returns for video or loaded figures', () => {
    const ctx = { isVideo: true, isLoaded: false, $: () => null }
    proto().loadHighRes.call(ctx)
    expect(ctx.highResSrc).toBeUndefined()

    const ctx2 = { isVideo: false, isLoaded: true, $: () => null }
    proto().loadHighRes.call(ctx2)
    expect(ctx2.highResSrc).toBeUndefined()
  })

  test('loadHighRes bails on >4096px media', () => {
    const ctx = { isVideo: false, isLoaded: false, mediaHeight: 5000, mediaWidth: 0, $: () => null }
    proto().loadHighRes.call(ctx)
    expect(ctx.highResSrc).toBeUndefined()
  })

  test('loadHighRes builds the Q50 storage URL and marks loaded when element exists', () => {
    const highEl = { complete: true, naturalWidth: 800, classList: { add: jest.fn() }, style: {} }
    const ctx = {
      isVideo: false,
      isLoaded: false,
      mediaHeight: 100,
      mediaWidth: 100,
      mediaSrc: 'p/img',
      $: (sel) => (sel.includes(MEDIA_CLASSES.RENDER_MEDIA_HIGH) ? highEl : { style: {} }),
      _isMounted: true,
    }

    proto().loadHighRes.call(ctx)

    expect(ctx.highResSrc).toContain('p/img')
    expect(ctx.isLoaded).toBe(true)
    expect(highEl.classList.add).toHaveBeenCalledWith(MEDIA_CLASSES.RENDER_MEDIA_LOADED)
  })

  test('loadHighRes marks loaded via onerror when the image fails', () => {
    const highEl = { complete: false, naturalWidth: 0, classList: { add: jest.fn() }, style: {} }
    const ctx = {
      isVideo: false,
      isLoaded: false,
      mediaHeight: 100,
      mediaWidth: 100,
      mediaSrc: 'p/img',
      $: () => highEl,
      _isMounted: true,
    }

    proto().loadHighRes.call(ctx)
    expect(typeof highEl.onload).toBe(TYPE_STRINGS.FUNCTION)
    expect(typeof highEl.onerror).toBe(TYPE_STRINGS.FUNCTION)

    highEl.onerror()
    expect(ctx.isLoaded).toBe(true)
  })

  test('loadHighRes falls back to _updateDom when no high-res element exists', () => {
    const ctx = {
      isVideo: false,
      isLoaded: false,
      mediaHeight: 0,
      mediaWidth: 0,
      mediaSrc: 'p/img',
      $: () => null,
      _isMounted: true,
      _updateDom: jest.fn(),
    }

    proto().loadHighRes.call(ctx)
    expect(ctx.isLoaded).toBe(true)
    expect(ctx._updateDom).toHaveBeenCalled()
  })
})
