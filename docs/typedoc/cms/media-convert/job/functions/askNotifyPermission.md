[**luiskr.com**](../../../../README.md)

---

[luiskr.com](../../../../README.md) / [cms/media-convert/job](../README.md) / askNotifyPermission

```ts
function askNotifyPermission(): Promise<void>
```

Defined in: [src/cms/media-convert/job.ts:164](https://github.com/LuisKrotz/luiskr.com-V3/blob/214965eca24f91b1469ed21eb399bf941ad49ce0/src/cms/media-convert/job.ts#L164)

Requests Notification permission up front (during run()) so the
completion notification can fire later — no-op unless the permission
is still 'default' (never re-prompts a denied user).

## Returns

`Promise`\<`void`\>
