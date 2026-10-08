/**
 * @file safari-patch-safari-patch-mediaexpanded-fake-contexts.test.js
 * @description Split from safari-patch.test.js — covers the "safari-patch — MediaExpanded fake contexts" describe.
 */
import { describe, test, beforeAll, afterAll, jest } from '@jest/globals'
import '@website/components/carousel/CustomCarousel.js'
import '@website/components/media/MediaFigure.js'
import '@website/components/media/MediaExpanded.js'
import '@website/views/project/Project.js'
import store from '@core/store.js'
import { STATE_CLASSES } from '@core/tokens/classes/state.js'
import { COMPONENT_TAGS } from '@core/tokens/elements/components.js'

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

describe('safari-patch — MediaExpanded fake contexts', () => {
  const expandedCtx = (overrides = {}) => ({
    isVideo: false,
    source: 's.jpg',
    $: () => null,
    $$: () => [],
    closest: () => null,
    addScopedListener: jest.fn(),
    startClose: jest.fn(),
    subscribe: jest.fn(),
    ...overrides,
  })

  test('image path with no rendered media element', () => {
    const ctx = expandedCtx({ isVideo: false, source: 's.jpg' })

    cls(COMPONENT_TAGS.MEDIA_EXPANDED).prototype.onMounted.call(ctx)
  })

  test('video path with no rendered video element', () => {
    const ctx = expandedCtx({ isVideo: true, source: 'v.mp4' })

    cls(COMPONENT_TAGS.MEDIA_EXPANDED).prototype.onMounted.call(ctx)
  })

  test('image path skips when no source', () => {
    const ctx = expandedCtx({ isVideo: false, source: '' })

    cls(COMPONENT_TAGS.MEDIA_EXPANDED).prototype.onMounted.call(ctx)
  })
})
