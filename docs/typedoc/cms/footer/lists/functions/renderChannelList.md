[**luiskr.com**](../../../../README.md)

---

[luiskr.com](../../../../README.md) / [cms/footer/lists](../README.md) / renderChannelList

```ts
function renderChannelList(
  host,
  arr,
  prefix,
  addFn,
  labelField?
): HTMLElement | DocumentFragment | SVGElement
```

Defined in: [cms/footer/lists.ts:58](https://github.com/LuisKrotz/luiskr.com-V3/blob/214965eca24f91b1469ed21eb399bf941ad49ce0/cms/footer/lists.ts#L58)

One editable channel list: label input + link/URL input + move/delete
controls per row. `prefix` namespaces every class (line1-_, legal-_,
social-*) so bindListEvents can bind by convention; `labelField`
picks which property holds the row label ('description' for contact
channels, 'page' for legal links, 'network' for socials) — matching
each DB shape exactly.

## Parameters

### host

[`CmsFooterEditor`](../../CmsFooterEditor/classes/CmsFooterEditor.md)

### arr

[`FooterChannel`](../../types/interfaces/FooterChannel.md)[]

### prefix

`string`

### addFn

`string`

### labelField?

`string` = `CMS_FIELD_KEYS.DESCRIPTION`

## Returns

`HTMLElement` \| `DocumentFragment` \| `SVGElement`
