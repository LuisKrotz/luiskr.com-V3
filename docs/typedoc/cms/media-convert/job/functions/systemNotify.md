[**luiskr.com**](../../../../README.md)

---

[luiskr.com](../../../../README.md) / [cms/media-convert/job](../README.md) / systemNotify

```ts
function systemNotify(title, body): void
```

Defined in: [src/cms/media-convert/job.ts:148](https://github.com/LuisKrotz/luiskr.com-V3/blob/214965eca24f91b1469ed21eb399bf941ad49ce0/src/cms/media-convert/job.ts#L148)

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
