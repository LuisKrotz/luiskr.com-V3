# `cms/tokens/editors/about.ts`

About-editor classes + control IDs — paragraph lists,

| | |
|---|---|
| **Source** | `src/cms/tokens/editors/about.ts` |
| **UX surface** | Admin bundle — editors for every database node. |

## Members

### `CMS_ABOUT_CLASSES`

Frozen cms about class-name map — sole declaration site for these tokens; consumers read
members and never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes
the token contract immutable at runtime.

### `CMS_ABOUT_IDS`

Frozen cms about element-id map — sole declaration site for these tokens; consumers read
members and never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes
the token contract immutable at runtime.
