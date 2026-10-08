# `shared/src/app/types.ts`

Shared structural types for the App shell — the APP

| | |
|---|---|
| **Source** | `src/shared/src/app/types.ts` |
| **UX surface** | Boot surfaces: what the user sees first on each bundle. |

## Members

### (module scope)

Shape of the translations/<locale>/APP dictionary node.

### (module scope)

<app-nav> reached through the shell — translations prop + scroll-state setter.

### (module scope)

<cookie-banner> reached through the shell — only the translations prop is used.

### (module scope)

<preferences-modal> reached through the shell — `pref` node + open flag.

### (module scope)

<lang-dialog> reached through the shell — only the open flag is driven.

### (module scope)

A mounted view element that may implement onRouteParamChange — the
outlet calls it when a same-tag route updates params (project→project
navigation reuses the element).
