[**luiskr.com**](../../../../../README.md)

***

[luiskr.com](../../../../../README.md) / [core/tokens/strings/types](../README.md) / TYPE\_STRINGS

```ts
const TYPE_STRINGS: Readonly<{
  UNDEFINED: "undefined";
  FUNCTION: "function";
  OBJECT: "object";
  STRING: "string";
  BOOLEAN: "boolean";
  NUMBER: "number";
}>;
```

Defined in: [core/tokens/strings/types.ts:11](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/tokens/strings/types.ts#L11)

`typeof` result string tokens. Sole declaration site — consumers import members
from this frozen map rather than re-declaring the literals
(zero-hardcoding rule).
