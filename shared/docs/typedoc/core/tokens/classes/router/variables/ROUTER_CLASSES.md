[**luiskr.com**](../../../../../README.md)

***

[luiskr.com](../../../../../README.md) / [core/tokens/classes/router](../README.md) / ROUTER\_CLASSES

```ts
const ROUTER_CLASSES: Readonly<{
  ROUTER_LINK_ACTIVE: "router-link-active";
  ROUTER_LINK_EXACT_ACTIVE: "router-link-exact-active";
}>;
```

Defined in: [core/tokens/classes/router.ts:13](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/tokens/classes/router.ts#L13)

Frozen router class-name map — sole declaration site for these tokens; consumers read
members and never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes
the token contract immutable at runtime.
