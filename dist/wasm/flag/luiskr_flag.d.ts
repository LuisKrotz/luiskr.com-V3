/* tslint:disable */
/* eslint-disable */

/**
 * Public wasm surface — one flag canvas per instance.
 */
export class Flag {
  free(): void
  [Symbol.dispose](): void
  /**
   * `frame` — one animation tick: pack, write, draw. Skips silently
   * until textures land (no bind group yet — an unbound draw would
   * be a validation error).
   *
   * @param dt Seconds since the previous call.
   */
  frame(dt: number): void
  /**
   * `init` — device + pipeline + sampler; the bind group builds
   * once textures land (`upload_textures` → `rebind`).
   *
   * @param canvas The widget's dedicated canvas.
   * @returns Ok on a live surface, Err(JsValue) on failure.
   */
  init(canvas: HTMLCanvasElement): Promise<void>
  /**
   * `Flag::new` — un-initialized widget; `init` must follow.
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
   * `set_state` — bundled scalar update: hover amount, the locale
   * personality, and the split-flag geometry.
   *
   * @param hover 0..1 hover amount.
   * @param anim Locale personality 0..11 (`GPU_FLAG_ANIMS`).
   * @param is_split 0 single / 1 split flag.
   * @param split_x Seam position 0..1.
   */
  set_state(hover: number, anim: number, is_split: number, split_x: number): void
  /**
   * `upload_textures` — stage one or two RGBA8 flag images. Single-
   * flag widgets pass `rgba_b` identical to `rgba_a` (the shader
   * reads tex2 only when is_split=1 — a duplicate binding is the
   * cheapest no-op). Rebuilds the bind group so the new textures go
   * live next frame.
   *
   * @param rgba_a Packed RGBA8 pixels of the primary flag.
   * @param w_a Primary texture width px.
   * @param h_a Primary texture height px.
   * @param rgba_b Packed RGBA8 pixels of the secondary flag.
   * @param w_b Secondary texture width px.
   * @param h_b Secondary texture height px.
   */
  upload_textures(
    rgba_a: Uint8Array,
    w_a: number,
    h_a: number,
    rgba_b: Uint8Array,
    w_b: number,
    h_b: number
  ): void
}

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module

export interface InitOutput {
  readonly memory: WebAssembly.Memory
  readonly __wbg_flag_free: (a: number, b: number) => void
  readonly flag_frame: (a: number, b: number) => void
  readonly flag_init: (a: number, b: number) => number
  readonly flag_new: () => number
  readonly flag_resize: (a: number, b: number, c: number) => void
  readonly flag_set_size: (a: number, b: number, c: number) => void
  readonly flag_set_state: (a: number, b: number, c: number, d: number, e: number) => void
  readonly flag_upload_textures: (
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
  readonly __wasm_bindgen_func_elem_160: (a: number, b: number, c: number, d: number) => void
  readonly __wasm_bindgen_func_elem_160_10: (a: number, b: number, c: number, d: number) => void
  readonly __wasm_bindgen_func_elem_725: (a: number, b: number, c: number, d: number) => void
  readonly __wasm_bindgen_func_elem_739: (a: number, b: number, c: number, d: number) => void
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
