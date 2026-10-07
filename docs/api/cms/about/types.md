# `cms/about/types.ts`

| | |
|---|---|
| **Source** | `src/cms/about/types.ts` |
| **UX surface** | About-section editor card. |

## Members

### `SIZE_PRESETS`

The SIZE_PRESETS constant.
- `@param` 200 — the value
- `@param` 256 — the value
- `@param` 300 — the value
- `@param` 400 — the value
- `@param` 512 — the value

### (module scope)

Type contract for mention item.

### (module scope)

The AboutData value.

### (module scope)

The BioColumn value.

### (module scope)

Email → Gravatar hash per Gravatar's spec: trim + lowercase, SHA-256,
hex string. crypto.subtle keeps the hash on the browser's crypto
engine — no hashing code or dependency needed.
