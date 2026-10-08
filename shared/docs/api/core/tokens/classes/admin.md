# `core/tokens/classes/admin.ts`

Admin login view class tokens — token group.

| | |
|---|---|
| **Source** | `src/core/tokens/classes/admin.ts` |
| **UX surface** | Shared primitives every surface builds on — no direct UI. |

## Members

### `ADMIN_CLASSES`

Admin-login view classes. The `ADMIN_*` entries compose the `admin` BEM
block; `GOOGLE_AUTH_BTN`/`GOOGLE_ICON` are standalone blocks (different
block prefix) since Google's sign-in widget styling is applied to those
nodes and must not inherit admin-* selectors.
