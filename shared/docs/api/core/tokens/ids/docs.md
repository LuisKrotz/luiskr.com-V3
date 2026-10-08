# `core/tokens/ids/docs.ts`

Docs-portal element id tokens — grouped subset of IDS.

| | |
|---|---|
| **Source** | `src/core/tokens/ids/docs.ts` |
| **UX surface** | Shared primitives every surface builds on — no direct UI. |

## Members

### `DOCS_IDS`

Frozen docs element-id map — sole declaration site for these tokens;
consumers read members and never re-declare the strings
(zero-hardcoding rules 4–5). Object.freeze makes the token contract
immutable at runtime.
