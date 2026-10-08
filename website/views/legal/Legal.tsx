/**
 * @file Legal.js
 * @description <view-legal> — the legal-page route (privacy policy, GDPR,
 * terms of use): renders the requested document's translated body inside
 * the internals chrome with the shared legal footer.
 */

import { ATTR_VALUES } from '@core/tokens/attrs/values.js'
import { COMMON_ATTRS } from '@core/tokens/attrs/common.js'
import { LEGAL_CLASSES } from '@core/tokens/classes/legal.js'
import { INTERNAL_CLASSES } from '@core/tokens/classes/project.js'
import { SKELETON_CLASSES } from '@core/tokens/classes/skeleton.js'
import { SECTION_UI_KEYS } from '@core/tokens/data/ui-keys.js'
import { COMPONENT_TAGS } from '@core/tokens/elements/components.js'
import { VIEW_TAGS } from '@core/tokens/elements/views.js'
import { LOCALES } from '@core/tokens/locales.js'
import { TRANSLATION_KEYS } from '@core/tokens/routes/translation-keys.js'
import { CHAR_STRINGS } from '@core/tokens/strings/chars.js'
import { TYPE_STRINGS } from '@core/tokens/strings/types.js'
import { h } from '@core/jsx.js'
import { BaseComponent } from '@core/Component.js'
import store from '@core/store.js'
import router from '@core/router/router.js'
import { appText } from '@core/locale/ui-text.js'
import { fetchFirebaseDb } from '@core/utils/data/db.js'
import type { DbSnapshot } from '@core/utils/data/db.js'
import type { RouteDescriptor } from '@core/router/router.js'
import { stripHtml } from '@core/utils/index.js'
import { calcDrawTextDelay, calcDrawTextOrderedOffset } from '@core/utils/wasm/wasm-layout.js'
import { DRAW_TIMINGS } from '@core/tokens/media/dimensions.js'
import { FALLBACK_PAGES } from '@core/locale/fallback.js'
import '@website/components/media/DrawText.js'
import legalStyles from './legal.scss?inline'
import '@website/components/legal/Footer.js'
import { devError } from '@core/devlog.js'

interface LegalSection {
  title?: string
  content?: string[]
}

interface LegalDoc {
  title?: string
  sections?: LegalSection[]
}

/**
 * The ViewLegal — legal class.
 */
export class ViewLegal extends BaseComponent {
  translations: LegalDoc | null = null
  private _unsubRoute: (() => void) | null = null
  private _lastLocale: string | null = null

  constructor() {
    super(legalStyles)
  }

  /** Lifecycle: kicks off document loading. */

  override onMounted() {
    this.subscribe(store)

    this._unsubRoute = router.subscribe((to) => {
      if (to.meta?.legalRoute) {
        this.onRouteParamChange(to)
      }
    })

    this.loadData()

    setTimeout(() => {
      window.scrollTo(0, 0)
    }, 500)
  }

  /** Router hook — swapping between legal pages reloads the document without remounting. */

  onRouteParamChange(to: RouteDescriptor | null): void {
    if (to?.meta?.legalRoute) {
      if (to?.meta?.title) {
        document.title = to.meta.title
      }
      this.translations = null
      this._updateDom()
      this.loadData()
      window.scrollTo({ top: 0, behavior: ATTR_VALUES.SMOOTH })
    }
  }

  /** Lifecycle: cleans up listeners. */

  override onDestroy() {
    if (typeof this._unsubRoute === TYPE_STRINGS.FUNCTION) {
      this._unsubRoute?.()
      this._unsubRoute = null
    }
  }

  /** Reloads when the locale changes. */

  override onStoreUpdate() {
    const currentLocale = store.getters.getLang()
    if (this._lastLocale && this._lastLocale !== currentLocale) {
      this._lastLocale = currentLocale
      this.loadData()
    }
  }

  /**
   * Fetches the legal document node (privacy-policy | gdpr | terms-of-use)
   * for the current locale. `wait` defers the DOM write — used after a
   * route swap so the old document's fade-out finishes before the new
   * skeleton→content swap (prevents a flash of loading state). SWR: the
   * callback fires immediately on cache hit AND on network revalidation.
   */
  loadData(wait = 0): void {
    const route = router.currentRoute
    if (route?.meta?.title) {
      document.title = route.meta.title
    }
    const translationKey: string = route?.meta?.translation || TRANSLATION_KEYS.PRIVACY_POLICY

    const lang = store.getters.getlang()

    const currentLocale = lang.locale || LOCALES.EN
    this._lastLocale = currentLocale

    const dbpath = `${lang.database}${currentLocale}${lang.pagesPath}${translationKey}`

    const apply = (snapshot: DbSnapshot) => {
      if (!snapshot?.exists()) return

      const val = snapshot.val() as LegalDoc
      if (!wait) {
        this.translations = val
        this._updateDom()
      } else {
        setTimeout(() => {
          this.translations = val
          this._updateDom()
        }, wait)
      }
    }

    fetchFirebaseDb(dbpath, apply).then(apply).catch(devError)
  }

  /**
   * JSX template — two states: loaded renders the document's sections
   * (CMS HTML paragraphs via dangerouslySetInnerHTML — trusted content,
   * sanitized at write time in the CMS); loading renders 3 skeleton
   * sections mirroring the real title+paragraph geometry so the swap is
   * seamless. Text-only route: no media fetches at all.
   */
  override render() {
    const t = this.translations
    const LegalFooter = COMPONENT_TAGS.LEGAL_FOOTER

    /**
     * Ordered reveal plan — one running cursor across the whole document
     * so titles and paragraphs cascade in reading order even when several
     * sections are in the viewport at once. Each item's offset is the
     * cumulative duration of every item before it (chars × its section's
     * per-char delay) plus a global index step; the `ordered` attribute
     * makes draw-text read that offset against the shared session clock.
     */
    const drawPlan: { section: LegalSection; offsets: number[]; delay: number }[] = []

    // The <h1> title leads the schedule — index 0, its reveal duration
    // (chars × DRAW_DEFAULT_DELAY, the attr-free default) seeds the cursor.
    let scheduledMs = t?.title ? stripHtml(t.title).length * DRAW_TIMINGS.DRAW_DEFAULT_DELAY : 0
    let itemIdx = t?.title ? 1 : 0

    for (const section of t?.sections || []) {
      const items = [section.title || CHAR_STRINGS.EMPTY, ...(section.content || [])]

      const totalChars = items.reduce((sum, str) => sum + stripHtml(str).length, 0) || 1

      const delay = calcDrawTextDelay(totalChars)

      const offsets = items.map((str) => {
        const offset = calcDrawTextOrderedOffset(itemIdx++, scheduledMs)

        scheduledMs += stripHtml(str).length * delay

        return offset
      })

      drawPlan.push({ section, offsets, delay })
    }

    return (
      <article>
        <div id="main" className={LEGAL_CLASSES.LEGAL}>
          <h1
            className={INTERNAL_CLASSES.INTERNAL_TITLE}
            aria-label={
              stripHtml(
                t?.title ||
                  (
                    FALLBACK_PAGES[router.currentRoute?.meta?.translation || CHAR_STRINGS.EMPTY] as
                      { title?: string } | undefined
                  )?.title ||
                  String(appText(SECTION_UI_KEYS.LOADING) || CHAR_STRINGS.EMPTY)
              ) || undefined
            }
          >
            {t?.title ? (
              <draw-text
                key="ttl1"
                text={t.title}
                trigger={COMMON_ATTRS.TRIGGER_VIEWPORT}
                fit={ATTR_VALUES.EMPTY}
                ordered={ATTR_VALUES.TRUE}
              />
            ) : (
              <span
                key="ttl2"
                className={`${SKELETON_CLASSES.SKELETON_SHIMMER} ${SKELETON_CLASSES.SKELETON_TITLE_SM}`}
              />
            )}
          </h1>

          {t?.sections ? (
            <div>
              {drawPlan.map(({ section, offsets, delay }, key) => (
                <section key={key} className={INTERNAL_CLASSES.INTERNAL_DESCRIPTION}>
                  <h2
                    className={INTERNAL_CLASSES.INTERNAL_DESCRIPTION_TEXT}
                    aria-label={stripHtml(section.title || CHAR_STRINGS.EMPTY) || undefined}
                  >
                    <draw-text
                      text={section.title || CHAR_STRINGS.EMPTY}
                      trigger={COMMON_ATTRS.TRIGGER_VIEWPORT}
                      delay={delay}
                      offset={offsets[0]}
                      ordered={ATTR_VALUES.TRUE}
                    />
                  </h2>
                  {(section.content || []).map((paragraph, pKey) => (
                    <p key={pKey} className={INTERNAL_CLASSES.INTERNAL_DESCRIPTION_TEXT}>
                      <draw-text
                        text={paragraph}
                        trigger={COMMON_ATTRS.TRIGGER_VIEWPORT}
                        delay={delay}
                        offset={offsets[pKey + 1]}
                        ordered={ATTR_VALUES.TRUE}
                      />
                    </p>
                  ))}
                </section>
              ))}
            </div>
          ) : (
            <div key="data-load">
              {[1, 2, 3].map((n) => (
                <section key={n} className={INTERNAL_CLASSES.INTERNAL_DESCRIPTION}>
                  <h2
                    aria-hidden="true"
                    className={`${INTERNAL_CLASSES.INTERNAL_DESCRIPTION_TEXT} ${SKELETON_CLASSES.SKELETON_SHIMMER} ${SKELETON_CLASSES.SKELETON_SECTION_TITLE}`}
                  />
                  <p
                    className={`${INTERNAL_CLASSES.INTERNAL_DESCRIPTION_TEXT} ${SKELETON_CLASSES.SKELETON_SHIMMER} ${SKELETON_CLASSES.SKELETON_PARA_FULL}`}
                  />
                  <p
                    className={`${INTERNAL_CLASSES.INTERNAL_DESCRIPTION_TEXT} ${SKELETON_CLASSES.SKELETON_SHIMMER} ${SKELETON_CLASSES.SKELETON_PARA_94}`}
                  />
                  <p
                    className={`${INTERNAL_CLASSES.INTERNAL_DESCRIPTION_TEXT} ${SKELETON_CLASSES.SKELETON_SHIMMER} ${SKELETON_CLASSES.SKELETON_PARA_98}`}
                  />
                  <p
                    className={`${INTERNAL_CLASSES.INTERNAL_DESCRIPTION_TEXT} ${SKELETON_CLASSES.SKELETON_SHIMMER} ${SKELETON_CLASSES.SKELETON_PARA_65}`}
                  />
                </section>
              ))}
            </div>
          )}
        </div>

        <LegalFooter />
      </article>
    )
  }
}

if (!customElements.get(VIEW_TAGS.VIEW_LEGAL)) {
  customElements.define(VIEW_TAGS.VIEW_LEGAL, ViewLegal)
}
