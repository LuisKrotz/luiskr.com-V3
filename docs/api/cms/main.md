# `cms/main.ts`

CMS bundle entry — completely separate from the public site

| | |
|---|---|
| **Source** | `src/cms/main.ts` |
| **UX surface** | Admin bundle — editors for every database node. |

## Members

### `mountView`

Swaps the CMS root's child for the given element tag (idempotent).

### (module scope)

Boots the CMS: first auth callback decides the initial view.
