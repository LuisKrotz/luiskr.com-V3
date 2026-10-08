[**luiskr.com**](../../../README.md)

***

[luiskr.com](../../../README.md) / [core/i18n](../README.md) / VALID\_LANGS

```ts
const VALID_LANGS: readonly (
  | "en"
  | "br"
  | "es"
  | "de"
  | "fr"
  | "it"
  | "ru"
  | "hrk"
  | "cas"
  | "riv"
  | "gn"
  | "tln"
  | "gl"
  | "ca"
  | "nl"
  | "ga")[];
```

Defined in: [core/i18n.ts:67](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/i18n.ts#L67)

Ordered list of routable locale codes — drives `detectLangFromPath` and
the CMS locale switcher. Order matches LANG_OPTIONS (picker order).
