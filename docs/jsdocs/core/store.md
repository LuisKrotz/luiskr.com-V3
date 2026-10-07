# `core/store.ts`

Framework-free reactive state container (tiny pub/sub).

| | |
|---|---|
| **Source** | `src/core/store.ts` |
| **UX surface** | Shared primitives every surface builds on — no direct UI. |

## Members

### (module scope)

StoreState re-export — canonical definition + docs live in ./store/state.js.

### `Store`

Reactive state container. Deliberately tiny: a Set of subscriber callbacks,
a state bag, a named-mutation map, and a getter facade. A Set (not Array)
gives O(1) unsubscribe and dedupes double-subscribe for free.

### `subscribers`

Live subscriber callbacks; invoked in insertion order by notify().

### `state`

The single mutable state bag — replaced by mutations, read via getters.

### `mutations`

name → mutator map built by createMutations(this) at construction.

### `getters`

Read facade — components read state exclusively through getters.

### `commit`

Runs a named mutation then notifies subscribers — unless the mutation
explicitly returns false (its way of saying "no state change"). Unknown
names warn through devlog instead of throwing so a typo in one component
can't crash an unrelated render pass.
- `@param` mutationName Key into MUTATIONS (token, not a literal).
- `@param` payload Optional value forwarded to the mutator.

### `subscribe`

Subscribes to state changes.
- `@param` listener Callback receiving the state bag on every notify().
- `@returns` unsubscribe function

### `notify`

Calls every subscriber; one throwing subscriber can't break the rest —
each call is try/catch'd and routed to devlog so a render bug in one
component doesn't starve the remaining subscribers of the update.

### `store`

The app-wide singleton store. Exported as both a named and default export —
both spellings appear across the module graph, so both are kept.
