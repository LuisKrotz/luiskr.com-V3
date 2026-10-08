# `core/tokens/classes/toast.ts`

Site toast notification class tokens — grouped subset of

| | |
|---|---|
| **Source** | `src/core/tokens/classes/toast.ts` |
| **UX surface** | Shared primitives every surface builds on — no direct UI. |

## Members

### `TOAST_CLASSES`

Frozen toast class-name map — sole declaration site for these tokens; consumers read
members and never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes
the token contract immutable at runtime.
