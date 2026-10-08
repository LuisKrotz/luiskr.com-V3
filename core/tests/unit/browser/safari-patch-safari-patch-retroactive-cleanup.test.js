/**
 * @file safari-patch-safari-patch-retroactive-cleanup.test.js
 * @description Split from safari-patch.test.js — covers the "safari-patch — retroactive cleanup" describe.
 */
import { describe, test, expect, beforeAll, afterAll, jest } from '@jest/globals'
import '@website/components/carousel/CustomCarousel.js'
import '@website/components/media/MediaFigure.js'
import '@website/components/media/MediaExpanded.js'
import '@website/views/project/Project.js'
import { STATE_CLASSES } from '@core/tokens/classes/state.js'
import { COMPONENT_TAGS } from '@core/tokens/elements/components.js'
import { ATTR_VALUES } from '@core/tokens/attrs/values.js'
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

const _cls = (tag) => customElements.get(tag)

const _tick = () => new Promise((resolve) => setTimeout(resolve, 20))

describe('safari-patch — retroactive cleanup', () => {
  test('figures already in the DOM at module-eval get styles stripped', async () => {
    const mf = document.createElement(COMPONENT_TAGS.MEDIA_FIGURE)

    mf.style.willChange = 'transform'
    mf.style.transform = 'scale(2)'
    mf.style.backfaceVisibility = STATE_STRINGS.HIDDEN

    document.body.appendChild(mf)

    jest.resetModules()

    await import('@core/safari/patch.js')
    await new Promise((resolve) => setTimeout(resolve, 20))

    // Re-import re-instantiates the module so the prototype patches close over the fresh store.
    await import('@core/store.js')

    expect(mf.style.willChange).toBe(ATTR_VALUES.EMPTY)
    expect(mf.style.transform).toBe(ATTR_VALUES.EMPTY)
    expect(mf.style.backfaceVisibility).toBe(ATTR_VALUES.EMPTY)

    mf.remove()
  })
})
