/**
 * @file HomeCarousel.js
 * @description <home-carousel> — lightweight carousel used by the awards
 * strip and selected-work sections: clone-ended infinite loop, dot nav,
 * 30s autoplay gated by ≥50% viewport visibility and reduced-motion.
 * Simpler sibling of <custom-carousel> for text/award content.
 *
 * Behavior lives in `./home-carousel/*` modules (autoplay, nav, observer,
 * events, render); this class is the element facade + state holder.
 */

import { HC_VARIANTS } from '@/core/tokens/classes/home-carousel.js'
import { COMPONENT_TAGS } from '@/core/tokens/elements/components.js'
import { BaseComponent } from '@/core/Component.js'
import store from '@/core/store.js'
import homeCarouselStyles from '@/sass/components/home/home-carousel.scss?inline'
import { startAutoplay, stopAutoplay, tickAutoplay } from './home-carousel/autoplay.js'
import { bindEvents } from './home-carousel/events.js'
import {
  goTo,
  jumpToSlide,
  onDotClick,
  scheduleTeleport,
  scrollToElement,
  scrollToSlide,
} from './home-carousel/nav.js'
import { disableClonesFocus, onResize, setupObserver } from './home-carousel/observer.js'
import { renderHomeCarousel, renderItem } from './home-carousel/render.js'
import type { CarouselSlide } from './home-carousel/types.js'

/**
 * The HomeCarousel — carousel class.
 */
export class HomeCarousel extends BaseComponent {
  _items: CarouselSlide[] = []
  variant: string = HC_VARIANTS.SELECTED // render mode: 'selected' content | 'awards' links
  duration = 30000 // autoplay dwell per slide (ms)
  showDots = false // dot nav visibility (host sets it for awards)
  currentIndex = 0 // real-slide index (clones excluded)
  autoplayRunning = false // RAF cycle active
  autoplayStart: number | null = null // performance.now() at cycle start
  autoplayElapsed = 0 // accumulated pause→resume offset
  rafId: number | null = null // autoplay RAF handle
  teleportTimer: ReturnType<typeof setTimeout> | null = null // pending clone→real jump timer
  touchStartX = 0 // swipe origin for the 40px threshold
  isNavigating = false // programmatic scroll in flight
  isEnteredViewport = false // any visibility ever observed
  isFullyVisible = false // ≥50% visible — autoplay gate
  observer: IntersectionObserver | null = null // IntersectionObserver handle
  setupRafId: ReturnType<typeof requestAnimationFrame> | null = null // pending one-shot init frame

  constructor() {
    super(homeCarouselStyles)
  }

  /** Setter/getter — portfolio slide entries. */

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

  override onMounted() {
    if (this.items && this.items.length) {
      this._updateDom()
    }
    this._setupCarousel()
    this._disableClonesFocus()
    this.subscribe(store)
  }

  override onUpdated() {
    this._disableClonesFocus()
  }

  override onStoreUpdate() {
    if (store.getters.getReducedMotion()) {
      this._stopAutoplay()
    }
  }

  /** Initializes the carousel: bind → jump → observer → clone a11y. */

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

  // ─── Delegates — ./home-carousel/* ─────────────────────────────────────────
  _bindEvents() {
    bindEvents(this)
  }
  onDotClick(idx: number) {
    onDotClick(this, idx)
  }
  goTo(idx: number) {
    goTo(this, idx)
  }
  _scrollToElement(el: Element) {
    scrollToElement(this, el)
  }
  _scrollToSlide(idx: number) {
    scrollToSlide(this, idx)
  }
  _scheduleTeleport(targetIdx: number) {
    scheduleTeleport(this, targetIdx)
  }
  _jumpToSlide(idx: number, smooth = false) {
    jumpToSlide(this, idx, smooth)
  }
  _setupObserver() {
    setupObserver(this)
  }
  _onResize() {
    onResize(this)
  }
  _disableClonesFocus() {
    disableClonesFocus(this)
  }
  _startAutoplay() {
    startAutoplay(this)
  }
  _stopAutoplay() {
    stopAutoplay(this)
  }
  _tickAutoplay() {
    tickAutoplay(this)
  }
  renderItem(item: CarouselSlide | undefined) {
    return renderItem(this, item)
  }

  /** JSX template (delegate — ./home-carousel/render.tsx). */

  override render() {
    return renderHomeCarousel(this)
  }
}

if (!customElements.get(COMPONENT_TAGS.HOME_CAROUSEL)) {
  customElements.define(COMPONENT_TAGS.HOME_CAROUSEL, HomeCarousel)
}
