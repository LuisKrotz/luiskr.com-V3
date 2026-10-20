/* tslint:disable */
/* eslint-disable */

/**
 * Public wasm surface — one burn canvas per instance (the mosaic
 * mounts one per title interaction).
 */
export class Burn {
  free(): void
  [Symbol.dispose](): void
  /**
   * `begin` — start a sim session: `dir` +1 burns, −1 rebuilds;
   * `origin` is the widget's CSS-px offset inside the canvas;
   * `seed` makes the xorshift deterministic per session.
   *
   * @param dir +1.0 burn / −1.0 rebuild.
   * @param ox Widget origin X, canvas CSS px.
   * @param oy Widget origin Y, canvas CSS px.
   * @param seed Deterministic xorshift seed (0 → session default).
   */
  begin(dir: number, ox: number, oy: number, seed: number): void
  /**
   * `frame` — one animation tick: advance the sim, emit instances,
   * upload, draw. Per-frame cost: O(particles) scalar math + one
   * instance write + one `draw(6, n)` — one JS→wasm crossing total.
   *
   * @param dt Seconds since the previous call.
   */
  frame(dt: number): void
  /**
   * `init` — device + pipeline + buffers. Rejection → JS keeps the
   * 2D-canvas burn; mounting can never regress the page.
   *
   * @param canvas The widget's dedicated canvas.
   * @param device The shared GPUDevice (one per page, from the JS bridge).
   * @returns Ok on a live surface, Err(JsValue) on failure.
   */
  init(canvas: HTMLCanvasElement, device: GPUDevice): void
  /**
   * `live_particles` — the sim's live-particle count. The JS loop
   * polls this for its settle check: the burn canvas can idle once
   * the front is spent AND the last ember died (mirroring the JS
   * sim's `particles.length === 0` condition).
   *
   * @returns Live particle count (0 when no sim is mounted).
   */
  live_particles(): number
  /**
   * `Burn::new` — un-initialized surface; `init` must follow.
   */
  constructor()
  /**
   * `resize` — canvas-bitmap change → surface re-configure.
   *
   * @param _w Device-pixel width (element-side).
   * @param _h Device-pixel height.
   */
  resize(_w: number, _h: number): void
  /**
   * `set_colors` — the ember ramp + scorch tint: [core, mid, edge,
   * scorch] × rgba = 16 f32s.
   *
   * @param flat Flat f32 color table.
   */
  set_colors(flat: Float32Array): void
  /**
   * `set_dir` — +1 burn, −1 rebuild.
   *
   * @param dir Direction discriminant.
   */
  set_dir(dir: number): void
  /**
   * `set_ink` — per-column ink occupancy bytes (the front's paper
   * mask — where burn front edges can live).
   *
   * @param ink One byte per pixel-column.
   */
  set_ink(ink: Uint8Array): void
  /**
   * `set_letters` — the letter table: 6 f32s per glyph (rect +
   * speeds — see `sim::BurnSim::set_letters` for the exact layout).
   *
   * @param flat Flat f32 letter table.
   */
  set_letters(flat: Float32Array): void
  /**
   * `set_origin` — move the burn origin (the widget rect moved).
   *
   * @param ox New origin X, canvas CSS px.
   * @param oy New origin Y, canvas CSS px.
   */
  set_origin(ox: number, oy: number): void
  /**
   * `set_size` — the canvas's CSS-pixel size (viewport uniform).
   *
   * @param w Canvas width in CSS pixels.
   * @param h Canvas height in CSS pixels.
   */
  set_size(w: number, h: number): void
  /**
   * `set_stage` — per-frame stage + jagged amplitude pushed by the
   * bridge before `frame`.
   *
   * @param stage Global burn progress 0..1.
   * @param jag_amp Jagged-edge amplitude in px.
   */
  set_stage(stage: number, jag_amp: number): void
}

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module

export interface InitOutput {
  readonly memory: WebAssembly.Memory
  readonly __wbg_burn_free: (a: number, b: number) => void
  readonly burn_begin: (a: number, b: number, c: number, d: number, e: number) => void
  readonly burn_frame: (a: number, b: number) => void
  readonly burn_init: (a: number, b: number, c: number, d: number) => void
  readonly burn_live_particles: (a: number) => number
  readonly burn_new: () => number
  readonly burn_resize: (a: number, b: number, c: number) => void
  readonly burn_set_colors: (a: number, b: number, c: number) => void
  readonly burn_set_dir: (a: number, b: number) => void
  readonly burn_set_ink: (a: number, b: number, c: number) => void
  readonly burn_set_letters: (a: number, b: number, c: number) => void
  readonly burn_set_origin: (a: number, b: number, c: number) => void
  readonly burn_set_size: (a: number, b: number, c: number) => void
  readonly burn_set_stage: (a: number, b: number, c: number) => void
  readonly __wbindgen_export: (a: number, b: number) => number
  readonly __wbindgen_export2: (a: number, b: number, c: number, d: number) => number
  readonly __wbindgen_export3: (a: number) => void
  readonly __wbindgen_add_to_stack_pointer: (a: number) => number
}

export type SyncInitInput = BufferSource | WebAssembly.Module

/**
 * Instantiates the given `module`, which can either be bytes or
 * a precompiled `WebAssembly.Module`.
 *
 * @param {{ module: SyncInitInput }} module - Passing `SyncInitInput` directly is deprecated.
 *
 * @returns {InitOutput}
 */
export function initSync(module: { module: SyncInitInput } | SyncInitInput): InitOutput

/**
 * If `module_or_path` is {RequestInfo} or {URL}, makes a request and
 * for everything else, calls `WebAssembly.instantiate` directly.
 *
 * @param {{ module_or_path: InitInput | Promise<InitInput> }} module_or_path - Passing `InitInput` directly is deprecated.
 *
 * @returns {Promise<InitOutput>}
 */
export default function __wbg_init(
  module_or_path?:
    { module_or_path: InitInput | Promise<InitInput> } | InitInput | Promise<InitInput>
): Promise<InitOutput>
