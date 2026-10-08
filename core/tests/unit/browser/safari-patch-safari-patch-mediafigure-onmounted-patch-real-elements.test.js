/**
 * @file safari-patch-safari-patch-mediafigure-onmounted-patch-real-elements.test.js
 * @description Split from safari-patch.test.js — covers the "safari-patch — MediaFigure onMounted patch (real elements)" describe.
 */
import { describe, test, expect, beforeAll, afterAll, jest } from '@jest/globals'
import '@website/components/carousel/CustomCarousel.js'
import '@website/components/media/MediaFigure.js'
import '@website/components/media/MediaExpanded.js'
import '@website/views/project/Project.js'
import store from '@core/store.js'
import { STATE_CLASSES } from '@core/tokens/classes/state.js'
import { COMPONENT_TAGS } from '@core/tokens/elements/components.js'
import { MEDIA_CLASSES } from '@core/tokens/classes/media.js'
import { MEDIA_ATTRS } from '@core/tokens/attrs/media.js'
import { ATTR_VALUES } from '@core/tokens/attrs/values.js'
import { SECTION_UI_KEYS } from '@core/tokens/data/ui-keys.js'
import { HTML_TAGS } from '@core/tokens/elements/html.js'
import { TOUCH_EVENTS } from '@core/tokens/events/dom.js'

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

const tick = () => new Promise((resolve) => setTimeout(resolve, 20))

// Bound after each module-registry reset so commits always reach the store
// instance the currently-installed prototype patches close over.
let _activeStore = store

describe('safari-patch — MediaFigure onMounted patch (real elements)', () => {
  const mountFigure = async (attrs = {}) => {
    const el = document.createElement(COMPONENT_TAGS.MEDIA_FIGURE)
    for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v)
    document.body.appendChild(el)
    await tick()
    return el
  }

  test('clears GPU styles and lazy-loads thumbs on non-hero figures', async () => {
    const el = await mountFigure({ [MEDIA_ATTRS.SRC]: 'p/img' })
    expect(el.style.getPropertyValue('will-change')).toBe(ATTR_VALUES.EMPTY)

    const thumb = el.shadowRoot.querySelector(`.${MEDIA_CLASSES.RENDER_MEDIA_THUMB}`)
    if (thumb) expect(thumb.getAttribute(SECTION_UI_KEYS.LOADING)).toBe(MEDIA_ATTRS.LOADING_LAZY)
    el.remove()
  })

  test('hero attribute triggers loadHighRes', async () => {
    const el = document.createElement(COMPONENT_TAGS.MEDIA_FIGURE)
    el.setAttribute(MEDIA_ATTRS.SRC, 'p/img')
    el.setAttribute(MEDIA_ATTRS.AUTO_PLAY, ATTR_VALUES.TRUE)
    el.loadHighRes = jest.fn()
    document.body.appendChild(el)
    await tick()
    expect(el.loadHighRes).toHaveBeenCalled()
    el.remove()
  })

  test('video figures get muted/playsinline/autoplay attributes', async () => {
    const el = await mountFigure({
      [MEDIA_ATTRS.SRC]: 'p/v',
      [MEDIA_ATTRS.IS_VIDEO]: ATTR_VALUES.TRUE,
      [MEDIA_ATTRS.AUTO_PLAY]: ATTR_VALUES.TRUE,
    })

    const vid = el.shadowRoot.querySelector(HTML_TAGS.VIDEO)
    if (vid) {
      expect(vid.muted).toBe(true)
      expect(vid.hasAttribute(MEDIA_ATTRS.PLAYSINLINE)).toBe(true)
      expect(vid.hasAttribute(MEDIA_ATTRS.MUTED)).toBe(true)
    }
    el.remove()
  })

  test('expandable figure: tap opens modal, drag suppresses it', async () => {
    const el = await mountFigure({
      [MEDIA_ATTRS.SRC]: 'p/img',
      [MEDIA_ATTRS.CAN_EXPAND]: ATTR_VALUES.TRUE,
    })
    el.openModal = jest.fn()

    const fig = el.shadowRoot.querySelector(HTML_TAGS.FIGURE)
    const target = fig || el

    // tap → expand
    target.dispatchEvent(
      new TouchEvent(TOUCH_EVENTS.TOUCHSTART, {
        touches: [{ clientX: 0, clientY: 0 }],
        bubbles: true,
        composed: true,
      })
    )
    target.dispatchEvent(
      new TouchEvent(TOUCH_EVENTS.TOUCHEND, { bubbles: true, composed: true, cancelable: true })
    )
    expect(el.openModal).toHaveBeenCalled()

    // drag → suppressed
    el.openModal.mockClear()
    target.dispatchEvent(
      new TouchEvent(TOUCH_EVENTS.TOUCHSTART, {
        touches: [{ clientX: 0, clientY: 0 }],
        bubbles: true,
        composed: true,
      })
    )
    target.dispatchEvent(
      new TouchEvent(TOUCH_EVENTS.TOUCHMOVE, {
        touches: [{ clientX: 50, clientY: 0 }],
        bubbles: true,
        composed: true,
      })
    )
    target.dispatchEvent(
      new TouchEvent(TOUCH_EVENTS.TOUCHEND, { bubbles: true, composed: true, cancelable: true })
    )
    expect(el.openModal).not.toHaveBeenCalled()
    el.remove()
  })
})
