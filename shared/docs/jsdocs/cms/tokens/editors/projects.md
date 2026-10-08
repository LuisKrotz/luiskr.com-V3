# `cms/tokens/editors/projects.ts`

Projects-editor classes + control IDs — section cards,

| | |
|---|---|
| **Source** | `src/cms/tokens/editors/projects.ts` |
| **UX surface** | Admin bundle — editors for every database node. |

## Members

### `CMS_PROJECTS_CLASSES`

Frozen cms projects class-name map — sole declaration site for these tokens; consumers
read members and never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze
makes the token contract immutable at runtime.

### `CMS_PROJECTS_IDS`

Frozen cms projects element-id map — sole declaration site for these tokens; consumers
read members and never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze
makes the token contract immutable at runtime.
