/**
 * @file awards-carousel/render.tsx — slide + template JSX.
 */

import { ARIA_ATTRS } from '@core/tokens/attrs/aria.js'
import { FORM_ATTRS } from '@core/tokens/attrs/form.js'
import { MEDIA_ATTRS } from '@core/tokens/attrs/media.js'
import { ATTR_VALUES } from '@core/tokens/attrs/values.js'
import { AWC_CLASSES, AWC_VARIANTS } from '@core/tokens/classes/awards-carousel.js'
import { MEDIA_UI_KEYS } from '@core/tokens/data/ui-keys.js'
import { GENERIC_DIMENSIONS } from '@core/tokens/media/dimensions.js'
import { DOM_STRINGS } from '@core/tokens/strings/dom.js'
import { h } from '@core/jsx.js'
import store from '@core/store.js'
import { appText } from '@core/locale/ui-text.js'
import type { AwardsCarousel } from '../AwardsCarousel.js'
import type { CarouselSlide } from './types.js'

/**
 * JSX for one slide — two shapes by variant: `awards` renders an outbound
 * link (target=_blank + rel=noopener — external sites get no opener
 * access, a tabnabbing fix per MDN) with an icon span or `<img>`; the
 * `selected` variant renders plain content text. `loading=lazy` +
 * `decoding=async` keep award images off the critical path.
 * @param host The AwardsCarousel element.
 * @param item Slide data; null-safe (clones render undefined).
 * @returns Slide JSX or null.
 */
export function renderItem(host: AwardsCarousel, item: CarouselSlide | undefined) {
  if (!item) return null
  const storage = store.getters.getStorage()

  if (host.variant === AWC_VARIANTS.AWARDS) {
    return (
      <a
        className={AWC_CLASSES.AWC_AWARD}
        href={item.link}
        target={DOM_STRINGS.BLANK}
        rel={DOM_STRINGS.NOOPENER}
      >
        {!item.media ? (
          <span className={AWC_CLASSES.AWC_AWARD_MEDIA}>{item.icon || ATTR_VALUES.EMPTY}</span>
        ) : (
          <img
            loading={MEDIA_ATTRS.LOADING_LAZY}
            decoding={MEDIA_ATTRS.DECODING_ASYNC}
            className={AWC_CLASSES.AWC_AWARD_IMG}
            src={storage + item.media.path}
            alt={item.description || ATTR_VALUES.EMPTY}
            width={item.media.width || GENERIC_DIMENSIONS.AWARD_ICON_SIZE}
            height={item.media.height || GENERIC_DIMENSIONS.AWARD_ICON_SIZE}
          />
        )}
        <span
          className={AWC_CLASSES.AWC_AWARD_TEXT}
          dangerouslySetInnerHTML={{ __html: item.description || ATTR_VALUES.EMPTY }}
        />
      </a>
    )
  }

  return (
    <div className={AWC_CLASSES.AWC_SLIDE_CONTENT}>
      {item.content || item.label || ATTR_VALUES.EMPTY}
    </div>
  )
}

/**
 * Dot nav row (awards variant only) — one button per slide; the active
 * dot gets `aw-c-dot--active`, and each carries an aria-label built from
 * the localized "go to slide" string + 1-based position.
 */
function renderDots(host: AwardsCarousel) {
  return (
    <div className={AWC_CLASSES.AWC_CONTROLS}>
      <div className={AWC_CLASSES.AWC_DOTS}>
        {host.items.map((_, idx) => (
          <button
            key={idx}
            type={FORM_ATTRS.BUTTON}
            className={`${AWC_CLASSES.AWC_DOT} ${host.currentIndex === idx ? AWC_CLASSES.AWC_DOT_ACTIVE : ATTR_VALUES.EMPTY}`}
            aria-label={`${appText(MEDIA_UI_KEYS.MEDIA_GO_TO_SLIDE)} ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  )
}

/**
 * Clone-ended slide — a visual duplicate of the first/last real slide so
 * the loop wraps seamlessly. `aria-hidden` + `inert` make it invisible to
 * AT and unfocusable: it's markup for the eye only; nav.ts teleports to
 * the real twin once the scroll animation lands on the clone.
 */
function renderCloneSlide(
  host: AwardsCarousel,
  item: CarouselSlide | undefined,
  cloneClass: string
) {
  return (
    <div
      className={`${AWC_CLASSES.AWC_SLIDE} ${AWC_CLASSES.AWC_SLIDE_CLONE} ${cloneClass}`}
      aria-hidden={ATTR_VALUES.TRUE}
      inert
    >
      {renderItem(host, item)}
    </div>
  )
}

/**
 * JSX template for the component's shadow DOM — the track is
 * `[clone(last)] …real slides… [clone(first)]`; the clone ends are what
 * make the infinite wrap seamless (see nav.ts). An empty item list still
 * emits the root wrapper so the element keeps its box for layout.
 * @param host The AwardsCarousel element.
 */
export function renderAwardsCarousel(host: AwardsCarousel) {
  if (!host.items.length) {
    return <div className={AWC_CLASSES.AWC} />
  }

  const lastItem = host.items[host.items.length - 1]
  const firstItem = host.items[0]

  return (
    <div
      className={`${AWC_CLASSES.AWC} ${AWC_CLASSES.AWC}--${host.variant} ${host.isEnteredViewport ? AWC_CLASSES.AWC_IN_VIEW : ''}`}
    >
      {host.variant === AWC_VARIANTS.AWARDS && host.showDots ? renderDots(host) : null}

      <div className={AWC_CLASSES.AWC_TRACK}>
        {renderCloneSlide(host, lastItem, AWC_CLASSES.AWC_SLIDE_CLONE_LAST)}
        {host.items.map((item, idx) => (
          <div
            key={idx}
            className={`${AWC_CLASSES.AWC_SLIDE} ${host.currentIndex === idx ? AWC_CLASSES.AWC_SLIDE_ACTIVE : ATTR_VALUES.EMPTY}`}
            role={ARIA_ATTRS.ROLE_GROUP}
            aria-label={`${idx + 1} of ${host.items.length}`}
          >
            {renderItem(host, item)}
          </div>
        ))}
        {renderCloneSlide(host, firstItem, AWC_CLASSES.AWC_SLIDE_CLONE_FIRST)}
      </div>
    </div>
  )
}
