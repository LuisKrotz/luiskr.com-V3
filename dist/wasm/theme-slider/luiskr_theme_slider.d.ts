/* tslint:disable */
/* eslint-disable */

/**
 * Public wasm surface — one slider canvas per instance.
 */
export class ThemeSlider {
  free(): void
  [Symbol.dispose](): void
  /**
   * `frame` — one animation tick: pack, write, draw.
   *
   * @param dt Seconds since the previous call.
   */
  frame(dt: number): void
  /**
   * `init` — device + pipeline. Rejection → JS keeps the WebGL
   * slider; mounting can never regress the page.
   *
   * @param canvas The widget's dedicated canvas.
   * @param device The shared GPUDevice (one per page, from the JS bridge).
   * @returns Ok on a live surface, Err(JsValue) on failure.
   */
  init(canvas: HTMLCanvasElement, device: GPUDevice): void
  /**
   * `ThemeSlider::new` — un-initialized widget; `init` must follow.
   */
  constructor()
  /**
   * `resize` — canvas-bitmap change → surface re-configure.
   *
   * @param _w Device-pixel width (element-side).
   * @param _h Device-pixel height.
   */
  resize(w: number, h: number): void
  /**
   * `set_size` — the canvas's CSS-pixel size (res + rect).
   *
   * @param w Canvas width in CSS pixels.
   * @param h Canvas height in CSS pixels.
   */
  set_size(w: number, h: number): void
  /**
   * `set_state` — bundled scalar update: eased progress + knob X.
   *
   * @param progress 0..2 theme morph (0..1 night→system,
   *                 1..2 system→day; clamped to the shader's domain).
   * @param knob_x Knob center X in px.
   */
  set_state(progress: number, knob_x: number): void
  /**
   * `tap` — registers a tap for the expanding-ring ripple: the JS
   * bridge passes its clock time + the tap's X position.
   *
   * @param time The frame clock's current seconds (matches what
   *              `frame` accumulates — the shader compares
   *              `u.time - ripple_time`).
   * @param x Tap X in canvas CSS px.
   */
  tap(time: number, x: number): void
}

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module

export interface InitOutput {
  readonly memory: WebAssembly.Memory
  readonly __wbg_themeslider_free: (a: number, b: number) => void
  readonly themeslider_frame: (a: number, b: number) => void
  readonly themeslider_init: (a: number, b: number, c: number, d: number) => void
  readonly themeslider_new: () => number
  readonly themeslider_resize: (a: number, b: number, c: number) => void
  readonly themeslider_set_size: (a: number, b: number, c: number) => void
  readonly themeslider_set_state: (a: number, b: number, c: number) => void
  readonly themeslider_tap: (a: number, b: number, c: number) => void
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
