/* tslint:disable */
/* eslint-disable */

/**
 * Public wasm surface — one fullscreen canvas per instance.
 */
export class MenuBackground {
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
   * backdrop; mounting can never regress the page.
   *
   * @param canvas The widget's dedicated canvas.
   * @returns Ok on a live surface, Err(JsValue) on failure.
   */
  init(canvas: HTMLCanvasElement): Promise<void>
  /**
   * `MenuBackground::new` — un-initialized widget; `init` follows.
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
   * `set_state` — bundled scalar update: reveal amount, the two
   * theme inks (linear 0..1 rgb triples), and the global alpha.
   *
   * @param reveal 0..1 menu open amount.
   * @param r1 Primary ink red.
   * @param g1 Primary ink green.
   * @param b1 Primary ink blue.
   * @param alpha Global opacity multiplier.
   * @param r2 Secondary ink red.
   * @param g2 Secondary ink green.
   * @param b2 Secondary ink blue.
   */
  set_state(
    reveal: number,
    r1: number,
    g1: number,
    b1: number,
    alpha: number,
    r2: number,
    g2: number,
    b2: number
  ): void
}

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module

export interface InitOutput {
  readonly memory: WebAssembly.Memory
  readonly __wbg_menubackground_free: (a: number, b: number) => void
  readonly menubackground_frame: (a: number, b: number) => void
  readonly menubackground_init: (a: number, b: number) => number
  readonly menubackground_new: () => number
  readonly menubackground_resize: (a: number, b: number, c: number) => void
  readonly menubackground_set_size: (a: number, b: number, c: number) => void
  readonly menubackground_set_state: (
    a: number,
    b: number,
    c: number,
    d: number,
    e: number,
    f: number,
    g: number,
    h: number,
    i: number
  ) => void
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
