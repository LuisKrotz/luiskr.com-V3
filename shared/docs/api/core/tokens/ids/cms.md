# `core/tokens/ids/cms.ts`

CMS root mount id token — token group.

| | |
|---|---|
| **Source** | `src/core/tokens/ids/cms.ts` |
| **UX surface** | Shared primitives every surface builds on — no direct UI. |

## Members

### `CMS_IDS`

Frozen cms element-id map — sole declaration site for these tokens; consumers read members
and never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes the
token contract immutable at runtime.
