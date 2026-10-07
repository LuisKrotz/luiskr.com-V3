# `core/tokens/primitives.ts`

Primitive string tokens — typeof results, punctuation,

| | |
|---|---|
| **Source** | `src/core/tokens/primitives.ts` |
| **UX surface** | Shared primitives every surface builds on — no direct UI. |

## Members

### `MEDIA_QUERIES`

Frozen media media-query map — sole declaration site for these tokens; consumers read
members and never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes
the token contract immutable at runtime.

### `KEYS`

Frozen keys key map — sole declaration site for these tokens; consumers read members and
never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes the token
contract immutable at runtime.
