[**luiskr.com**](../../../../../README.md)

***

[luiskr.com](../../../../../README.md) / [core/tokens/strings/dom](../README.md) / DOM\_STRINGS

```ts
const DOM_STRINGS: Readonly<{
  CLASS: "class";
  CLASS_NAME: "className";
  ID: "id";
  SRC: "src";
  HREF: "href";
  ALT: "alt";
  TYPE: "type";
  NAME: "name";
  VALUE: "value";
  REL: "rel";
  REL_CANONICAL: "canonical";
  REL_PREFETCH: "prefetch";
  BLANK: "_blank";
  NOOPENER: "noopener noreferrer";
  DATA_ROUTE: "data-route";
  A_TAG: "a";
  BR_TAG: "<br>";
}>;
```

Defined in: [core/tokens/strings/dom.ts:14](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/tokens/strings/dom.ts#L14)

Frozen dom string map — sole declaration site for these tokens; consumers read members and
never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes the token
contract immutable at runtime.
