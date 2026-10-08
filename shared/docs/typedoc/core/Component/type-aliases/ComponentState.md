[**luiskr.com**](../../../README.md)

***

[luiskr.com](../../../README.md) / [core/Component](../README.md) / ComponentState

```ts
type ComponentState = Record<string, any>;
```

Defined in: [core/Component.ts:48](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/Component.ts#L48)

Component state bag — keys are declared per-component and narrowed by
each subclass's own types; `any` is deliberate (unknown would force a
cast at every read site).
