# `shared/src/app/modal.ts`

Modal-state DOM sync for AppRoot — toggles modal-open on html/body, copies the modifier class onto the wrapper, and applies/restores the iOS fixed-position scroll lock.

| | |
|---|---|
| **Source** | `src/shared/src/app/modal.ts` |
| **UX surface** | Boot surfaces: what the user sees first on each bundle. |

## Members

### `updateAppModalState`

Updates app modal state.
- `@param` c — the component
