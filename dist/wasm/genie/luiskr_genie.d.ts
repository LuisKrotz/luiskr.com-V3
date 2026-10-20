/* tslint:disable */
/* eslint-disable */

/**
 * Public wasm surface — one genie transition per expand modal.
 */
export class Genie {
  free(): void
  [Symbol.dispose](): void
  /**
   * `frame` — repack uniforms + one render pass (the mesh draw).
   *
   * @param dt Frame delta in seconds.
   * @returns false once the surface is stale/lost.
   */
  frame(dt: number): boolean
  /**
   * `init` — device + the mesh pipeline + the placeholder texture.
   *
   * @param canvas The overlay canvas.
   * @param device The shared GPUDevice (one per page, from the JS bridge).
   * @returns Ok on a live surface, Err(JsValue) on failure.
   */
  init(canvas: HTMLCanvasElement, device: GPUDevice): void
  /**
   * `Genie::new` — un-initialized widget; `init` must follow.
   */
  constructor()
  /**
   * `resize` — device px — the `res` uniform + surface re-configure.
   *
   * @param w @param h Backing size in device pixels.
   */
  resize(w: number, h: number): void
  /**
   * `set_flags` — direction + facing edge.
   *
   * @param opening 1.0 while opening, 0.0 on the collapse.
   * @param near_bottom 1.0 when the origin sits below the destination.
   */
  set_flags(opening: number, near_bottom: number): void
  /**
   * `set_progress` — the JS-owned spring progress 0..1.
   *
   * @param p Progress.
   */
  set_progress(p: number): void
  /**
   * `set_rects` — the warp's origin + destination rects, CSS px.
   *
   * @param fx @param fy @param fw @param fh Origin rect.
   * @param tx @param ty @param tw @param th Destination rect.
   */
  set_rects(
    fx: number,
    fy: number,
    fw: number,
    fh: number,
    tx: number,
    ty: number,
    tw: number,
    th: number
  ): void
  /**
   * `set_size` — canvas CSS px (drives the dpr uniform against `dev`).
   *
   * @param w @param h CSS size.
   */
  set_size(w: number, h: number): void
  /**
   * `set_tint` — the accent rgba (0-1, theme-resolved in JS) the
   * untextured ghost fill reads.
   *
   * @param r @param g @param b @param a Rgba channels.
   */
  set_tint(r: number, g: number, b: number, a: number): void
  /**
   * `upload_bitmap` — decode happened off-thread (createImageBitmap);
   * GPU→GPU copy into a fresh texture, then the mesh bind group is
   * rebuilt against it and `has_tex` goes live.
   *
   * @param bitmap The decoded frame.
   * @param w @param h Bitmap pixel size.
   */
  upload_bitmap(bitmap: ImageBitmap, w: number, h: number): void
}

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module

export interface InitOutput {
  readonly memory: WebAssembly.Memory
  readonly __wbg_genie_free: (a: number, b: number) => void
  readonly genie_frame: (a: number, b: number) => number
  readonly genie_init: (a: number, b: number, c: number, d: number) => void
  readonly genie_new: () => number
  readonly genie_resize: (a: number, b: number, c: number) => void
  readonly genie_set_flags: (a: number, b: number, c: number) => void
  readonly genie_set_progress: (a: number, b: number) => void
  readonly genie_set_rects: (
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
  readonly genie_set_size: (a: number, b: number, c: number) => void
  readonly genie_set_tint: (a: number, b: number, c: number, d: number, e: number) => void
  readonly genie_upload_bitmap: (a: number, b: number, c: number, d: number) => void
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
