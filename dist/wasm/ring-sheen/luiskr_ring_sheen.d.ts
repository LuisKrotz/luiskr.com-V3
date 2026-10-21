/* tslint:disable */
/* eslint-disable */

/**
 * Public wasm surface — one ring canvas per tile container.
 */
export class RingSheen {
  free(): void
  [Symbol.dispose](): void
  /**
   * `frame` — advance the sweep clock, repack, draw all tiles.
   *
   * @param dt Frame delta in seconds.
   * @returns false once the surface is stale/lost.
   */
  frame(dt: number): boolean
  /**
   * `init` — device + pipeline + the initial bind group.
   *
   * @param canvas The overlay canvas (positioned over the grid).
   * @param device The shared GPUDevice (one per page, from the JS bridge).
   * @returns Ok on a live surface, Err(JsValue) on failure.
   */
  init(canvas: HTMLCanvasElement, device: GPUDevice): void
  /**
   * `RingSheen::new` — un-initialized widget; `init` must follow.
   */
  constructor()
  /**
   * `resize` — device px — the `res` uniform.
   *
   * @param w @param h Backing size in device pixels.
   */
  resize(w: number, h: number): void
  /**
   * `set_colors` — push the live theme colors (computed style read
   * once per theme flip — the shader never sees CSS vars).
   *
   * @param er @param eg @param eb @param ea Ring edge rgba 0-1.
   * @param ar @param ag @param ab @param aa Sheen core rgba 0-1.
   * @param hair Hairline half-width in device px.
   */
  set_colors(
    er: number,
    eg: number,
    eb: number,
    ea: number,
    ar: number,
    ag: number,
    ab: number,
    aa: number,
    hair: number
  ): void
  /**
   * `set_size` — CSS px (contract parity; unused — device px only).
   *
   * @param _w @param _h CSS size — unused.
   */
  set_size(_w: number, _h: number): void
  /**
   * `set_tiles` — upload the per-tile sheet (8 f32s per tile — see
   * module doc). Recreates the storage buffer on growth, rebinds.
   *
   * @param values The flat f32 sheet (len = tiles·8).
   * @returns The tile count adopted (0 on malformed input).
   */
  set_tiles(values: Float32Array): number
}

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module

export interface InitOutput {
  readonly memory: WebAssembly.Memory
  readonly __wbg_ringsheen_free: (a: number, b: number) => void
  readonly ringsheen_frame: (a: number, b: number) => number
  readonly ringsheen_init: (a: number, b: number, c: number, d: number) => void
  readonly ringsheen_new: () => number
  readonly ringsheen_resize: (a: number, b: number, c: number) => void
  readonly ringsheen_set_colors: (
    a: number,
    b: number,
    c: number,
    d: number,
    e: number,
    f: number,
    g: number,
    h: number,
    i: number,
    j: number
  ) => void
  readonly ringsheen_set_size: (a: number, b: number, c: number) => void
  readonly ringsheen_set_tiles: (a: number, b: number, c: number) => number
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
