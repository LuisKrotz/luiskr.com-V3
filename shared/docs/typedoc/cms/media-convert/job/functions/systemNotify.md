[**luiskr.com**](../../../../README.md)

***

[luiskr.com](../../../../README.md) / [cms/media-convert/job](../README.md) / systemNotify

```ts
function systemNotify(title, body): void;
```

Defined in: [cms/media-convert/job.ts:148](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/cms/media-convert/job.ts#L148)

Fires an OS-level Notification when permission is already granted —
silent no-op otherwise (the in-app toast always runs too, so this is a
progressive enhancement for backgrounded tabs).

## Parameters

### title

`string`

Notification title.

### body

`string`

Notification body text.

## Returns

`void`
