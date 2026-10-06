# `cms/about/types.ts`

| | |
|---|---|
| **Source** | `src/cms/about/types.ts` |
| **UX surface** | About-section editor card. |

## Members

### (module scope)

Email → Gravatar hash per Gravatar's spec: trim + lowercase, SHA-256,
hex string. crypto.subtle keeps the hash on the browser's crypto
engine — no hashing code or dependency needed.
