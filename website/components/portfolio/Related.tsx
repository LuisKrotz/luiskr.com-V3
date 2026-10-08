/**
 * @file portfolio/Related.js
 * @description <portfolio-related> — "related projects" strip at the
 * bottom of project pages: a <custom-carousel> of sibling portfolio items
 * from the projects list.
 *
 * Facade — types/matcher/fetch/JSX live in ./related/.
 */

import { COMPONENT_TAGS } from '@core/tokens/elements/components.js'
import { INTERNAL_CLASSES } from '@core/tokens/classes/project.js'
import { TYPE_STRINGS } from '@core/tokens/strings/types.js'
import { h } from '@core/jsx.js'
import { BaseComponent } from '@core/Component.js'
import store from '@core/store.js'
import router from '@core/router/router.js'
import { buildProjectsList } from './related/match.js'
import { fetchData, storedTranslations } from './related/data.js'
import { renderRelated } from './related/render.js'
import type { HomeItem, RelatedCard, RelatedTranslations } from './related/types.js'
import internalStyles from '@core/sass/components/internals/internals.scss?inline'
import '@website/components/media/DrawText.js'
import { CDN_URLS } from '@core/tokens/media/urls.js'

/**
 * The PortfolioRelated — related class.
 */
export class PortfolioRelated extends BaseComponent {
  translations: RelatedTranslations = {}

  homePortfolio: HomeItem[] = []

  _unsubRouter: (() => void) | null = null

  _noteOpen = false // disclaimer expand state (clamped to its first line)

  _noteTruncated = false // true while the clamped note overflows its line

  _noteEl: Element | null = null // last note button the observer bound to

  _noteRO: ResizeObserver | null = null

  constructor() {
    super(internalStyles)
  }

  /** Toggles the clamped footer disclaimer between one-line and full text. */

  _toggleNote(): void {
    this._noteOpen = !this._noteOpen
    this._updateDom()
  }

  /**
   * Detects whether the clamped note actually overflows — CSS cannot
   * detect line-clamp truncation, so scrollHeight vs clientHeight does
   * it here. The flag drives the `is-truncated` class that reveals the
   * pulsing "···" affordance; measured only while collapsed (open state
   * is unclamped by definition, and the affordance hides anyway).
   */
  _measureNote(): void {
    const textEl = this.$(`.${INTERNAL_CLASSES.INTERNAL_FOOTER_ITEMS_NOTE_TEXT}`)

    if (!textEl || this._noteOpen) return

    const truncated = textEl.scrollHeight > textEl.clientHeight + 1

    if (truncated !== this._noteTruncated) {
      this._noteTruncated = truncated
      this._updateDom()
    }
  }

  /**
   * Binds a ResizeObserver to the note button so font loads, viewport
   * resizes and locale swaps re-evaluate truncation. The element is
   * recreated on every render, so the observer re-binds whenever the
   * node identity changes instead of watching a detached element.
   */
  _watchNoteTruncation(): void {
    const noteEl = this.$(`.${INTERNAL_CLASSES.INTERNAL_FOOTER_ITEMS_NOTE}`)

    if (!noteEl) {
      this._noteEl = null
      return
    }

    this._measureNote()

    if (typeof ResizeObserver === TYPE_STRINGS.UNDEFINED || this._noteEl === noteEl) return

    this._noteRO?.disconnect()

    this._noteEl = noteEl

    this._noteRO = new ResizeObserver(() => this._measureNote())

    this._noteRO.observe(noteEl)
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

  /** Lifecycle: removes the router subscription + the note observer. */
  override onDestroy() {
    if (typeof this._unsubRouter === TYPE_STRINGS.FUNCTION) {
      this._unsubRouter?.()

      this._unsubRouter = null
    }

    this._noteRO?.disconnect()

    this._noteRO = null

    this._noteEl = null
  }

  override onStoreUpdate() {
    if (!this.translations?.title) {
      this.translations = storedTranslations()
    }

    this._updateDom()
  }

  override onUpdated() {
    this._watchNoteTruncation()
  }

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
