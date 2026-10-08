[**luiskr.com**](../../../../../README.md)

***

[luiskr.com](../../../../../README.md) / [core/tokens/data/cms-keys](../README.md) / CMS\_KEYS

```ts
const CMS_KEYS: Readonly<{
  ABOUT_SECTION: "about-section";
  LEGAL_FOOTER: "legal-footer";
  RELATED_FOOTER: "related-footer";
  AUTOPLAY: "autoplay";
  RELATED: "related";
  CONTACT: "contact";
  LANG_DIALOG: "lang-dialog";
  APP: "APP";
  HOME: "HOME";
  ABOUT: "about";
  PORTFOLIOLIST: "portfoliolist";
  MEDIA: "media";
  EARTH_PLAYGROUND: "earthPlayground";
  SOURCE_CODE: "source-code";
  PREFERENCES_MODAL: "preferences-modal";
}>;
```

Defined in: [core/tokens/data/cms-keys.ts:26](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/tokens/data/cms-keys.ts#L26)

Frozen cms key map — sole declaration site for these tokens; consumers read members and
never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes the token
contract immutable at runtime.
