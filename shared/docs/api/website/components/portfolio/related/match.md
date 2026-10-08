# `website/components/portfolio/related/match.ts`

| | |
|---|---|
| **Source** | `src/website/components/portfolio/related/match.ts` |
| **UX surface** | Boot surfaces: what the user sees first on each bundle. |

## Members

### `normalize`

Lowercases + strips non-alphanumerics — the matcher's normalization.

### `cleanLink`

Strips leading /projects/, /portfolio/ or lone slash plus a trailing slash — the DB mixes all three forms.

### `matches`

One related row vs one home item — the three acceptance rules.

### `buildProjectsList`

Maps the DB `related.projects` rows into display-ready cards.

URL build: [{locale}/]{basePath}/{cleanLink} — basePath may or may not
arrive slash-prefixed, so the pieces are joined defensively rather
than trusting CMS formatting.
