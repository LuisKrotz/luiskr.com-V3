[**luiskr.com**](../../../../../README.md)

***

[luiskr.com](../../../../../README.md) / [core/tokens/jsx/props](../README.md) / PROP\_ATTR\_MAP

```ts
const PROP_ATTR_MAP: Readonly<{
  playsInline: "playsinline";
  autoPlay: "autoplay";
  readOnly: "readonly";
  noValidate: "novalidate";
  htmlFor: "for";
  tabIndex: "tabindex";
  crossOrigin: "crossorigin";
}>;
```

Defined in: [core/tokens/jsx/props.ts:39](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/tokens/jsx/props.ts#L39)

camelCase JSX prop → lowercase HTML attribute spelling. The DOM accepts
only the lowercase form (`playsinline`, `readonly`, `tabindex`, `for`).
