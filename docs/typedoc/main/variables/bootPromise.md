[**luiskr.com**](../../README.md)

---

[luiskr.com](../../README.md) / [main](../README.md) / bootPromise

```ts
const bootPromise: Promise<void>
```

Defined in: [src/main.ts:133](https://github.com/LuisKrotz/luiskr.com-V3/blob/214965eca24f91b1469ed21eb399bf941ad49ce0/src/main.ts#L133)

Boot promise — resolves once the full start sequence (Safari lazy chunk,
router init, mount/retry arming) has run. Tests await this so async boot
work never continues past a test boundary into a torn-down registry.
