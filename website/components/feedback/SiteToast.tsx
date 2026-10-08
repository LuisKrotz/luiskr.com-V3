/**
 * @file SiteToast.js
 * @description <site-toast> — the in-page notification surface. notify()
 * prefers native Notification when permission allows; this element is the
 * guaranteed fallback (API unavailable, permission denied, or platform
 * restrictions such as Android's service-worker-only notifications).
 *
 * Design: dark-glass pill stack matching the stats-HUD / cookie-banner
 * chrome language — bottom-right column on desktop, full-width bottom bar on
 * mobile (thumb-reach dismiss), safe-area aware, reduced-motion safe.
 *
 * Accessibility: the container is a live region; error items render
 * role="alert" (assertive), everything else role="status" (polite). Every
 * item carries an always-reachable dismiss button so assertive toasts can
 * never trap screen-reader output.
 */

import { ARIA_ATTRS } from '@core/tokens/attrs/aria.js'
import { FORM_ATTRS } from '@core/tokens/attrs/form.js'
import { ATTR_VALUES } from '@core/tokens/attrs/values.js'
import { TOAST_CLASSES } from '@core/tokens/classes/toast.js'
import { NOTIFY_TYPES } from '@core/tokens/data/notify.js'
import { NAV_UI_KEYS } from '@core/tokens/data/ui-keys.js'
import { COMPONENT_TAGS } from '@core/tokens/elements/components.js'
import { NOTIFY } from '@core/tokens/motion/notify.js'
import { CHAR_STRINGS } from '@core/tokens/strings/chars.js'
import { TYPE_STRINGS } from '@core/tokens/strings/types.js'
import { h } from '@core/jsx.js'
import { BaseComponent } from '@core/Component.js'
import { appText } from '@core/locale/ui-text.js'
import toastStyles from '@core/sass/components/feedback/site-toast.scss?inline'

interface ToastItem {
  id: number
  text: string
  type: string
  title: string
  duration: number
  timerId: ReturnType<typeof setTimeout> | null
}

/**
 * The SiteToast — toast class.
 */
export class SiteToast extends BaseComponent {
  private _items: ToastItem[] = []
  private _seq = 0

  constructor() {
    super(toastStyles)
  }

  /**
   * Queues a toast item and starts its auto-dismiss clock.
   * @param item.text - body copy (already localized by the caller)
   * @param item.type - NOTIFY_TYPES entry; styles the BEM modifier
   * @param item.title - optional eyebrow heading
   * @param item.duration - ms until auto-dismiss; ≤0 pins it
   * @returns the item id (null when text was empty)
   */
  push({
    text,
    type = NOTIFY_TYPES.ERROR,
    title = CHAR_STRINGS.EMPTY,
    duration = NOTIFY.TOAST_DURATION,
  }: Partial<ToastItem> = {}): number | null {
    if (!text) return null

    const id = ++this._seq
    const item: ToastItem = {
      id,
      text,
      type: type || NOTIFY_TYPES.ERROR,
      title: title || CHAR_STRINGS.EMPTY,
      duration: duration ?? 0,
      timerId: null,
    }

    this._items.push(item)

    while (this._items.length > NOTIFY.MAX_VISIBLE) {
      this._dismiss(this._items[0].id)
    }

    if (duration > 0) {
      item.timerId = setTimeout(() => this._dismiss(id), duration)

      const timer = item.timerId as unknown as { unref?: () => void } | null

      if (timer && typeof timer.unref === TYPE_STRINGS.FUNCTION) (timer.unref as () => void)()
    }

    if (this._isMounted) {
      this._updateDom()
    }

    return id
  }

  /**
   * Removes an item by id and cancels its pending auto-dismiss.
   * @param {number} id
   */
  private _dismiss(id: number): void {
    const idx = this._items.findIndex((item) => item.id === id)

    if (idx < 0) return

    const [item] = this._items.splice(idx, 1)

    if (item.timerId) {
      clearTimeout(item.timerId)

      item.timerId = null
    }

    if (this._isMounted) {
      this._updateDom()
    }
  }

  /** Lifecycle: releases every pending dismiss timer. */
  override onDestroy() {
    this._items.forEach((item) => {
      if (item.timerId) clearTimeout(item.timerId)
    })

    this._items = []
  }

  /** JSX template for the component's shadow DOM. */

  override render() {
    if (!this._items.length) {
      this.style.display = ATTR_VALUES.NONE

      return null
    }

    this.style.display = ATTR_VALUES.BLOCK

    const closeLabel = String(appText(NAV_UI_KEYS.CLOSE) || CHAR_STRINGS.EMPTY)

    return (
      <aside className={TOAST_CLASSES.SITE_TOAST} aria-live={ARIA_ATTRS.POLITE}>
        {this._items.map((item) => (
          <div
            key={item.id}
            className={`${TOAST_CLASSES.SITE_TOAST_ITEM} ${TOAST_CLASSES.SITE_TOAST}--${item.type}`}
            role={item.type === NOTIFY_TYPES.ERROR ? ARIA_ATTRS.ROLE_ALERT : ARIA_ATTRS.ROLE_STATUS}
          >
            <p className={TOAST_CLASSES.SITE_TOAST_TEXT}>
              {item.title ? (
                <strong className={TOAST_CLASSES.SITE_TOAST_TITLE}>{item.title}</strong>
              ) : null}
              {item.text}
            </p>
            <button
              className={TOAST_CLASSES.SITE_TOAST_CLOSE}
              type={FORM_ATTRS.BUTTON}
              aria-label={closeLabel}
              onClick={() => this._dismiss(item.id)}
            >
              <span aria-hidden={ATTR_VALUES.TRUE}>×</span>
            </button>
          </div>
        ))}
      </aside>
    )
  }
}

if (!customElements.get(COMPONENT_TAGS.SITE_TOAST)) {
  customElements.define(COMPONENT_TAGS.SITE_TOAST, SiteToast)
}
