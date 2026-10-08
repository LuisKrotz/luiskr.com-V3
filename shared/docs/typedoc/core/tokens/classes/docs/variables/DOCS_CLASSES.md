[**luiskr.com**](../../../../../README.md)

***

[luiskr.com](../../../../../README.md) / [core/tokens/classes/docs](../README.md) / DOCS\_CLASSES

```ts
const DOCS_CLASSES: Readonly<{
  DOCS: "docs";
  DOCS_HEADER: "docs-header";
  DOCS_TITLE: "docs-title";
  DOCS_UPDATED: "docs-updated";
  DOCS_GL: "docs-gl";
  DOCS_GL_FALLBACK: "docs-gl-fallback";
  DOCS_BODY: "docs-body";
  DOCS_NAV: "docs-nav";
  DOCS_TREE: "docs-tree";
  DOCS_TREE_ITEM: "docs-tree-item";
  DOCS_TREE_OPEN: "docs-tree-open";
  DOCS_MAIN: "docs-main";
  DOCS_CRUMBS: "docs-crumbs";
  DOCS_CRUMB: "docs-crumb";
  DOCS_CRUMB_EDIT: "docs-crumb-edit";
  DOCS_GRID: "docs-grid";
  DOCS_CARD: "docs-card";
  DOCS_CARD_LABEL: "docs-card-label";
  DOCS_CARD_ART: "docs-card-art";
  DOCS_FOLDER: "docs-folder";
  DOCS_FOLDER_THREAD: "docs-folder-thread";
  DOCS_VIEWER: "docs-viewer";
  DOCS_VIEWER_HEAD: "docs-viewer-head";
  DOCS_VIEWER_PATH: "docs-viewer-path";
  DOCS_VIEWER_BACK: "docs-viewer-back";
  DOCS_CONTENT: "docs-content";
  DOCS_FRAME: "docs-frame";
  DOCS_SCENE: "docs-scene";
  DOCS_SCENE_OFF: "docs-scene-off";
  DOCS_NAV_TOGGLE: "docs-nav-toggle";
  DOCS_NAV_OPEN: "docs-nav-open";
  DOCS_PROTECTED: "docs-protected";
  DOCS_MERMAID: "docs-mermaid";
  DOCS_FOOTER_NOTE: "docs-footer-note";
}>;
```

Defined in: [core/tokens/classes/docs.ts:14](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/tokens/classes/docs.ts#L14)

Frozen docs class-name map — sole declaration site for these tokens;
consumers read members and never re-declare the strings
(zero-hardcoding rules 4–5). Object.freeze makes the token contract
immutable at runtime.
