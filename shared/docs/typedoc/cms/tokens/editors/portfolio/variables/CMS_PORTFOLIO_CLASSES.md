[**luiskr.com**](../../../../../README.md)

***

[luiskr.com](../../../../../README.md) / [cms/tokens/editors/portfolio](../README.md) / CMS\_PORTFOLIO\_CLASSES

```ts
const CMS_PORTFOLIO_CLASSES: Readonly<{
  CMS_PORTFOLIO_MANAGER: "cms-portfolio-manager";
  CMS_CARD_LANG: "cms-card--lang";
  CMS_SELECT_NARROW: "cms-select--narrow";
  CMS_BTN_COMPACT: "cms-btn--compact";
  CMS_PF_LIST: "cms-pf-list";
  CMS_PF_EMPTY: "cms-pf-empty";
  CMS_PF_ITEM: "cms-pf-item";
  CMS_PF_HEAD: "cms-pf-head";
  CMS_PF_IDENTITY: "cms-pf-identity";
  CMS_PF_THUMB: "cms-pf-thumb";
  CMS_PF_THUMB_IMG: "cms-pf-thumb-img";
  CMS_PF_NOIMG: "cms-pf-noimg";
  CMS_PF_TITLE: "cms-pf-title";
  CMS_PF_FIELDS: "cms-pf-fields";
  CMS_PF_IMAGE_ROW: "cms-pf-image-row";
  CMS_PF_VIEW: "cms-pf-view";
  CMS_PF_DIMS: "cms-pf-dims";
  CMS_PF_DIMS_TITLE: "cms-pf-dims-title";
  CMS_PF_DIMS_GRID: "cms-pf-dims-grid";
  CMS_PF_DIM_LABEL: "cms-pf-dim-label";
  ITEM_FIELD: "item-field";
  DIM_FIELD: "dim-field";
  FEAT_SELECT: "feat-select";
}>;
```

Defined in: [cms/tokens/editors/portfolio.ts:17](https://github.com/LuisKrotz/luiskr.com-V3/blob/9eeffce09b8f1b5d7b918bf7a393a7229dd71a78/cms/tokens/editors/portfolio.ts#L17)

Frozen cms portfolio class-name map — sole declaration site for these tokens; consumers
read members and never re-declare the strings (zero-hardcoding rules 4–5). Object.freeze
makes the token contract immutable at runtime.
