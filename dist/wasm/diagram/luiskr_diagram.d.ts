/* tslint:disable */
/* eslint-disable */

/**
 * Renders a mermaid diagram source to an SVG string.
 *
 * `source` — the raw fence content (first word selects the family).
 * `theme_json` — `{"font": "...", "fontSize": 14, "fg": "#…", "bg":
 * "#…", "line": "#…", "accent": "#…"}` — the bridge maps live CSS
 * custom properties into this so diagrams follow the active theme.
 *
 * Returns `<svg …>…</svg>` or a `JsValue` error the caller shows as a
 * devWarn while restoring the source block (fail-soft contract).
 */
export function render_diagram(source: string, theme_json: string): string

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module

export interface InitOutput {
  readonly memory: WebAssembly.Memory
  readonly render_diagram: (a: number, b: number, c: number, d: number, e: number) => void
  readonly __wbindgen_add_to_stack_pointer: (a: number) => number
  readonly __wbindgen_export: (a: number, b: number) => number
  readonly __wbindgen_export2: (a: number, b: number, c: number, d: number) => number
  readonly __wbindgen_export3: (a: number, b: number, c: number) => void
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
