/**
 * @file site-toast.test.js
 * @description <site-toast> component + notify.js service coverage:
 * push/dismiss lifecycle, queue eviction, timer handling, ARIA roles,
 * native Notification preference, service-worker fallback channel,
 * toast fallback, dedupe window, and global error-handler binding.
 */

import { describe, test, expect, jest, beforeEach, afterEach, beforeAll } from '@jest/globals'
import { NOTIFY, NOTIFY_TYPES } from '@/core/constants.js'
import { appText } from '@/core/locale/ui-text.js'
import { TEST_TEXT } from '../../fixtures/test-constants.js'
import { COMPONENT_TAGS } from '../../../src/core/tokens/elements/components.js'
import { TOAST_CLASSES } from '../../../src/core/tokens/classes/toast.js'
import { CHAR_STRINGS } from '../../../src/core/tokens/strings/chars.js'
import { TYPE_STRINGS } from '../../../src/core/tokens/strings/types.js'
import { HTML_TAGS } from '../../../src/core/tokens/elements/html.js'
import { ARIA_ATTRS } from '../../../src/core/tokens/attrs/aria.js'
import {
  NAV_UI_KEYS,
  NOTIFY_UI_KEYS,
  SECTION_UI_KEYS,
} from '../../../src/core/tokens/data/ui-keys.js'
import { ATTR_VALUES } from '../../../src/core/tokens/attrs/values.js'
import { MOUSE_EVENTS, WINDOW_EVENTS } from '../../../src/core/tokens/events/dom.js'
import { STATE_STRINGS } from '../../../src/core/tokens/strings/state.js'

const flush = () => new Promise((resolve) => setTimeout(resolve, 0))

/** Fresh notify module (fresh _seen/_toastEl/_globalBound state) per call. */
const loadNotify = async () => {
  jest.resetModules()

  return import('@/utils/notify.js')
}

/** Mounts a toast element, returning it. */
const mountToast = () => {
  const el = document.createElement(COMPONENT_TAGS.SITE_TOAST)

  document.body.appendChild(el)

  return el
}

const items = (el) =>
  Array.from(el.shadowRoot.querySelectorAll(`.${TOAST_CLASSES.SITE_TOAST_ITEM}`))

describe('SiteToast component', () => {
  beforeAll(async () => {
    await import('@/components/feedback/SiteToast.js')
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

describe('notify service', () => {
  const realNotification = globalThis.Notification
  const realDocument = globalThis.document
  const realWindow = globalThis.window

  const stubNotification = (permission, impl) => {
    const Mock = jest.fn(function MockNotification(title, opts) {
      this.title = title
      this.opts = opts
    })

    Object.defineProperty(Mock, 'permission', { value: permission, configurable: true })

    if (impl) Object.assign(Mock, impl)

    globalThis.Notification = Mock

    return Mock
  }

  beforeEach(() => {
    document.body.innerHTML = CHAR_STRINGS.EMPTY
  })

  afterEach(() => {
    globalThis.Notification = realNotification
    globalThis.document = realDocument
    globalThis.window = realWindow
    delete navigator.serviceWorker
    document.body.innerHTML = CHAR_STRINGS.EMPTY
    jest.restoreAllMocks()
  })

  test('empty message is a no-op', async () => {
    const { notify } = await loadNotify()

    expect(await notify(CHAR_STRINGS.EMPTY)).toBe(false)
  })

  test('falls back to the toast when Notification is unavailable', async () => {
    delete globalThis.Notification
    const { notify } = await loadNotify()

    expect(await notify(TEST_TEXT.BODY, { toastOnly: true })).toBe('toast')
    expect(document.querySelector(COMPONENT_TAGS.SITE_TOAST)).not.toBeNull()
  })

  test('adopts an existing toast element instead of duplicating it', async () => {
    mountToast()
    const { notify } = await loadNotify()

    await notify(TEST_TEXT.BODY, { toastOnly: true })

    expect(document.querySelectorAll(COMPONENT_TAGS.SITE_TOAST)).toHaveLength(1)
  })

  test('returns false when the toast element cannot host items', async () => {
    const el = mountToast()

    Object.defineProperty(el, 'push', { value: null, configurable: true })

    const { notify } = await loadNotify()

    expect(await notify(TEST_TEXT.BODY, { toastOnly: true })).toBe(false)
  })

  test('returns false when no document can host the toast', async () => {
    const { notify } = await loadNotify()

    delete globalThis.document
    expect(await notify(TEST_TEXT.BODY, { toastOnly: true })).toBe(false)
  })

  test('uses the native channel when permission is granted', async () => {
    const Mock = stubNotification(STATE_STRINGS.GRANTED)
    const { notify } = await loadNotify()

    expect(await notify(TEST_TEXT.BODY, { title: TEST_TEXT.HEADING })).toBe('native')
    expect(Mock).toHaveBeenCalledWith(
      TEST_TEXT.HEADING,
      expect.objectContaining({ body: TEST_TEXT.BODY })
    )
  })

  test('falls back to the site title for the native title', async () => {
    const Mock = stubNotification(STATE_STRINGS.GRANTED)
    const { notify } = await loadNotify()

    await notify(TEST_TEXT.BODY)

    expect(Mock).toHaveBeenCalledWith(appText(SECTION_UI_KEYS.TITLE), expect.anything())
  })

  test('requests permission when undecided and honors the grant', async () => {
    const Mock = stubNotification(STATE_STRINGS.DEFAULT, {
      requestPermission: jest.fn().mockResolvedValue(STATE_STRINGS.GRANTED),
    })
    const { notify } = await loadNotify()

    expect(await notify(TEST_TEXT.BODY)).toBe('native')
    expect(Mock.requestPermission).toHaveBeenCalled()
  })

  test('denied request drops to the toast', async () => {
    stubNotification(STATE_STRINGS.DEFAULT, {
      requestPermission: jest.fn().mockResolvedValue(STATE_STRINGS.DENIED),
    })
    const { notify } = await loadNotify()

    expect(await notify(TEST_TEXT.BODY)).toBe('toast')
  })

  test('rejected requestPermission resolves to current permission', async () => {
    stubNotification(STATE_STRINGS.DEFAULT, {
      requestPermission: jest.fn().mockRejectedValue(new Error(TEST_TEXT.STALE)),
    })
    const { notify } = await loadNotify()

    expect(await notify(TEST_TEXT.BODY)).toBe('toast')
  })

  test('pre-denied permission skips request and toasts', async () => {
    const requestPermission = jest.fn()

    stubNotification(STATE_STRINGS.DENIED, { requestPermission })

    const { notify } = await loadNotify()

    expect(await notify(TEST_TEXT.BODY)).toBe('toast')
    expect(requestPermission).not.toHaveBeenCalled()
  })

  test('Notification constructor throw falls back through the service worker', async () => {
    const showNotification = jest.fn().mockResolvedValue(undefined)
    const Mock = jest.fn(() => {
      throw new Error(TEST_TEXT.STALE)
    })

    Object.defineProperty(Mock, 'permission', { value: STATE_STRINGS.GRANTED, configurable: true })
    globalThis.Notification = Mock
    Object.defineProperty(navigator, 'serviceWorker', {
      value: { ready: Promise.resolve({ showNotification }) },
      configurable: true,
    })

    const { notify } = await loadNotify()

    expect(await notify(TEST_TEXT.BODY)).toBe('native')
    expect(showNotification).toHaveBeenCalled()
  })

  test('SW registration without showNotification drops to the toast', async () => {
    const Mock = jest.fn(() => {
      throw new Error(TEST_TEXT.STALE)
    })

    Object.defineProperty(Mock, 'permission', { value: STATE_STRINGS.GRANTED, configurable: true })
    globalThis.Notification = Mock
    Object.defineProperty(navigator, 'serviceWorker', {
      value: { ready: Promise.resolve({}) },
      configurable: true,
    })

    const { notify } = await loadNotify()

    expect(await notify(TEST_TEXT.BODY)).toBe('toast')
  })

  test('SW channel failure drops to the toast', async () => {
    const Mock = jest.fn(() => {
      throw new Error(TEST_TEXT.STALE)
    })

    Object.defineProperty(Mock, 'permission', { value: STATE_STRINGS.GRANTED, configurable: true })
    globalThis.Notification = Mock
    Object.defineProperty(navigator, 'serviceWorker', {
      value: { ready: Promise.reject(new Error(TEST_TEXT.STALE)) },
      configurable: true,
    })

    const { notify } = await loadNotify()

    expect(await notify(TEST_TEXT.BODY)).toBe('toast')
  })

  test('toastOnly skips the native path entirely', async () => {
    const Mock = stubNotification(STATE_STRINGS.GRANTED)
    const { notify } = await loadNotify()

    expect(await notify(TEST_TEXT.BODY, { toastOnly: true })).toBe('toast')
    expect(Mock).not.toHaveBeenCalled()
  })

  test('identical type+message dedupes within the window', async () => {
    const { notify } = await loadNotify()

    expect(await notify(TEST_TEXT.BODY, { toastOnly: true })).toBe('toast')
    expect(await notify(TEST_TEXT.BODY, { toastOnly: true })).toBe(false)
    expect(await notify(TEST_TEXT.SECOND, { toastOnly: true })).toBe('toast')
  })

  test('dedupe registry prunes beyond the cache cap', async () => {
    const { notify } = await loadNotify()

    for (let i = 0; i <= NOTIFY.DEDUPE_CACHE_MAX; i++) {
      await notify(`${TEST_TEXT.STALE}-${i}`, { toastOnly: true, duration: 0 })
    }

    const el = document.querySelector(COMPONENT_TAGS.SITE_TOAST)

    expect(el).not.toBeNull()
    expect(el._items.length).toBeLessThanOrEqual(NOTIFY.MAX_VISIBLE)
  })

  test('notifyError surfaces the localized generic string', async () => {
    const { notifyError } = await loadNotify()

    expect(await notifyError({ toastOnly: true })).toBe('toast')

    const text = document
      .querySelector(COMPONENT_TAGS.SITE_TOAST)
      .shadowRoot.querySelector(`.${TOAST_CLASSES.SITE_TOAST_TEXT}`)

    expect(text.textContent).toContain(appText(NOTIFY_UI_KEYS.NOTIFY_ERROR))
  })

  test('notifyLoadFailed surfaces the localized load string', async () => {
    const { notifyLoadFailed } = await loadNotify()

    expect(await notifyLoadFailed({ toastOnly: true })).toBe('toast')

    const fresh = await loadNotify()

    expect(await fresh.notifyLoadFailed()).toBe('toast')

    const text = document
      .querySelector(COMPONENT_TAGS.SITE_TOAST)
      .shadowRoot.querySelector(`.${TOAST_CLASSES.SITE_TOAST_TEXT}`)

    expect(text.textContent).toContain(appText(NOTIFY_UI_KEYS.NOTIFY_LOAD_FAILED))
  })

  test('missing translations degrade to empty strings without crashing', async () => {
    jest.resetModules()
    jest.unstable_mockModule('@/core/locale/ui-text.js', () => ({
      appText: () => CHAR_STRINGS.EMPTY,
      componentText: () => CHAR_STRINGS.EMPTY,
      routeSlugs: () => ({}),
    }))

    try {
      const Mock = stubNotification(STATE_STRINGS.GRANTED)
      const { notify } = await import('@/utils/notify.js')

      expect(await notify(TEST_TEXT.BODY)).toBe('native')
      expect(Mock).toHaveBeenCalledWith(
        CHAR_STRINGS.EMPTY,
        expect.objectContaining({ body: TEST_TEXT.BODY })
      )

      const { SiteToast } = await import('@/components/feedback/SiteToast.js')
      const out = SiteToast.prototype.render.call({
        _items: [
          { id: 1, text: TEST_TEXT.BODY, type: NOTIFY_TYPES.ERROR, title: CHAR_STRINGS.EMPTY },
        ],
        style: {},
      })

      expect(out).toBeTruthy()
    } finally {
      jest.unstable_unmockModule('@/core/locale/ui-text.js')
      jest.resetModules()
    }
  })

  test('initGlobalErrorHandlers binds once and toasts on failures', async () => {
    const { initGlobalErrorHandlers } = await loadNotify()

    expect(initGlobalErrorHandlers()).toBe(true)
    expect(initGlobalErrorHandlers()).toBe(false)

    window.dispatchEvent(new Event(WINDOW_EVENTS.ERROR))
    await flush()

    const text = document
      .querySelector(COMPONENT_TAGS.SITE_TOAST)
      .shadowRoot.querySelector(`.${TOAST_CLASSES.SITE_TOAST_TEXT}`)

    expect(text.textContent).toContain(appText(NOTIFY_UI_KEYS.NOTIFY_ERROR))
  })

  test('initGlobalErrorHandlers is a no-op without a window', async () => {
    const { initGlobalErrorHandlers } = await loadNotify()

    delete globalThis.window
    expect(initGlobalErrorHandlers()).toBe(false)
  })
})
