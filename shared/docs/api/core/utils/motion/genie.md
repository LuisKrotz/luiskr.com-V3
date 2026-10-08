# `core/utils/motion/genie.ts`

"Genie" dialog transition shared by the preferences modal and

| | |
|---|---|
| **Source** | `src/core/utils/motion/genie.ts` |
| **UX surface** | Shared primitives every surface builds on — no direct UI. |

## Members

### (module scope)

Any component exposing the shadow-scoped `$` selector helper.

### `genieEnter`

Genie open/close shared by the preferences and language dialogs.
The dialog scales from the control that opened it (store.modalOrigin) and
zooms back into it on close. Honors reduced motion (instant).

### `genieLeave`

Plays the collapse-back-to-origin animation, then runs done() so the
caller can finish unmounting. Instant (done() immediately) under reduced
motion or when the backdrop isn't in the DOM.
