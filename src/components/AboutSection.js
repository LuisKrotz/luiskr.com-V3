import { BaseComponent } from '../core/Component.js'
import { CLASSES, TAGS, MEDIA_DIMENSIONS, ATTRS, TEXT, IMAGE_SIZES, IDS } from '../core/constants.js'
import { h } from '../core/jsx.js'
import { calcDrawTextDelay, calcDrawTextOffset } from '../utils/wasm-layout.js'
import { stripHtml, getGravatarSrcset, getOptimizedGravatar } from '../utils/media.js'
import aboutStyles from '../sass/about.scss?inline'

export class AboutSection extends BaseComponent {
  constructor() {
    super(aboutStyles)
    this._aboutTranslations = null
    this._profilePicture = null
  }

  set aboutTranslations(val) {
    this._aboutTranslations = val
    if (this._isMounted) this._updateDom()
  }

  get aboutTranslations() {
    return this._aboutTranslations
  }

  set profilePicture(val) {
    this._profilePicture = val
    if (this._isMounted) this._updateDom()
  }

  get profilePicture() {
    return this._profilePicture
  }

  get optimizedProfilePicture() {
    return getOptimizedGravatar(this.profilePicture)
  }

  get profilePictureSrcset() {
    return getGravatarSrcset(this.profilePicture)
  }

  get aboutDrawData() {
    const col1 = this.aboutTranslations?.col1 || []
    const col2 = this.aboutTranslations?.col2 || []
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

  render() {
    const title = this.aboutTranslations?.title || ATTRS.EMPTY
    const drawData = this.aboutDrawData
    const DrawText = TAGS.DRAW_TEXT

    return (
      <section id={IDS.ABOUT} className={CLASSES.ABOUT}>
        <h2 className={CLASSES.ABOUT_TITLE} aria-label={title || TEXT.ABOUT_ME}>
          {this.aboutTranslations ? (
            <DrawText text={title} trigger={ATTRS.TRIGGER_VIEWPORT} />
          ) : (
            <span aria-hidden={ATTRS.TRUE} className={`${CLASSES.SKELETON_SHIMMER} ${CLASSES.SKELETON_ABOUT_TITLE}`} />
          )}
        </h2>
        <div className={CLASSES.ABOUT_PROFILE_SECTION}>
          <div className={CLASSES.ABOUT_PROFILE_PICTURE}>
            {this.aboutTranslations && this.profilePicture ? (
              <img
                decoding={ATTRS.DECODING_ASYNC}
                loading={ATTRS.LOADING_LAZY}
                className={CLASSES.ABOUT_PROFILE_PICTURE_IMG}
                src={this.optimizedProfilePicture}
                srcset={this.profilePictureSrcset || undefined}
                sizes={IMAGE_SIZES.PROFILE_PICTURE}
                alt={title}
                width={MEDIA_DIMENSIONS.PROFILE_SIZE}
                height={MEDIA_DIMENSIONS.PROFILE_SIZE}
              />
            ) : (
              <div className={CLASSES.ABOUT_PROFILE_PICTURE_PLACEHOLDER} />
            )}
          </div>
          <div className={CLASSES.ABOUT_PROFILE_TEXT}>
            <div className={CLASSES.ABOUT_PROFILE_TEXT_COL}>
              {this.aboutTranslations ? (
                drawData.col1.map((item) => (
                  <p key={item.key} className={CLASSES.ABOUT_ITEM_TEXT}>
                    <DrawText
                      text={item.text}
                      delay={drawData.charDelay}
                      offset={item.offset}
                      trigger={ATTRS.TRIGGER_VIEWPORT}
                    />
                  </p>
                ))
              ) : (
                <div>
                  <p className={`${CLASSES.ABOUT_ITEM_TEXT} ${CLASSES.SKELETON_SHIMMER} ${CLASSES.SKELETON_ABOUT_P1}`} />
                  <p className={`${CLASSES.ABOUT_ITEM_TEXT} ${CLASSES.SKELETON_SHIMMER} ${CLASSES.SKELETON_ABOUT_P2}`} />
                  <p className={`${CLASSES.ABOUT_ITEM_TEXT} ${CLASSES.SKELETON_SHIMMER} ${CLASSES.SKELETON_ABOUT_P3}`} />
                </div>
              )}
            </div>
            <div className={CLASSES.ABOUT_PROFILE_TEXT_COL}>
              {this.aboutTranslations ? (
                drawData.col2.map((item) => (
                  <p key={item.key} className={CLASSES.ABOUT_ITEM_TEXT}>
                    <DrawText
                      text={item.text}
                      delay={drawData.charDelay}
                      offset={item.offset}
                      trigger={ATTRS.TRIGGER_VIEWPORT}
                    />
                  </p>
                ))
              ) : (
                <div>
                  <p className={`${CLASSES.ABOUT_ITEM_TEXT} ${CLASSES.SKELETON_SHIMMER} ${CLASSES.SKELETON_ABOUT_P4}`} />
                  <p className={`${CLASSES.ABOUT_ITEM_TEXT} ${CLASSES.SKELETON_SHIMMER} ${CLASSES.SKELETON_ABOUT_P5}`} />
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    )
  }
}

if (!customElements.get(TAGS.ABOUT_SECTION)) {
  customElements.define(TAGS.ABOUT_SECTION, AboutSection)
}
