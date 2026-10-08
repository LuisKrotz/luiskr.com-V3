# `core/tokens/data/cms-keys.ts`

CMS/Firebase node-key tokens — keys used to read the

| | |
|---|---|
| **Source** | `src/core/tokens/data/cms-keys.ts` |
| **UX surface** | Shared primitives every surface builds on — no direct UI. |

## Members

### `CMS_KEYS`

Frozen cms key map — sole declaration site for these tokens; consumers read members and
never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes the token
contract immutable at runtime.
