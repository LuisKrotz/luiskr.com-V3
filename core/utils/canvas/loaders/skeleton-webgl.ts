/**
 * @file skeleton-webgl.js
 * @description WebGL skeleton/shimmer layer for loading states: a shared
 * pooled renderer draws an organic morphing shimmer over placeholder
 * geometry sampled from the component's own DOM (skeleton elements report
 * their rects). Frees its context once content resolves (resolve()/destroy())
 * and on software renderers falls back to the pure-CSS shimmer.
 * syncSkeletonLayer()/destroySkeletonLayer() are the component-level API.
 */

import { parseCssColor } from '../css-color.js'
import { SKELETON_CLASSES } from '@core/tokens/classes/skeleton.js'
import { WINDOW_EVENTS } from '@core/tokens/events/dom.js'
import { SKELETON_SELECTORS } from '@core/tokens/selectors/skeleton.js'
import { TYPE_STRINGS } from '@core/tokens/strings/types.js'
import { webglPool } from '../webgl-pool.js'
import { measureSkeleton } from './skeleton/measure.js'
import { type SkeletonRenderer, skeletonRenderer } from './skeleton/renderer.js'
import { init } from './skeleton/init.js'
import { sampleTheme } from './skeleton/theme.js'
import { loop, render, resolve, upload } from './skeleton/loop.js'
import type { BaseComponent } from '@core/Component.js'
import { SKELETON_RENDER } from '@core/tokens/motion/skeleton.js'

/** Per-placeholder computed style, cached between measures (cleared on theme flip). */
export interface SkelStyle {
  /** Computed line-height — text placeholders tile glyph rows against it. */
  lineHeight: number
  /** Computed border-radius — forwarded to the shader's corner rounding. */
  radius: number
  /** Whether this placeholder is a text line (vs a media block). */
  textLike: boolean
  /** Raw CSS color string for the base fill — parsed lazily. */
  baseStr: string
  /** Raw CSS color string for the ink/glyph color — parsed lazily. */
  inkStr: string
}

/** One measured placeholder: geometry (CSS px) + sampled palette for the shader. */
export interface SkelRect {
  /** Left edge relative to the layer canvas origin. */
  x: number
  /** Top edge relative to the layer canvas origin. */
  y: number
  /** Box width in CSS px. */
  w: number
  /** Box height in CSS px. */
  h: number
  /** Corner radius in CSS px — matches the placeholder's own border-radius. */
  radius: number
  /** Glyph cell size driving the procedural 0/1 grid density. */
  cell: number
  /** Row index within a text placeholder (0 for media blocks). */
  row: number
  /** Parsed [r,g,b,a] base fill 0–1 floats for the u_sbase uniform array. */
  base: number[]
  /** Parsed [r,g,b,a] ink/glyph floats for the u_sink uniform array. */
  ink: number[]
}

/**
 * WebGL skeleton layer: one canvas per component overlays every skeleton
 * placeholder with a restrained "data decoding" field. Each cell shows a
 * procedural 0 or 1 glyph that slowly morphs into the other shape while the
 * colour drifts between the skeleton palette tokens. Text placeholders are
 * rendered as rows aligned to the real line height so geometry matches the
 * content that will replace them. When content arrives the layer resolves
 * (glyphs collapse, layer fades) and the context is destroyed.
 *
 * Falls back to the CSS shimmer (already on the placeholders) when WebGL is
 * unavailable: the canvas is simply never attached.
 */

export class SkeletonWebGL {
  /**
   * @param {HTMLElement} host   The custom element (positioned via :host(.has-skeleton-layer))
   * @param {ShadowRoot} root    Where the canvas lives (survives content re-renders)
   * @param {Element} content    The content wrapper that holds the placeholders
   */
  /** Host custom element — the layer positions itself via :host(.has-skeleton-layer). */
  host: HTMLElement
  /** Shadow root that owns the canvas — survives content re-renders. */
  root: ShadowRoot
  /** Content wrapper holding the placeholders being measured. */
  content: Element
  /** Per-layer 2D canvas the shared renderer blits into. */
  canvas: HTMLCanvasElement | null = null
  /** The canvas's 2D context — receives the blit each frame. */
  ctx: CanvasRenderingContext2D | null = null
  /** Borrowed shared-renderer handle — null until acquire succeeds. */
  renderer: SkeletonRenderer | null = null
  /** rAF handle for the shimmer loop — null while paused/destroyed. */
  animId: number | null = null
  /** Measured placeholder list — rebuilt by refresh(). */
  rects: SkelRect[] = []
  /** Flat xyzw rect data uploaded as the u_rects uniform array. */
  rectData = new Float32Array(SKELETON_RENDER.MAX_RECTS * 4)
  /** Per-rect metadata (radius/cell/row pad) uploaded as u_meta. */
  metaData = new Float32Array(SKELETON_RENDER.MAX_RECTS * 4)
  /** Per-rect base RGBA uploaded as u_sbase. */
  skelBaseData = new Float32Array(SKELETON_RENDER.MAX_RECTS * 4)
  /** Per-rect ink RGBA uploaded as u_sink. */
  skelInkData = new Float32Array(SKELETON_RENDER.MAX_RECTS * 4)
  /** Sampled --skel-bg base palette floats (theme-level default). */
  base: number[] | null = null
  /** Sampled ink/glyph palette floats (theme-level default). */
  ink: number[] | null = null
  /** Ink opacity multiplier — fades during the resolve-out. */
  inkAlpha = 1
  /** Canvas origin in page coords — rect measurements are relative to it. */
  origin = { x: 0, y: 0 }
  /** devicePixelRatio — canvas backing store scales by it. */
  dpr = 1
  /** Frame counter — feeds the glyph-morph phase. */
  _frame = 0
  /** Whether WebGL mode is live on this layer (webglPool reads this). */
  useWebGL = false
  /** performance.now() stamp when the resolve-out began — drives the fade. */
  resolveStart = 0
  /** Loop epoch — u_time is (now − startTime)/1000 so shaders see seconds. */
  startTime = performance.now()
  /** ResizeObserver on the content wrapper — geometry follows layout. */
  _ro: ResizeObserver | null = null
  /** Deferred init id (requestIdleCallback or setTimeout fallback). */
  _idleId: number | null = null
  /** Pending refresh rAF — debounces repeated layout churn into one measure. */
  _refreshId: number | null = null
  /** Purge latch — restore() early-returns unless a purge happened. */
  _paused = false
  /** Bound resize handler — remeasures placeholder geometry. */
  _onResize = (): void => this.refresh()
  /** Placeholder nodes currently observed for size changes — rebuilt on each measure. */
  _observed: Set<Element> = new Set()
  /** Per-placeholder computed-style cache — cleared by sampleTheme() on a theme flip. */
  _styleCache = new WeakMap<Element, SkelStyle>()
  /** Last sampled dark-mode flag — drives the style-cache invalidation. */
  _wasDark: boolean | null = null

  constructor(host: HTMLElement, root: ShadowRoot, content: Element) {
    this.host = host

    this.root = root

    this.content = content

    this._init()
  }

  /** Bootstrap — canvas attach, measure, theme sample, renderer acquire (skeleton/init.ts). */
  _init() {
    init(this)
  }

  /* ── webglPool hooks ── */
  /**
   * webglPool hook — offscreen: stops the loop AND releases this layer's
   * shared-renderer reference. Once every layer is offscreen the refcount
   * hits zero and the shared GL context is disposed entirely — offscreen
   * skeletons hold no GPU resources.
   */
  purge() {
    this._paused = true

    if (this.animId) {
      cancelAnimationFrame(this.animId)

      this.animId = null
    }

    if (this.renderer) {
      skeletonRenderer.release()

      this.renderer = null
    }
  }

  /**
   * Re-acquires the shared renderer and resumes the loop after a purge —
   * the GL context is recreated on demand. If re-acquisition fails the
   * layer destroys itself; the CSS shimmer stays as the fallback.
   */
  restore() {
    if (!this._paused) return

    this._paused = false

    if (!this.useWebGL) return

    if (!this.renderer) {
      this.renderer = skeletonRenderer.acquire()

      if (!this.renderer) {
        this.destroy()

        return
      }
    }

    if (!this.animId) this._loop()
  }

  /**
   * Parses rgb()/hex into normalized 0–1 floats for shader uniforms.
   * @param str Raw CSS color string.
   * @returns [r,g,b,a] floats, or null on unparsable input.
   */
  _parseCssColor(str: unknown): number[] | null {
    return parseCssColor(str)
  }

  /** Reads skeleton theme tokens (--skel-bg-*) into shader colors — see skeleton-theme.ts. */
  _sampleTheme() {
    sampleTheme(this)
  }

  /**
   * Debounces a geometry re-measure (fonts/layout shifts) — coalesces a
   * burst of RO/resize callbacks into a single post-layout measure.
   */
  _scheduleRefresh() {
    if (this._refreshId || !this.useWebGL) return

    this._refreshId = requestAnimationFrame(() => {
      this._refreshId = null

      this.refresh()
    })
  }

  /**
   * Re-measures every skeleton placeholder inside the host and resizes the
   * canvas to the union of their boxes. Call after each render.
   */
  refresh() {
    measureSkeleton(this)
  }

  /** Uploads the latest geometry + theme to shader uniforms (skeleton/loop.ts). */
  _upload() {
    upload(this)
  }

  /** rAF callback — animates the shimmer until resolved (skeleton/loop.ts). */
  _loop() {
    loop(this)
  }

  /**
   * Renders one frame via the shared renderer — delegates the actual GL
   * draw + 2D blit to skeleton/loop.ts.
   * @param t Animation clock in seconds.
   * @param resolve Resolve-out progress 0–1.
   */
  _render(t: number, resolve: number): void {
    render(this, t, resolve)
  }

  /**
   * Content has arrived: fades the real content in, plays the shimmer
   * resolve-out animation, then tears down and releases the shared GL
   * context back to the pool.
   */
  resolve() {
    resolve(this)
  }

  /**
   * Releases every acquired resource — rAF loop, resize listener,
   * ResizeObserver, pending idle/refresh callbacks, pool registration,
   * shared-renderer ref, and the canvas itself — so nothing references
   * the layer after the host detaches.
   */
  destroy() {
    if (this.animId) {
      cancelAnimationFrame(this.animId)

      this.animId = null
    }

    window.removeEventListener(WINDOW_EVENTS.RESIZE, this._onResize)

    this._ro?.disconnect()

    this._ro = null

    this._observed.clear()

    if (this._idleId) {
      if (typeof cancelIdleCallback === TYPE_STRINGS.FUNCTION) cancelIdleCallback(this._idleId)

      clearTimeout(this._idleId)

      this._idleId = null
    }

    if (this.canvas) webglPool.unregister(this.canvas)

    if (this._refreshId) {
      cancelAnimationFrame(this._refreshId)

      this._refreshId = null
    }

    this.host?.classList.remove(SKELETON_CLASSES.HAS_SKELETON_LAYER)

    if (this.renderer) {
      skeletonRenderer.release()

      this.renderer = null
    }

    this.canvas?.remove()

    this.canvas = null

    this.ctx = null

    this.useWebGL = false
  }
}

/**
 * Keeps a component's skeleton layer in sync with its rendered content.
 * Call from onUpdated()/onMounted(): creates the layer while skeleton nodes
 * exist, re-measures after every render, resolves it once they are gone.
 * @param component The host component whose content is being watched.
 */
export const syncSkeletonLayer = (component: BaseComponent): void => {
  const content = component._contentNode

  if (!content || !component.shadowRoot || typeof window === TYPE_STRINGS.UNDEFINED) return

  const hasSkeleton = !!content.querySelector(SKELETON_SELECTORS.SKELETON_ANY)

  if (hasSkeleton) {
    // A failed instance (no WebGL) is kept so we never retry per render;
    // the CSS shimmer on the placeholders is the fallback.
    if (!component._skeletonLayer) {
      component._skeletonLayer = new SkeletonWebGL(component, component.shadowRoot, content)
    } else if (component._skeletonLayer.useWebGL) {
      component._skeletonLayer.refresh()
    }

    return
  }

  if (component._skeletonLayer) {
    // Content replaced the placeholders: the canvas (outside the content
    // wrapper) stays for the resolve-out and destroys itself afterwards.
    const layer = component._skeletonLayer

    component._skeletonLayer = null

    layer.resolve()
  }
}

/**
 * Component-unmount teardown — destroys the layer immediately (no
 * resolve-out: the host is going away, so a fade would never be seen) and
 * clears the component's reference.
 * @param component The host component being unmounted.
 */
export const destroySkeletonLayer = (component: BaseComponent): void => {
  component._skeletonLayer?.destroy()

  component._skeletonLayer = null
}
