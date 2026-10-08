# `core/tokens/data/notify.ts`

Toast severity levels — drives the `site-toast--&lt;type&gt;` BEM

| | |
|---|---|
| **Source** | `src/core/tokens/data/notify.ts` |
| **UX surface** | Shared primitives every surface builds on — no direct UI. |

## Members

### `NOTIFY_TYPES`

Toast severity tokens. ERROR intentionally aliases `WINDOW_EVENTS.ERROR`
so the 'error' literal stays single-declared — the toast modifier and the
window event name share one token source (zero-hardcoding).
