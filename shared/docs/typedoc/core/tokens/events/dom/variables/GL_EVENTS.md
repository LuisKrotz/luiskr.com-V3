[**luiskr.com**](../../../../../README.md)

***

[luiskr.com](../../../../../README.md) / [core/tokens/events/dom](../README.md) / GL\_EVENTS

```ts
const GL_EVENTS: Readonly<{
  WEBGL_CONTEXT_LOST: "webglcontextlost";
  WEBGL_CONTEXT_RESTORED: "webglcontextrestored";
}>;
```

Defined in: [core/tokens/events/dom.ts:137](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/tokens/events/dom.ts#L137)

Frozen gl event-name map — sole declaration site for these tokens; consumers read members
and never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes the
token contract immutable at runtime.
