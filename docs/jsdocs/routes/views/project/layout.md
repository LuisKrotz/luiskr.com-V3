# `routes/views/project/layout.ts`

Layout helpers for ViewProject — per-section height from the first media ratio, text stagger delays, and the landscape-group detector that forces carousel mode.

| | |
|---|---|
| **Source** | `src/routes/views/project/layout.ts` |
| **UX surface** | One page of the site per file — the URL the visitor lands on. |

## Members

### `sectionItemHeight`

The sectionItemHeight value.
- `@param` c — the component
- `@param` section — the value
- `@returns` string

### `textDelay`

The textDelay value.
- `@param` c — the component
- `@param` items — the items
- `@returns` number

### `textOffset`

The textOffset value.
- `@param` c — the component
- `@param` items — the items
- `@param` idx — the index
- `@returns` number

### `isLandscapeGroup`

Returns whether landscape group.
- `@param` c — the component
- `@param` group — the group
- `@returns` boolean
