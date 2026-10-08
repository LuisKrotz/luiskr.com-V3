# `core/store/getters.ts`

Getter map factory — read-only accessors so the state

| | |
|---|---|
| **Source** | `src/core/store/getters.ts` |
| **UX surface** | Shared primitives every surface builds on — no direct UI. |

## Members

### `createGetters`

Builds the getter map bound to `store`. Each entry is a thin arrow over
`store.state` — evaluated lazily per call so subscribers always read the
post-mutation snapshot, never a captured copy.
- `@param` store The Store instance to read from.
- `@returns` The StoreGetters facade.
