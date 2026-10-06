/**
 * @file home-carousel/render.tsx — slide + template JSX.
 */

import { FORM_ATTRS } from '@/core/tokens/attrs/form.js'
import { MEDIA_ATTRS } from '@/core/tokens/attrs/media.js'
import { ATTR_VALUES } from '@/core/tokens/attrs/values.js'
import { HC_CLASSES, HC_VARIANTS } from '@/core/tokens/classes/home-carousel.js'
import { MEDIA_UI_KEYS } from '@/core/tokens/data/ui-keys.js'
import { DOM_STRINGS } from '@/core/tokens/strings/dom.js'
import { h } from '@/core/jsx.js'
import store from '@/core/store.js'
import { appText } from '@/core/locale/ui-text.js'
import type { HomeCarousel } from '../HomeCarousel.js'
import type { CarouselSlide } from './types.js'

/** JSX for one slide (cover media + title overlay / award link). */
export function renderItem(host: HomeCarousel, item: CarouselSlide | undefined) {
  if (!item) return null
  const storage = store.getters.getStorage()

  if (host.variant === HC_VARIANTS.AWARDS) {
    return (
      <a
        className={HC_CLASSES.HC_AWARD}
        href={item.link}
        target={DOM_STRINGS.BLANK}
        rel={DOM_STRINGS.NOOPENER}
      >
        {!item.media ? (
          <span className={HC_CLASSES.HC_AWARD_MEDIA}>{item.icon || ATTR_VALUES.EMPTY}</span>
        ) : (
          <img
            loading={MEDIA_ATTRS.LOADING_LAZY}
            decoding={MEDIA_ATTRS.DECODING_ASYNC}
            className={HC_CLASSES.HC_AWARD_IMG}
            src={storage + item.media.path}
            alt={item.description || ATTR_VALUES.EMPTY}
            width={item.media.width || 60}
            height={item.media.height || 60}
          />
        )}
        <span
          className={HC_CLASSES.HC_AWARD_TEXT}
          dangerouslySetInnerHTML={{ __html: item.description || ATTR_VALUES.EMPTY }}
        />
      </a>
    )
  }

  return (
    <div className={HC_CLASSES.HC_SLIDE_CONTENT}>
      {item.content || item.label || ATTR_VALUES.EMPTY}
    </div>
  )
}

/** Dot nav (awards variant only). */
function renderDots(host: HomeCarousel) {
  return (
    <div className={HC_CLASSES.HC_CONTROLS}>
      <div className={HC_CLASSES.HC_DOTS}>
        {host.items.map((_, idx) => (
          <button
            key={idx}
            type={FORM_ATTRS.BUTTON}
            className={`${HC_CLASSES.HC_DOT} ${host.currentIndex === idx ? HC_CLASSES.HC_DOT_ACTIVE : ''}`}
            aria-label={`${appText(MEDIA_UI_KEYS.MEDIA_GO_TO_SLIDE)} ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  )
}

/** Clone-ended slide (visual duplicate for the loop illusion). */
function renderCloneSlide(host: HomeCarousel, item: CarouselSlide | undefined, cloneClass: string) {
  return (
    <div
      className={`${HC_CLASSES.HC_SLIDE} ${HC_CLASSES.HC_SLIDE_CLONE} ${cloneClass}`}
      aria-hidden="true"
      inert
    >
      {renderItem(host, item)}
    </div>
  )
}

/** JSX template for the component's shadow DOM. */
export function renderHomeCarousel(host: HomeCarousel) {
  if (!host.items.length) {
    return <div className={HC_CLASSES.HC} />
  }

  const lastItem = host.items[host.items.length - 1]
  const firstItem = host.items[0]

  return (
    <div
      className={`${HC_CLASSES.HC} ${HC_CLASSES.HC}--${host.variant} ${host.isEnteredViewport ? HC_CLASSES.HC_IN_VIEW : ''}`}
    >
      {host.variant === HC_VARIANTS.AWARDS && host.showDots ? renderDots(host) : null}

      <div className={HC_CLASSES.HC_TRACK}>
        {renderCloneSlide(host, lastItem, HC_CLASSES.HC_SLIDE_CLONE_LAST)}
        {host.items.map((item, idx) => (
          <div
            key={idx}
            className={`${HC_CLASSES.HC_SLIDE} ${host.currentIndex === idx ? HC_CLASSES.HC_SLIDE_ACTIVE : ''}`}
            role="group"
            aria-label={`${idx + 1} of ${host.items.length}`}
          >
            {renderItem(host, item)}
          </div>
        ))}
        {renderCloneSlide(host, firstItem, HC_CLASSES.HC_SLIDE_CLONE_FIRST)}
      </div>
    </div>
  )
}
