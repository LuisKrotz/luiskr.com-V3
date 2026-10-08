# `cms/footer/CmsFooterEditor.tsx`

CMS footer editor: credit/source lines and the social/other

| | |
|---|---|
| **Source** | `src/cms/footer/CmsFooterEditor.tsx` |
| **UX surface** | Footer + legal links editor card. |

## Members

### `CmsFooterEditor`

The CmsFooterEditor — footer editor class.

### (module scope)

Lifecycle: loads footer data.

### (module scope)

Lifecycle: re-binds after render.

### `loadAllData`

Reads the footer nodes for the selected locale.

### `saveAll`

Writes the footer model back to Firebase.

### `syncLine1ToAllLangs`

Propagates the source/credit line to every locale.

### `syncSocialsToAllLangs`

Propagates the social-channel list to every locale.

### `_addItem`

Appends an item to a channel list and re-renders.

### `_removeItem`

Removes an item by index and re-renders.

### `_moveItem`

Moves an item up/down within its list.

### `_notify`

Fires a cms-notification toast.

### `_renderChannelList`

One editable channel list — see footer/lists.ts for the
prefix-namespaced row markup.

### `_bindListEvents`

Wires add/remove/move/input handlers for a rendered list.

### `_bindEvents`

Wires the whole form.

### (module scope)

JSX template.
