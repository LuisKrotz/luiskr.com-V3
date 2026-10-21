/* tslint:disable */
/* eslint-disable */

/**
 * Public wasm surface — one text-draw canvas per animated block.
 */
export class TextDraw {
  free(): void
  [Symbol.dispose](): void
  /**
   * `frame` — advance the clock, repack, draw all live chars.
   *
   * @param dt Frame delta in seconds.
   * @returns false once the surface is stale/lost (JS disarms).
   */
  frame(dt: number): boolean
  /**
   * `init` — device + pipeline + sampler; the bind group builds
   * once the atlas + first sheet land (`upload_atlas`/`set_chars`
   * → `rebind`).
   *
   * @param canvas The overlay canvas.
   * @param device The shared GPUDevice (one per page, from the JS bridge).
   * @returns Ok on a live surface, Err(JsValue) on failure.
   */
  init(canvas: HTMLCanvasElement, device: GPUDevice): void
  /**
   * `TextDraw::new` — un-initialized widget; `init` must follow.
   */
  constructor()
  /**
   * `resize` — device px — the `res` uniform.
   *
   * @param w @param h Backing size in device pixels.
   */
  resize(w: number, h: number): void
  /**
   * `set_chars` — upload the per-char sheet (12 f32s per char —
   * see module doc). Recreates the storage buffer when the sheet
   * outgrows capacity, then rebinds.
   *
   * @param values The flat f32 sheet (len = count·12).
   * @returns The char count adopted (0 on malformed input).
   */
  set_chars(values: Float32Array): number
  /**
   * `set_ink` — push the text color (computed style read once).
   *
   * @param r @param g @param b @param a rgba 0-1.
   */
  set_ink(r: number, g: number, b: number, a: number): void
  /**
   * `set_size` — CSS px (contract parity; unused — device px only).
   *
   * @param _w @param _h CSS size — unused.
   */
  set_size(_w: number, _h: number): void
  /**
   * `trigger` — start the stagger: the clock's current value
   * becomes t0 so `frame` reports elapsed ms from HERE.
   */
  trigger(): void
  /**
   * `upload_atlas` — stage the rasterized char atlas. `ImageBitmap`
   * input — `copyExternalImageToTexture` moves pixels GPU→GPU.
   * Rebinds so the new atlas goes live next frame.
   *
   * @param bitmap The decoded atlas bitmap.
   * @returns true when the texture landed, false before init.
   */
  upload_atlas(bitmap: ImageBitmap): boolean
}

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module

export interface InitOutput {
  readonly memory: WebAssembly.Memory
  readonly __wbg_textdraw_free: (a: number, b: number) => void
  readonly textdraw_frame: (a: number, b: number) => number
  readonly textdraw_init: (a: number, b: number, c: number, d: number) => void
  readonly textdraw_new: () => number
  readonly textdraw_resize: (a: number, b: number, c: number) => void
  readonly textdraw_set_chars: (a: number, b: number, c: number) => number
  readonly textdraw_set_ink: (a: number, b: number, c: number, d: number, e: number) => void
  readonly textdraw_set_size: (a: number, b: number, c: number) => void
  readonly textdraw_trigger: (a: number) => void
  readonly textdraw_upload_atlas: (a: number, b: number) => number
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
