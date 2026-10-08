# `core/tokens/strings/input.ts`

Input-modality string tokens (pointer types, touch event

| | |
|---|---|
| **Source** | `src/core/tokens/strings/input.ts` |
| **UX surface** | Shared primitives every surface builds on — no direct UI. |

## Members

### `INPUT_STRINGS`

Frozen input string map — sole declaration site for these tokens; consumers read members
and never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes the
token contract immutable at runtime.
