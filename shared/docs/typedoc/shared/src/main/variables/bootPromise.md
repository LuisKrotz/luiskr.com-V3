[**luiskr.com**](../../../../README.md)

***

[luiskr.com](../../../../README.md) / [shared/src/main](../README.md) / bootPromise

```ts
const bootPromise: Promise<void>;
```

Defined in: [shared/src/main.ts:133](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/shared/src/main.ts#L133)

Boot promise — resolves once the full start sequence (Safari lazy chunk,
router init, mount/retry arming) has run. Tests await this so async boot
work never continues past a test boundary into a torn-down registry.
