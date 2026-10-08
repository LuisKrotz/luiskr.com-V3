# `website/components/portfolio/related/types.ts`

| | |
|---|---|
| **Source** | `src/website/components/portfolio/related/types.ts` |
| **UX surface** | Boot surfaces: what the user sees first on each bundle. |

## Members

### (module scope)

A related-projects pointer row — `link`/`page` identify the target,
`featured` promotes it visually; `title`/`image`/`description` are hydrated from
the home portfoliolist since the related node stores pointers only.

### (module scope)

A social row in the related footer — `network` names the service
(icon lookup key), `link` is the profile URL.

### (module scope)

The components/related DB node as consumed by <portfolio-related> —
`projects` may arrive keyed-object or array from Firebase, `path` is the
portfolio base route, `socials`/`note`/`title` the footer copy.

### (module scope)

A home portfoliolist row used to hydrate related pointers — `link` is the
join key, `image`/`label`/`title`/`description` fill the card.

### (module scope)

The resolved display card — every field concrete (no optionals) because
hydration already merged the pointer row with its home-list data. `fullPath` is
the computed route to the project page.
