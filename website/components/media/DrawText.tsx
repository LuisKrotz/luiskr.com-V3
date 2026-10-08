/**
 * @file DrawText.js
 * @description <draw-text> — character-staggered text reveal: splits its
 * text into per-character spans and animates each in sequence (per-char
 * delay computed via WASM so the whole line lands in the target duration).
 * Supports trigger modes (on-visible, manual, hover) and replay via
 * trigger()/reset().
 *
 * Behavior lives in `./draw-text/*` modules (shared sheet, tokenizer +
 * renderer, trigger wiring, shadow-DOM update); this class is the
 * element facade + state holder.
 */

import { COMMON_ATTRS } from '@core/tokens/attrs/common.js'
import { FORM_ATTRS } from '@core/tokens/attrs/form.js'
import { ATTR_VALUES } from '@core/tokens/attrs/values.js'
import { DRAW_TEXT_CLASSES } from '@core/tokens/classes/draw-text.js'
import { COMPONENT_TAGS } from '@core/tokens/elements/components.js'
import { DRAW_TEXT_SELECTORS } from '@core/tokens/selectors/draw-text.js'
import { updateDom } from './draw-text/dom.js'
import { fitText, setupFit, teardownFit } from './draw-text/fit.js'
import { parseTokens, renderContent } from './draw-text/render.js'
import {
  registerOrdered,
  setupTrigger,
  startAnimation,
  teardownTrigger,
} from './draw-text/trigger.js'
import type { DrawTimer, DrawToken } from './draw-text/types.js'
import { DRAW_TIMINGS } from '@core/tokens/media/dimensions.js'

/**
 * Draws text.
 */
export class DrawText extends HTMLElement {
  _isVisible = false // animation started (visible class applied)
  _hasAnimated = false // animation completed — chars collapsed back
  _observer: IntersectionObserver | null = null // viewport IntersectionObserver (viewport trigger)
  _animTimer: DrawTimer | null = null // pending done-timer for the collapse step
  _isMounted = false // connectedCallback ran
  _styleEl: HTMLStyleElement | CSSStyleSheet | null = null // adopted shared sheet OR per-instance <style>
  _contentEl: HTMLSpanElement | null = null // cached content wrapper (skips re-query)
  _fitObserver: ResizeObserver | null = null // parent-size watcher for the `fit` scale-down
  _effectiveOffset: number | null = null // resolved start offset — set at trigger time (ordered elements subtract elapsed session time)

  static get observedAttributes() {
    return [
      FORM_ATTRS.TEXT,
      COMMON_ATTRS.DELAY,
      COMMON_ATTRS.OFFSET,
      COMMON_ATTRS.TRIGGER,
      COMMON_ATTRS.VISIBLE,
      COMMON_ATTRS.FIT,
      COMMON_ATTRS.ORDERED,
    ]
  }

  constructor() {
    super()

    this.attachShadow({ mode: 'open' })
  }

  /** Setter/getter — the text content to animate. */

  get text() {
    return this.getAttribute(FORM_ATTRS.TEXT) || ATTR_VALUES.EMPTY
  }

  set text(val: string) {
    this.setAttribute(FORM_ATTRS.TEXT, val || ATTR_VALUES.EMPTY)
  }

  /** Setter/getter — per-character animation delay in ms. */

  get delay() {
    return parseInt(
      this.getAttribute(COMMON_ATTRS.DELAY) || String(DRAW_TIMINGS.DRAW_DEFAULT_DELAY),
      10
    )
  }

  set delay(val: number) {
    this.setAttribute(COMMON_ATTRS.DELAY, String(val))
  }

  /** Setter/getter — start-time offset before the first character. */

  get offset() {
    return parseInt(this.getAttribute(COMMON_ATTRS.OFFSET) || '0', 10)
  }

  set offset(val: number) {
    this.setAttribute(COMMON_ATTRS.OFFSET, String(val))
  }

  /** Setter/getter — how the animation starts (visible/manual/hover). */

  get triggerMode() {
    return this.getAttribute(COMMON_ATTRS.TRIGGER) || ATTR_VALUES.AUTO
  }

  set triggerMode(val: string) {
    this.setAttribute(COMMON_ATTRS.TRIGGER, val)
  }

  /**
   * Ordered-queue flag — when set, `offset` is a scheduled start on the
   * shared session clock (document-order cascade) rather than a delay
   * after this element's own trigger.
   */

  get ordered() {
    return this.hasAttribute(COMMON_ATTRS.ORDERED)
  }

  /** Setter/getter — visibility flag used by the auto trigger. */

  get visible() {
    return (
      this.hasAttribute(COMMON_ATTRS.VISIBLE) &&
      this.getAttribute(COMMON_ATTRS.VISIBLE) !== ATTR_VALUES.FALSE
    )
  }

  set visible(val: boolean) {
    if (val) this.setAttribute(COMMON_ATTRS.VISIBLE, ATTR_VALUES.EMPTY)
    else this.removeAttribute(COMMON_ATTRS.VISIBLE)
  }

  connectedCallback() {
    this._isMounted = true

    this._updateDom()

    this._setupTrigger()

    this._setupFit()
  }

  disconnectedCallback() {
    this._isMounted = false

    teardownFit(this)

    teardownTrigger(this)

    if (this._observer) {
      this._observer.disconnect()

      this._observer = null
    }

    if (this._animTimer) {
      clearTimeout(this._animTimer)

      this._animTimer = null
    }
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
    if (oldValue === newValue) return

    if (name === COMMON_ATTRS.VISIBLE && this.triggerMode === COMMON_ATTRS.PROP) {
      if (this.visible && !this._isVisible) {
        this._startAnimation()
      }
    } else if (name === FORM_ATTRS.TEXT) {
      if (this._isMounted) {
        this._hasAnimated = false

        this._isVisible = false

        this._updateDom()

        this._setupTrigger()
      }
    } else if (name === COMMON_ATTRS.FIT && this._isMounted) {
      if (this.hasAttribute(COMMON_ATTRS.FIT)) {
        this._setupFit()
      } else {
        teardownFit(this)
      }
    } else if (name === COMMON_ATTRS.ORDERED && this._isMounted) {
      if (this.ordered) {
        registerOrdered(this)
      } else {
        teardownTrigger(this)
      }
    }
  }

  /**
   * Per-character spans only exist while the animation runs. Before the
   * element enters the viewport and after the animation has finished the
   * words are rendered as single nodes: same line breaking, a fraction of
   * the DOM — long project pages would otherwise mount thousands of char
   * spans permanently.
   */
  get _needsCharSpans() {
    return this._isVisible && !this._hasAnimated
  }

  /** Re-renders the shadow DOM for current props. */

  _updateDom() {
    updateDom(this)

    fitText(this)
  }

  /** The animated content element inside the shadow root — cached by _applyContent so repeated queries are free. */
  get _rootEl() {
    return this._contentEl || this.shadowRoot!.querySelector(DRAW_TEXT_SELECTORS.DRAW_TEXT)
  }

  /** Starts the animation externally (manual trigger mode). */

  trigger() {
    this._startAnimation()
  }

  /** Returns characters to the hidden start state so the animation can replay. */

  reset() {
    this._isVisible = false

    this._hasAnimated = false

    this._effectiveOffset = null

    if (this._animTimer) {
      clearTimeout(this._animTimer)

      this._animTimer = null
    }

    const rootEl = this._rootEl

    if (rootEl) {
      rootEl.classList.remove(DRAW_TEXT_CLASSES.DRAW_TEXT_VISIBLE, DRAW_TEXT_CLASSES.DRAW_TEXT_DONE)
    }
  }

  /** Wires the active trigger mode (delegate — ./draw-text/trigger.ts). */

  _setupTrigger() {
    setupTrigger(this)
  }

  /** Installs the fit-to-width pipeline (delegate — ./draw-text/fit.ts). */

  _setupFit() {
    setupFit(this)
  }

  /** Runs the reveal sequence (delegate — ./draw-text/trigger.ts). */

  _startAnimation() {
    startAnimation(this)
  }

  /** Tokenizes the text into word/space/br/inline-tag chunks (delegate). */

  _parseTokens(text: string): DrawToken[] {
    return parseTokens(text)
  }

  /** Builds the animated span tree (delegate — ./draw-text/render.ts). */

  _renderContent(withChars = true): string {
    return renderContent(this.text, this.delay, this._effectiveOffset ?? this.offset, withChars)
  }
}

if (!customElements.get(COMPONENT_TAGS.DRAW_TEXT)) {
  customElements.define(COMPONENT_TAGS.DRAW_TEXT, DrawText)
}
