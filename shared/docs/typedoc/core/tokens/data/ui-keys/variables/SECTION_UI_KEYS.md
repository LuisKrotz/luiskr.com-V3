[**luiskr.com**](../../../../../README.md)

***

[luiskr.com](../../../../../README.md) / [core/tokens/data/ui-keys](../README.md) / SECTION\_UI\_KEYS

```ts
const SECTION_UI_KEYS: Readonly<{
  ABOUT_DESCRIPTION: "about.description";
  ABOUT_MORE_INFO: "about.moreInfo";
  CONTACT: "contact";
  RELATED: "related";
  TITLE: "title";
  NOT_FOUND: "notFound";
  EARTH_PLAYGROUND: "earthPlayground";
  LOADING: "loading";
}>;
```

Defined in: [core/tokens/data/ui-keys.ts:23](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/tokens/data/ui-keys.ts#L23)

Frozen section ui key map — sole declaration site for these tokens; consumers read members
and never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes the
token contract immutable at runtime.
