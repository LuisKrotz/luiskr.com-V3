[**luiskr.com**](../../../../../README.md)

***

[luiskr.com](../../../../../README.md) / [core/tokens/elements/html](../README.md) / HTML\_TAGS

```ts
const HTML_TAGS: Readonly<{
  FIGURE: "figure";
  VIDEO: "video";
  IMG: "img";
  IFRAME: "iframe";
  BUTTON: "button";
  LINK: "link";
  META: "meta";
  STYLE: "style";
  DIV: "div";
  SPAN: "span";
  A: "a";
  P: "p";
  CANVAS: "canvas";
  SELECT: "select";
  OPTION: "option";
  INPUT: "input";
  TEXTAREA: "textarea";
  LABEL: "label";
  H2: "h2";
  H3: "h3";
  NAV: "nav";
  ASIDE: "aside";
  HEADER: "header";
  MAIN: "main";
  DIALOG: "dialog";
  TITLE: "title";
  H1: "h1";
}>;
```

Defined in: [core/tokens/elements/html.ts:13](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/tokens/elements/html.ts#L13)

Frozen html element tag-name map — sole declaration site for these tokens; consumers read
members and never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes
the token contract immutable at runtime.
