# `cms/tokens/fields/form.ts`

Form-field classes — field groups/rows, subsections, labels,

| | |
|---|---|
| **Source** | `src/cms/tokens/fields/form.ts` |
| **UX surface** | Admin bundle — editors for every database node. |

## Members

### `CMS_FORM_CLASSES`

Frozen cms form class-name map — sole declaration site for these tokens; consumers read
members and never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes
the token contract immutable at runtime.
