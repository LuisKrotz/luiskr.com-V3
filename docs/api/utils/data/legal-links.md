# `utils/data/legal-links.ts`

Builds the bundled legal link list (home / privacy / GDPR /

| | |
|---|---|
| **Source** | `src/utils/data/legal-links.ts` |
| **UX surface** | Runtime services behind the scenes (WASM, GL, scroll, media). |

## Members

### (module scope)

A legal footer entry: localized path + human label.

### `getFallbackLegalLinks`

Gets fallback legal links.
- `@param` locale — the locale
- `@returns` LegalLink[]
