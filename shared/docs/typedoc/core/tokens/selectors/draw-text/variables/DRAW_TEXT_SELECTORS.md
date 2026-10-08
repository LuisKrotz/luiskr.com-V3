[**luiskr.com**](../../../../../README.md)

***

[luiskr.com](../../../../../README.md) / [core/tokens/selectors/draw-text](../README.md) / DRAW\_TEXT\_SELECTORS

```ts
const DRAW_TEXT_SELECTORS: Readonly<{
  DRAW_TEXT: ".draw-text";
  DRAW_TEXT_WORD: ".draw-text__word";
  DRAW_TEXT_CHAR: ".draw-text__char";
  DRAW_TEXT_SPACE: ".draw-text__space";
}>;
```

Defined in: [core/tokens/selectors/draw-text.ts:14](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/tokens/selectors/draw-text.ts#L14)

Selector strings for the draw-text surface — the component root plus
the word/char/space spans the stagger animation targets. Composed from
the class tokens so selectors stay correct if a class name changes.
