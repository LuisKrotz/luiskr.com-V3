# `components/portfolio/related/data.ts`

| | |
|---|---|
| **Source** | `src/components/portfolio/related/data.ts` |
| **UX surface** | Related-projects strip on case-study pages. |

## Members

### `storedTranslations`

components/related translations from the store dictionary, if loaded.

### `fetchData`

Fires two SWR reads in parallel: the home page node (for the
portfoliolist used as the image/description join table) and the
components/related node (title, path, socials, project pointers).
A store hit resolves instantly; a miss round-trips Firebase.
