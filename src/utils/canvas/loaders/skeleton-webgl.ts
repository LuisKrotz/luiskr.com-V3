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
import { SKELETON_CLASSES } from '@/core/tokens/classes/skeleton.js'
import { WINDOW_EVENTS } from '@/core/tokens/events/dom.js'
import { SKELETON_SELECTORS } from '@/core/tokens/selectors/skeleton.js'
import { TYPE_STRINGS } from '@/core/tokens/strings/types.js'
import { webglPool } from '../webgl-pool.js'
import { measureSkeleton } from './skeleton/measure.js'
import { type SkeletonRenderer, skeletonRenderer } from './skeleton/renderer.js'
import { init } from './skeleton/init.js'
import { sampleTheme } from './skeleton/theme.js'
import { loop, render, resolve, upload } from './skeleton/loop.js'
import type { BaseComponent } from '@/core/Component.js'
import { SKELETON_RENDER } from '@/core/tokens/motion/skeleton.js'

/** One measured placeholder: geometry (CSS px) + sampled palette for the shader. */
export interface SkelRect {
  x: number
  y: number
  w: number
  h: number
  radius: number
  cell: number
  row: number
  base: number[]
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
  host: HTMLElement
  root: ShadowRoot
  content: Element
  canvas: HTMLCanvasElement | null = null
  ctx: CanvasRenderingContext2D | null = null
  renderer: SkeletonRenderer | null = null
  animId: number | null = null
  rects: SkelRect[] = []
  rectData = new Float32Array(SKELETON_RENDER.MAX_RECTS * 4)
  metaData = new Float32Array(SKELETON_RENDER.MAX_RECTS * 4)
  skelBaseData = new Float32Array(SKELETON_RENDER.MAX_RECTS * 4)
  skelInkData = new Float32Array(SKELETON_RENDER.MAX_RECTS * 4)
  base: number[] | null = null
  ink: number[] | null = null
  inkAlpha = 1
  origin = { x: 0, y: 0 }
  dpr = 1
  _frame = 0
  useWebGL = false
  resolveStart = 0
  startTime = performance.now()
  _ro: ResizeObserver | null = null
  _idleId: number | null = null
  _refreshId: number | null = null
  _paused = false
  _onResize = (): void => this.refresh()

  constructor(host: HTMLElement, root: ShadowRoot, content: Element) {
    this.host = host

    this.root = root

    this.content = content

    this._init()
  }

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

  /** Parses rgb()/hex into normalized floats for shader uniforms. */

  _parseCssColor(str: unknown): number[] | null {
    return parseCssColor(str)
  }

  /** Reads skeleton theme tokens (--skel-bg-*) into shader colors — see skeleton-theme.ts. */
  _sampleTheme() {
    sampleTheme(this)
  }

  /** Debounces a geometry re-measure (fonts/layout shifts). */

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
  /** Re-measures the skeleton DOM rects into the layer's draw list. */
  refresh() {
    measureSkeleton(this)
  }

  /** Uploads the latest geometry + theme to shader uniforms. */

  _upload() {
    upload(this)
  }

  /** rAF callback — animates the shimmer until resolved (see skeleton-loop.ts). */

  _loop() {
    loop(this)
  }

  /** Renders a frame via the shared renderer. */

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

  /** Releases the context, buffers, listeners and rAF handle so the canvas can be GC'd. */

  destroy() {
    if (this.animId) {
      cancelAnimationFrame(this.animId)

      this.animId = null
    }

    window.removeEventListener(WINDOW_EVENTS.RESIZE, this._onResize)

    this._ro?.disconnect()

    this._ro = null

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
 * The destroySkeletonLayer constant.
 * @param component — the value
 */
export const destroySkeletonLayer = (component: BaseComponent): void => {
  component._skeletonLayer?.destroy()

  component._skeletonLayer = null
}
