/**
 * @file tokens/attrs/microdata.js
 * @description HTML microdata attribute tokens (`itemscope`/`itemtype`/
 * `itemprop`) plus the Schema.org type/property URLs used on the docs
 * portal — JSON-LD lives in `core/utils/schema.ts`; these attributes are
 * the in-DOM mirror so crawlers that don't execute scripts still get a
 * typed graph. Keep DOM microdata and JSON-LD consistent: both describe
 * the same page entity.
 */

import { SCHEMA_STRINGS } from '../strings/schema.js'

/**
 * Frozen microdata attribute-name map — sole declaration site for these
 * tokens; consumers read members and never re-declare the strings
 * (zero-hardcoding rules 4–5). Object.freeze makes the token contract
 * immutable at runtime.
 */
export const MICRODATA_ATTRS = Object.freeze({
  /** `itemscope` — boolean attribute that opens a microdata item. */
  ITEMSCOPE: 'itemscope',
  /** `itemtype` — Schema.org type URL for the enclosing itemscope. */
  ITEMTYPE: 'itemtype',
  /** `itemprop` — property name of the enclosing itemscope's value. */
  ITEMPROP: 'itemprop',
})

/**
 * Frozen microdata value map — Schema.org type URLs (`itemtype` values)
 * and property names (`itemprop` values) used by the docs portal markup.
 * Composed from SCHEMA_STRINGS.SCHEMA_CONTEXT so the vocabulary base is
 * declared exactly once.
 */
export const MICRODATA_VALUES = Object.freeze({
  /** itemtype value — https://schema.org/TechArticle (file pages). */
  TYPE_TECH_ARTICLE: `${SCHEMA_STRINGS.SCHEMA_CONTEXT}/TechArticle`,
  /** itemtype value — https://schema.org/CollectionPage (folder/root pages). */
  TYPE_COLLECTION_PAGE: `${SCHEMA_STRINGS.SCHEMA_CONTEXT}/CollectionPage`,
  /** itemprop value — the item's display name. */
  PROP_NAME: 'name',
  /** itemprop value — the item's canonical URL. */
  PROP_URL: 'url',
  /** itemprop value — last-modified timestamp. */
  PROP_DATE_MODIFIED: 'dateModified',
  /** itemprop value — main content body of the page/article. */
  PROP_ARTICLE_BODY: 'articleBody',
})
