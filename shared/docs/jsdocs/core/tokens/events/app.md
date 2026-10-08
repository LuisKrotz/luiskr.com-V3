# `core/tokens/events/app.ts`

Custom application event-name tokens — grouped subset of

| | |
|---|---|
| **Source** | `src/core/tokens/events/app.ts` |
| **UX surface** | Shared primitives every surface builds on — no direct UI. |

## Members

### `APP_EVENTS`

Frozen app event-name map — sole declaration site for these tokens; consumers read members
and never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes the
token contract immutable at runtime.
