# `core/tokens/ids/dialogs.ts`

Dialog title id tokens (aria-labelledby targets) — grouped

| | |
|---|---|
| **Source** | `src/core/tokens/ids/dialogs.ts` |
| **UX surface** | Shared primitives every surface builds on — no direct UI. |

## Members

### `DIALOG_IDS`

Frozen dialog element-id map — sole declaration site for these tokens; consumers read
members and never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes
the token contract immutable at runtime.
