[**luiskr.com**](../../../README.md)

***

[luiskr.com](../../../README.md) / [cms/tokens](../README.md) / CMS\_EVENTS

```ts
const CMS_EVENTS: Readonly<{
  NOTIFY: "notify";
  AUTH_CHANGED: "cms-auth-changed";
}>;
```

Defined in: [cms/tokens.ts:60](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/cms/tokens.ts#L60)

Frozen cms event-name map — sole declaration site for these tokens; consumers read members
and never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes the
token contract immutable at runtime.
