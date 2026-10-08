# `website/tests/components/feedback/site-toast-sitetoast-placement-contract.test.js`

Split from site-toast.test.js — covers the "SiteToast placement contract" describe.

| | |
|---|---|
| **Source** | `src/website/tests/components/feedback/site-toast-sitetoast-placement-contract.test.js` |
| **UX surface** | Boot surfaces: what the user sees first on each bundle. |

## Members

### `_loadNotify`

Fresh notify module (fresh _seen/_toastEl/_globalBound state) per call.

### `_mountToast`

Mounts a toast element, returning it.
