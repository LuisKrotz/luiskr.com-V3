[**luiskr.com**](../../../../../README.md)

***

[luiskr.com](../../../../../README.md) / [core/tokens/strings/css](../README.md) / CSS\_STRINGS

```ts
const CSS_STRINGS: Readonly<{
  CSS_VAR_PREFIX: "--";
  VAR_RADIUS_FULL: "var(--radius-full)";
  VAR_RADIUS_2XS: "var(--radius-2xs)";
  TOKEN_WORD: "word";
  TOKEN_SPACE: "space";
  TOKEN_BR: "br";
  TOKEN_TAG: "tag";
}>;
```

Defined in: [core/tokens/strings/css.ts:12](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/tokens/strings/css.ts#L12)

CSS-token string tokens (var() references, tokenizer kinds) Sole declaration site — consumers import members
from this frozen map rather than re-declaring the literals
(zero-hardcoding rule).
