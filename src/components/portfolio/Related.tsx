/**
 * @file portfolio/Related.js
 * @description <portfolio-related> — "related projects" strip at the
 * bottom of project pages: a <custom-carousel> of sibling portfolio items
 * from the projects list.
 *
 * Facade — types/matcher/fetch/JSX live in ./related/.
 */

import { COMPONENT_TAGS } from '@/core/tokens/elements/components.js'
import { TYPE_STRINGS } from '@/core/tokens/strings/types.js'
import { h } from '@/core/jsx.js'
import { BaseComponent } from '@/core/Component.js'
import store from '@/core/store.js'
import router from '@/routes/router.js'
import { buildProjectsList } from './related/match.js'
import { fetchData, storedTranslations } from './related/data.js'
import { renderRelated } from './related/render.js'
import type { HomeItem, RelatedCard, RelatedTranslations } from './related/types.js'
import internalStyles from '@/sass/components/project/internals.scss?inline'
import '@/components/media/DrawText.js'
import { CDN_URLS } from '@/core/tokens/media/urls.js'

/**
 * The PortfolioRelated — related class.
 */
export class PortfolioRelated extends BaseComponent {
  translations: RelatedTranslations = {}

  homePortfolio: HomeItem[] = []

  _unsubRouter: (() => void) | null = null

  _noteOpen = false // disclaimer expand state (clamped to its first line)

  constructor() {
    super(internalStyles)
  }

  /** Toggles the clamped footer disclaimer between one-line and full text. */

  _toggleNote(): void {
    this._noteOpen = !this._noteOpen
    this._updateDom()
  }

  /** CDN base URL for project media. */

  get storage() {
    return store.getters.getStorage() || CDN_URLS.CDN_BASE
  }

  /**
   * Maps the DB `related.projects` rows into display-ready cards — see
   * related/match.ts for the fuzzy link/image/title join against the
   * home portfoliolist.
   */
  get projectsList(): RelatedCard[] {
    return buildProjectsList(this.translations, this.homePortfolio, this.storage)
  }

  /**
   * Lifecycle: seeds translations from the store (they may already be
   * loaded by the view), kicks the SWR fetch for the two DB nodes it
   * needs, and subscribes to the router — navigating between projects
   * re-runs the fuzzy match against the new page's related list.
   */
  override onMounted() {
    this.subscribe(store)

    this._unsubRouter = router.subscribe(() => {
      this._updateDom()
    })

    if (!this.translations?.title) {
      this.translations = storedTranslations()
    }

    this.fetchData()
  }

  /** Lifecycle: removes the router subscription. */
  override onDestroy() {
    if (typeof this._unsubRouter === TYPE_STRINGS.FUNCTION) {
      this._unsubRouter?.()

      this._unsubRouter = null
    }
  }

  override onStoreUpdate() {
    if (!this.translations?.title) {
      this.translations = storedTranslations()
    }

    this._updateDom()
  }

  override onUpdated() {}

  /**
   * Fires two SWR reads in parallel: the home page node (for the
   * portfoliolist join table) and the components/related node — see
   * related/data.ts.
   */
  fetchData(): void {
    fetchData(this)
  }

  /** JSX template for the component's shadow DOM. */

  override render() {
    return renderRelated(this)
  }
}

if (!customElements.get(COMPONENT_TAGS.PORTFOLIO_RELATED)) {
  customElements.define(COMPONENT_TAGS.PORTFOLIO_RELATED, PortfolioRelated)
}
