# `core/tokens/motion/notify.ts`

Notification/toast runtime tuning tokens.

| | |
|---|---|
| **Source** | `src/core/tokens/motion/notify.ts` |
| **UX surface** | Shared primitives every surface builds on — no direct UI. |

## Members

### `TOAST_DURATION`

Default auto-dismiss for a toast item (ms)

### `MAX_VISIBLE`

Max simultaneously visible toasts — oldest evicted first

### `DEDUPE_MS`

Re-show window for identical type+message pairs (ms)

### `DEDUPE_CACHE_MAX`

Cap on the dedupe registry before oldest entries are pruned
