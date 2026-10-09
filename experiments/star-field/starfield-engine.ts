/**
 * @file starfield-engine.ts
 * @description Facade for the star-field three.js engine — owns the SFState
 * bag and exposes the lifecycle surface the StarField component drives:
 * init() → bootstrap (single onReady fire point even on bailouts, like
 * the earth engine), selectBody/flyHome camera control, takeScreenshot,
 * setReducedMotion pause/resume, destroy() releasing listeners, RAF and
 * the renderer.
 *
 * Public API:
 *   init()               → async bootstrap
 *   selectBody(id)       → fly to body + onSelect(id)
 *   flyHome()            → return to the overview pose
 *   takeScreenshot()     → download PNG
 *   setReducedMotion(b)  → pause/resume RAF
 *   get failed           → bootstrap bailed — host shows CSS fallback
 *   destroy()
 */
import { POINTER_EVENTS, MOUSE_EVENTS, WINDOW_EVENTS } from '@core/tokens/events/dom.js'
import { SF_CAMERA } from '@core/tokens/starfield/params.js'
import { bootstrapStarField } from './engine/bootstrap.js'
import { anchorWorldPos, tickStar } from './engine/frame.js'
import { startFly } from './engine/fly.js'
import { takeStarScreenshot } from './engine/screenshot.js'
import { createStarState, type SFEvents } from './engine/state.js'
import type { SFState } from './engine/types.js'
import { devError } from '@core/devlog.js'

/**
 * Owns the full star-field scene: renderer, camera rig, skybox, catalog
 * body graph, raycast picking, fly-to tweens and the RAF loop. The host
 * component reads `failed` to swap in the CSS fallback surface.
 */
export class StarFieldEngine {
  /** All mutable engine state — see engine/state.ts. */
  #s: SFState

  constructor(canvas: HTMLCanvasElement, events: SFEvents = {}) {
    this.#s = createStarState(canvas, events)
  }

  /**
   * Async bootstrap — catches throws, marks failed when the scene never
   * assembled (silent bailouts included), and always fires onReady so the
   * loader can never stick. Same contract as EarthBackground.init().
   */
  async init(): Promise<void> {
    const s = this.#s

    try {
      await bootstrapStarField(s)
    } catch (e) {
      devError('[StarField] Bootstrap failed:', e)
      s.failed = true
    }

    if (s.disposed) return

    // A missing scene means boot bailed before assembly — flag it so the
    // host swaps in the CSS fallback instead of a dead canvas.
    if (!s.scene) s.failed = true

    s.onReady?.()
  }

  /** True when bootstrap bailed or threw before the scene assembled. */
  get failed(): boolean {
    return this.#s.failed
  }

  /**
   * Pause/resume the render loop for prefers-reduced-motion — the last
   * frame stays on screen (preserveDrawingBuffer), so pausing never
   * blanks the scene.
   */
  setReducedMotion(reduced: boolean): void {
    const s = this.#s

    s.reduced = reduced

    if (reduced) {
      if (s.animId) {
        cancelAnimationFrame(s.animId)

        s.animId = null
      }
    } else if (!s.animId && s.renderer) {
      tickStar(s)
    }
  }

  /**
   * Flies the camera to a catalog body. Called by the host for both nav
   * picks and canvas raycast picks — `onSelect` is only fired by the
   * pointer path (picking.ts) so selection never loops.
   * @param id Catalog body id.
   */
  selectBody(id: string): void {
    const s = this.#s

    const anchor = s.anchors.get(id)

    const def = s.nodes.get(id)?.def

    if (!anchor || !def || !s.camera) return

    s.selectedId = id

    const p = anchorWorldPos(anchor)

    const offset = def.radius * 5 + 14

    startFly(s, p, offset)
  }

  /** Returns the camera to the overview pose — the whole-chart vantage. */
  flyHome(): void {
    const s = this.#s

    s.selectedId = null

    startFly(
      s,
      { x: SF_CAMERA.TARGET_X, y: SF_CAMERA.TARGET_Y, z: SF_CAMERA.TARGET_Z },
      Math.max(Math.hypot(SF_CAMERA.HOME_X, SF_CAMERA.HOME_Y, SF_CAMERA.HOME_Z), 1)
    )
  }

  /** Downloads the current frame as a PNG. */
  takeScreenshot(): void {
    takeStarScreenshot(this.#s)
  }

  /** Tears down listeners, RAF, controls and the renderer. */
  destroy(): void {
    const s = this.#s

    s.disposed = true

    if (s.animId) {
      cancelAnimationFrame(s.animId)

      s.animId = null
    }

    const canvas = s.canvas

    if (canvas) {
      if (s.onPointerDown) canvas.removeEventListener(POINTER_EVENTS.POINTERDOWN, s.onPointerDown)
      if (s.onPointerMove) canvas.removeEventListener(POINTER_EVENTS.POINTERMOVE, s.onPointerMove)
      if (s.onPointerUp) canvas.removeEventListener(POINTER_EVENTS.POINTERUP, s.onPointerUp)
      if (s.onWheel) canvas.removeEventListener(MOUSE_EVENTS.WHEEL, s.onWheel)
    }

    if (s.onResize) window.removeEventListener(WINDOW_EVENTS.RESIZE, s.onResize)

    s.controls?.dispose()

    s.renderer?.dispose()

    s.renderer = null
    s.scene = null
    s.camera = null
    s.controls = null
  }
}
