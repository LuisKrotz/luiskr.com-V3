[**luiskr.com**](../../README.md)

---

[luiskr.com](../../README.md) / [registerServiceWorker](../README.md) / registerServiceWorker

```ts
function registerServiceWorker(env): void
```

Defined in: [src/registerServiceWorker.ts:18](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/registerServiceWorker.ts#L18)

Registers `<base>service-worker.js` on window load when `env.PROD` is set.
Exported (and env-injected) so the prod-only branch is exercisable in
tests — `import.meta.env` does not exist outside Vite.

## Parameters

### env

Vite env object ({PROD, BASE_URL})

#### PROD?

`boolean`

#### BASE_URL?

`string`

## Returns

`void`
