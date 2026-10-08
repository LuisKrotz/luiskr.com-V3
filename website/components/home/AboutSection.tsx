/**
 * @file AboutSection.js
 * @description <about-section> — the home page's bio block: Gravatar profile
 * photo and the bio/introduction copy rendered through <draw-text>
 * character-stagger animations. Translations come from the app dictionary
 * (FALLBACK_PAGES snapshot until Firebase loads).
 */

import { COMMON_ATTRS } from '@core/tokens/attrs/common.js'
import { MEDIA_ATTRS } from '@core/tokens/attrs/media.js'
import { ATTR_VALUES } from '@core/tokens/attrs/values.js'
import { ABOUT_CLASSES } from '@core/tokens/classes/about.js'
import { SKELETON_CLASSES } from '@core/tokens/classes/skeleton.js'
import { COMPONENT_TAGS } from '@core/tokens/elements/components.js'
import { SECTION_IDS } from '@core/tokens/ids/sections.js'
import { IMAGE_SIZES } from '@core/tokens/media/sizes.js'
import { TRANSLATION_KEYS } from '@core/tokens/routes/translation-keys.js'
import { BaseComponent } from '@core/Component.js'
import { FALLBACK_PAGES } from '@core/locale/fallback.js'
import { h } from '@core/jsx.js'
import { calcDrawTextDelay, calcDrawTextOffset } from '@core/utils/wasm/wasm-layout.js'
import { stripHtml } from '@core/utils/string.js'
import { getGravatarSrcset, getOptimizedGravatar } from '@core/utils/media.js'
import '@website/components/media/DrawText.js'
import aboutStyles from '@core/sass/components/home/about.scss?inline'
import { GENERIC_DIMENSIONS } from '@core/tokens/media/dimensions.js'

interface AboutTranslations {
  title?: string
  col1?: string[]
  col2?: string[]
}

interface DrawItem {
  key: number
  text: string
  offset: number
}

interface DrawData {
  charDelay: number
  col1: DrawItem[]
  col2: DrawItem[]
}

/**
 * The AboutSection — section class.
 */
export class AboutSection extends BaseComponent {
  private _aboutTranslations: AboutTranslations | null = null // pages/about node — title + col1/col2 paragraphs
  private _profilePicture: string | null = null // raw Gravatar URL from the CMS

  constructor() {
    super(aboutStyles)
  }

  /** Setter/getter — the about-page translation node pushed by the parent view. */

  set aboutTranslations(val: AboutTranslations | null) {
    this._aboutTranslations = val
    if (this._isMounted) this._updateDom()
  }

  get aboutTranslations(): AboutTranslations | null {
    return this._aboutTranslations
  }

  /** Setter/getter — raw Gravatar URL for the profile photo. */

  set profilePicture(val: string | null) {
    this._profilePicture = val
    if (this._isMounted) this._updateDom()
  }

  get profilePicture(): string | null {
    return this._profilePicture
  }

  /** CDN-resized Gravatar URL for the profile img. */

  get optimizedProfilePicture(): string {
    return getOptimizedGravatar(this.profilePicture || ATTR_VALUES.EMPTY)
  }

  /** Responsive srcset candidates for the profile photo. */

  get profilePictureSrcset(): string {
    return getGravatarSrcset(this.profilePicture || ATTR_VALUES.EMPTY)
  }

  /**
   * Draw-timing plan for the two bio columns. Both columns share ONE
   * 1500ms animation budget: charDelay = 1500ms ÷ totalChars (both
   * columns), and each paragraph's offset = cumulative chars before it
   * × delay — so col2's first paragraph starts exactly when col1's last
   * ends. The bio reads as a single continuous type-in flowing down the
   * left column then continuing down the right.
   */
  get aboutDrawData(): DrawData {
    const col1: string[] = this.aboutTranslations?.col1 || []
    const col2: string[] = this.aboutTranslations?.col2 || []
    const all = [...col1, ...col2]

    const totalChars = all.reduce((s, t) => s + stripHtml(t).length, 0)
    const charDelay = calcDrawTextDelay(totalChars, 1500)

    let charsBefore = 0
    const withOffsets = all.map((text, idx) => {
      const offset = calcDrawTextOffset(idx, charsBefore, charDelay)
      charsBefore += stripHtml(text).length
      return { key: idx, text, offset }
    })

    return {
      charDelay,
      col1: withOffsets.slice(0, col1.length),
      col2: withOffsets.slice(col1.length),
    }
  }

  /** JSX template for the component's shadow DOM. */

  override render() {
    const title = this.aboutTranslations?.title || ATTR_VALUES.EMPTY
    const drawData = this.aboutDrawData
    const DrawText = COMPONENT_TAGS.DRAW_TEXT

    return (
      <section id={SECTION_IDS.ABOUT} className={ABOUT_CLASSES.ABOUT}>
        <h2
          className={ABOUT_CLASSES.ABOUT_TITLE}
          aria-label={
            title ||
            (FALLBACK_PAGES[TRANSLATION_KEYS.ABOUT] as { title?: string } | undefined)?.title
          }
        >
          {this.aboutTranslations ? (
            <DrawText text={title} trigger={COMMON_ATTRS.TRIGGER_VIEWPORT} />
          ) : (
            <span
              aria-hidden={ATTR_VALUES.TRUE}
              className={`${SKELETON_CLASSES.SKELETON_SHIMMER} ${SKELETON_CLASSES.SKELETON_ABOUT_TITLE}`}
            />
          )}
        </h2>
        <div className={ABOUT_CLASSES.ABOUT_PROFILE_SECTION}>
          <div className={ABOUT_CLASSES.ABOUT_PROFILE_PICTURE}>
            {this.aboutTranslations && this.profilePicture ? (
              <img
                decoding={MEDIA_ATTRS.DECODING_ASYNC}
                loading={MEDIA_ATTRS.LOADING_LAZY}
                className={ABOUT_CLASSES.ABOUT_PROFILE_PICTURE_IMG}
                src={this.optimizedProfilePicture}
                srcset={this.profilePictureSrcset || undefined}
                sizes={IMAGE_SIZES.PROFILE_PICTURE}
                alt={title}
                width={GENERIC_DIMENSIONS.PROFILE_SIZE}
                height={GENERIC_DIMENSIONS.PROFILE_SIZE}
              />
            ) : (
              <div className={ABOUT_CLASSES.ABOUT_PROFILE_PICTURE_PLACEHOLDER} />
            )}
          </div>
          <div className={ABOUT_CLASSES.ABOUT_PROFILE_TEXT}>
            <div className={ABOUT_CLASSES.ABOUT_PROFILE_TEXT_COL}>
              {this.aboutTranslations ? (
                drawData.col1.map((item) => (
                  <p key={item.key} className={ABOUT_CLASSES.ABOUT_ITEM_TEXT}>
                    <DrawText
                      text={item.text}
                      delay={drawData.charDelay}
                      offset={item.offset}
                      trigger={COMMON_ATTRS.TRIGGER_VIEWPORT}
                    />
                  </p>
                ))
              ) : (
                <div>
                  <p
                    className={`${ABOUT_CLASSES.ABOUT_ITEM_TEXT} ${SKELETON_CLASSES.SKELETON_SHIMMER} ${SKELETON_CLASSES.SKELETON_ABOUT_P1}`}
                  />
                  <p
                    className={`${ABOUT_CLASSES.ABOUT_ITEM_TEXT} ${SKELETON_CLASSES.SKELETON_SHIMMER} ${SKELETON_CLASSES.SKELETON_ABOUT_P2}`}
                  />
                  <p
                    className={`${ABOUT_CLASSES.ABOUT_ITEM_TEXT} ${SKELETON_CLASSES.SKELETON_SHIMMER} ${SKELETON_CLASSES.SKELETON_ABOUT_P3}`}
                  />
                </div>
              )}
            </div>
            {/*
              Extended bio ("side info"): always-visible far-right column —
              distinct styling carries the secondary hierarchy without a
              collapsible control.
            */}
            <div className={ABOUT_CLASSES.ABOUT_SIDE_INFO}>
              <div className={ABOUT_CLASSES.ABOUT_PROFILE_TEXT_COL}>
                {this.aboutTranslations ? (
                  drawData.col2.map((item) => (
                    <p key={item.key} className={ABOUT_CLASSES.ABOUT_ITEM_TEXT}>
                      <DrawText
                        text={item.text}
                        delay={drawData.charDelay}
                        offset={item.offset}
                        trigger={COMMON_ATTRS.TRIGGER_VIEWPORT}
                      />
                    </p>
                  ))
                ) : (
                  <div>
                    <p
                      className={`${ABOUT_CLASSES.ABOUT_ITEM_TEXT} ${SKELETON_CLASSES.SKELETON_SHIMMER} ${SKELETON_CLASSES.SKELETON_ABOUT_P4}`}
                    />
                    <p
                      className={`${ABOUT_CLASSES.ABOUT_ITEM_TEXT} ${SKELETON_CLASSES.SKELETON_SHIMMER} ${SKELETON_CLASSES.SKELETON_ABOUT_P5}`}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  }
}

if (!customElements.get(COMPONENT_TAGS.ABOUT_SECTION)) {
  customElements.define(COMPONENT_TAGS.ABOUT_SECTION, AboutSection)
}
