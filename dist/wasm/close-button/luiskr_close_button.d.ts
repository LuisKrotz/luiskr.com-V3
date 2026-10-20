/* tslint:disable */
/* eslint-disable */

/**
 * Public wasm surface — one button canvas per instance.
 */
export class CloseButton {
  free(): void
  [Symbol.dispose](): void
  /**
   * `click` — registers a click for the shockwave ring: the bridge
   * passes the frame clock's current seconds (the shader computes
   * `time - click_time` for ring expansion/fade).
   *
   * @param time The frame clock's current seconds.
   */
  click(time: number): void
  /**
   * `frame` — one animation tick: pack, write, draw.
   *
   * @param dt Seconds since the previous call.
   */
  frame(dt: number): void
  /**
   * `init` — device + pipeline. Rejection → JS keeps the WebGL
   * button; mounting can never regress the page.
   *
   * @param canvas The widget's dedicated canvas.
   * @param device The shared GPUDevice (one per page, from the JS bridge).
   * @returns Ok on a live surface, Err(JsValue) on failure.
   */
  init(canvas: HTMLCanvasElement, device: GPUDevice): void
  /**
   * `CloseButton::new` — un-initialized widget; `init` must follow.
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
   * `set_state` — bundled scalar update: liquid fill, X stroke
   * progress, X rotation. All eased JS-side; the shader just draws.
   *
   * @param liquid 0..1 fill height.
   * @param draw 0..1 X stroke progress.
   * @param rot X rotation in radians.
   */
  set_state(liquid: number, draw: number, rot: number): void
}

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module

export interface InitOutput {
  readonly memory: WebAssembly.Memory
  readonly __wbg_closebutton_free: (a: number, b: number) => void
  readonly closebutton_click: (a: number, b: number) => void
  readonly closebutton_frame: (a: number, b: number) => void
  readonly closebutton_init: (a: number, b: number, c: number, d: number) => void
  readonly closebutton_new: () => number
  readonly closebutton_resize: (a: number, b: number, c: number) => void
  readonly closebutton_set_size: (a: number, b: number, c: number) => void
  readonly closebutton_set_state: (a: number, b: number, c: number, d: number) => void
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
