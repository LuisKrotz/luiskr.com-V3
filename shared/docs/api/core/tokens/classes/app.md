# `core/tokens/classes/app.ts`

App shell class tokens — progress bar + view outlet. Grouped

| | |
|---|---|
| **Source** | `src/core/tokens/classes/app.ts` |
| **UX surface** | Shared primitives every surface builds on — no direct UI. |

## Members

### `APP_CLASSES`

Frozen app class-name map — sole declaration site for these tokens; consumers read members
and never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes the
token contract immutable at runtime.
