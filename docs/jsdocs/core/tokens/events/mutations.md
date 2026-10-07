# `core/tokens/events/mutations.ts`

Store mutation identifier tokens — grouped subsets of

| | |
|---|---|
| **Source** | `src/core/tokens/events/mutations.ts` |
| **UX surface** | Shared primitives every surface builds on — no direct UI. |

## Members

### `LANG_MUTATIONS`

Frozen lang store-mutation name map — sole declaration site for these tokens; consumers
read members and never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze
makes the token contract immutable at runtime.

### `PREF_MUTATIONS`

Frozen pref store-mutation name map — sole declaration site for these tokens; consumers
read members and never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze
makes the token contract immutable at runtime.

### `DATA_MUTATIONS`

Frozen data store-mutation name map — sole declaration site for these tokens; consumers
read members and never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze
makes the token contract immutable at runtime.

### `UI_MUTATIONS`

Frozen ui store-mutation name map — sole declaration site for these tokens; consumers read
members and never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes
the token contract immutable at runtime.
