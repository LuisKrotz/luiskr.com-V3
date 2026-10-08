/**
 * @file tokens/selectors/docs.js
 * @description Docs-portal query-selector tokens — grouped subset of
 * SELECTORS.
 */

import { DOCS_CLASSES } from '../classes/docs.js'

/**
 * Frozen docs selector map — sole declaration site for these tokens;
 * consumers read members and never re-declare the strings
 * (zero-hardcoding rules 4–5). Object.freeze makes the token contract
 * immutable at runtime.
 */
export const DOCS_SELECTORS = Object.freeze({
  CRUMBS: `.${DOCS_CLASSES.DOCS_CRUMBS}`,
  CRUMB: `.${DOCS_CLASSES.DOCS_CRUMB}`,
  TREE_ITEM: `.${DOCS_CLASSES.DOCS_TREE_ITEM}`,
  CARD: `.${DOCS_CLASSES.DOCS_CARD}`,
  VIEWER: `.${DOCS_CLASSES.DOCS_VIEWER}`,
  CONTENT: `.${DOCS_CLASSES.DOCS_CONTENT}`,
  PROTECTED: `.${DOCS_CLASSES.DOCS_PROTECTED}`,
  MERMAID: `.${DOCS_CLASSES.DOCS_MERMAID}`,
  /** Istanbul uncovered-block markers — the coverage-report key nav. */
  UNCOVERED:
    'td.pct.low, :not(.cbranch-no):not(.cstat-no):not(.fstat-no) > .cbranch-no, :not(.cbranch-no):not(.cstat-no):not(.fstat-no) > .cstat-no, :not(.cbranch-no):not(.cstat-no):not(.fstat-no) > .fstat-no, :not(.cbranch-no):not(.cstat-no):not(.fstat-no) > .cline-no, :not(.cbranch-no):not(.cstat-no):not(.fstat-no) > .missing-if-branch',
  /** Istanbul report table — sortable coverage-summary on index pages. */
  COV_TABLE: 'table.coverage-summary',
  /** Istanbul filter-input template cloned into the report header. */
  COV_TEMPLATE: 'template#filterTemplate',
  /** Istanbul file-search input created from the filter template. */
  COV_SEARCH: '#fileSearch',
  /** Istanbul sort-arrow span appended to sortable column headers. */
  COV_SORTER: 'span.sorter',
  /** Istanbul "block under cursor" class toggled by the key nav. */
  COV_HIGHLIGHT: 'highlighted',
  /** Istanbul sorted-column indicator classes. */
  COV_SORTED: 'sorted',
  COV_SORTED_DESC: 'sorted-desc',
  /** Istanbul th/td data attributes driving the sort wiring. */
  COV_DATA_COL: 'data-col',
  COV_DATA_TYPE: 'data-type',
  COV_DATA_NOSORT: 'data-nosort',
  COV_DATA_VALUE: 'data-value',
  /** Anchors inside painted payload HTML — internal links reroute. */
  CONTENT_LINK: 'a[href]',
})
