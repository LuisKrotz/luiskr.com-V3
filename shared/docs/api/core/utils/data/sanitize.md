# `core/utils/data/sanitize.ts`

| | |
|---|---|
| **Source** | `src/core/utils/data/sanitize.ts` |
| **UX surface** | Shared primitives every surface builds on — no direct UI. |

## Members

### `ALLOWED_TAGS`

Elements whose tag name is allowed to remain in the output

### `ALLOWED_ATTRS`

Attributes that are safe when applied to allowed tags

### `sanitizeHtml`

Sanitize an HTML string, preserving allowed tags and attributes only.
- `@param` {string} html - Raw HTML string (possibly from CMS / i18n store).
- `@returns` {string} Safe HTML string ready for use in innerHTML.

### `sanitizeNode`

Recursively walk a DOM node, removing disallowed elements and attributes.
Disallowed elements are replaced with their text content.
- `@param` node - DOM node to scrub in place
