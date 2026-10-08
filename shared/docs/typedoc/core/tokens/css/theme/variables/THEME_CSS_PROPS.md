[**luiskr.com**](../../../../../README.md)

***

[luiskr.com](../../../../../README.md) / [core/tokens/css/theme](../README.md) / THEME\_CSS\_PROPS

```ts
const THEME_CSS_PROPS: Readonly<{
  TEXT_PRIMARY: "--text-primary";
  BG_PRIMARY: "--bg-primary";
  BG_SECONDARY: "--bg-secondary";
  BG_DARK: "--bg-dark";
  BG_DARKER: "--bg-darker";
  TEXT_SECONDARY: "--text-secondary";
  TEXT_MUTED: "--text-muted";
  TEXT_MUTED_ON_DARK: "--text-muted-on-dark";
  MENU_BG: "--menu-bg";
  WHITE: "--white";
  BORDER_COLOR: "--border-color";
  COLOR_ACCENT: "--color-accent";
  COLOR_ACCENT_CONTRAST: "--color-accent-contrast";
  FOCUS_RING: "--focus-ring";
}>;
```

Defined in: [core/tokens/css/theme.ts:12](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/tokens/css/theme.ts#L12)

Theme/ink CSS custom-property names. Sole declaration site — consumers import members
from this frozen map rather than re-declaring the literals
(zero-hardcoding rule).
