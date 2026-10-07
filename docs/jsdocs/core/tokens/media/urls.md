# `core/tokens/media/urls.ts`

External base URLs split by function — grouped subsets of

| | |
|---|---|
| **Source** | `src/core/tokens/media/urls.ts` |
| **UX surface** | Shared primitives every surface builds on — no direct UI. |

## Members

### `CDN_URLS`

Frozen cdn URL map — sole declaration site for these tokens; consumers read members and
never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes the token
contract immutable at runtime.

### `SOCIAL_URLS`

Frozen social URL map — sole declaration site for these tokens; consumers read members and
never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes the token
contract immutable at runtime.
