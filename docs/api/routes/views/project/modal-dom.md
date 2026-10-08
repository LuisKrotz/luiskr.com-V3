# `routes/views/project/modal-dom.tsx`

Imperative expand-modal sync for &lt;view-project&gt;: mirrors

| | |
|---|---|
| **Source** | `website/views/project/modal-dom.tsx` |
| **UX surface** | One page of the site per file — the URL the visitor lands on. |

## Members

### `updateModalDOM`

Store → DOM modal sync (open: pin page + mount media; close: restore).

### `onProjectStoreUpdate`

Store change → reload on locale switch, otherwise sync modal DOM.
