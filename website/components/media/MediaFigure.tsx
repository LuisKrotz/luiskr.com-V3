/**
 * @file MediaFigure.js
 * @description <media-figure> — the site's core media card: renders a
 * thumb → high-res swap image, or a muted-autoplay video, inside a figure
 * with caption. IntersectionObserver-driven loading, WASM/GPU decode path
 * for bitmaps, skeleton shimmer until loaded, and expands into the
 * <media-expanded> modal on activation.
 */

import { mountMediaFigure } from './figure/mount.js'
import { openMediaModal } from './figure/modal.js'
import { renderMediaFigure } from './figure/render.js'
import { loadHighRes, mediaPlaceholder, resolveMediaSources } from './figure/load.js'
import { ensureVideoSource, pauseVideo, playVideo, syncVideoPlayback } from './figure/video.js'
import { COMMON_ATTRS } from '@core/tokens/attrs/common.js'
import { FORM_ATTRS } from '@core/tokens/attrs/form.js'
import { MEDIA_ATTRS } from '@core/tokens/attrs/media.js'
import { ATTR_VALUES } from '@core/tokens/attrs/values.js'
import { COMPONENT_TAGS } from '@core/tokens/elements/components.js'
import { h } from '@core/jsx.js'
import { BaseComponent } from '@core/Component.js'
import { slugify } from '@core/utils'
import { calcAspectScaled } from '@core/utils/wasm/wasm-layout.js'
import mediaFigureStyles from '@core/sass/components/media/media-figure.scss?inline'
import internalStyles from '@core/sass/components/internals/internals.scss?inline'
import modalStyles from '@core/sass/components/internals/modal.scss?inline'
import { COVER_DIMENSIONS, GENERIC_DIMENSIONS } from '@core/tokens/media/dimensions.js'

/**
 * The MediaFigure — figure class.
 */
export class MediaFigure extends BaseComponent {
  static get observedAttributes() {
    return [
      MEDIA_ATTRS.SRC,
      FORM_ATTRS.LABEL,
      MEDIA_ATTRS.WIDTH,
      MEDIA_ATTRS.HEIGHT,
      MEDIA_ATTRS.CAN_EXPAND,
      MEDIA_ATTRS.IS_VIDEO,
      MEDIA_ATTRS.AUTO_PLAY,
      COMMON_ATTRS.CLASSES,
    ]
  }

  thumbSrc: string = ATTR_VALUES.EMPTY // low-res preview URL painted instantly
  highResSrc: string = ATTR_VALUES.EMPTY // deferred quality image URL
  isLoaded = false // high-res decoded — thumb can retire
  poster: string[] = [] // [main, scaled] video poster URLs
  video: string[] = [] // [main, scaled] video source URLs
  observer: IntersectionObserver | null = null // video viewport IntersectionObserver
  imgObserver: IntersectionObserver | null = null // image lazy-load IntersectionObserver
  isIntersecting = false // last observed viewport state

  constructor() {
    super(`${mediaFigureStyles}\n${internalStyles}\n${modalStyles}`)
  }

  /** Whether the figure may open the expand modal. */

  get canExpand(): boolean {
    return (
      this.hasAttribute(MEDIA_ATTRS.CAN_EXPAND) &&
      this.getAttribute(MEDIA_ATTRS.CAN_EXPAND) !== ATTR_VALUES.FALSE
    )
  }

  /** Whether the media is a video. */

  get isVideo(): boolean {
    return (
      this.hasAttribute(MEDIA_ATTRS.IS_VIDEO) &&
      this.getAttribute(MEDIA_ATTRS.IS_VIDEO) !== ATTR_VALUES.FALSE
    )
  }

  /** Whether the video should autoplay. */

  get autoPlay(): boolean {
    return (
      this.hasAttribute(MEDIA_ATTRS.AUTO_PLAY) &&
      this.getAttribute(MEDIA_ATTRS.AUTO_PLAY) !== ATTR_VALUES.FALSE
    )
  }

  /** Declared media width attribute. */

  get mediaWidth(): number {
    return parseInt(
      this.getAttribute(MEDIA_ATTRS.WIDTH) || String(GENERIC_DIMENSIONS.DEFAULT_WIDTH),
      10
    )
  }

  /** Declared media height attribute. */

  get mediaHeight(): number {
    return parseInt(
      this.getAttribute(MEDIA_ATTRS.HEIGHT) || String(GENERIC_DIMENSIONS.DEFAULT_HEIGHT),
      10
    )
  }

  /** Caption label. */

  get label(): string {
    return this.getAttribute(FORM_ATTRS.LABEL) || ATTR_VALUES.EMPTY
  }

  /** Base media path on the CDN. */

  get mediaSrc(): string {
    return this.getAttribute(MEDIA_ATTRS.SRC) || ATTR_VALUES.EMPTY
  }

  /** Extra host classes passed through the attribute. */

  get classes(): string {
    return this.getAttribute(COMMON_ATTRS.CLASSES) || ATTR_VALUES.EMPTY
  }

  /**
   * Rendered display width. Videos are capped at FHD_WIDTH (1920): the
   * player can't visually exceed 1080p, so decode/GPU budgets stay
   * bounded even when the source is 4K. Images pass through untouched —
   * the CDN serves the right variant instead.
   */
  get displayWidth(): number {
    const MAX = COVER_DIMENSIONS.FHD_WIDTH

    if (!this.isVideo || this.mediaWidth <= MAX) return this.mediaWidth

    return MAX
  }

  /**
   * Rendered display height — pairs with displayWidth's FHD cap:
   * aspect-preserving downscale via calcAspectScaled (h·(MAX/w)) so the
   * layout box never stretches when the video is >1080p.
   */
  get displayHeight(): number {
    const MAX = COVER_DIMENSIONS.FHD_WIDTH

    if (!this.isVideo || this.mediaWidth <= MAX) return this.mediaHeight

    return calcAspectScaled(this.mediaWidth, this.mediaHeight, MAX)
  }

  /** Primary video source URL. */

  get videoSrcMain(): string {
    return this.video[0] || ATTR_VALUES.EMPTY
  }

  /** Fallback (scaled) video source for constrained devices. */

  get videoSrcFallback(): string {
    return this.video.length >= 2 ? this.video[1] : ATTR_VALUES.EMPTY
  }

  override onInit() {
    resolveMediaSources(this)
  }

  override onMounted() {
    mountMediaFigure(this)
  }

  /** Sets the <source> src on a video element when it becomes playable. */

  _ensureVideoSource(vid: HTMLVideoElement | null): void {
    ensureVideoSource(this, vid)
  }

  override onDestroy() {
    if (this.observer) {
      this.observer.disconnect()

      this.observer = null
    }

    if (this.imgObserver) {
      this.imgObserver.disconnect()

      this.imgObserver = null
    }
  }

  override onStoreUpdate() {
    syncVideoPlayback(this)
  }

  /** Starts muted playback honoring reduced-motion/autoplay prefs. */

  playVideo(target: HTMLVideoElement | null): void {
    playVideo(this, target)
  }

  /** Pauses playback (offscreen or pref change). */

  pauseVideo(target: HTMLVideoElement | null): void {
    pauseVideo(this, target)
  }

  /** Zero-CLS SVG placeholder data-URI at the media's aspect (see media-load.ts). */

  placeholder(w: number, h: number): string {
    return mediaPlaceholder(w, h)
  }

  /** Thumb → high-res preload swap (see media-load.ts). */

  async loadHighRes() {
    return loadHighRes(this)
  }

  /** Slugifies a caption for the alt/ARIA text. */

  slugify(text: string): string {
    return slugify(text)
  }

  /** Opens the expand modal with this media's descriptor via the store. */

  openModal(): void {
    return openMediaModal(this)
  }

  /**
   * JSX template — a layered stack the CSS crossfades:
   *   1. placeholder <img>  SVG data-URI at exact aspect (zero-CLS)
   *   2. thumb <img>        instant low-res paint
   *   3. high-res <img>     fades in over the thumb once decoded
   *   video path replaces 2+3 with a muted looping <video>
   * Expand affordance renders as two buttons: a visible labelled one and
   * a full-cover aria-hidden layer that catches clicks anywhere on media.
   */
  override render() {
    return renderMediaFigure(this)
  }
}

if (!customElements.get(COMPONENT_TAGS.MEDIA_FIGURE)) {
  customElements.define(COMPONENT_TAGS.MEDIA_FIGURE, MediaFigure)
}
