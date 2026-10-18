/* tslint:disable */
/* eslint-disable */

/**
 * Public wasm surface — one toggle canvas per instance.
 */
export class SwitchSlider {
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
   * toggle; mounting can never regress the page.
   *
   * @param canvas The widget's dedicated canvas.
   * @returns Ok on a live surface, Err(JsValue) on failure.
   */
  init(canvas: HTMLCanvasElement): Promise<void>
  /**
   * `SwitchSlider::new` — un-initialized widget; `init` must follow.
   */
  constructor()
  /**
   * `resize` — canvas-bitmap change → surface re-configure + the
   * DEVICE-pixel size that becomes `rect.zw` (the frag→uv divisor;
   * `frag` arrives in device px, so the divisor must too).
   *
   * @param w Device-pixel width (element CSS px × DPR).
   * @param h Device-pixel height.
   */
  resize(w: number, h: number): void
  /**
   * `set_size` — the canvas's CSS-pixel size (res + rect). NOTE: the
   * shader's pixel-space math assumes the design height (~28px) —
   * mount the canvas at the design size.
   *
   * @param w Canvas width in CSS pixels.
   * @param h Canvas height in CSS pixels.
   */
  set_size(w: number, h: number): void
  /**
   * `set_state` — bundled scalar update: eased progress, knob X,
   * and the context personality (0 stats / 1 grid / 2 motion —
   * mirrored by `GPU_SWITCH_CONTEXTS` on the JS side).
   *
   * @param progress 0..1 eased on-ness.
   * @param knob_x Knob center X in px.
   * @param context Track personality discriminant.
   */
  set_state(progress: number, knob_x: number, context: number): void
}

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module

export interface InitOutput {
  readonly memory: WebAssembly.Memory
  readonly __wbg_switchslider_free: (a: number, b: number) => void
  readonly switchslider_frame: (a: number, b: number) => void
  readonly switchslider_init: (a: number, b: number) => number
  readonly switchslider_new: () => number
  readonly switchslider_resize: (a: number, b: number, c: number) => void
  readonly switchslider_set_size: (a: number, b: number, c: number) => void
  readonly switchslider_set_state: (a: number, b: number, c: number, d: number) => void
  readonly __wasm_bindgen_func_elem_137: (a: number, b: number, c: number, d: number) => void
  readonly __wasm_bindgen_func_elem_137_9: (a: number, b: number, c: number, d: number) => void
  readonly __wasm_bindgen_func_elem_676: (a: number, b: number, c: number, d: number) => void
  readonly __wasm_bindgen_func_elem_689: (a: number, b: number, c: number, d: number) => void
  readonly __wbindgen_export: (a: number, b: number) => number
  readonly __wbindgen_export2: (a: number, b: number, c: number, d: number) => number
  readonly __wbindgen_export3: (a: number) => void
  readonly __wbindgen_export4: (a: number, b: number) => void
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
