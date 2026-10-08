# `core/tokens/strings/net.ts`

Network/URL string tokens — token group.

| | |
|---|---|
| **Source** | `src/core/tokens/strings/net.ts` |
| **UX surface** | Shared primitives every surface builds on — no direct UI. |

## Members

### `NET_STRINGS`

Frozen net string map — sole declaration site for these tokens; consumers read members and
never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes the token
contract immutable at runtime.
