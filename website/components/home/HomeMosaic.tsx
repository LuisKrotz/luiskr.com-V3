/**
 * @file HomeMosaic.js
 * @description <home-mosaic> — the masonry project grid on the home page:
 * packs portfolio cards into responsive columns (WASM layout math),
 * renders each as a <media-figure>, and animates hover preview states.
 * Shows the WebGL skeleton layer while project data loads.
 *
 * Facade — behavior lives in ./mosaic-* modules:
 *   mosaic-pack          shared packing geometry (cards + skeleton)
 *   mosaic-layout        quickLayout/layout passes + style writer
 *   mosaic-interactions  hover expansion + two-tap activation
 *   mosaic-events        scoped listener bindings
 *   mosaic-render        JSX template
 */

import { COMMON_ATTRS } from '@core/tokens/attrs/common.js'
import { COMPONENT_TAGS } from '@core/tokens/elements/components.js'
import { MEDIA } from '@core/tokens/media/suffixes.js'
import { CHAR_STRINGS } from '@core/tokens/strings/chars.js'
import { TYPE_STRINGS } from '@core/tokens/strings/types.js'
import { BaseComponent } from '@core/Component.js'
import store from '@core/store.js'
import { predictiveLoader } from '@core/predictive-loader.js'
import { h } from '@core/jsx.js'
import {
  packMosaicSkeleton,
  type MosaicCardStyle,
  type MosaicItem,
  type SkeletonBox,
} from './mosaic/pack.js'
import { applyCardStyles, layout, quickLayout, scheduleLayout } from './mosaic/layout.js'
import { onClick, onHover, onLeave } from './mosaic/interactions.js'
import { bindEvents } from './mosaic/events.js'
import { renderMosaic, skeletonStyle } from './mosaic/render.js'
import homeMosaicStyles from '@core/sass/components/home/home-mosaic.scss?inline'

interface MosaicTranslations {
  featured?: string
  explore?: string
}

/**
 * The HomeMosaic — mosaic class.
 */
export class HomeMosaic extends BaseComponent {
  _processedItems: MosaicItem[] = [] // layout-ready project items pushed by the view
  _translations: MosaicTranslations | null = null // locale strings (featured/explore labels)
  hoveredIdx: number | null = null // index of the card currently hover-expanded
  touchIdx: number | null = null // first-tap expanded card on touch devices
  cards: MosaicCardStyle[] = [] // computed per-card style objects (card/media/bottom)
  containerH = `${CHAR_STRINGS.ZERO}${CHAR_STRINGS.PX}` // packed wall height → container style
  bottomHMap: Record<number, number> = {} // idx → measured details-panel height for expansion
  ext: string = MEDIA.EXT // CDN image extension
  _rafId: number | null = null // pending layout RAF for debounced re-packs

  constructor() {
    super(homeMosaicStyles)
  }

  /** Setter/getter — layout-ready project items pushed by the view. */

  set processedItems(val: MosaicItem[]) {
    this._processedItems = Array.isArray(val) ? val : []
    this.quickLayout()
    if (this._isMounted) {
      this._updateDom()
    }
    this.scheduleLayout()
  }

  get processedItems(): MosaicItem[] {
    return this._processedItems
  }

  /** Setter/getter — locale strings for card labels. */

  set translations(val: MosaicTranslations | null) {
    this._translations = val
    if (this._isMounted) {
      this._updateDom()
      this.scheduleLayout()
    }
  }

  get translations(): MosaicTranslations | null {
    return this._translations
  }

  /** Whether the session is touch-input (disables hover previews). */

  get hasTouch() {
    return store.getters.getTouch()
  }

  /** CDN base URL for card media. */

  get storage() {
    return store.getters.getStorage()
  }

  /**
   * Packs skeleton tiles with the same lowest-column algorithm as
   * quickLayout(), using the real featured pattern (first
   * SKELETON_MOSAIC.MOSAIC_FEATURED tiles span 2 columns) so the placeholder wall
   * matches the loaded geometry instead of a uniform grid — avoids a
   * jarring layout shift when real data lands. Returns {boxes, height}.
   */
  _packSkeleton(): { boxes: SkeletonBox[]; height: number } {
    const vw = typeof window !== TYPE_STRINGS.UNDEFINED ? window.innerWidth : 375

    return packMosaicSkeleton(vw)
  }

  /** Height of the skeleton placeholder area. */

  get skeletonH() {
    return this._packSkeleton().height + COMMON_ATTRS.PX
  }

  override onMounted() {
    bindEvents(this)
  }

  override onDestroy() {
    if (this._rafId) cancelAnimationFrame(this._rafId)
  }

  /** Debounced re-layout (resize/data changes). */

  scheduleLayout() {
    scheduleLayout(this)
  }

  /**
   * Synchronous layout pass for urgent repaints (data arrival, resize,
   * hover expansion). Same packing math as layout() but skips the WASM
   * round-trip so the DOM never waits on a worker.
   */
  quickLayout() {
    quickLayout(this)
  }

  /** Full masonry pass: measures, assigns columns, positions cards via WASM math. */

  layout(): void {
    layout(this)
  }

  /** Writes computed card positions/sizes into DOM styles. */

  _applyCardStyles(): void {
    applyCardStyles(this)
  }

  /**
   * Pointer-enter: expands the card's details region — see
   * mosaic-interactions.ts for the two-pass measurement flow.
   */
  onHover(i: number): void {
    onHover(this, i)
  }

  /** Pointer-leave: clears hover state. */

  onLeave() {
    onLeave(this)
  }

  /**
   * Card activation — see mosaic-interactions.ts for the desktop-nav /
   * two-tap-on-touch split.
   */
  onClick(item: MosaicItem, i: number): void {
    onClick(this, item, i)
  }

  /** Style object for one skeleton placeholder box. */

  skeletonStyle(box: SkeletonBox): string {
    return skeletonStyle(box)
  }

  /** JSX template for the component's shadow DOM. */

  override render() {
    return renderMosaic(this)
  }

  override onUpdated() {
    this._applyCardStyles()

    predictiveLoader.scanAndObserve(this.shadowRoot)
  }
}

if (!customElements.get(COMPONENT_TAGS.HOME_MOSAIC)) {
  customElements.define(COMPONENT_TAGS.HOME_MOSAIC, HomeMosaic)
}
