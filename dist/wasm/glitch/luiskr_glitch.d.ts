/* tslint:disable */
/* eslint-disable */

/**
 * Public wasm surface — one glitch canvas per portrait.
 */
export class Glitch {
  free(): void
  [Symbol.dispose](): void
  /**
   * `frame` — advance the clock + RNG, repack the uniform, draw.
   *
   * The RNG: one xorshift32 step per frame — `x ^= x<<13; x ^= x>>17;
   * x ^= x<<5` (Marsaglia) — maximal period 2³²−1, three shifts of
   * state. The seed goes down as an f32; the shader bitcasts it
   * back to u32 for the hash mixer (bit-exact round trip — the
   * seed's low 24 bits are the only ones that survive f32, which is
   * why the mixer uses the HIGH bits via the second shift).
   *
   * @param dt Frame delta in seconds (roll-bar clock).
   * @returns false once the surface is stale/lost.
   */
  frame(dt: number): boolean
  /**
   * `init` — device + pipeline + sampler; the bind group builds
   * once the portrait lands (`upload` → `rebind`).
   *
   * @param canvas The overlay canvas (positioned over the <img>).
   * @param device The shared GPUDevice (one per page, from the JS bridge).
   * @returns Ok on a live surface, Err(JsValue) on failure.
   */
  init(canvas: HTMLCanvasElement, device: GPUDevice): void
  /**
   * `Glitch::new` — un-initialized widget; `init` must follow.
   *
   * The RNG seeds from a fixed constant — determinism is a feature:
   * replayed corruption is stable across mounts, and entropy comes
   * from the frame counter, not wall time.
   */
  constructor()
  /**
   * `resize` — device px — the `res` uniform (corruption math is
   * px-native: band heights, tear distances, grain).
   *
   * @param w @param h Backing size in device pixels.
   */
  resize(w: number, h: number): void
  /**
   * `set_cover` — push the cover-fit dest rect (device px) — the
   * DOM `coverRect()` parity value so the shader's frag→uv mapping
   * matches `object-fit: cover` + `object-position` exactly.
   *
   * @param dx @param dy Dest rect origin (device px).
   * @param dw @param dh Dest rect size (device px).
   */
  set_cover(dx: number, dy: number, dw: number, dh: number): void
  /**
   * `set_hover` — the intensity latch: 0 = idle ambient, 1 = full
   * VHS. Mirrors `session.hover`.
   *
   * @param hover 0 or 1.
   */
  set_hover(hover: number): void
  /**
   * `set_size` — CSS px (kept for bridge contract parity; the
   * shader reads device px from `resize` only).
   *
   * @param _w @param _h CSS size — unused.
   */
  set_size(_w: number, _h: number): void
  /**
   * `upload` — stage the decoded portrait. `ImageBitmap` input —
   * the browser decodes off-main-thread and
   * `copyExternalImageToTexture` moves pixels GPU→GPU, so no CPU
   * pixel round-trip ever touches the glitch path.
   *
   * NOTE on CORS: the portrait is cross-origin — the copy REQUIRES
   * the image be fetched with `crossorigin` or the bitmap is
   * tainted and the copy throws. The JS arm catches that and keeps
   * the 2D fallback alive — the <img> stays the source of truth.
   *
   * @param bitmap The decoded portrait (`createImageBitmap(img)`).
   * @returns true when the texture landed, false before init.
   */
  upload(bitmap: ImageBitmap): boolean
}

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module

export interface InitOutput {
  readonly memory: WebAssembly.Memory
  readonly __wbg_glitch_free: (a: number, b: number) => void
  readonly glitch_frame: (a: number, b: number) => number
  readonly glitch_init: (a: number, b: number, c: number, d: number) => void
  readonly glitch_new: () => number
  readonly glitch_resize: (a: number, b: number, c: number) => void
  readonly glitch_set_cover: (a: number, b: number, c: number, d: number, e: number) => void
  readonly glitch_set_hover: (a: number, b: number) => void
  readonly glitch_set_size: (a: number, b: number, c: number) => void
  readonly glitch_upload: (a: number, b: number) => number
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
