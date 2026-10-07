[**luiskr.com**](../../../README.md)

---

[luiskr.com](../../../README.md) / [core/Component](../README.md) / ComponentState

```ts
type ComponentState = Record<string, any>
```

Defined in: [src/core/Component.ts:45](https://github.com/LuisKrotz/luiskr.com-V3/blob/214965eca24f91b1469ed21eb399bf941ad49ce0/src/core/Component.ts#L45)

Component state bag — keys are declared per-component and narrowed by
each subclass's own types; `any` is deliberate (unknown would force a
cast at every read site).
