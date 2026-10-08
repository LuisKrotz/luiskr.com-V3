[**luiskr.com**](../../../../README.md)

***

[luiskr.com](../../../../README.md) / [cms/footer/lists](../README.md) / bindListEvents

```ts
function bindListEvents(
   host, 
   prefix, 
   arr, 
   labelField?
): void;
```

Defined in: [cms/footer/lists.ts:135](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/cms/footer/lists.ts#L135)

Wires add/remove/move/input handlers for a rendered list.

## Parameters

### host

[`CmsFooterEditor`](../../CmsFooterEditor/classes/CmsFooterEditor.md)

### prefix

`string`

### arr

[`FooterChannel`](../../types/interfaces/FooterChannel.md)[]

### labelField?

`string` = `CMS_FIELD_KEYS.DESCRIPTION`

## Returns

`void`
