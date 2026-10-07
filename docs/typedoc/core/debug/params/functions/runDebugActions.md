[**luiskr.com**](../../../../README.md)

---

[luiskr.com](../../../../README.md) / [core/debug/params](../README.md) / runDebugActions

```ts
function runDebugActions(): void
```

Defined in: [src/core/debug/params.ts:37](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/core/debug/params.ts#L37)

Runs the side-effecting debug flags once at boot. The toast test is async
(lazy <site-toast> chunk) — intentionally fire-and-forget so a slow chunk
load never blocks the app start.

## Returns

`void`
