# `core/utils/string.ts`

Small pure string transforms — HTML stripping for

| | |
|---|---|
| **Source** | `src/core/utils/string.ts` |
| **UX surface** | Shared primitives every surface builds on — no direct UI. |

## Members

### `stripHtml`

Strips HTML tags iteratively to prevent malformed or nested tags from leaking.
A single `replace(/<[^>]*>/)` pass can leave a reconstructed tag behind
(input like `<scr<script>ipt>` collapses into `<script>`), so the loop
re-runs until the string is stable — this is the classic "iterated
sanitization" defense: each pass may expose a tag assembled from
fragments of the previous pass.
Pure ESM utility function, tree-shakeable.
- `@param` str Raw markup-bearing text.
- `@returns` Text with every `<…>` span removed.

### `escapeHtml`

Escapes HTML-significant characters for safe insertion into innerHTML or
double-quoted attributes. `&` must be replaced first so the entities
emitted by the later replacements are not double-escaped.
Pure ESM utility function, tree-shakeable.
- `@param` {string} str — raw text that may contain &, <, >, ", '
- `@returns` {string} entity-escaped text safe for markup contexts

### `slugify`

Converts a string into a clean, URL-safe and DOM-id-safe slug.
Pipeline: lowercase → drop non-word/non-space/non-dash chars → collapse
whitespace+underscores to `-` → collapse consecutive dashes. e.g.
"METCHA — Leather!" → "metcha-leather". `\w` is ASCII-only
([a-z0-9_]) — accented characters are dropped, which intentionally
mirrors the ASCII-folded LANG_SLUGS convention for URL safety.
- `@param` text Display text to slug.
- `@returns` URL/id-safe slug, or '' for non-string input.
