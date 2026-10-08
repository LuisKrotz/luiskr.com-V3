[**luiskr.com**](../../../../README.md)

***

[luiskr.com](../../../../README.md) / [cms/media-convert/job](../README.md) / askNotifyPermission

```ts
function askNotifyPermission(): Promise<void>;
```

Defined in: [cms/media-convert/job.ts:164](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/cms/media-convert/job.ts#L164)

Requests Notification permission up front (during run()) so the
completion notification can fire later — no-op unless the permission
is still 'default' (never re-prompts a denied user).

## Returns

`Promise`\<`void`\>
