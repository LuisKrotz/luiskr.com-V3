# `core/tokens/classes/flags.ts`

Language flag class tokens — token group.

| | |
|---|---|
| **Source** | `src/core/tokens/classes/flags.ts` |
| **UX surface** | Shared primitives every surface builds on — no direct UI. |

## Members

### `FLAG_CLASSES`

Language-flag classes — `flag-img`/`flag-split` for the SVG flag images,
`flag-canvas`/`flag-canvas--nav` for the WebGL/2D-drawn flag surfaces in
the locale picker. `_B_FLAG_CANVAS` is its own block so canvas variants
(nav vs dialog sizing) key off `--nav` modifiers.
