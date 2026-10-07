[**luiskr.com**](../../README.md)

---

[luiskr.com](../../README.md) / [main](../README.md) / bootPromise

```ts
const bootPromise: Promise<void>
```

Defined in: [src/main.ts:133](https://github.com/LuisKrotz/luiskr.com-V3/blob/dc19b98c416f1c06932286d4962b2322d8a9a425/src/main.ts#L133)

Boot promise — resolves once the full start sequence (Safari lazy chunk,
router init, mount/retry arming) has run. Tests await this so async boot
work never continues past a test boundary into a torn-down registry.
