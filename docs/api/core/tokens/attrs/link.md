# `core/tokens/attrs/link.ts`

Anchor/link attribute tokens — token group. The `href`

| | |
|---|---|
| **Source** | `src/core/tokens/attrs/link.ts` |
| **UX surface** | Shared primitives every surface builds on — no direct UI. |

## Members

### `HREF`

`href` — link target; read by predictive-loader and link builders.

### `TARGET`

`target` — browsing context (`_blank` for external links).

### `REL`

`rel` — link relationship (`noopener`/`noreferrer` on external links per MDN: window.opener exposure otherwise).
