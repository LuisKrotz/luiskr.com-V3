# `core/tokens/strings/text.ts`

Non-localized UI text tokens (units, dev-facing labels) —

| | |
|---|---|
| **Source** | `src/core/tokens/strings/text.ts` |
| **UX surface** | Shared primitives every surface builds on — no direct UI. |

## Members

### `LABEL_TEXT`

labels text.

### `UNIT_TEXT`

Frozen unit UI text map — sole declaration site for these tokens; consumers read members
and never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes the
token contract immutable at runtime.
