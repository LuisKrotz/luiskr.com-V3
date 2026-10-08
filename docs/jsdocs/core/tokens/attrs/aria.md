# `core/tokens/attrs/aria.ts`

ARIA attribute + role-value tokens — token group.

| | |
|---|---|
| **Source** | `src/core/tokens/attrs/aria.ts` |
| **UX surface** | Shared primitives every surface builds on — no direct UI. |

## Members

### `ARIA_ATTRS`

Frozen aria attribute-name map — sole declaration site for these tokens; consumers read
members and never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes
the token contract immutable at runtime.

### `ROLE_TREE`

`tree`/`treeitem`/`none` — the ARIA treeview contract for the docs nav.
