/* tslint:disable */
/* eslint-disable */

/**
 * Public wasm surface — one divider canvas per footer hairline.
 */
export class DividerSheen {
  free(): void
  [Symbol.dispose](): void
  /**
   * `frame` — advance the sweep clock, repack, draw.
   *
   * @param dt Frame delta in seconds.
   * @returns false once the surface is stale/lost.
   */
  frame(dt: number): boolean
  /**
   * `init` — device + pipeline + the single bind group.
   *
   * @param canvas The divider's overlay canvas.
   * @param device The shared GPUDevice (one per page, from the JS bridge).
   * @returns Ok on a live surface, Err(JsValue) on failure.
   */
  init(canvas: HTMLCanvasElement, device: GPUDevice): void
  /**
   * `DividerSheen::new` — un-initialized widget; `init` must follow.
   */
  constructor()
  /**
   * `resize` — device px — the `res`/`rect` uniform.
   *
   * @param w @param h Backing size in device pixels.
   */
  resize(w: number, h: number): void
  /**
   * `set_colors` — push the live theme colors (read once per
   * theme flip from the DOM's computed style — the shader never
   * sees CSS vars).
   *
   * @param br @param bg @param bb @param ba Hairline rgba 0-1.
   * @param ar @param ag @param ab @param aa Accent-band rgba 0-1.
   */
  set_colors(
    br: number,
    bg: number,
    bb: number,
    ba: number,
    ar: number,
    ag: number,
    ab: number,
    aa: number
  ): void
  /**
   * `set_size` — CSS px (contract parity; unused — device px only).
   *
   * @param _w @param _h CSS size — unused.
   */
  set_size(_w: number, _h: number): void
}

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module

export interface InitOutput {
  readonly memory: WebAssembly.Memory
  readonly __wbg_dividersheen_free: (a: number, b: number) => void
  readonly dividersheen_frame: (a: number, b: number) => number
  readonly dividersheen_init: (a: number, b: number, c: number, d: number) => void
  readonly dividersheen_new: () => number
  readonly dividersheen_resize: (a: number, b: number, c: number) => void
  readonly dividersheen_set_colors: (
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
  readonly dividersheen_set_size: (a: number, b: number, c: number) => void
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
