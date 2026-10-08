# `core/tokens/playground.ts`

Playground-scoped registries — Space/Earth Playground action

| | |
|---|---|
| **Source** | `src/core/tokens/playground.ts` |
| **UX surface** | Shared primitives every surface builds on — no direct UI. |

## Members

### `DEFAULT_SP_GUI`

Engine start state for the Earth Playground — the hardcoded baseline the
scene boots with before any CMS `defaults` node or user localStorage
overrides merge in. Values were hand-tuned visually; each block maps to
one `earth-background.js` subsystem (post-fx chain, moon orbit, sun,
atmosphere scattering, ocean BRDF, camera orbit).
