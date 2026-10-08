[**luiskr.com**](../../../../README.md)

***

[luiskr.com](../../../../README.md) / [experiments/docs/copy-guard](../README.md) / attachCopyGuard

```ts
function attachCopyGuard(
   root, 
   isProtected, 
   getPath, 
   toastText
): GuardDisposer;
```

Defined in: [experiments/docs/copy-guard.ts:64](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/experiments/docs/copy-guard.ts#L64)

Wires every guard listener onto `root` (typically the viewer container
or the component shadow root). `isProtected` gates interception so the
guard only bites while a protected page (source-code file) is open —
normal browsing of docs/reports keeps full clipboard freedom.

## Parameters

### root

`HTMLElement` \| `ShadowRoot`

Element/ShadowRoot to attach to.

### isProtected

() => `boolean`

Whether the current view is guarded right now.

### getPath

() => `string`

Returns the current docs path for telemetry.

### toastText

() => `string`

Localized toast message getter.

## Returns

[`GuardDisposer`](../type-aliases/GuardDisposer.md)

Disposer removing every listener.
