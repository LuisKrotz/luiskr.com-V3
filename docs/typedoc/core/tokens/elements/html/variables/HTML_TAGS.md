[**luiskr.com**](../../../../../README.md)

---

[luiskr.com](../../../../../README.md) / [core/tokens/elements/html](../README.md) / HTML\_TAGS

```ts
const HTML_TAGS: Readonly<{
  FIGURE: 'figure'
  VIDEO: 'video'
  IMG: 'img'
  BUTTON: 'button'
  LINK: 'link'
  META: 'meta'
  STYLE: 'style'
  DIV: 'div'
  SPAN: 'span'
  A: 'a'
  P: 'p'
  CANVAS: 'canvas'
  SELECT: 'select'
  OPTION: 'option'
  INPUT: 'input'
  TEXTAREA: 'textarea'
  LABEL: 'label'
  H2: 'h2'
  H3: 'h3'
  NAV: 'nav'
  ASIDE: 'aside'
  HEADER: 'header'
  MAIN: 'main'
  DIALOG: 'dialog'
  TITLE: 'title'
  H1: 'h1'
}>
```

Defined in: [src/core/tokens/elements/html.ts:13](https://github.com/LuisKrotz/luiskr.com-V3/blob/214965eca24f91b1469ed21eb399bf941ad49ce0/src/core/tokens/elements/html.ts#L13)

Frozen html element tag-name map — sole declaration site for these tokens; consumers read
members and never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes
the token contract immutable at runtime.
