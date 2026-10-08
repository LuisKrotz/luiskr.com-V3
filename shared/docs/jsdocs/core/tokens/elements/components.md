# `core/tokens/elements/components.ts`

Component custom-element tag tokens — grouped subset of

| | |
|---|---|
| **Source** | `src/core/tokens/elements/components.ts` |
| **UX surface** | Shared primitives every surface builds on — no direct UI. |

## Members

### `COMPONENT_TAGS`

Frozen component element tag-name map — sole declaration site for these tokens; consumers
read members and never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze
makes the token contract immutable at runtime.
