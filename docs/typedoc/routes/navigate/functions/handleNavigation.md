[**luiskr.com**](../../../README.md)

---

[luiskr.com](../../../README.md) / [routes/navigate](../README.md) / handleNavigation

```ts
function handleNavigation(host, path, replace?): Promise<void>
```

Defined in: [src/routes/navigate.ts:129](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/routes/navigate.ts#L129)

Full navigation pipeline — the space-playground chunk is preloaded
when navigated to, since it's excluded from the idle route warmer
for size.

## Parameters

### host

[`Router`](../../router/classes/Router.md)

### path

`string`

### replace?

`boolean` = `false`

## Returns

`Promise`\<`void`\>
