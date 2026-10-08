/**
 * @file site-toast-notify-service.test.js
 * @description Split from site-toast.test.js — covers the "notify service" describe.
 */
import { describe, test, expect, jest, beforeEach, afterEach } from '@jest/globals'
import { NOTIFY, NOTIFY_TYPES } from '@core/constants.js'
import { appText } from '@core/locale/ui-text.js'
import { TEST_TEXT } from '@tests/fixtures/test-constants.js'
import { COMPONENT_TAGS } from '@core/tokens/elements/components.js'
import { TOAST_CLASSES } from '@core/tokens/classes/toast.js'
import { CHAR_STRINGS } from '@core/tokens/strings/chars.js'
import { NOTIFY_UI_KEYS, SECTION_UI_KEYS } from '@core/tokens/data/ui-keys.js'
import { WINDOW_EVENTS } from '@core/tokens/events/dom.js'
import { STATE_STRINGS } from '@core/tokens/strings/state.js'

const flush = () => new Promise((resolve) => setTimeout(resolve, 0))

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

const _items = (el) =>
  Array.from(el.shadowRoot.querySelectorAll(`.${TOAST_CLASSES.SITE_TOAST_ITEM}`))

// ─── Placement contract ─────────────────────────────────────────────────────
// The toast stack is anchored bottom-right on desktop and enters from the
// lower-right. Mobile intentionally spans edge-to-edge — that block is the
// only place `left:` may appear.

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
    jest.unstable_mockModule('@core/locale/ui-text.js', () => ({
      appText: () => CHAR_STRINGS.EMPTY,
      componentText: () => CHAR_STRINGS.EMPTY,
      routeSlugs: () => ({}),
    }))

    try {
      const Mock = stubNotification(STATE_STRINGS.GRANTED)
      const { notify } = await import('@core/utils/notify.js')

      expect(await notify(TEST_TEXT.BODY)).toBe('native')
      expect(Mock).toHaveBeenCalledWith(
        CHAR_STRINGS.EMPTY,
        expect.objectContaining({ body: TEST_TEXT.BODY })
      )

      const { SiteToast } = await import('@website/components/feedback/SiteToast.js')
      const out = SiteToast.prototype.render.call({
        _items: [
          { id: 1, text: TEST_TEXT.BODY, type: NOTIFY_TYPES.ERROR, title: CHAR_STRINGS.EMPTY },
        ],
        style: {},
      })

      expect(out).toBeTruthy()
    } finally {
      jest.unstable_unmockModule('@core/locale/ui-text.js')
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
