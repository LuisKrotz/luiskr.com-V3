[**luiskr.com**](../../../../../README.md)

***

[luiskr.com](../../../../../README.md) / [core/tokens/routes/paths](../README.md) / DB\_PATHS

```ts
const DB_PATHS: Readonly<{
  COVERS: "covers/";
  COMPONENTS: "/components";
  SLUGS: "/slugs";
  COMPONENTS_RELATED: "/components/related";
  COMPONENTS_RELATED_PROJECTS: "/components/related/projects";
  TRANSLATIONS: "translations/";
  PROJECTS_SEGMENT: "projects";
  CORE_SEGMENT: "core";
  PAGES: "/pages/";
  PROJECTS: "/projects/";
  DOCS_STATS: "docs-stats/";
}>;
```

Defined in: [core/tokens/routes/paths.ts:43](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/tokens/routes/paths.ts#L43)

Frozen db path map — sole declaration site for these tokens; consumers read members and
never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze makes the token
contract immutable at runtime.
