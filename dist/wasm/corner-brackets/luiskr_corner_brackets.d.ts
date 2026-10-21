/* tslint:disable */
/* eslint-disable */

/**
 * Public wasm surface — one bracket canvas per button.
 */
export class CornerBrackets {
  free(): void
  [Symbol.dispose](): void
  /**
   * `frame` — repack the uniform block, draw the brackets.
   *
   * @param _dt Frame delta — unused (the shader is stateless:
   *            `hover` is driven from JS so time never appears in
   *            the uniform).
   * @returns false once the surface is stale/lost.
   */
  frame(_dt: number): boolean
  /**
   * `init` — device + pipeline + uniform bind group.
   *
   * @param canvas The overlay canvas (the button's own box).
   * @param device The shared GPUDevice (one per page, from the JS bridge).
   * @returns Ok on a live surface, Err(JsValue) on failure.
   */
  init(canvas: HTMLCanvasElement, device: GPUDevice): void
  /**
   * `CornerBrackets::new` — un-initialized widget; `init` must
   * follow.
   */
  constructor()
  /**
   * `resize` — device px — the `res` uniform.
   *
   * @param w @param h Backing size in device pixels.
   */
  resize(w: number, h: number): void
  /**
   * `set_arms` — push the stub/full arm lengths and hairline (all
   * device px — JS computes them from the rect + tokens once).
   *
   * @param a0w @param a0h Stub arm lengths.
   * @param a1w @param a1h Full arm lengths.
   * @param hair Hairline half-width in device px.
   */
  set_arms(a0w: number, a0h: number, a1w: number, a1h: number, hair: number): void
  /**
   * `set_colors` — push the resting/hover colors (computed style
   * read once per theme flip — the shader never sees CSS vars).
   *
   * @param er @param eg @param eb @param ea Resting rgba 0-1.
   * @param ar @param ag @param ab @param aa Hover rgba 0-1.
   */
  set_colors(
    er: number,
    eg: number,
    eb: number,
    ea: number,
    ar: number,
    ag: number,
    ab: number,
    aa: number
  ): void
  /**
   * `set_hover` — drive the eased hover progress (JS runs the
   * ease so the shader stays stateless; pump frames while the
   * value is moving, settle it to present the last frame).
   *
   * @param v Eased progress 0..1 (0 = stub arms, 1 = full span).
   */
  set_hover(v: number): void
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
  readonly __wbg_cornerbrackets_free: (a: number, b: number) => void
  readonly cornerbrackets_frame: (a: number, b: number) => number
  readonly cornerbrackets_init: (a: number, b: number, c: number, d: number) => void
  readonly cornerbrackets_new: () => number
  readonly cornerbrackets_resize: (a: number, b: number, c: number) => void
  readonly cornerbrackets_set_arms: (
    a: number,
    b: number,
    c: number,
    d: number,
    e: number,
    f: number
  ) => void
  readonly cornerbrackets_set_colors: (
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
  readonly cornerbrackets_set_hover: (a: number, b: number) => void
  readonly cornerbrackets_set_size: (a: number, b: number, c: number) => void
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
