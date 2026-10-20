/* tslint:disable */
/* eslint-disable */

/**
 * Public wasm surface — one skeleton canvas per instance. A page may
 * mount several (hero + content areas shimmer independently).
 */
export class Skeleton {
  free(): void
  [Symbol.dispose](): void
  /**
   * `frame` — one animation tick. Per-frame cost: one ~64 B uniform
   * write + one pass + one 3-vertex draw. The fragment loop early-
   * outs per rect — bounded and cheap.
   *
   * @param dt Seconds since the previous `frame` call.
   */
  frame(dt: number): void
  /**
   * `init` — acquire adapter/device, configure the canvas, compile
   * the pipeline, allocate the uniform + sheet buffers. Rejection
   * propagates to JS, which falls back to the WebGL/CSS skeleton.
   *
   * @param canvas The dedicated canvas this surface paints.
   * @param device The shared GPUDevice (one per page, from the JS bridge).
   * @returns Ok on a configured surface, Err(JsValue) on failure.
   */
  init(canvas: HTMLCanvasElement, device: GPUDevice): void
  /**
   * `Skeleton::new` — un-initialized surface; `init` must follow.
   * Split because the device request is an async browser promise.
   */
  constructor()
  /**
   * `resize` — re-configure the surface after a canvas-bitmap
   * change + store the DEVICE-pixel size as the shader's `rect`
   * (the whole-canvas clip, in `frag`'s device units).
   *
   * @param w Device-pixel width (element CSS px × DPR).
   * @param h Device-pixel height.
   */
  resize(w: number, h: number): void
  /**
   * `set_size` — the canvas's CSS-pixel size. Feeds the shader's
   * `res` field (the widget rect IS the whole canvas — device-px
   * `rect` is written by `resize` instead).
   *
   * @param w Canvas width in CSS pixels.
   * @param h Canvas height in CSS pixels.
   */
  set_size(w: number, h: number): void
  /**
   * `set_state` — scalar updates bundled to keep the JS call count
   * low: resolve progress, ink alpha, live rect count.
   *
   * @param resolve 0..1 resolve progress (collapse+fade driver).
   * @param ink_alpha Global glyph opacity multiplier.
   * @param count Live rect count, clamped to MAX_RECTS.
   */
  set_state(resolve: number, ink_alpha: number, count: number): void
  /**
   * `write_sheet` — upload the per-rect data block: 16 f32s per
   * rect — [x,y,w,h][radius,cell,row_h,unused][sbase rgb,unused]
   * [sink rgb,unused]. Truncated at MAX_RECTS rows; `count` (set
   * via `set_state`) decides how many rows the GPU reads.
   *
   * @param values Flat f32 sheet — 16 values per rect row.
   */
  write_sheet(values: Float32Array): void
}

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module

export interface InitOutput {
  readonly memory: WebAssembly.Memory
  readonly __wbg_skeleton_free: (a: number, b: number) => void
  readonly skeleton_frame: (a: number, b: number) => void
  readonly skeleton_init: (a: number, b: number, c: number, d: number) => void
  readonly skeleton_new: () => number
  readonly skeleton_resize: (a: number, b: number, c: number) => void
  readonly skeleton_set_size: (a: number, b: number, c: number) => void
  readonly skeleton_set_state: (a: number, b: number, c: number, d: number) => void
  readonly skeleton_write_sheet: (a: number, b: number, c: number) => void
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
