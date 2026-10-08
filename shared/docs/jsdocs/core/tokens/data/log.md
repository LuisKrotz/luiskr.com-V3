# `core/tokens/data/log.ts`

Dev-log severity levels + the globalThis inspection key.

| | |
|---|---|
| **Source** | `src/core/tokens/data/log.ts` |
| **UX surface** | Shared primitives every surface builds on — no direct UI. |

## Members

### `LOG_LEVELS`

Frozen log map — sole declaration site for these tokens; consumers read members and never
re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes the token contract
immutable at runtime.

### `DEV_LOG`

The DEV_LOG constant — buffer sizing + the devtools inspection key.

### `MAX_ENTRIES`

Max retained entries — oldest entries drop off the front.

### `GLOBAL_KEY`

globalThis key exposing getDevLog() for devtools inspection.
