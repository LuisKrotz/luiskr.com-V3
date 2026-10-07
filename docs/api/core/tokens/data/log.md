# `core/tokens/data/log.ts`

Dev-log severity levels + the globalThis inspection key.

| | |
|---|---|
| **Source** | `src/core/tokens/data/log.ts` |
| **UX surface** | Shared primitives every surface builds on — no direct UI. |

## Members

### `LOG_LEVELS`

The LOG_LEVELS constant.

### `DEV_LOG`

The DEV_LOG constant — buffer sizing + the devtools inspection key.

### `MAX_ENTRIES`

Max retained entries — oldest entries drop off the front.

### `GLOBAL_KEY`

globalThis key exposing getDevLog() for devtools inspection.
