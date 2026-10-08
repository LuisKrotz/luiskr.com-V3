# `website/components/home/awards/data.ts`

Data helpers for &lt;awards-mentions&gt;: the legal-links list

| | |
|---|---|
| **Source** | `src/website/components/home/awards/data.ts` |
| **UX surface** | Boot surfaces: what the user sees first on each bundle. |

## Members

### (module scope)

A CMS-stored link row — both fields optional at the data boundary.

### (module scope)

Destination URL/path.

### (module scope)

Page name the link points at (used for the visible label).

### (module scope)

A validated legal link — both fields proven present by the filter.

### `link`

Destination path (e.g. '/en/legal/privacy').

### `page`

Page key used for the localized label.

### `HAS_LINK`

Bare locale-root matcher ('/', '/en/', '/pt/') — the CMS stores the home
link in the same list, but the footer must only show real legal pages.

### `legalLinks`

Legal-page links for the footer row — CMS `legal-footer` list preferred,
bundled per-locale fallback when empty. Both lists are filtered through
HAS_LINK so a bare locale-root row (the stored home link) never renders.
- `@returns` Validated {link, page} rows.

### `ensureAwardsData`

Loads the components dictionary node for the current locale when missing
(stale-while-revalidate) — commits SET_COMPONENT_LANG so the footer
links/mentions re-render once the snapshot lands.
- `@param` _el The AwardsMentions element (unused — data flows via the store).
