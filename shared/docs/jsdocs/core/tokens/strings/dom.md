# `core/tokens/strings/dom.ts`

DOM property/markup string tokens — grouped subset of

| | |
|---|---|
| **Source** | `src/core/tokens/strings/dom.ts` |
| **UX surface** | Shared primitives every surface builds on — no direct UI. |

## Members

### `DOM_STRINGS`

Frozen dom string map — sole declaration site for these tokens; consumers read members and
never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes the token
contract immutable at runtime.
