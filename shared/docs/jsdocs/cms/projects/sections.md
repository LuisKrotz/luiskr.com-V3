# `cms/projects/sections.ts`

| | |
|---|---|
| **Source** | `src/cms/projects/sections.ts` |
| **UX surface** | Per-project sections editor card. |

## Members

### `normalizeSection`

Normalizes section.
- `@param` s — the source value
- `@returns` CmsSection

### `ensureSectionShape`

Ensures section shape.
- `@param` host — the host component
- `@param` sIdx — the value

### `addSection`

Adds section.
- `@param` host — the host component

### `removeSection`

Removes section.
- `@param` host — the host component
- `@param` sIdx — the value

### `moveSection`

Moves section.
- `@param` host — the host component
- `@param` sIdx — the value
- `@param` dir — the value

### `addSectionText`

Adds section text.
- `@param` host — the host component
- `@param` sIdx — the value

### `removeSectionText`

Removes section text.
- `@param` host — the host component
- `@param` sIdx — the value
- `@param` tIdx — the value

### `addSectionMedia`

Adds section media.
- `@param` host — the host component
- `@param` sIdx — the value

### `removeSectionMedia`

Removes section media.
- `@param` host — the host component
- `@param` sIdx — the value
- `@param` mIdx — the value
