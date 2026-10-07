# `cms/tokens/fields/media.ts`

Media-converter classes + control IDs — dropzone state,

| | |
|---|---|
| **Source** | `src/cms/tokens/fields/media.ts` |
| **UX surface** | Admin bundle — editors for every database node. |

## Members

### `CMS_MEDIA_CLASSES`

Frozen cms media class-name map — sole declaration site for these tokens; consumers read
members and never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes
the token contract immutable at runtime.

### `CMS_MEDIA_IDS`

Frozen cms media element-id map — sole declaration site for these tokens; consumers read
members and never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes
the token contract immutable at runtime.
