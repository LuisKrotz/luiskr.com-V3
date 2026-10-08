# `core/tokens/strings/auth.ts`

Firebase Auth error-code string tokens — token group.

| | |
|---|---|
| **Source** | `src/core/tokens/strings/auth.ts` |
| **UX surface** | Shared primitives every surface builds on — no direct UI. |

## Members

### `AUTH_REDIRECT_FALLBACK_CODES`

Codes where the popup handshake cannot run in the current browser
environment (popup blockers, COOP window.closed blocking, partitioned
storage, unsupported contexts) — these retry via signInWithRedirect.
User-cancellation codes are deliberately excluded.
