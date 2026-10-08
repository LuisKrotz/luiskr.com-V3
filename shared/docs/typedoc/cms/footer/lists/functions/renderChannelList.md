[**luiskr.com**](../../../../README.md)

***

[luiskr.com](../../../../README.md) / [cms/footer/lists](../README.md) / renderChannelList

```ts
function renderChannelList(
   host, 
   arr, 
   prefix, 
   addFn, 
   labelField?
): HTMLElement | DocumentFragment | SVGElement;
```

Defined in: [cms/footer/lists.ts:58](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/cms/footer/lists.ts#L58)

One editable channel list: label input + link/URL input + move/delete
controls per row. `prefix` namespaces every class (line1-*, legal-*,
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
