# `cms/footer/lists.ts`

| | |
|---|---|
| **Source** | `src/cms/footer/lists.ts` |
| **UX surface** | Footer + legal links editor card. |

## Members

### `addItem`

Appends an item to a channel list and re-renders.

### `removeItem`

Removes an item by index and re-renders.

### `moveItem`

Moves an item up/down within its list.

### `renderChannelList`

One editable channel list: label input + link/URL input + move/delete
controls per row. `prefix` namespaces every class (line1-*, legal-*,
social-*) so bindListEvents can bind by convention; `labelField`
picks which property holds the row label ('description' for contact
channels, 'page' for legal links, 'network' for socials) — matching
each DB shape exactly.

### `bindListEvents`

Wires add/remove/move/input handlers for a rendered list.
