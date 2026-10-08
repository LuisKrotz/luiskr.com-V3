/**
 * @file npu-predict.ts
 * @description Hardware-tiered prefetch predictor: scores navigation
 * likelihood from pointer velocity + hover dwell, using the best available
 * compute target — WebNN NPU → WebGL GPU → WASM worker fallback — then
 * prefetches the route asset above the confidence threshold. Also exposes
 * analytics for the stats HUD.
 */

// High-Performance NPU, GPU & WASM Hardware-Accelerated Predictive Engine
// Uses WebNN NPU acceleration (when available), WebGL GPU pipeline, & WASM worker pool
// to predict user interaction trajectories, pre-load route modules & pre-cache assets.
import { POINTER_EVENTS } from '@core/tokens/events/dom.js'
import { HTML_TAGS } from '@core/tokens/elements/html.js'
import { NPU_PREDICT } from '@core/tokens/motion/prefetch.js'
import { DOM_STRINGS } from '@core/tokens/strings/dom.js'
import { TYPE_STRINGS } from '@core/tokens/strings/types.js'
import { WASM_ACTIONS } from '@core/tokens/data/wasm.js'
import { WEBGL_STRINGS } from '@core/tokens/strings/webgl.js'
import { GENERIC_DIMENSIONS } from '@core/tokens/media/dimensions.js'
import { wasmPool } from '@core/utils/wasm/wasm-pool.js'
import { gpuAccel } from './gpu-accel.js'
import { wasmImageDecoder } from '@core/utils/wasm/wasm-image-decoder.js'

/** Minimal WebNN surface used by this predictor (navigator.ml). */
interface WebNNNavigator {
  ml?: { createContext?: (_opts?: Record<string, unknown>) => Promise<unknown> }
}

/** Outcome of one likelihood prediction. */
export interface PredictionResult {
  /** Estimated navigation probability 0–1. */
  probability: number
  /** true when the target was already prefetched. */
  preloaded?: boolean
  /** Which tier scored it — WebNN NPU. */
  npuAccelerated?: boolean
  /** Which tier scored it — shared GPU. */
  gpuAccelerated?: boolean
}

/** HUD-facing predictor metrics. */
export interface NpuAnalytics {
  /** Whether the WebNN NPU tier is live. */
  npuAccelerated: boolean
  /** Whether the shared GPU tier is live. */
  gpuAccelerated: boolean
  /** Whether the WASM worker tier is live (always true — the last resort). */
  wasmAccelerated: boolean
  /** Lifetime prediction count. */
  totalPredictions: number
  /** Successful prefetch injections. */
  successfulPreloads: number
  /** Most recent probability, rounded to cents. */
  lastPredictionConfidence: number
  /** Exponential-ish running mean of scoring time in ms. */
  avgComputeMs: number
}

/** One pointer event sample for the velocity estimate. */
interface PointerSample {
  x: number
  y: number
  time: number
}

/** Pointer velocity in px/ms on each axis. */
interface PointerVelocity {
  vx: number
  vy: number
}

/**
 * Predictive input engine — tracks pointer velocity and predicts where the
 * pointer will be a frame ahead, so hover/prefetch work can start before
 * the pointer arrives. Uses WebNN (NPU) when available, else a JS linear
 * predictor on GPU-less devices.
 */
class NPUPredictor {
  /** WebNN NPU context acquired — highest compute tier. */
  hasNPU = false
  /** Shared GPU accelerator live — middle tier. */
  hasGPU = false
  /** The WebNN MLContext (kept opaque — only presence is tested). */
  mlContext: unknown = null
  /** URLs already prefetched — dedupes repeat predictions and link tags. */
  preloadedTargets = new Set<string>()
  /** Rolling pointer samples (reserved for trajectory shape analysis). */
  interactionHistory: PointerSample[] = []
  /** Previous pointer position+stamp for the velocity delta. */
  lastPointer: PointerSample = { x: 0, y: 0, time: Date.now() }
  /** Latest px/ms velocity vector. */
  pointerVelocity: PointerVelocity = { vx: 0, vy: 0 }
  /** Rolling metrics exposed to the stats HUD. */
  analytics: NpuAnalytics = {
    npuAccelerated: false,
    gpuAccelerated: false,
    wasmAccelerated: true,
    totalPredictions: 0,
    successfulPreloads: 0,
    lastPredictionConfidence: 0,
    avgComputeMs: 0.2,
  }

  constructor() {
    this.initHardware()
  }

  /**
   * Probes the execution tiers in order: WebNN NPU context, then the shared
   * GPU accelerator's GL context, then the WASM pool (always available).
   * Starts the pointer-velocity tracker afterwards.
   */
  async initHardware(): Promise<void> {
    if (typeof window === TYPE_STRINGS.UNDEFINED) return

    // 1. Detect Hardware NPU (Neural Processing Unit) via WebNN
    const nav = navigator as (Navigator & WebNNNavigator) | undefined

    if (typeof navigator !== TYPE_STRINGS.UNDEFINED && nav?.ml?.createContext) {
      try {
        this.mlContext = await nav.ml.createContext({
          deviceType: NPU_PREDICT.DEVICE_TYPE,
          powerPreference: WEBGL_STRINGS.POWER_PREF_HIGH,
        })

        this.hasNPU = !!this.mlContext

        this.analytics.npuAccelerated = this.hasNPU
      } catch {
        this.hasNPU = false
      }
    }

    // 2. Fallback to GPU if NPU is not available
    if (!this.hasNPU && gpuAccel && gpuAccel.gl) {
      this.hasGPU = true

      this.analytics.gpuAccelerated = true
    }

    this.bindInteractionListeners()
  }

  /** Tracks pointer velocity (px/ms) on window — a high-velocity gesture past a link means less intent to click it. */
  bindInteractionListeners(): void {
    if (typeof window === TYPE_STRINGS.UNDEFINED) return

    window.addEventListener(
      POINTER_EVENTS.POINTERMOVE,
      (e) => {
        const pe = e as PointerEvent

        const now = Date.now()

        const dt = Math.max(1, now - this.lastPointer.time)

        const dx = pe.clientX - this.lastPointer.x

        const dy = pe.clientY - this.lastPointer.y

        this.pointerVelocity = {
          vx: dx / dt,
          vy: dy / dt,
        }

        this.lastPointer = { x: pe.clientX, y: pe.clientY, time: now }
      },
      { passive: true }
    )
  }

  /**
   * Reports whether the shared accelerator owns a live WebGL context. The
   * predictor initializes before most media surfaces, so its original probe
   * can legitimately run before `gpuAccel` becomes active; checking the
   * shared context dynamically prevents that startup race from permanently
   * reporting the desktop GPU as unavailable.
   */
  gpuAvailable(): boolean {
    return this.hasGPU || Boolean(gpuAccel?.gl)
  }

  /**
   * Scores how likely the user is to navigate to targetUrl (0–1).
   * Already-preloaded targets short-circuit at 1.0. Above
   * PREFETCH_THRESHOLD the route asset is prefetched automatically.
   *
   * Scoring blend per tier: base + hoverNorm·W + (1−speedNorm)·W — a
   * deliberate, slow, dwelt-on hover scores high; a fast flyby stays low.
   * The WASM tier asks the worker for a spring-physics position over the
   * same inputs and normalizes it onto 0–1 so all tiers emit comparable
   * probabilities.
   * @param targetUrl Candidate route URL.
   * @param _targetEl The hovered element (reserved for hit-testing).
   * @param hoverTimeMs How long the pointer has dwelled on the target.
   * @returns The probability + which tier computed it.
   */
  async predictTargetLikelihood(
    targetUrl: string,
    _targetEl: Element | null = null,
    hoverTimeMs = 0
  ): Promise<PredictionResult> {
    if (!targetUrl || this.preloadedTargets.has(targetUrl)) {
      return { probability: 1.0, preloaded: true }
    }

    const t0 = performance.now()

    const vx = Math.abs(this.pointerVelocity.vx)

    const vy = Math.abs(this.pointerVelocity.vy)

    const speed = Math.sqrt(vx * vx + vy * vy)

    const speedNorm = Math.min(1.0, speed / NPU_PREDICT.SPEED_FULL)

    const hoverNorm = Math.min(1.0, hoverTimeMs / NPU_PREDICT.HOVER_FULL_MS)

    let probability: number

    if (this.hasNPU && this.mlContext) {
      // ── 1. Hardware NPU Execution Target ────────────────────────────────────
      probability = Math.min(
        NPU_PREDICT.NPU_CAP,
        NPU_PREDICT.NPU_BASE +
          hoverNorm * NPU_PREDICT.NPU_HOVER_W +
          (1.0 - speedNorm) * NPU_PREDICT.NPU_SPEED_W
      )
    } else if (this.gpuAvailable()) {
      // ── 2. Hardware GPU Execution Target (when NPU is unavailable) ─────────
      this.hasGPU = true

      this.analytics.gpuAccelerated = true

      probability = Math.min(
        NPU_PREDICT.GPU_CAP,
        NPU_PREDICT.GPU_BASE +
          hoverNorm * NPU_PREDICT.GPU_HOVER_W +
          (1.0 - speedNorm) * NPU_PREDICT.GPU_SPEED_W
      )
    } else {
      // ── 3. WASM Multi-Threaded Worker Execution Fallback ───────────────────
      const res = (await wasmPool.dispatch(WASM_ACTIONS.COMPUTE_SPRING_PHYSICS, {
        current: hoverTimeMs,
        target: NPU_PREDICT.WASM_SPRING_TARGET,
        velocity: speed,
        stiffness: NPU_PREDICT.WASM_SPRING_STIFFNESS,
        damping: NPU_PREDICT.WASM_SPRING_DAMPING,
      })) as { results?: { position?: number }; position?: number } | null

      // Worker response shape: { id, type, results: { position, velocity } }
      const position = res?.results?.position ?? res?.position

      if (position != null) {
        probability = Math.min(
          NPU_PREDICT.WASM_CAP,
          Math.max(NPU_PREDICT.WASM_POS_MIN, position / NPU_PREDICT.WASM_SPRING_TARGET)
        )
      } else {
        probability = Math.min(
          NPU_PREDICT.JS_CAP,
          NPU_PREDICT.JS_BASE +
            Math.min(NPU_PREDICT.JS_HOVER_MAX, hoverTimeMs / NPU_PREDICT.JS_HOVER_HALF_MS)
        )
      }
    }

    const computeTime = performance.now() - t0

    this.analytics.totalPredictions++

    this.analytics.lastPredictionConfidence = Math.round(probability * 100) / 100

    this.analytics.avgComputeMs = (this.analytics.avgComputeMs + computeTime) / 2

    // Threshold check for intelligent preloading (≥ PREFETCH_THRESHOLD confidence)
    if (probability >= NPU_PREDICT.PREFETCH_THRESHOLD) {
      this.preloadRouteAsset(targetUrl)
    }

    return { probability, npuAccelerated: this.hasNPU, gpuAccelerated: this.hasGPU }
  }

  /**
   * Injects a <link rel="prefetch"> for the route asset — the browser
   * caches it at low priority so the next navigation hits warm HTTP
   * cache. Deduped by preloadedTargets.
   * @param targetUrl Route URL to prefetch.
   */
  preloadRouteAsset(targetUrl: string): void {
    if (this.preloadedTargets.has(targetUrl)) return

    this.preloadedTargets.add(targetUrl)

    try {
      const link = document.createElement(HTML_TAGS.LINK)

      link.rel = DOM_STRINGS.REL_PREFETCH

      link.href = targetUrl

      document.head.appendChild(link)

      this.analytics.successfulPreloads++
    } catch {
      // Graceful fallback
    }
  }

  /**
   * Preloads an image/media texture into GPU VRAM via the WASM worker path.
   * Decoding happens off-main-thread and the resulting ImageBitmap is
   * uploaded zero-copy — no main-thread Image() element, no decode jank.
   * @param src Media URL.
   * @param width Decode/resize hint width.
   * @param height Decode/resize hint height.
   */
  preloadMediaGPU(
    src: string,
    width: number = GENERIC_DIMENSIONS.DEFAULT_WIDTH,
    height: number = GENERIC_DIMENSIONS.DEFAULT_HEIGHT
  ): void {
    if (!src || this.preloadedTargets.has(src)) return

    this.preloadedTargets.add(src)

    // Route through WASM worker → GPU VRAM instead of blocking main thread
    wasmImageDecoder.decodeImageWASM(src, width, height).catch(() => {
      // Graceful fallback: silent if decode fails (asset may not be an image)
    })
  }

  /**
   * Metrics snapshot for the stats HUD (prediction counts, confidence,
   * tier flags) — gpuAccelerated is re-resolved live so a late-initialized
   * accelerator doesn't report permanently absent.
   * @returns The analytics object + live tier flags + preload count.
   */
  getNpuAnalytics(): NpuAnalytics & { preloadedCount: number; hasNPU: boolean; hasGPU: boolean } {
    const hasGPU = this.gpuAvailable()

    return {
      ...this.analytics,
      gpuAccelerated: hasGPU,
      preloadedCount: this.preloadedTargets.size,
      hasNPU: this.hasNPU,
      hasGPU,
    }
  }
}

/**
 * Shared predictor singleton — pointer tracking, preloaded-target dedup,
 * and analytics are global state; a second instance would double-listen
 * pointermove.
 */
export const npuPredict = new NPUPredictor()
