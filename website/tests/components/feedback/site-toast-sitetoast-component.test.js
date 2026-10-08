/**
 * @file site-toast-sitetoast-component.test.js
 * @description Split from site-toast.test.js — covers the "SiteToast component" describe.
 */
import { describe, test, expect, jest, beforeEach, afterEach, beforeAll } from '@jest/globals'
import { NOTIFY, NOTIFY_TYPES } from '@core/constants.js'
import { appText } from '@core/locale/ui-text.js'
import { TEST_TEXT } from '@tests/fixtures/test-constants.js'
import { COMPONENT_TAGS } from '@core/tokens/elements/components.js'
import { TOAST_CLASSES } from '@core/tokens/classes/toast.js'
import { CHAR_STRINGS } from '@core/tokens/strings/chars.js'
import { TYPE_STRINGS } from '@core/tokens/strings/types.js'
import { HTML_TAGS } from '@core/tokens/elements/html.js'
import { ARIA_ATTRS } from '@core/tokens/attrs/aria.js'
import { NAV_UI_KEYS } from '@core/tokens/data/ui-keys.js'
import { ATTR_VALUES } from '@core/tokens/attrs/values.js'
import { MOUSE_EVENTS } from '@core/tokens/events/dom.js'

const _flush = () => new Promise((resolve) => setTimeout(resolve, 0))

/** Fresh notify module (fresh _seen/_toastEl/_globalBound state) per call. */
const loadNotify = async () => {
  jest.resetModules()

  return import('@core/utils/notify.js')
}

/** Mounts a toast element, returning it. */
const mountToast = () => {
  const el = document.createElement(COMPONENT_TAGS.SITE_TOAST)

  document.body.appendChild(el)

  return el
}

const items = (el) =>
  Array.from(el.shadowRoot.querySelectorAll(`.${TOAST_CLASSES.SITE_TOAST_ITEM}`))

// ─── Placement contract ─────────────────────────────────────────────────────
// The toast stack is anchored bottom-right on desktop and enters from the
// lower-right. Mobile intentionally spans edge-to-edge — that block is the
// only place `left:` may appear.

describe('SiteToast component', () => {
  beforeAll(async () => {
    await import('@website/components/feedback/SiteToast.js')
  })

  beforeEach(() => {
    document.body.innerHTML = CHAR_STRINGS.EMPTY
  })

  afterEach(() => {
    document.body.innerHTML = CHAR_STRINGS.EMPTY
    jest.restoreAllMocks()
  })

  test('registers the custom element', () => {
    expect(customElements.get(COMPONENT_TAGS.SITE_TOAST)).toBeDefined()
  })

  test('re-eval skips re-defining an already-registered tag', async () => {
    const mod = await loadNotify()

    await mod.notify(TEST_TEXT.BODY, { toastOnly: true, duration: 0 })

    expect(customElements.get(COMPONENT_TAGS.SITE_TOAST)).toBeDefined()
    expect(typeof mod.notify).toBe(TYPE_STRINGS.FUNCTION)
  })

  test('push with no payload or empty text returns null', () => {
    const el = mountToast()

    expect(el.push()).toBeNull()
    expect(el.push({ text: CHAR_STRINGS.EMPTY })).toBeNull()
  })

  test('push while unmounted queues without rendering', () => {
    const el = document.createElement(COMPONENT_TAGS.SITE_TOAST)
    const spy = jest.spyOn(el, 'render')

    expect(el.push({ text: TEST_TEXT.BODY })).toBeGreaterThan(0)
    expect(spy).not.toHaveBeenCalled()

    document.body.appendChild(el)
    expect(items(el)).toHaveLength(1)
  })

  test('renders item with role/aria mapping and dismiss button', () => {
    const el = mountToast()

    el.push({
      text: TEST_TEXT.BODY,
      type: NOTIFY_TYPES.ERROR,
      title: TEST_TEXT.HEADING,
      duration: 0,
    })

    const aside = el.shadowRoot.querySelector(HTML_TAGS.ASIDE)
    const item = items(el)[0]

    expect(aside.getAttribute(ARIA_ATTRS.ARIA_LIVE)).toBe(ARIA_ATTRS.POLITE)
    expect(item.getAttribute(ARIA_ATTRS.ROLE)).toBe(ARIA_ATTRS.ROLE_ALERT)
    expect(item.querySelector(`.${TOAST_CLASSES.SITE_TOAST_TITLE}`).textContent).toBe(
      TEST_TEXT.HEADING
    )
    expect(item.querySelector(`.${TOAST_CLASSES.SITE_TOAST_TEXT}`).textContent).toContain(
      TEST_TEXT.BODY
    )
    expect(
      item.querySelector(`.${TOAST_CLASSES.SITE_TOAST_CLOSE}`).getAttribute(ARIA_ATTRS.ARIA_LABEL)
    ).toBe(appText(NAV_UI_KEYS.CLOSE))
    expect(el.style.display).toBe(ATTR_VALUES.BLOCK)
  })

  test('non-error type maps to role=status and omits title when absent', () => {
    const el = mountToast()

    el.push({ text: TEST_TEXT.HELLO, type: NOTIFY_TYPES.INFO, duration: 0 })

    const item = items(el)[0]

    expect(item.getAttribute(ARIA_ATTRS.ROLE)).toBe(ARIA_ATTRS.ROLE_STATUS)
    expect(item.classList.contains(`${TOAST_CLASSES.SITE_TOAST}--${NOTIFY_TYPES.INFO}`)).toBe(true)
    expect(item.querySelector(`.${TOAST_CLASSES.SITE_TOAST_TITLE}`)).toBeNull()
  })

  test('falsy type falls back to the error modifier', () => {
    const el = mountToast()

    el.push({ text: TEST_TEXT.HELLO, type: CHAR_STRINGS.EMPTY, duration: 0 })

    expect(
      items(el)[0].classList.contains(`${TOAST_CLASSES.SITE_TOAST}--${NOTIFY_TYPES.ERROR}`)
    ).toBe(true)
  })

  test('dismiss button removes its own item', () => {
    const el = mountToast()

    el.push({ text: TEST_TEXT.HELLO, type: NOTIFY_TYPES.INFO, duration: 0 })
    el.push({ text: TEST_TEXT.SECOND, type: NOTIFY_TYPES.INFO, duration: 0 })
    items(el)[0]
      .querySelector(`.${TOAST_CLASSES.SITE_TOAST_CLOSE}`)
      .dispatchEvent(new Event(MOUSE_EVENTS.CLICK, { bubbles: true }))

    const remaining = items(el)

    expect(remaining).toHaveLength(1)
    expect(remaining[0].querySelector(`.${TOAST_CLASSES.SITE_TOAST_TEXT}`).textContent).toContain(
      TEST_TEXT.SECOND
    )
  })

  test('auto-dismiss fires after the duration elapses', () => {
    jest.useFakeTimers()

    try {
      const el = mountToast()

      el.push({ text: TEST_TEXT.HELLO, type: NOTIFY_TYPES.INFO, duration: 10 })
      expect(items(el)).toHaveLength(1)

      jest.advanceTimersByTime(20)
      expect(items(el)).toHaveLength(0)
      expect(el.style.display).toBe(ATTR_VALUES.NONE)
    } finally {
      jest.useRealTimers()
    }
  })

  test('duration ≤0 pins the item (no timer scheduled)', () => {
    const spy = jest.spyOn(globalThis, 'setTimeout')
    const el = mountToast()

    el.push({ text: TEST_TEXT.HELLO, type: NOTIFY_TYPES.INFO, duration: 0 })

    expect(spy).not.toHaveBeenCalled()
    expect(items(el)).toHaveLength(1)
  })

  test('timer handles expose unref() when the runtime supports it', () => {
    const handle = { unref: jest.fn() }
    const timeoutSpy = jest.spyOn(globalThis, 'setTimeout').mockReturnValue(handle)
    const el = mountToast()

    el.push({ text: TEST_TEXT.HELLO, type: NOTIFY_TYPES.INFO, duration: 10 })

    expect(handle.unref).toHaveBeenCalled()
    timeoutSpy.mockRestore()

    el._dismiss(1)
  })

  test('numeric timer handles skip the unref() call', () => {
    const timeoutSpy = jest.spyOn(globalThis, 'setTimeout').mockReturnValue(1)
    const el = mountToast()

    el.push({ text: TEST_TEXT.HELLO, type: NOTIFY_TYPES.INFO, duration: 10 })

    expect(el._items[0].timerId).toBe(1)
    timeoutSpy.mockRestore()

    el._dismiss(1)
  })

  test('_dismiss on an unmounted element skips the re-render', () => {
    const el = document.createElement(COMPONENT_TAGS.SITE_TOAST)
    const spy = jest.spyOn(el, 'render')
    const id = el.push({ text: TEST_TEXT.BODY, duration: 0 })

    el._dismiss(id)

    expect(el._items).toHaveLength(0)
    expect(spy).not.toHaveBeenCalled()
  })

  test('queue evicts the oldest item beyond MAX_VISIBLE', () => {
    const el = mountToast()

    for (let i = 0; i < NOTIFY.MAX_VISIBLE + 2; i++) {
      el.push({ text: `${TEST_TEXT.BODY} ${i}`, type: NOTIFY_TYPES.INFO, duration: 0 })
    }

    const texts = items(el).map(
      (item) => item.querySelector(`.${TOAST_CLASSES.SITE_TOAST_TEXT}`).textContent
    )

    expect(items(el)).toHaveLength(NOTIFY.MAX_VISIBLE)
    expect(texts.every((t) => !t.endsWith(' 0') && !t.endsWith(' 1'))).toBe(true)
  })

  test('_dismiss ignores unknown ids and clears pending timers', () => {
    jest.useFakeTimers()

    try {
      const el = mountToast()
      const id = el.push({ text: TEST_TEXT.HELLO, type: NOTIFY_TYPES.INFO, duration: 1000 })

      el._dismiss(id + 99)
      expect(items(el)).toHaveLength(1)

      el._dismiss(id)
      jest.advanceTimersByTime(2000)
      expect(items(el)).toHaveLength(0)
    } finally {
      jest.useRealTimers()
    }
  })

  test('onDestroy clears all pending timers and empties the queue', () => {
    jest.useFakeTimers()

    try {
      const el = mountToast()
      const clearSpy = jest.spyOn(globalThis, 'clearTimeout')

      el.push({ text: TEST_TEXT.HELLO, type: NOTIFY_TYPES.INFO, duration: 1000 })
      el.push({ text: TEST_TEXT.SECOND, type: NOTIFY_TYPES.INFO, duration: 0 })

      el.onDestroy()

      expect(el._items).toHaveLength(0)
      expect(clearSpy).toHaveBeenCalled()
    } finally {
      jest.useRealTimers()
    }
  })
})
