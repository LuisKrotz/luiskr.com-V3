/**
 * @file AwardsMentions.js
 * @description <awards-mentions> — the footer band on internals/home: an
 * auto-advancing carousel of award/mention entries with a progress arc,
 * plus the legal links row. Data comes from the CMS translations nodes
 * with bundled fallbacks. Implementation lives in home/awards/{data,
 * carousel,render} — this facade keeps the property + lifecycle surface.
 */

import { COMPONENT_TAGS } from '@core/tokens/elements/components.js'
import { TRANSLATION_KEYS } from '@core/tokens/routes/translation-keys.js'
import { CHAR_STRINGS } from '@core/tokens/strings/chars.js'
import { MOUSE_EVENTS } from '@core/tokens/events/dom.js'
import { AWARDS_CLASSES } from '@core/tokens/classes/awards.js'
import { TYPE_STRINGS } from '@core/tokens/strings/types.js'
import { BaseComponent } from '@core/Component.js'
import store from '@core/store.js'
import router from '@core/router/router.js'
import { FALLBACK_PAGES } from '@core/locale/fallback.js'
import { ensureAwardsData, legalLinks } from './awards/data.js'
import {
  hideAwardsProgress,
  restartAwardsProgress,
  setupAwardsCarousel,
  showAwardsProgress,
} from './awards/carousel.js'
import { renderAwards } from './awards/render.js'
import type { LegalLink } from './awards/data.js'
import awardsFooterStyles from '@core/sass/components/home/awards-footer.scss?inline'
import '@website/components/carousel/AwardsCarousel.js'

interface AwardsCarouselEl extends HTMLElement {
  items?: unknown[] | null
}

/**
 * The AwardsMentions — mentions class.
 */
export class AwardsMentions extends BaseComponent {
  _title: string =
    (FALLBACK_PAGES[TRANSLATION_KEYS.ABOUT] as { mentions?: string } | undefined)?.mentions ||
    CHAR_STRINGS.EMPTY // section heading
  _items: unknown[] | null = null // award entries pushed by the view (null = skeleton shown)
  _lastLocale: string | null = null // locale the entries were loaded for
  _duration = 10000 // autoplay dwell per slide — also drives the progress arc's CSS duration
  _autoplayEverStarted = false

  constructor() {
    super(awardsFooterStyles)
  }

  /** Setter/getter — section heading text. */

  override set title(val: string | null | undefined) {
    const newTitle =
      val ||
      (FALLBACK_PAGES[TRANSLATION_KEYS.ABOUT] as { mentions?: string } | undefined)?.mentions ||
      CHAR_STRINGS.EMPTY

    if (this._title === newTitle) return

    this._title = newTitle

    if (this._isMounted) this._updateDom()
  }

  override get title(): string {
    return this._title
  }

  /** Setter/getter — award/mention entries for the carousel. */

  set items(val: unknown[] | null) {
    if (this._items === val) return

    this._items = val

    if (this._isMounted) {
      const awc = this.$<AwardsCarouselEl>(COMPONENT_TAGS.AWARDS_CAROUSEL)

      if (awc) {
        awc.items = this.items
      } else {
        this._updateDom()

        this._setupCarousel()
      }
    }
  }

  get items(): unknown[] | null {
    return this._items
  }

  /** Legal-page links for the footer row (see awards/data.ts). */

  get legalLinks(): LegalLink[] {
    return legalLinks()
  }

  override onMounted() {
    this._lastLocale = store.getters.getLang()

    this.subscribe(store)

    this._ensureData()

    this._setupCarousel()

    this._bindLinks()
  }

  override onStoreUpdate() {
    const currentLocale = store.getters.getLang()

    if (this._lastLocale !== currentLocale) {
      this._lastLocale = currentLocale

      this._updateDom()

      this._setupCarousel()
    }
  }

  /** Loads the mentions + legal-links nodes when missing (SWR). */

  _ensureData(): void {
    ensureAwardsData(this)
  }

  override onUpdated() {
    this._setupCarousel()
  }

  /** Builds the auto-advance loop (see awards/carousel.ts). */

  _setupCarousel(): void {
    setupAwardsCarousel(this)
  }

  /** Shows the circular progress indicator for the current slide. */

  _showProgress(): void {
    showAwardsProgress(this)
  }

  /** Hides the progress arc (paused/hover). */

  _hideProgress(): void {
    hideAwardsProgress(this)
  }

  /** Resets the SVG progress arc so the next slide's timer animates from zero. */

  _restartProgressAnimation(): void {
    restartAwardsProgress(this)
  }

  /** Wires internal links through the SPA router. */

  _bindLinks(): void {
    // Delegated click handler on shadowRoot: handles all legal links across DOM re-renders
    this.addScopedListener(this.shadowRoot, MOUSE_EVENTS.CLICK, (e) => {
      const path = typeof e.composedPath === TYPE_STRINGS.FUNCTION ? e.composedPath() : []

      const a =
        (e.target instanceof Element
          ? e.target
          : (e.target as Element | null)?.parentElement
        )?.closest(`.${AWARDS_CLASSES.AWARDS_FOOTER_ITEM}`) ||
        path.find(
          (el) => el instanceof Element && el.classList?.contains(AWARDS_CLASSES.AWARDS_FOOTER_ITEM)
        )

      if (a) {
        e.preventDefault()

        router.push((a as Element).getAttribute('href') || CHAR_STRINGS.EMPTY)
      }
    })
  }

  /** JSX template for the component's shadow DOM. */

  override render() {
    return renderAwards(this)
  }
}

if (!customElements.get(COMPONENT_TAGS.AWARDS_MENTIONS)) {
  customElements.define(COMPONENT_TAGS.AWARDS_MENTIONS, AwardsMentions)
}
