/**
 * @file AwardsCarousel.js
 * @description <awards-carousel> — lightweight carousel used by the awards
 * strip and selected-work sections: clone-ended infinite loop, dot nav,
 * 30s autoplay gated by ≥50% viewport visibility and reduced-motion.
 * Simpler sibling of <custom-carousel> for text/award content.
 *
 * Behavior lives in `./awards-carousel/*` modules (autoplay, nav, observer,
 * events, render); this class is the element facade + state holder.
 */

import { AWC_VARIANTS } from '@core/tokens/classes/awards-carousel.js'
import { COMPONENT_TAGS } from '@core/tokens/elements/components.js'
import { BaseComponent } from '@core/Component.js'
import store from '@core/store.js'
import awardsCarouselStyles from '@core/sass/components/carousel/awards-carousel.scss?inline'
import { startAutoplay, stopAutoplay, tickAutoplay } from './awards-carousel/autoplay.js'
import { bindEvents } from './awards-carousel/events.js'
import {
  goTo,
  jumpToSlide,
  onDotClick,
  scheduleTeleport,
  scrollToElement,
  scrollToSlide,
} from './awards-carousel/nav.js'
import { disableClonesFocus, onResize, setupObserver } from './awards-carousel/observer.js'
import { renderAwardsCarousel, renderItem } from './awards-carousel/render.js'
import type { CarouselSlide } from './awards-carousel/types.js'

/**
 * <awards-carousel> element — a lightweight looping carousel for award
 * and selected-work strips. Clone-ended infinite scroll (first/last
 * slides duplicated so the wrap jump looks seamless), dot navigation,
 * and a 30s RAF-driven autoplay gated on ≥50% visibility and
 * reduced-motion. All behavior delegates to `./awards-carousel/*`; this
 * class is the state holder + custom-element facade.
 */
export class AwardsCarousel extends BaseComponent {
  /** Slide entries pushed by the host — setter guards identity so repeat pushes don't re-render. */
  _items: CarouselSlide[] = []
  /** Render mode: 'selected' content cards | 'awards' link list. */
  variant: string = AWC_VARIANTS.SELECTED
  /** Autoplay dwell per slide (ms) — 30s keeps it ambient, not distracting. */
  duration = 30000
  /** Dot nav visibility (host sets it for awards). */
  showDots = false
  /** Real-slide index (clones excluded). */
  currentIndex = 0
  /** RAF cycle active flag. */
  autoplayRunning = false
  /** performance.now() at cycle start. */
  autoplayStart: number | null = null
  /** Accumulated pause→resume offset so dwell survives interruptions. */
  autoplayElapsed = 0
  /** Autoplay RAF handle. */
  rafId: number | null = null
  /** Pending clone→real jump timer (teleport after wrap settles). */
  teleportTimer: ReturnType<typeof setTimeout> | null = null
  /** Swipe origin X for the 40px threshold check. */
  touchStartX = 0
  /** Programmatic scroll in flight — scroll events during it are ignored. */
  isNavigating = false
  /** Any viewport visibility ever observed (starts fade-in on first sight). */
  isEnteredViewport = false
  /** ≥50% visible — the autoplay gate. */
  isFullyVisible = false
  /** IntersectionObserver handle driving the visibility flags. */
  observer: IntersectionObserver | null = null
  /** Pending one-shot init frame (setup runs after first paint so layout exists). */
  setupRafId: ReturnType<typeof requestAnimationFrame> | null = null

  constructor() {
    super(awardsCarouselStyles)
  }

  /**
   * Slide entries pushed by the host. The identity-equality early-return
   * (same array instance, or same items in same order) prevents Firebase
   * re-pushes that carry identical data from wiping the DOM and
   * restarting autoplay + draw animations mid-cycle.
   */
  set items(val: CarouselSlide[]) {
    const newItems = Array.isArray(val) ? val : []
    if (
      this._items === newItems ||
      (this._items.length === newItems.length && this._items.every((it, i) => it === newItems[i]))
    ) {
      return
    }
    this._items = newItems
    if (this._isMounted) {
      this._updateDom()
      this._setupCarousel()
    }
  }

  get items(): CarouselSlide[] {
    return this._items
  }

  /** Mount: render items, wire events/observer, subscribe to the store for reduced-motion. */
  override onMounted() {
    if (this.items && this.items.length) {
      this._updateDom()
    }
    this._setupCarousel()
    this._disableClonesFocus()
    this.subscribe(store)
  }

  /** Re-render: re-strip clone focusability (clones get re-created). */
  override onUpdated() {
    this._disableClonesFocus()
  }

  /** Reduced-motion commit → kill autoplay immediately (no residual RAF). */
  override onStoreUpdate() {
    if (store.getters.getReducedMotion()) {
      this._stopAutoplay()
    }
  }

  /** Initializes the carousel: bind → jump → observer → clone a11y. The work runs inside one RAF so layout is settled before jump/observer measure positions. */

  _setupCarousel() {
    if (!this.items.length) return
    this._bindEvents()
    this.setupRafId = requestAnimationFrame(() => {
      this.setupRafId = null
      this._jumpToSlide(0, false)
      this._setupObserver()
      this._disableClonesFocus()
    })
  }

  /** Teardown: stop RAF + observer + timers — every async handle is released so nothing fires after disconnect. */
  override onDestroy() {
    this._stopAutoplay()
    if (this.observer) {
      this.observer.disconnect()
      this.observer = null
    }
    if (this.teleportTimer) clearTimeout(this.teleportTimer)
    if (this.setupRafId != null) {
      cancelAnimationFrame(this.setupRafId)
      this.setupRafId = null
    }
  }

  // ─── Delegates — ./awards-carousel/* ─────────────────────────────────────────
  /** Binds scroll/touch/dot listeners (awards-carousel/events.ts). */
  _bindEvents() {
    bindEvents(this)
  }
  /** Dot-nav click → goTo. */
  onDotClick(idx: number) {
    onDotClick(this, idx)
  }
  /** Navigate to real-slide index (wraps via clone path). */
  goTo(idx: number) {
    goTo(this, idx)
  }
  /** Scrolls the track so `el` lands at the carousel start edge. */
  _scrollToElement(el: Element) {
    scrollToElement(this, el)
  }
  /** Scrolls to slide `idx` — real index, resolved through the clone map. */
  _scrollToSlide(idx: number) {
    scrollToSlide(this, idx)
  }
  /** Schedules the post-wrap teleport from a clone position back to the real slide. */
  _scheduleTeleport(targetIdx: number) {
    scheduleTeleport(this, targetIdx)
  }
  /** Positions the track on slide `idx` (smooth=false for instant jumps). */
  _jumpToSlide(idx: number, smooth = false) {
    jumpToSlide(this, idx, smooth)
  }
  /** Creates the IntersectionObserver driving isEnteredViewport/isFullyVisible. */
  _setupObserver() {
    setupObserver(this)
  }
  /** Resize handler — remeasures slide width and re-jumps without animation. */
  _onResize() {
    onResize(this)
  }
  /** Strips focusability from clone slides so Tab order only visits real slides. */
  _disableClonesFocus() {
    disableClonesFocus(this)
  }
  /** Starts the autoplay RAF cycle (gated by visibility + reduced-motion). */
  _startAutoplay() {
    startAutoplay(this)
  }
  /** Stops the autoplay RAF cycle. */
  _stopAutoplay() {
    stopAutoplay(this)
  }
  /** One autoplay frame — advances when dwell elapsed, then self-schedules. */
  _tickAutoplay() {
    tickAutoplay(this)
  }
  /** Renders one slide JSX (variant-aware). */
  renderItem(item: CarouselSlide | undefined) {
    return renderItem(this, item)
  }

  /** JSX template (delegate — ./awards-carousel/render.tsx). */

  override render() {
    return renderAwardsCarousel(this)
  }
}

// Registration guard: define() throws on duplicate tag — `get` check keeps
// module re-evaluation (HMR, coverage re-imports) safe.
if (!customElements.get(COMPONENT_TAGS.AWARDS_CAROUSEL)) {
  customElements.define(COMPONENT_TAGS.AWARDS_CAROUSEL, AwardsCarousel)
}
