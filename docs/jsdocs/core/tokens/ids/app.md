# `core/tokens/ids/app.ts`

App shell element id tokens — token group.

| | |
|---|---|
| **Source** | `src/core/tokens/ids/app.ts` |
| **UX surface** | Shared primitives every surface builds on — no direct UI. |

## Members

### `APP_IDS`

Frozen app element-id map — sole declaration site for these tokens; consumers read members
and never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes the
token contract immutable at runtime.
