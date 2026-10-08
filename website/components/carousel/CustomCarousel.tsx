/**
 * @file CustomCarousel.js
 * @description <custom-carousel> — infinite-loop horizontal carousel used by
 * the awards carousel and related-projects strip. Native-scroll based with
 * clone slides at both ends for wrap-around (teleport on reaching a clone),
 * WebGL prev/next arrow controls with progress ring, dot navigation,
 * IntersectionObserver-driven lazy media, and autoplay. Clone slides are
 * inert/aria-hidden for a11y. Safari gets a patched variant via
 * safari-patch.js.
 */

import { ATTR_VALUES } from '@core/tokens/attrs/values.js'
import { COMPONENT_TAGS } from '@core/tokens/elements/components.js'
import { TYPE_STRINGS } from '@core/tokens/strings/types.js'
import { h } from '@core/jsx.js'
import { BaseComponent } from '@core/Component.js'
import { CarouselArrowWebGL } from '@core/utils/canvas/widgets/carousel-controls.js'
import { type CarouselItem, renderCarousel, renderCarouselSlide } from './custom-carousel/render.js'
import { onDestroy, onMounted, onStoreUpdate, onUnmounted } from './custom-carousel/lifecycle.js'
import {
  regressRingToZero,
  startCarouselAutoplay,
  stopCarouselAutoplay,
  tickCarouselAutoplay,
  updateCarouselRingDom,
} from './custom-carousel/autoplay.js'
import { bindControls, destroyWebGLArrows, mountWebGLArrows } from './custom-carousel/arrows.js'
import {
  carouselGoTo,
  carouselOnDotClick,
  carouselOnNextClick,
  carouselOnPrevClick,
  carouselOnScroll,
  checkInfiniteLoop,
  jumpToSlide,
  markAdjacentLoaded,
  scheduleTeleport,
  scrollToElement,
  scrollToSlide,
  setupIntersectionObserver,
  updateActiveClasses,
} from './custom-carousel/nav.js'
import {
  measureFit,
  onCarouselResize,
  setHeightVar,
  startFitObserver,
} from './custom-carousel/sizing.js'
import carouselStyles from '@core/sass/components/carousel/carousel.scss?inline'
import carouselHostStyles from '@core/sass/components/carousel/carousel-host.scss?inline'
import internalStyles from '@core/sass/components/internals/internals.scss?inline'
import '@website/components/media/MediaFigure.js'
import { CAROUSEL_LAYOUT } from '@core/tokens/motion/carousel.js'

/**
 * <custom-carousel> element — the full-featured infinite carousel: media
 * slides (image/video via <media-figure>), clone-ended wrap, WebGL
 * prev/next arrows with a progress ring, dot nav, lazy media near the
 * active index, IntersectionObserver-gated autoplay, and a side-by-side
 * mode that drops all chrome when ≤2 items fit. Behavior delegates to
 * `./custom-carousel/*`; this class is the state holder + facade.
 */
export class CustomCarousel extends BaseComponent {
  /** Slide descriptors {src, size:[w,h], label, class, isVideo, canExpand}. */
  _items: CarouselItem[] = []
  /** CDN folder prefix prepended to each item's src. */
  _folder: string = ATTR_VALUES.EMPTY
  /** Host-forced active flag — keeps the carousel live even when side-by-side would fit. */
  _forceActive = false
  /** Live CarouselArrowWebGL widgets (null until viewport entry). */
  _prevArrow: CarouselArrowWebGL | null = null
  _nextArrow: CarouselArrowWebGL | null = null
  /** Logical index into items (0..len-1; clone positions never stored). */
  currentIndex = 0
  // Autoplay clock: autoplayStart is the performance.now() the current
  // cycle began at (offset by elapsed on resume); autoplayElapsed is the
  // accumulated ms into the AUTOPLAY_DURATION cycle.
  /** RAF cycle active flag. */
  autoplayRunning = false
  /** performance.now() the current dwell cycle started at. */
  autoplayStart = 0
  /** Accumulated ms into the cycle — survives pause→resume. */
  autoplayElapsed = 0
  /** 0–1 fraction of the autoplay cycle — drives both the SVG ring and
   *  the WebGL arrows' progress arc. */
  ringProgress = 0
  /** Autoplay RAF handle — cancelled by _stopAutoplay. */
  rafId: number | null = null
  /** Scroll debounce — _checkInfiniteLoop runs 150ms after the last event. */
  scrollTimeout: ReturnType<typeof setTimeout> | null = null
  /** Pending clone→real instant jump (CAROUSEL_TIMING.TELEPORT_DELAY). */
  teleportTimer: ReturnType<typeof setTimeout> | null = null
  /** True while a programmatic scroll is animating — suppresses the
   *  scroll-handler teleport so the goTo-driven clone jump isn't undone. */
  isNavigating = false
  /** Swipe origin X for the threshold check in the touchend handler. */
  touchStartX = 0
  /** Per-index lazy flag: media src assigned only for slides near the
   *  active one (±2 positions, wrapping). */
  slideLoaded: boolean[] = []
  /** 2πr of the progress ring — used as stroke-dasharray/dashoffset. */
  circumference = CAROUSEL_LAYOUT.CIRCUMFERENCE
  /** ≥50% visible — the autoplay gate. */
  isFullyVisible = false
  /** Any viewport visibility ever observed. */
  isEnteredViewport = false
  /** IntersectionObserver driving the visibility flags + lazy media. */
  observer: IntersectionObserver | null = null
  /** True when ≤2 items fit side-by-side at ≥960px — no carousel chrome. */
  _isSideBySide = false
  /** ResizeObserver on the host for _measureFit re-runs. */
  _fitObserver: ResizeObserver | null = null
  /** Last width the fit observer saw — dedups sub-pixel RO noise. */
  _lastObservedWidth = 0
  /** Latched by any user interaction — autoplay never resumes after. */
  _autoplayPermanentlyStopped = false
  /** Ring regress animation in flight (drains progress on stop). */
  _isRegressing = false
  /** Viewport under the mobile breakpoint at construct time. */
  isMobile =
    typeof window !== TYPE_STRINGS.UNDEFINED
      ? window.innerWidth < CAROUSEL_LAYOUT.MOBILE_BREAKPOINT
      : false

  constructor() {
    super(`${carouselStyles}\n${internalStyles}\n${carouselHostStyles}`)

    this.forceActive = false
  }

  /** Setter/getter — slide data (media + labels). */

  set items(val: unknown) {
    this._items = Array.isArray(val) ? val : []

    this._markAdjacentLoaded(0)

    if (this._isMounted) {
      this._updateDom()

      this._setupAfterRender()
    }
  }

  /**
   * Batch-assigns items/folder/forceActive with a single render — the
   * setter chain would otherwise re-render per property. Re-applying the
   * same data (same array reference + same flags) is a no-op, so parents
   * may call it freely from render/update paths.
   * @param {object} o
   * @param {Array} o.items
   * @param {string} o.folder
   * @param {boolean} o.forceActive
   */
  configure({
    items,
    folder,
    forceActive,
  }: {
    items?: CarouselItem[]
    folder?: string
    forceActive?: boolean
  }): void {
    const sameItems = this._items === items

    const sameFlags =
      this._folder === (folder || ATTR_VALUES.EMPTY) &&
      Boolean(forceActive) === Boolean(this._forceActive)

    if (sameItems && sameFlags) return

    this._folder = folder || ATTR_VALUES.EMPTY

    this._forceActive = Boolean(forceActive)

    this.items = items
  }

  get items(): CarouselItem[] {
    return this._items
  }

  /** Setter/getter — CDN media folder prefix for slide assets. */

  set folder(val: string) {
    this._folder = val || ATTR_VALUES.EMPTY
  }

  get folder() {
    return this._folder
  }

  /** Setter/getter — forces the autoplay/running state on. */

  set forceActive(val: unknown) {
    this._forceActive = Boolean(val)

    if (this._isMounted) {
      this._updateDom()

      this._setupAfterRender()
    }
  }

  get forceActive() {
    return this._forceActive || false
  }

  /** Whether the carousel is currently auto-advancing. */

  get isActive() {
    if (this._forceActive) return this.items.length > 1

    return this.items.length > 1 && !this._isSideBySide
  }

  override onMounted() {
    onMounted(this)
  }

  /** Extra unmount hook the Safari patch calls — releases the fit observer early. */
  onUnmounted() {
    onUnmounted(this)
  }

  override onStoreUpdate() {
    onStoreUpdate(this)
  }

  /** Post-render setup: measures, binds controls, starts observers. */

  _setupAfterRender() {
    if (!this.isActive) return

    this._bindControls()

    requestAnimationFrame(() => {
      this._jumpToSlide(0, false)

      this._setupIntersectionObserver()

      this._setHeightVar()

      requestAnimationFrame(() => {
        this._measureFit()
      })
    })
  }

  /** ResizeObserver that re-fits slides when the container size changes. */

  _startFitObserver() {
    startFitObserver(this)
  }

  /**
   * Decides whether the items fit side-by-side (no carousel chrome) or
   * need the scroll track. Side-by-side requires: exactly ≤2 items, no
   * landscape item (they're too wide to pair), viewport ≥960px, and the
   * projected total width ≤ host width. Projection math: each item renders
   * at maxH = 70vh tall, so its laid-out width is (w/h)·maxH; +32px gap
   * per item approximates the flex gap.
   */
  _measureFit(observedWidth?: number): void {
    measureFit(this, observedWidth)
  }

  /** Window-resize handler: re-fits and re-measures. */

  _onResize() {
    onCarouselResize(this)
  }

  /**
   * Publishes --carousel-item-height on the enclosing <section> so all
   * slides share one height. Source: the first item's intrinsic ratio
   * applied to the host width ((h/w)·hostW), capped at MAX_HEIGHT_VH —
   * aspect-correct without waiting for image decode.
   */
  _setHeightVar() {
    setHeightVar(this)
  }

  /** Wires prev/next/dot controls and mounts the WebGL arrows. */

  _bindControls() {
    bindControls(this)
  }

  /** Creates the CarouselArrowWebGL widgets on the prev/next canvases. */

  _mountWebGLArrows() {
    mountWebGLArrows(this)
  }

  /** Destroys the WebGL arrow widgets. */

  _destroyWebGLArrows() {
    destroyWebGLArrows(this)
  }

  override onDestroy() {
    onDestroy(this)
  }

  /**
   * Lazy-load window: marks slides within 2 positions of the active index
   * as loadable — distance is measured on the ring (min of direct vs
   * wrapped |i−center|), so sliding to the last item pre-loads the first
   * and vice versa. The two explicit edge lines cover len<3 edge cases.
   */
  _markAdjacentLoaded(centerIdx: number): void {
    markAdjacentLoaded(this, centerIdx)
  }

  /**
   * Navigate to slide idx — accepts out-of-range idx (idx<0 or idx≥len) by
   * scrolling to the CLONE slide at that edge, then scheduling an instant
   * teleport to the real slide (the infinite-loop illusion: the user sees
   * the clone scroll in, the swap to its identical twin is invisible).
   * In-range idx scrolls directly; isNavigating suppresses the scroll
   * handler's own teleport until the animation settles (~400ms).
   */
  goTo(idx: number): void {
    carouselGoTo(this, idx)
  }

  /** Toggles -active classes on the active slide/dot pair. */

  _updateActiveClasses() {
    updateActiveClasses(this)
  }

  /** Smooth-scrolls the track to a slide element. */

  _scrollToElement(el: Element | null): void {
    scrollToElement(this, el)
  }

  /** Schedules the invisible jump from a clone to its real slide. */

  _scheduleTeleport(targetIdx: number): void {
    scheduleTeleport(this, targetIdx)
  }

  /** Smooth-scrolls to slide idx. */

  _scrollToSlide(idx: number): void {
    scrollToSlide(this, idx)
  }

  /** Instant position jump — used for the clone teleports. */

  _jumpToSlide(idx: number, smooth = false): void {
    jumpToSlide(this, idx, smooth)
  }

  /** Scroll handler: detects when the track lands on a clone edge to teleport. */

  onScroll() {
    carouselOnScroll(this)
  }

  /** Teleports between clone and real slides at track edges — the infinite-loop trick. */

  _checkInfiniteLoop() {
    checkInfiniteLoop(this)
  }

  /** Prev-arrow click. */

  onPrevClick() {
    carouselOnPrevClick(this)
  }

  /** Next-arrow click. */

  onNextClick() {
    carouselOnNextClick(this)
  }

  /** Dot-navigation click to a specific slide. */

  onDotClick(idx: number): void {
    carouselOnDotClick(this, idx)
  }

  /** Observes slides for lazy media loading + autoplay pausing when offscreen. */

  _setupIntersectionObserver() {
    setupIntersectionObserver(this)
  }

  /**
   * Starts/resumes the autoplay RAF cycle. autoplayStart is backdated by
   * the accumulated elapsed so a pause→resume continues mid-cycle rather
   * than restarting the countdown — the ring picks up where it drained to.
   */
  _startAutoplay() {
    startCarouselAutoplay(this)
  }

  /** Stops autoplay; `permanently` latches _autoplayPermanentlyStopped so no resume follows a user gesture. */
  _stopAutoplay(permanently = false) {
    stopCarouselAutoplay(this, permanently)
  }

  /** Animates ringProgress back to 0 (drain effect when autoplay stops). */
  _regressRingToZero() {
    regressRingToZero(this)
  }

  /** Autoplay RAF frame — advances the ring clock, flips slides on cycle end. */
  _tick(timestamp: number): void {
    tickCarouselAutoplay(this, timestamp)
  }

  /** Writes ringProgress into the SVG dashoffset + arrow widget arc. */
  _updateRingDom() {
    updateCarouselRingDom(this)
  }

  /**
   * One slide's inner content — a <media-figure> with the item's CDN src
   * (folder + src), intrinsic size for aspect-ratio layout, and the
   * expand/video/label flags. Returns null for placeholder entries.
   */
  renderSlide(item: CarouselItem | null) {
    return renderCarouselSlide(item, this.folder || ATTR_VALUES.EMPTY)
  }

  /**
   * JSX template — see carousel-render.tsx for the active/inactive
   * shapes (clone slides, dots, ring buttons).
   */
  override render() {
    return renderCarousel(this)
  }
}

// Registration guard: define() throws on duplicate tag — `get` check keeps
// module re-evaluation (HMR, coverage re-imports) safe.
if (!customElements.get(COMPONENT_TAGS.CUSTOM_CAROUSEL)) {
  customElements.define(COMPONENT_TAGS.CUSTOM_CAROUSEL, CustomCarousel)
}
