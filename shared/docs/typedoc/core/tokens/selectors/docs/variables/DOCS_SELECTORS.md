[**luiskr.com**](../../../../../README.md)

***

[luiskr.com](../../../../../README.md) / [core/tokens/selectors/docs](../README.md) / DOCS\_SELECTORS

```ts
const DOCS_SELECTORS: Readonly<{
  CRUMBS: ".docs-crumbs";
  CRUMB: ".docs-crumb";
  TREE_ITEM: ".docs-tree-item";
  CARD: ".docs-card";
  VIEWER: ".docs-viewer";
  CONTENT: ".docs-content";
  PROTECTED: ".docs-protected";
  MERMAID: ".docs-mermaid";
  UNCOVERED: "td.pct.low, :not(.cbranch-no):not(.cstat-no):not(.fstat-no) > .cbranch-no, :not(.cbranch-no):not(.cstat-no):not(.fstat-no) > .cstat-no, :not(.cbranch-no):not(.cstat-no):not(.fstat-no) > .fstat-no, :not(.cbranch-no):not(.cstat-no):not(.fstat-no) > .cline-no, :not(.cbranch-no):not(.cstat-no):not(.fstat-no) > .missing-if-branch";
  COV_TABLE: "table.coverage-summary";
  COV_TEMPLATE: "template#filterTemplate";
  COV_SEARCH: "#fileSearch";
  COV_SORTER: "span.sorter";
  COV_HIGHLIGHT: "highlighted";
  COV_SORTED: "sorted";
  COV_SORTED_DESC: "sorted-desc";
  COV_DATA_COL: "data-col";
  COV_DATA_TYPE: "data-type";
  COV_DATA_NOSORT: "data-nosort";
  COV_DATA_VALUE: "data-value";
  CONTENT_LINK: "a[href]";
}>;
```

Defined in: [core/tokens/selectors/docs.ts:15](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/core/tokens/selectors/docs.ts#L15)

Frozen docs selector map — sole declaration site for these tokens;
consumers read members and never re-declare the strings
(zero-hardcoding rules 4–5). Object.freeze makes the token contract
immutable at runtime.
