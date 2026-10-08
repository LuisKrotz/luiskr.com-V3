[**luiskr.com**](../../../../README.md)

***

[luiskr.com](../../../../README.md) / [core/debug/params](../README.md) / runDebugActions

```ts
function runDebugActions(): void;
```

Defined in: [core/debug/params.ts:46](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/debug/params.ts#L46)

Runs the side-effecting debug flags once at boot. The toast test is async
(lazy <site-toast> chunk) — intentionally fire-and-forget so a slow chunk
load never blocks the app start.

## Returns

`void`
