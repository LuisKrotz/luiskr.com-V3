# `core/tokens/elements/html.ts`

Native HTML tag-name tokens — token group.

| | |
|---|---|
| **Source** | `src/core/tokens/elements/html.ts` |
| **UX surface** | Shared primitives every surface builds on — no direct UI. |

## Members

### `HTML_TAGS`

Frozen html element tag-name map — sole declaration site for these tokens; consumers read
members and never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes
the token contract immutable at runtime.
