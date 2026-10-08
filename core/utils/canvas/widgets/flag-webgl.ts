/**
 * @file flag-webgl.js
 * @description WebGL flag renderer for the language dialog: draws each
 * locale's flag as an animated waving shader from a generated SVG texture —
 * including split/hybrid flags (e.g. Galician over Spanish, Talian over
 * Italian-Brazilian) whose halves wave together at the locale's natural
 * aspect ratio. Flags render at their real national aspect. Shares one
 * pooled GL renderer (FlagRenderer) across all instances; CSS/emoji
 * fallback without WebGL.
 */

import { FLAG_CLASSES } from '@core/tokens/classes/flags.js'
import { MOUSE_EVENTS, WINDOW_EVENTS } from '@core/tokens/events/dom.js'
import { TYPE_STRINGS } from '@core/tokens/strings/types.js'
import { WEBGL_STRINGS } from '@core/tokens/strings/webgl.js'
import type { LangOption } from '@core/i18n.js'
import { webglPool } from '../webgl-pool.js'
import { FlagRenderer, flagRenderer } from './flag/renderer.js'
import { displayAspect, getAnimType, resizeToNaturalAspect, splitPoint } from './flag/anim.js'
import { animateFlag, renderFlagWebGL, renderStaticFlag, triggerFlagFallback } from './flag/loop.js'
import { FLAG_DIMENSIONS } from '@core/tokens/media/dimensions.js'

/**
 * WebGL Flag Animator for Language Selection Buttons
 * Each flag has a completely unique animated kinetic effect and wave physics:
 * - EN (0): Star-spangled waving ripple with specular stars sparkle
 * - PT (1): Solar burst pulse radiating from rhombus with Southern Cross constellation twinkle
 * - ES (2): Warm flamenco silk wave with golden crest glow
 * - DE (3): Swiss cross kinetic pulse transitioning into German horizontal ribbon wave
 * - HRK (4): Harmonic dual-wave blending German tricolor and Brazilian tropical pulse
 * - CAS (5): Sol de Mayo radiant solar rays pulsing across Argentine & Uruguayan sky-blue stripes
 * - RIV (6): Border river ripple reflecting the Uruguayan sun into Brazilian green-gold canopy
 * - GN (7): Tricolor horizontal fluid wave with national seal star glow
 * - IT (8): Mediterranean silk flutter with delicate cloth folds
 * - RU (9): Northern lights aurora borealis shimmer waving across the stripes
 * - FR (10): Revolutionary vertical tricolor ripple with satin sheen
 * - TLN (11): Venetian gondola water reflection merging Italian and Brazilian tones
 */

export class FlagWebGL {
  canvas: HTMLCanvasElement
  lang: LangOption
  height: number
  aspect1: number
  aspect2: number
  width: number
  isHovered = false
  hoverLevel = 0
  useWebGL = false
  _paused = false
  animId: number | null = null
  startTime: number
  ctx: CanvasRenderingContext2D | null = null
  renderer: FlagRenderer | null = null
  isLoaded = false
  onMouseEnter: (() => void) | undefined
  onMouseLeave: (() => void) | undefined
  boundTarget: HTMLElement | undefined

  constructor(canvas: HTMLCanvasElement, langOption: LangOption) {
    this.canvas = canvas

    this.lang = langOption

    const rect = canvas.getBoundingClientRect?.()

    const isSmall =
      (rect && rect.height > 0 && rect.height < FLAG_DIMENSIONS.FLAG_SMALL_THRESHOLD) ||
      canvas.classList?.contains(FLAG_CLASSES.FLAG_CANVAS_NAV)

    this.height = isSmall ? FLAG_DIMENSIONS.FLAG_NAV_HEIGHT : FLAG_DIMENSIONS.FLAG_DIALOG_HEIGHT

    // Natural aspect ratios of the source flags (w / h). Until the SVGs are
    // decoded we assume the common 3:2 so the canvas has a sane first size.
    this.aspect1 = FLAG_DIMENSIONS.FLAG_DEFAULT_ASPECT

    this.aspect2 = FLAG_DIMENSIONS.FLAG_DEFAULT_ASPECT

    this.width = Math.round(this.height * this._displayAspect())

    this.isHovered = false

    this.hoverLevel = 0.0

    this.useWebGL = false

    this.animId = null

    this.startTime = performance.now()

    this.ctx = null

    this.renderer = null

    this.isLoaded = false

    this.init()
  }

  /**
   * Display aspect of the whole canvas. A split flag shows the left half of
   * the first flag and the right half of the second, each at natural scale,
   * so its width is the mean of both natural widths.
   */
  /** Natural aspect ratio the flag should display at (from its source SVG). */
  _displayAspect() {
    return displayAspect(this)
  }

  /**
   * Normalized 0–1 x where a hybrid flag's two halves meet: the first
   * flag's share of the combined aspect widths (aspect1/(aspect1+aspect2))
   * so each half keeps its natural proportions instead of stretching 50/50.
   * @returns {number}
   */
  _splitPoint() {
    return splitPoint(this)
  }

  /** Sizes the canvas to the flag's natural aspect ratio. */

  _resizeToNaturalAspect() {
    resizeToNaturalAspect(this)
  }

  /** Picks the shader's animation mode (wave / gentle ripple / static). */

  _getAnimType() {
    return getAnimType(this)
  }

  /** Boot sequence: GL init → event binding → render start; fully degrades to the fallback path. */

  init() {
    if (!this.canvas || typeof this.canvas.getContext !== TYPE_STRINGS.FUNCTION) {
      this._triggerFallback()

      return
    }

    this.renderer = flagRenderer.acquire()

    this.ctx = this.renderer ? this.canvas.getContext(WEBGL_STRINGS.CONTEXT_2D) : null

    if (!this.renderer || !this.ctx) {
      this._triggerFallback()

      return
    }

    this.useWebGL = true

    this._resizeToNaturalAspect()

    this.loadImages()

    this.bindEvents()

    // Offscreen flags release their shared-renderer ref and stop drawing;
    // restore() re-acquires the context on re-entry.
    webglPool.register(this.canvas, this)

    this.animate()
  }

  /**
   * webglPool hook — offscreen: stops the loop and releases the shared
   * renderer reference so the pooled GL context can be disposed once
   * every flag is out of view (or destroyed).
   */
  purge() {
    this._paused = true

    if (this.animId) {
      cancelAnimationFrame(this.animId)

      this.animId = null
    }

    if (this.renderer) {
      flagRenderer.release()

      this.renderer = null
    }
  }

  /** Re-acquires the shared renderer and resumes the wave loop after a purge. */
  restore() {
    if (!this._paused) return

    this._paused = false

    if (!this.useWebGL) return

    if (!this.renderer) {
      this.renderer = flagRenderer.acquire()

      if (!this.renderer) {
        this._triggerFallback()

        return
      }
    }

    if (!this.animId) this.animate()
  }

  /** Switches to the non-WebGL path (CSS class on the host / Canvas2D) — used on context loss or init failure. */

  _triggerFallback() {
    triggerFlagFallback(this)
  }

  /** Loads the flag's SVG source(s) into the texture cache. */

  loadImages(): void {
    const renderer = this.renderer

    if (!renderer) return

    const codes = [this.lang.cc, this.lang.cc2].filter((cc): cc is string => Boolean(cc))

    const imgs = codes.map((cc) => renderer.image(cc))

    const check = () => {
      if (!imgs.every((img) => img.complete && img.naturalWidth)) return

      this.aspect1 = imgs[0].naturalWidth / imgs[0].naturalHeight

      if (imgs[1]) this.aspect2 = imgs[1].naturalWidth / imgs[1].naturalHeight

      this._resizeToNaturalAspect()

      this.isLoaded = true

      if (!this.animId) this._renderStatic()
    }

    imgs.forEach((img) => {
      if (img.complete && img.naturalWidth) return

      img.addEventListener(WINDOW_EVENTS.LOAD, check, { once: true })

      img.addEventListener(WINDOW_EVENTS.ERROR, () => this._triggerFallback(), { once: true })
    })

    check()
  }

  /** Wires pointer/hover listeners that drive the widget's interactive state. */

  bindEvents() {
    this.onMouseEnter = () => {
      this.setHover(true)
    }

    this.onMouseLeave = () => {
      this.setHover(false)
    }

    const target = this.canvas.parentElement || this.canvas

    this.boundTarget = target

    target.addEventListener(MOUSE_EVENTS.MOUSEENTER, this.onMouseEnter)

    target.addEventListener(MOUSE_EVENTS.MOUSELEAVE, this.onMouseLeave)
  }

  /** Updates hover state — the shader renders the hover accent when true. */

  setHover(hovered: boolean): void {
    this.isHovered = Boolean(hovered)
  }

  /**
   * Called when the reduced-motion preference changes.
   * Restarts the animation loop if motion is now allowed,
   * or renders a final static frame when entering reduced mode.
   */
  /** Applies prefers-reduced-motion: swaps the animation loop for one static frame render. */
  setReducedMotion(isReduced: boolean): void {
    if (isReduced) {
      this._renderStatic()
    } else if (!this.animId) {
      this.animate()
    }
  }

  /**
   * Render a single static frame of the flag (no waving).
   * Used when reduced-motion is active so the flag remains visible.
   */
  /** Draws a single settled frame — used under reduced motion or when the loop is stopped. */
  _renderStatic() {
    renderStaticFlag(this)
  }

  /** Starts the requestAnimationFrame render loop (skipped under reduced motion). */

  animate() {
    animateFlag(this)
  }

  /** Per-frame WebGL render: updates time/hover uniforms and draws the quad. */

  _renderWebGL(now: number): void {
    renderFlagWebGL(this, now)
  }

  /** Releases the context, buffers, listeners and rAF handle so the canvas can be GC'd. */

  destroy() {
    webglPool.unregister(this.canvas)

    if (this.animId) {
      cancelAnimationFrame(this.animId)

      this.animId = null
    }

    if (this.boundTarget) {
      if (this.onMouseEnter)
        this.boundTarget.removeEventListener(MOUSE_EVENTS.MOUSEENTER, this.onMouseEnter)

      if (this.onMouseLeave)
        this.boundTarget.removeEventListener(MOUSE_EVENTS.MOUSELEAVE, this.onMouseLeave)
    }

    if (this.renderer) {
      flagRenderer.release()

      this.renderer = null
    }

    this.ctx = null
  }
}
