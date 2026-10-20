/* tslint:disable */
/* eslint-disable */

/**
 * Public wasm surface — one burger canvas per instance.
 */
export class Burger {
  free(): void
  [Symbol.dispose](): void
  /**
   * `frame` — one animation tick: pack the 8-f32 block, write, draw.
   *
   * @param dt Seconds since the previous call.
   */
  frame(dt: number): void
  /**
   * `init` — acquire device + compile the pipeline. Rejection → JS
   * keeps the DOM/CSS burger; mounting can never regress the page.
   *
   * @param canvas The widget's dedicated canvas.
   * @param device The shared GPUDevice (one per page, from the JS bridge).
   * @returns Ok on a live surface, Err(JsValue) on failure.
   */
  init(canvas: HTMLCanvasElement, device: GPUDevice): void
  /**
   * `Burger::new` — un-initialized widget; `init` must follow.
   */
  constructor()
  /**
   * `resize` — canvas-bitmap change → surface re-configure + the
   * DEVICE-pixel size that becomes `rect.zw` (the frag→uv divisor;
   * `frag` arrives in device px, so the divisor must too, or every
   * widget renders squashed at DPR ≠ 1).
   *
   * @param w Device-pixel width (element CSS px × DPR).
   * @param h Device-pixel height.
   */
  resize(w: number, h: number): void
  /**
   * `set_dark` — the theme lerp: 0 = light, 1 = dark. Clamped —
   * the shader lerps ink colors on this factor.
   *
   * @param v Theme darkness 0..1.
   */
  set_dark(v: number): void
  /**
   * `set_size` — the canvas's CSS-pixel size (the `res` field —
   * the shader's design-unit domain; `uv * res` yields CSS px).
   *
   * @param w Canvas width in CSS pixels.
   * @param h Canvas height in CSS pixels.
   */
  set_size(w: number, h: number): void
}

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module

export interface InitOutput {
  readonly memory: WebAssembly.Memory
  readonly __wbg_burger_free: (a: number, b: number) => void
  readonly burger_frame: (a: number, b: number) => void
  readonly burger_init: (a: number, b: number, c: number, d: number) => void
  readonly burger_new: () => number
  readonly burger_resize: (a: number, b: number, c: number) => void
  readonly burger_set_dark: (a: number, b: number) => void
  readonly burger_set_size: (a: number, b: number, c: number) => void
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
