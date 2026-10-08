# `core/tokens/classes/docs.ts`

Docs-portal class tokens — BEM block `docs` + modifiers.

| | |
|---|---|
| **Source** | `src/core/tokens/classes/docs.ts` |
| **UX surface** | Shared primitives every surface builds on — no direct UI. |

## Members

### `DOCS_CLASSES`

Frozen docs class-name map — sole declaration site for these tokens;
consumers read members and never re-declare the strings
(zero-hardcoding rules 4–5). Object.freeze makes the token contract
immutable at runtime.
