[**luiskr.com**](../../../../../README.md)

---

[luiskr.com](../../../../../README.md) / [components/media/draw-text/types](../README.md) / DrawTimer

```ts
type DrawTimer = ReturnType<typeof setTimeout> & object
```

Defined in: [src/components/media/draw-text/types.ts:33](https://github.com/LuisKrotz/luiskr.com-V3/blob/214965eca24f91b1469ed21eb399bf941ad49ce0/src/components/media/draw-text/types.ts#L33)

A setTimeout handle that may be Node's Timeout — `unref` exists only in
Node, so the intersection type keeps `.unref?.()` callable in workers/tests.

## Type Declaration

### unref?

```ts
optional unref?: () => void;
```

#### Returns

`void`
