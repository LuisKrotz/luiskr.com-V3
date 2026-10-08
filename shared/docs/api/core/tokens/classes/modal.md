# `core/tokens/classes/modal.ts`

Generic modal + media expand-modal class tokens — grouped

| | |
|---|---|
| **Source** | `src/core/tokens/classes/modal.ts` |
| **UX surface** | Shared primitives every surface builds on — no direct UI. |

## Members

### `MODAL_CLASSES`

Frozen modal class-name map — sole declaration site for these tokens; consumers read
members and never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes
the token contract immutable at runtime.

### `EXPAND_MODAL_CLASSES`

expands modal classes.
