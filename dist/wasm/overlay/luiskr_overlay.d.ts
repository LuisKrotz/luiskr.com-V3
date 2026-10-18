/* tslint:disable */
/* eslint-disable */

/**
 * Public wasm surface. `RefCell` interior-mutates around wasm-bindgen's
 * `&self`/`&mut self` exports without JS-visible ceremony.
 */
export class Overlay {
  free(): void
  [Symbol.dispose](): void
  /**
   * Burn sim data: four ink tints [core, mid, edge, scorch] × rgba.
   */
  burn_set_colors(id: number, flat: Float32Array): void
  /**
   * Burn sim direction: +1 burn, −1 rebuild (un-hover replay).
   */
  burn_set_dir(id: number, dir: number): void
  /**
   * Burn sim data: per-column ink occupancy bytes.
   */
  burn_set_ink(id: number, ink: Uint8Array): void
  /**
   * Burn sim data: letter table (f32×6 per letter).
   */
  burn_set_letters(id: number, flat: Float32Array): void
  /**
   * Burn sim stage — pushed per frame before `frame`: global progress
   * 0..1 + jagged-edge amplitude in device px.
   */
  burn_set_stage(id: number, stage: number, jag_amp: number): void
  /**
   * One frame — the only per-tick entry point, and the whole reason
   * the architecture works. Five stages, each chosen to cost the
   * minimum the hardware allows:
   *
   * 1. **Drain input** — replay every queued event once. Hover is
   *    recomputed only on move/down (up and wheel don't change what's
   *    under the pointer — skipping their hit_tests is a deliberate
   *    cost cut).
   * 2. **Tick sims** — burn particles advance in dt-space and emit
   *    quads into the shared buffer (one instanced draw covers ALL
   *    particles of ALL widgets).
   * 3. **Upload** — ONE `write_buffer` memcpy per frame; the instance
   *    buffer is grown geometrically (`next_power_of_two`) so steady
   *    frames never recreate it — allocation-free like the Vecs.
   * 4. **Encode** — clear once, then: quad pass → per-widget scissored
   *    draws (paint order = rect.y sort, mirroring DOM order) → text.
   *    One encoder, one render pass — state changes between widgets
   *    are pipeline+bind swaps, cheap driver commands.
   * 5. **Present** — mailbox mode drops stale frames rather than
   *    queueing latency.
   *
   * `dt` is in SECONDS — see the module doc's dt-space note.
   */
  frame(dt: number): void
  /**
   * The group under the pointer from the latest drain — the bridge
   * reads it after `frame` to route click intents to the DOM router.
   */
  hover_group(): number
  /**
   * Request adapter/device and configure the canvas surface. Called
   * once from the bridge; failure propagates so the bridge falls back
   * to DOM rendering.
   */
  init(canvas: HTMLCanvasElement): Promise<void>
  /**
   * Pointer to the f32 input ring — JS writes records directly into
   * wasm linear memory here. No copy, no call per event.
   */
  input_buffer_ptr(): number
  /**
   * Pointer to the [head, tail] i32 meta pair — JS bumps head after
   * each record write, Rust drains from tail during `frame`.
   */
  input_meta_ptr(): number
  /**
   * Loads a route font (Raleway/Fira bytes) into the glyphon font db.
   */
  install_font(family: string, bytes: Uint8Array): void
  /**
   * Constructs an un-initialized overlay — `init` must follow before
   * `frame`. Split because wgpu init is async on wasm32.
   */
  constructor()
  /**
   * Pushes a decoded video frame (WebCodecs → RGBA) into a media
   * widget's texture — the video hot path: one write_texture, no
   * bind-group rebuild, size changes recreate the slot.
   */
  push_video_frame(id: number, rgba: Uint8Array, w: number, h: number): void
  /**
   * Registers a media widget rect — media quads draw through the
   * textured pipeline; the id is shared with the slot table above.
   * Same signature family as `register_widget` but no kind — media
   * widgets are always textured quads.
   */
  register_media(x: number, y: number, w: number, h: number): number
  /**
   * Registers a widget region on the overlay. `kind` is a
   * `widgets::kinds` discriminant; the rect is canvas CSS px. Returns
   * a stable id for state pushes + teardown, 0 when the kind is
   * unknown or the GPU isn't live (bridge keeps its DOM fallback).
   */
  register_widget(kind: number, x: number, y: number, w: number, h: number): number
  /**
   * Reconfigures the surface + text viewport after a canvas resize.
   * `scale` is devicePixelRatio — text jobs stay in CSS px, glyphon
   * rasterizes at device px so glyphs stay crisp at 120Hz+.
   */
  resize(w: number, h: number): void
  /**
   * Tells the overlay the canvas's CSS size — the bridge calls this
   * alongside `resize(device px)` so scissor math can convert widget
   * rects (CSS px) into surface pixels.
   */
  set_css_size(w: number, h: number): void
  /**
   * Registers/replaces a mirrored text node. Called on DOM content
   * change — not per frame. `id` is the bridge's stable slot for the
   * DOM node; re-calling with an existing id updates in place.
   */
  set_text(
    id: number,
    text: string,
    x: number,
    y: number,
    size: number,
    max_width_px: number,
    family: string,
    r: number,
    g: number,
    b: number,
    a: number,
    bl: number,
    bt: number,
    br: number,
    bb: number
  ): void
  /**
   * Moves/resizes a widget region — the bridge calls this when the
   * DOM rect it mirrors moves (layout shift, resize, scroll of the
   * containing surface). The widget's own `res` uniform updates too
   * so shaders keep their original px-space math.
   */
  set_widget_rect(id: number, x: number, y: number, w: number, h: number): void
  /**
   * Writes the widget's uniform block — raw f32s in the layout the
   * widget's `*.rs` documents. Called per state change (per frame for
   * time/progress, once per event for ripple/click stamps).
   */
  set_widget_uniform(id: number, values: Float32Array): void
  /**
   * Removes a widget — GPU resources drop with the handle.
   */
  unregister_widget(id: number): void
  /**
   * Uploads both flag textures (RGBA8) and finishes the flag bind
   * group. `tex2` may repeat `tex1` for non-split flags.
   */
  upload_flag_textures(
    id: number,
    rgba_a: Uint8Array,
    w_a: number,
    h_a: number,
    rgba_b: Uint8Array,
    w_b: number,
    h_b: number
  ): void
  /**
   * Decodes an image (jpeg/png/webp) in Rust and binds it to a media
   * widget — decode runs in wasm, off the main thread, no
   * createImageBitmap round trip. Returns false on decode failure so
   * the bridge keeps the DOM <img> (manifest-gated fallback).
   */
  upload_media_image(id: number, bytes: Uint8Array): boolean
  /**
   * Writes the skeleton sheet — the per-rect vec4 fields the shader
   * loops (rects/meta/sbase/sink, `skeleton::RECT_FIELDS` per rect).
   */
  write_skel_sheet(id: number, values: Float32Array): void
}

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module

export interface InitOutput {
  readonly memory: WebAssembly.Memory
  readonly __wbg_overlay_free: (a: number, b: number) => void
  readonly overlay_burn_set_colors: (a: number, b: number, c: number, d: number) => void
  readonly overlay_burn_set_dir: (a: number, b: number, c: number) => void
  readonly overlay_burn_set_ink: (a: number, b: number, c: number, d: number) => void
  readonly overlay_burn_set_letters: (a: number, b: number, c: number, d: number) => void
  readonly overlay_burn_set_stage: (a: number, b: number, c: number, d: number) => void
  readonly overlay_frame: (a: number, b: number) => void
  readonly overlay_hover_group: (a: number) => number
  readonly overlay_init: (a: number, b: number) => number
  readonly overlay_input_buffer_ptr: (a: number) => number
  readonly overlay_input_meta_ptr: (a: number) => number
  readonly overlay_install_font: (a: number, b: number, c: number, d: number, e: number) => void
  readonly overlay_new: () => number
  readonly overlay_push_video_frame: (
    a: number,
    b: number,
    c: number,
    d: number,
    e: number,
    f: number
  ) => void
  readonly overlay_register_media: (a: number, b: number, c: number, d: number, e: number) => number
  readonly overlay_register_widget: (
    a: number,
    b: number,
    c: number,
    d: number,
    e: number,
    f: number
  ) => number
  readonly overlay_resize: (a: number, b: number, c: number) => void
  readonly overlay_set_css_size: (a: number, b: number, c: number) => void
  readonly overlay_set_text: (
    a: number,
    b: number,
    c: number,
    d: number,
    e: number,
    f: number,
    g: number,
    h: number,
    i: number,
    j: number,
    k: number,
    l: number,
    m: number,
    n: number,
    o: number,
    p: number,
    q: number,
    r: number
  ) => void
  readonly overlay_set_widget_rect: (
    a: number,
    b: number,
    c: number,
    d: number,
    e: number,
    f: number
  ) => void
  readonly overlay_set_widget_uniform: (a: number, b: number, c: number, d: number) => void
  readonly overlay_unregister_widget: (a: number, b: number) => void
  readonly overlay_upload_flag_textures: (
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
  readonly overlay_upload_media_image: (a: number, b: number, c: number, d: number) => number
  readonly overlay_write_skel_sheet: (a: number, b: number, c: number, d: number) => void
  readonly __wasm_bindgen_func_elem_7690: (a: number, b: number, c: number, d: number) => void
  readonly __wasm_bindgen_func_elem_7711: (a: number, b: number, c: number, d: number) => void
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
