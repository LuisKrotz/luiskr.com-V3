/**
 * @file earth-background.ts
 * @description Three.js WebGPU Earth background engine.
 * Renders a photorealistic Earth as a fixed canvas behind all site content.
 * All controls are exposed via method API (no lil-gui).
 *
 * Facade: the engine's state lives in earth/state.ts and the behavior in
 * earth/{bootstrap,frame,updates,screenshot,settings,meshes,post-nodes,
 * consts}.ts — this class only owns lifecycle glue and the public surface.
 *
 * Public API:
 *   init()                  → async bootstrap
 *   setReducedMotion(bool)  → pause/resume RAF
 *   setTheme(isDark)        → rotate sun to show lit or night hemisphere
 *   takeScreenshot()        → download PNG
 *   updateBloom(opts)       → live bloom tweaks
 *   updateColorGrading(opts)
 *   updateCamera(opts)
 *   updateEarth(opts)
 *   updateVignette(opts)
 *   updateChromatic(opts)
 *   get settings            → current settings snapshot
 *   destroy()
 *
 * Lifecycle contract for the host component:
 *   new EarthBackground(canvas, {onReady, onProgress}) → await init() →
 *   live updates via update*() → destroy() releases renderer + controls.
 *
 * Reduced-motion and visibility are honored by stopping the RAF loop —
 * a paused canvas still shows the last frame (preserveDrawingBuffer: true).
 */
import { CHAR_STRINGS } from '@core/tokens/strings/chars.js'
import { STATE_STRINGS } from '@core/tokens/strings/state.js'
import { WINDOW_EVENTS } from '@core/tokens/events/dom.js'
import { createEarthState, type EarthProgressFn, type EarthState } from './earth/runtime/state.js'
import { bootstrapEarth } from './earth/setup/bootstrap.js'
import { tickEarth } from './earth/runtime/frame.js'
import {
  getEarthCameraState,
  resetEarthView,
  updateEarthBloom,
  updateEarthCamera,
  updateEarthChromatic,
  updateEarthColorGrading,
  updateEarthFilm,
  updateEarthMaterial,
  updateEarthRender,
  updateEarthSpin,
  updateEarthSun,
  updateEarthVignette,
} from './earth/runtime/updates.js'
import { takeEarthScreenshot } from './earth/runtime/screenshot.js'
import { buildSettingsSnapshot } from './earth/settings.js'
import { devError } from '@core/devlog.js'

/**
 * Owns the full WebGPU/WebGL Earth scene: renderer, camera rig, sun+moon
 * lighting, the textured Earth group (surface/clouds/atmosphere shells), and
 * the TSL post-processing pipeline (bloom → chromatic aberration → color
 * grade → vignette → film grain).
 */
export class EarthBackground {
  /** All mutable engine state — see earth/state.ts. */
  #s: EarthState

  constructor(
    canvas: HTMLCanvasElement,
    {
      onReady,
      onProgress,
    }: {
      onReady?: () => void
      onProgress?: EarthProgressFn
    } = {}
  ) {
    this.#s = createEarthState(canvas, onReady, onProgress)
  }

  /* ─── Public API ─────────────────────────────────────────────────────── */

  async init(): Promise<void> {
    try {
      await bootstrapEarth(this.#s)
    } catch (e) {
      devError('[EarthBG] Bootstrap failed:', e)
      this.#s.onReady?.()
    }
  }

  /**
   * Pause/resume the render loop for prefers-reduced-motion. The last frame
   * stays on screen (preserveDrawingBuffer), so pausing never blanks the
   * background — motion just stops.
   */
  setReducedMotion(reduced: boolean): void {
    const s = this.#s

    s.reduced = reduced

    if (reduced) {
      if (s.animId) {
        cancelAnimationFrame(s.animId)
        s.animId = null
      }
    } else if (!s.animId && !s.disposed) {
      tickEarth(s)
    }
  }

  /**
   * Store the UI theme for the sun-rotation theme feature (not yet wired
   * into the scene — kept as public API for the playground controls).
   */
  setTheme(isDark: boolean): void {
    // Stored for the sun-rotation theme feature; nothing reads it yet.
    this.#s.isDarkTheme = isDark
  }

  /**
   * Show/hide the canvas and stop the loop while hidden — the playground
   * page is the only consumer, so hiding releases GPU work entirely.
   */
  setVisible(visible: boolean): void {
    const s = this.#s

    if (!s.canvas) return

    s.canvas.style.opacity = visible ? CHAR_STRINGS.ONE : CHAR_STRINGS.ZERO
    s.canvas.style.pointerEvents = visible ? CHAR_STRINGS.EMPTY : STATE_STRINGS.NONE

    if (visible && !s.animId && !s.reduced && !s.disposed) {
      tickEarth(s)
    } else if (!visible && s.animId) {
      cancelAnimationFrame(s.animId)
      s.animId = null
    }
  }

  /**
   * Renders one frame at 2× resolutionScale and downloads it as PNG.
   * Temporarily bumps pixel ratio → resize → render → capture → restore,
   * so the saved image is sharper than the live viewport.
   */
  async takeScreenshot(): Promise<void> {
    await takeEarthScreenshot(this.#s)
  }

  /**
   * Tears down the engine: stops RAF, unbinds resize, releases the
   * renderer's GPU context and the controls' DOM listeners. Idempotent —
   * safe to call while bootstrap awaits are still in flight (they check
   * disposed after each await and bail).
   */
  destroy(): void {
    const s = this.#s

    s.disposed = true

    if (s.animId) {
      cancelAnimationFrame(s.animId)
      s.animId = null
    }

    if (s.onResize) window.removeEventListener(WINDOW_EVENTS.RESIZE, s.onResize)

    s.renderer?.dispose()

    s.controls?.dispose()
  }

  /**
   * Snapshot of every tunable, shaped exactly like DEFAULT_SP_GUI so the
   * playground control panel can render sliders without knowing which
   * values are live uniforms vs build-time constants.
   * @returns {object} settings tree keyed like DEFAULT_SP_GUI
   */
  get settings() {
    const s = this.#s

    return buildSettingsSnapshot(
      {
        cg: s.cg,
        moonCfg: s.moonCfg,
        bloom_: s.bloom,
        vig: s.vig,
        ca: s.ca,
        film: s.film,
        earth_: s.earthSpin,
        sun: s.sun,
        earthMatUniforms: s.earthMatUniforms,
        camera: s.camera,
        controls: s.controls,
        render: s.render,
      },
      getEarthCameraState(s)
    )
  }

  /* ─── Live updates (delegates — see earth/updates.ts) ────────────────── */

  updateBloom(
    o: { enabled?: boolean; strength?: number; radius?: number; threshold?: number } = {}
  ): void {
    updateEarthBloom(this.#s, o)
  }

  updateColorGrading(
    o: { contrast?: number; saturation?: number; blackLevel?: number; blueGreenBoost?: number } = {}
  ): void {
    updateEarthColorGrading(this.#s, o)
  }

  updateCamera(o: { fov?: number; autoRotate?: boolean; autoRotateSpeed?: number } = {}): void {
    updateEarthCamera(this.#s, o)
  }

  updateEarth(o: { rotationSpeed?: number; trueInclination?: boolean } = {}): void {
    updateEarthSpin(this.#s, o)
  }

  updateEarthMaterial(
    o: {
      waterMetalness?: number
      waterRoughness?: number
      bumpScale?: number
      terrainShadowIntensity?: number
      terrainShadowOffset?: number
    } = {}
  ): void {
    updateEarthMaterial(this.#s, o)
  }

  updateVignette(o: { enabled?: boolean; darkness?: number; offset?: number } = {}): void {
    updateEarthVignette(this.#s, o)
  }

  updateChromatic(o: { enabled?: boolean; strength?: number; scale?: number } = {}): void {
    updateEarthChromatic(this.#s, o)
  }

  updateRender(o: { resolutionScale?: number } = {}): void {
    updateEarthRender(this.#s, o)
  }

  updateFilm(o: { enabled?: boolean; intensity?: number } = {}): void {
    updateEarthFilm(this.#s, o)
  }

  updateSun(o: { autoRotate?: boolean; speed?: number; angle?: number } = {}): void {
    updateEarthSun(this.#s, o)
  }

  /**
   * Current camera position + orbit target, rounded to 2 decimals — used
   * to persist/restore the view in the playground's settings snapshot.
   */
  getCameraState() {
    return getEarthCameraState(this.#s)
  }

  /**
   * Restore the default framing: OrbitControls.reset() replays saveState()
   * (captured at bootstrap), then fov/position/target are pinned to
   * DEFAULT_SP_GUI.CAMERA in case the saved state drifted.
   */
  resetView() {
    resetEarthView(this.#s)
  }
}
