# `core/tokens/classes/playground.ts`

Earth/Space playground class tokens (`sp-*` block) —

| | |
|---|---|
| **Source** | `src/core/tokens/classes/playground.ts` |
| **UX surface** | Shared primitives every surface builds on — no direct UI. |

## Members

### `SP_CLASSES`

Frozen sp class-name map — sole declaration site for these tokens; consumers read members
and never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes the
token contract immutable at runtime.
