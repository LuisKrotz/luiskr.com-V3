[**luiskr.com**](../../../../../README.md)

***

[luiskr.com](../../../../../README.md) / [core/tokens/ids/docs](../README.md) / DOCS\_IDS

```ts
const DOCS_IDS: Readonly<{
  GL: "docs-gl";
  TREE: "docs-tree";
  CRUMBS: "docs-crumbs";
  GRID: "docs-grid";
  VIEWER: "docs-viewer";
  SCENE: "docs-scene";
}>;
```

Defined in: [core/tokens/ids/docs.ts:14](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/tokens/ids/docs.ts#L14)

Frozen docs element-id map — sole declaration site for these tokens;
consumers read members and never re-declare the strings
(zero-hardcoding rules 4–5). Object.freeze makes the token contract
immutable at runtime.
