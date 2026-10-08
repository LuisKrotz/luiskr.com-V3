# `core/tokens/playground/params.ts`

`data-param` values on playground sliders/checkboxes split by

| | |
|---|---|
| **Source** | `src/core/tokens/playground/params.ts` |
| **UX surface** | Shared primitives every surface builds on — no direct UI. |

## Members

### `SP_SCENE_PARAMS`

Frozen sp scene parameter map — sole declaration site for these tokens; consumers read
members and never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes
the token contract immutable at runtime.

### `SP_POST_PARAMS`

Frozen sp post parameter map — sole declaration site for these tokens; consumers read
members and never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes
the token contract immutable at runtime.

### `SP_GRADE_PARAMS`

Frozen sp grade parameter map — sole declaration site for these tokens; consumers read
members and never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes
the token contract immutable at runtime.

### `SP_DEBUG_PARAMS`

Frozen sp debug parameter map — sole declaration site for these tokens; consumers read
members and never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes
the token contract immutable at runtime.
