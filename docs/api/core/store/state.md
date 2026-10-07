# `core/store/state.ts`

StoreState shape + initial-state factory — locale nodes,

| | |
|---|---|
| **Source** | `src/core/store/state.ts` |
| **UX surface** | Shared primitives every surface builds on — no direct UI. |

## Members

### (module scope)

The ActionTextMap value.

### (module scope)

The LangState value.

### (module scope)

The MentionsState value.

### (module scope)

The ModalMedia value.

### (module scope)

The ModalObject value.

### (module scope)

pages pos.

### (module scope)

The StoreState value.

### (module scope)

The Mutation value.
- `@param` _payload — the value

### (module scope)

Type contract for mutation map.

### (module scope)

subscribers.
- `@param` _state — the value

### (module scope)

Type contract for store getters.

### (module scope)

Framework-free reactive state container — the app's single source of truth.
Components never read each other; they read `store.getters.*` / `store.state`
and react via `store.commit(MUTATIONS.X)` → `notify()` → every subscriber's
`onStoreUpdate`. That single fan-in/fan-out is what lets a nav button click
in one shadow root open a dialog owned by another.
