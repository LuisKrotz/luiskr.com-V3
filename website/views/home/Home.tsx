/**
 * @file Home.js
 * @description <view-home> — the home page route: hero carousel, about
 * section, mosaic project grid and contact footer. Loads the home page
 * node + projects list via SWR, keeps JSON-LD (WebSite + ItemList) in
 * sync, and passes data down to its child sections. Behavior lives in
 * home/{types,data,children,scroll,render} — this facade keeps the
 * lifecycle + test-facing method surface.
 */

import { VIEW_TAGS } from '@core/tokens/elements/views.js'
import { BaseComponent } from '@core/Component.js'
import store from '@core/store.js'
import router from '@core/router/router.js'
import type { RouteDescriptor } from '@core/router/router.js'
import { isFeatured, loadHomeData, onHomeStoreUpdate, processedItems } from './data.js'
import { passDataToChildren } from './children.js'
import { onHomeRouteChange, scrollOnMount } from './scroll.js'
import { renderHome } from './render.js'
import type { AboutNode, HomeTranslations, PortfolioItem } from './types.js'
import homeStyles from './home.scss?inline'
import '@website/components/home/HomeMosaic.js'
import '@website/components/home/AboutSection.js'
import '@website/components/home/ContactSection.js'
import '@website/components/home/AwardsMentions.js'

/**
 * The ViewHome — home class.
 */
export class ViewHome extends BaseComponent {
  translations: HomeTranslations | null = null // pages/home node — title, portfoliolist, labels
  aboutTranslations: AboutNode | null = null // pages/about node pushed into <about-section>
  profilePicture: string | null = null // profile-picture descriptor for <about-section>
  featuredLinks = new Set<string>() // project links flagged featured in components/projects
  _lastLocale: string | null = null

  constructor() {
    super(homeStyles)
  }

  /** CDN base URL for project media. */

  get storage() {
    return store.getters.getStorage()
  }

  /** Whether the session is touch-input. */

  get hasTouch() {
    return store.getters.getTouch()
  }

  /** Projects list reshaped for the mosaic (see home/data.ts). */

  get processedItems(): PortfolioItem[] {
    return processedItems(this)
  }

  /** Featured detection (item flag or featuredLinks membership). */

  isFeatured(item: PortfolioItem): boolean {
    return isFeatured(this, item)
  }

  /** Same-view navigations re-scroll instead of remounting (see home/scroll.ts). */

  onRouteParamChange(to: RouteDescriptor | null): void {
    onHomeRouteChange(this, to)
  }

  /** Lifecycle: kicks off data loading and subscribes to the store. */

  override onMounted() {
    this.loadData()

    this.subscribe(store)

    scrollOnMount(this, router.currentRoute)
  }

  /** Re-pushes data when locale/state changes. */

  override onStoreUpdate() {
    onHomeStoreUpdate(this)
  }

  /** Loads the three home data sources in parallel via SWR (see home/data.ts). */

  loadData(): void {
    loadHomeData(this)
  }

  /** Distributes loaded translations/items to the mosaic, about and contact children. */

  _passDataToChildren(): void {
    passDataToChildren(this)
  }

  /** JSX template for the view's shadow DOM. */

  override render() {
    return renderHome(this)
  }

  /** Lifecycle: re-syncs children after each re-render. */

  override onUpdated() {
    this._passDataToChildren()
  }
}

if (!customElements.get(VIEW_TAGS.VIEW_HOME)) {
  customElements.define(VIEW_TAGS.VIEW_HOME, ViewHome)
}
