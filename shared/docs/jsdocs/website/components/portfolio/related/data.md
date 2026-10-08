# `website/components/portfolio/related/data.ts`

| | |
|---|---|
| **Source** | `src/website/components/portfolio/related/data.ts` |
| **UX surface** | Boot surfaces: what the user sees first on each bundle. |

## Members

### `storedTranslations`

components/related translations from the store dictionary, if loaded.

### `fetchData`

Fires two SWR reads in parallel: the home page node (for the
portfoliolist used as the image/description join table) and the
components/related node (title, path, socials, project pointers).
A store hit resolves instantly; a miss round-trips Firebase.
