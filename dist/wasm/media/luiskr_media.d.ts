/* tslint:disable */
/* eslint-disable */

/**
 * Public wasm surface — one media canvas per instance.
 */
export class Media {
  free(): void
  [Symbol.dispose](): void
  /**
   * `frame` — draw the current texture. No clock needed (static
   * until an upload lands); the bridge calls this on resize/scroll
   * or per rAF — drawing costs one 6-vertex call.
   *
   * @param _dt Seconds since last call (unused — media is static
   *            between uploads; kept for API symmetry).
   */
  frame(_dt: number): void
  /**
   * `init` — device + pipeline + sampler; the bind group builds on
   * the first upload.
   *
   * @param canvas The widget's dedicated canvas.
   * @returns Ok on a live surface, Err(JsValue) on failure.
   */
  init(canvas: HTMLCanvasElement): Promise<void>
  /**
   * `Media::new` — un-initialized widget; `init` must follow.
   */
  constructor()
  /**
   * `push_frame` — stream a WebCodecs `VideoFrame` into the texture.
   * Same GPU→GPU path as bitmaps — video frames upload per
   * requestVideoFrameCallback, NOT per rAF.
   *
   * @param frame The decoded frame.
   * @param w Frame width px.
   * @param h Frame height px.
   */
  push_frame(frame: VideoFrame, w: number, h: number): void
  /**
   * `resize` — canvas-bitmap change → surface re-configure. The
   * projection is pure CSS px (`rect`/`viewport` — see State doc),
   * so no size state updates here.
   *
   * @param _w Device-pixel width (element-side; unused — see doc).
   * @param _h Device-pixel height.
   */
  resize(_w: number, _h: number): void
  /**
   * `set_size` — the canvas's CSS-pixel size (rect + viewport).
   *
   * @param w Canvas width in CSS pixels.
   * @param h Canvas height in CSS pixels.
   */
  set_size(w: number, h: number): void
  /**
   * `set_uv_rect` — the cover-fit crop window: which sub-rect of
   * the texture maps onto the widget. JS computes the aspect math
   * (single responsibility — the shader just samples it).
   *
   * @param u Crop window left edge, 0..1.
   * @param v Crop window top edge, 0..1.
   * @param du Crop window width, 0..1.
   * @param dv Crop window height, 0..1.
   */
  set_uv_rect(u: number, v: number, du: number, dv: number): void
  /**
   * `upload_bitmap` — paint a decoded `ImageBitmap` (JS did the
   * decode off-main-thread via createImageBitmap). GPU→GPU copy —
   * the fastest possible path and zero wasm-side decode code.
   *
   * @param bitmap The decoded image.
   * @param w Bitmap width px.
   * @param h Bitmap height px.
   */
  upload_bitmap(bitmap: ImageBitmap, w: number, h: number): void
}

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module

export interface InitOutput {
  readonly memory: WebAssembly.Memory
  readonly __wbg_media_free: (a: number, b: number) => void
  readonly media_frame: (a: number, b: number) => void
  readonly media_init: (a: number, b: number) => number
  readonly media_new: () => number
  readonly media_push_frame: (a: number, b: number, c: number, d: number) => void
  readonly media_resize: (a: number, b: number, c: number) => void
  readonly media_set_size: (a: number, b: number, c: number) => void
  readonly media_set_uv_rect: (a: number, b: number, c: number, d: number, e: number) => void
  readonly media_upload_bitmap: (a: number, b: number, c: number, d: number) => void
  readonly __wasm_bindgen_func_elem_163: (a: number, b: number, c: number, d: number) => void
  readonly __wasm_bindgen_func_elem_163_11: (a: number, b: number, c: number, d: number) => void
  readonly __wasm_bindgen_func_elem_738: (a: number, b: number, c: number, d: number) => void
  readonly __wasm_bindgen_func_elem_752: (a: number, b: number, c: number, d: number) => void
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
