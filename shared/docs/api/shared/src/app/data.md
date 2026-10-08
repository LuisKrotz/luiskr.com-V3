# `shared/src/app/data.ts`

Locale data loading for AppRoot — fetches the APP translation node per locale, fans it out to translations, and caches the loaded lang.

| | |
|---|---|
| **Source** | `src/shared/src/app/data.ts` |
| **UX surface** | Boot surfaces: what the user sees first on each bundle. |

## Members

### `loadAppData`

Loads app data.
- `@param` c — the component
