# `core/store/state.ts`

StoreState shape + initial-state factory — locale nodes,

| | |
|---|---|
| **Source** | `src/core/store/state.ts` |
| **UX surface** | Shared primitives every surface builds on — no direct UI. |

## Members

### (module scope)

Framework-free reactive state container — the app's single source of truth.
Components never read each other; they read `store.getters.*` / `store.state`
and react via `store.commit(MUTATIONS.X)` → `notify()` → every subscriber's
`onStoreUpdate`. That single fan-in/fan-out is what lets a nav button click
in one shadow root open a dialog owned by another.
