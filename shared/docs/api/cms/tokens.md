# `cms/tokens.ts`

CMS-restricted tokens, tags, classes, and actions.

| | |
|---|---|
| **Source** | `src/cms/tokens.ts` |
| **UX surface** | Admin bundle — editors for every database node. |

## Members

### `CMS_TABS`

Frozen cms map — sole declaration site for these tokens; consumers read members and never
re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes the token contract
immutable at runtime.

### `CMS_TAGS`

Frozen cms element tag-name map — sole declaration site for these tokens; consumers read
members and never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes
the token contract immutable at runtime.

### `CMS_EVENTS`

Frozen cms event-name map — sole declaration site for these tokens; consumers read members
and never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes the
token contract immutable at runtime.

### `CMS_ACTIONS`

data-action values for the list-item row controls.

### `CMS_LIST_PREFIXES`

Class-prefix conventions for the editable channel lists in the footer/about editors.

### `CMS_FIELD_KEYS`

Record field names the channel lists bind to (label prop varies per DB node).

### `CMS_LANG_NODES`

Frozen cms lang list — the ordered source for this token set.
