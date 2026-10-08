# `core/store/mutations.ts`

Mutation map factory — every named mutation is a pure

| | |
|---|---|
| **Source** | `src/core/store/mutations.ts` |
| **UX surface** | Shared primitives every surface builds on — no direct UI. |

## Members

### `createMutations`

Builds the mutation map bound to `store`. Domain groups are spread into
one flat map — key collisions would silently overwrite, so each group
owns a disjoint prefix of MUTATIONS by convention (theme.*, media.*, …).
- `@param` store The Store instance the mutators close over.
- `@returns` The composed MutationMap.
