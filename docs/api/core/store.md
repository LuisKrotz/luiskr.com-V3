# `core/store.ts`

Framework-free reactive state container (tiny pub/sub).

| | |
|---|---|
| **Source** | `src/core/store.ts` |
| **UX surface** | Shared primitives every surface builds on — no direct UI. |

## Members

### `commit`

Runs a named mutation then notifies subscribers — unless the mutation
explicitly returns false (its way of saying "no state change").

### `subscribe`

Subscribes to state changes.
- `@returns` unsubscribe function

### `notify`

Calls every subscriber; one throwing subscriber can't break the rest.
