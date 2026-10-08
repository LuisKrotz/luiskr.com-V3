[**luiskr.com**](../../../../../README.md)

***

[luiskr.com](../../../../../README.md) / [core/tokens/routes/paths](../README.md) / ROUTE\_PATHS

```ts
const ROUTE_PATHS: Readonly<{
  ROOT: "/";
  PORTFOLIO: "/portfolio/";
  PORTFOLIO_SEGMENT: "portfolio";
  PORTFOLIO_SLASH: "/portfolio/";
  ADMIN: "/admin";
  CMS: "/cms";
  ABOUT: "/about";
  CONTACT: "/contact";
  PRIVACY_POLICY: "/privacy-policy";
  GDPR: "/gdpr";
  TERMS_OF_USE: "/terms-of-use";
  NOT_FOUND: "not-found";
  EARTH_PLAYGROUND: "/earth-playground";
  EARTH_PLAYGROUND_SEGMENT: "earth-playground";
  SPACE_PLAYGROUND: "/space-playground";
  SPACE_PLAYGROUND_SEGMENT: "space-playground";
  DOCS: "/docs";
  DOCS_SEGMENT: "docs";
}>;
```

Defined in: [core/tokens/routes/paths.ts:17](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/tokens/routes/paths.ts#L17)

Frozen public-route map — canonical (English) URL paths. `*_SEGMENT`
variants exist for string-contains matching when the leading slash would
false-positive (e.g. '/portfolio/' vs the bare 'portfolio' segment);
`PORTFOLIO`/`PORTFOLIO_SLASH` duplicate intentionally so call sites
read unambiguously by intent.
