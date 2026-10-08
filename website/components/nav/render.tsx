/**
 * @file nav-render.tsx
 * @description JSX template for <app-nav>, extracted from AppNav.tsx —
 * logo button, burger strip, and the fullscreen menu overlay (the single
 * menu for every breakpoint). Pure render: reads host getters/state and
 * calls the host's delegate methods; returns an empty string while the
 * media-expand modal is open so the nav can't compete with its chrome.
 * The CTA label flips Contact → Scroll-up → Related by scroll state and
 * route; the menu items mirror the same conditional logic.
 */

import { BASE_TITLE } from '@core/tokens/routes.js'
import { ARIA_ATTRS } from '@core/tokens/attrs/aria.js'
import { FORM_ATTRS } from '@core/tokens/attrs/form.js'
import { ATTR_VALUES } from '@core/tokens/attrs/values.js'
import { SECTIONS } from '@core/tokens/base.js'
import { NAV_BURGER_CLASSES, NAV_CLASSES, NAV_MENU_CLASSES } from '@core/tokens/classes/nav.js'
import { PREF_CLASSES } from '@core/tokens/classes/preferences.js'
import { CMS_KEYS } from '@core/tokens/data/cms-keys.js'
import { NAV_UI_KEYS, SECTION_UI_KEYS } from '@core/tokens/data/ui-keys.js'
import { ROUTE_NAMES } from '@core/tokens/routes/names.js'
import { COMPONENT_TAGS } from '@core/tokens/elements/components.js'
import { CHAR_STRINGS } from '@core/tokens/strings/chars.js'
import { MENU_CSS_PROPS } from '@core/tokens/css/menu.js'
import { h } from '@core/jsx.js'
import '@website/components/media/DrawText.js'
import store from '@core/store.js'
import router from '@core/router/router.js'
import { localePath } from '@core/i18n.js'
import { appText } from '@core/locale/ui-text.js'
import type { AppNav } from './AppNav.js'
import { DRAW_TIMINGS } from '@core/tokens/media/dimensions.js'

/**
 * Renders the <app-nav> template: logo, burger strip, and the fullscreen
 * menu overlay. Returns '' while the media-expand modal is open — an empty
 * render wipes the nav DOM so its z-index/focus can never compete with the
 * modal chrome. The CTA label chain (contact → scroll-up at page bottom →
 * related on project routes) mirrors the menu item order.
 * @param nav AppNav instance — reads its getters/state, calls delegates.
 * @returns JSX tree, or '' while a modal owns the screen.
 */
export const renderAppNav = (nav: AppNav) => {
  const modal = store.getters.getModal()
  if (modal?.open === true) {
    return ATTR_VALUES.EMPTY
  }

  const t = nav.translations
  const title = t?.title || BASE_TITLE

  const aboutDesc = t?.about?.description || appText(SECTION_UI_KEYS.ABOUT_DESCRIPTION)

  const isNotFound = nav.currentRoute?.name === ROUTE_NAMES.NOT_FOUND

  const isProjectRoute = nav.currentRoute?.meta?.projectRoute === true

  let actionLabel = t?.contact || appText(CMS_KEYS.CONTACT)

  // CTA label precedence: near document bottom → "scroll up" (returning
  // beats dead-ends); on a project page → "related" (jumps to related
  // projects); otherwise plain "contact".
  if (nav.onBottom) {
    actionLabel = t?.scrollup || appText(NAV_UI_KEYS.SCROLL_UP)
  } else if (isProjectRoute) {
    actionLabel = t?.related || appText(CMS_KEYS.RELATED)
  }

  const logoClasses = `${NAV_CLASSES.NAV_LINK} ${!nav.isHomePage ? NAV_CLASSES.NAV_BACK : CHAR_STRINGS.EMPTY} ${nav.isHomePage && nav.activeSection === SECTIONS.HOME ? NAV_CLASSES.NAV_ACTIVE : CHAR_STRINGS.EMPTY} ${NAV_CLASSES.NAV_LOGO_BTN}`

  const aboutActive = nav.isHomePage && nav.activeSection === SECTIONS.ABOUT && !nav.onBottom

  const actionActive = nav.onBottom || (nav.isHomePage && nav.activeSection === SECTIONS.CONTACT)

  const itemClass = (active: boolean) =>
    `${NAV_MENU_CLASSES.NAV_MENU_MODAL_ITEM}${active ? ` ${NAV_MENU_CLASSES.NAV_MENU_MODAL_ITEM_ACTIVE}` : CHAR_STRINGS.EMPTY}`

  // Letters draw first (draw-text stagger), then the item's own underline
  // sweeps in — --draw-ms = offset + chars·delay + one draw duration, so the
  // line lands the moment the label finishes drawing.
  let itemIdx = 0

  const drawTiming = (label: string) => {
    const offset = DRAW_TIMINGS.MENU_LABEL_OFFSET_MS + itemIdx * DRAW_TIMINGS.MENU_LABEL_STAGGER_MS

    itemIdx++

    return {
      offset,
      underline:
        offset +
        Math.max(0, label.length - 1) * DRAW_TIMINGS.MENU_LABEL_CHAR_DELAY +
        DRAW_TIMINGS.DRAW_ANIM_EXTRA_MS,
    }
  }

  const DrawText = COMPONENT_TAGS.DRAW_TEXT

  // The label also lives in the element's light DOM: textContent stays
  // populated for tests/no-upgrade paths while the shadow char spans do
  // the drawing. Unslotted light children are never rendered.
  const itemLabel = (label: string, offset: number) => (
    <DrawText text={label} delay={DRAW_TIMINGS.MENU_LABEL_CHAR_DELAY} offset={offset}>
      {label}
    </DrawText>
  )

  const menuLabel = (t?.menu || appText(NAV_UI_KEYS.MENU)) as string

  // The space playground's scene is always dark — the nav needs the
  // light-ink variant there regardless of the global theme, otherwise
  // light mode paints dark links over the dark canvas.
  const onDark =
    (nav.isHomePage && (nav.onBottom || nav.activeSection === SECTIONS.CONTACT)) ||
    nav.isPlaygroundPage

  nav._onDark = onDark

  return (
    <nav
      className={`${NAV_CLASSES.NAV}${onDark ? ` ${NAV_CLASSES.NAV_ON_DARK}` : CHAR_STRINGS.EMPTY}${nav.isPlaygroundPage ? ` ${NAV_CLASSES.NAV_PLAYGROUND}` : CHAR_STRINGS.EMPTY}`}
      role={ARIA_ATTRS.ROLE_NAVIGATION}
    >
      <button
        className={logoClasses}
        type={FORM_ATTRS.TYPE_BUTTON}
        aria-label={title}
        onClick={(e: Event) => nav.handleLogo(e)}
      >
        <DrawText text={title} delay={DRAW_TIMINGS.MENU_LABEL_CHAR_DELAY} offset={0} visible>
          {title}
        </DrawText>
      </button>

      {!isNotFound && (
        <div className={`${NAV_CLASSES.NAV_MOBILE_STRIP} ${NAV_BURGER_CLASSES.NAV_BURGER_WRAP}`}>
          {nav._burgerCanvas(menuLabel)}
          <button
            className={NAV_BURGER_CLASSES.NAV_BURGER_FALLBACK}
            type={FORM_ATTRS.TYPE_BUTTON}
            aria-label={menuLabel}
            aria-expanded={nav._menuOpen ? ATTR_VALUES.TRUE : ATTR_VALUES.FALSE}
            onClick={() => nav._toggleMenu()}
          >
            <span className={NAV_BURGER_CLASSES.NAV_BURGER_LINE} />
          </button>
        </div>
      )}

      {/* Fullscreen menu modal — the single menu for every breakpoint */}
      <div
        className={`${NAV_MENU_CLASSES.NAV_MENU_MODAL}${nav._menuOpen ? ` ${NAV_MENU_CLASSES.NAV_MENU_MODAL_OPEN}` : CHAR_STRINGS.EMPTY}${nav._menuClosing ? ` ${NAV_MENU_CLASSES.NAV_MENU_MODAL_CLOSING}` : CHAR_STRINGS.EMPTY}${nav._menuSettled ? ` ${NAV_MENU_CLASSES.NAV_MENU_MODAL_SETTLED}` : CHAR_STRINGS.EMPTY}`}
      >
        {nav._menuOpen ? nav._menuCanvas() : null}

        <div className={NAV_MENU_CLASSES.NAV_MENU_MODAL_FALLBACK} aria-hidden={ATTR_VALUES.TRUE} />

        <div className={NAV_MENU_CLASSES.NAV_MENU_MODAL_HEADER}>
          <button
            className={PREF_CLASSES.PREF_CLOSE_BTN}
            type={FORM_ATTRS.TYPE_BUTTON}
            aria-label={t?.close || appText(NAV_UI_KEYS.CLOSE)}
            onClick={() => nav._closeMenu()}
          >
            {nav._menuOpen ? nav._menuCloseCanvas() : null}
          </button>
        </div>

        {nav._menuOpen &&
          (() => {
            const aboutLabel = String(aboutDesc)
            const actionText = String(actionLabel)
            const playgroundLabel = String(t?.earthPlayground || appText(CMS_KEYS.EARTH_PLAYGROUND))
            const prefLabel = String(t?.preferences || appText(NAV_UI_KEYS.PREFERENCES))
            const langLabel = String(nav.currentLangLabel)

            const items: Array<{
              label: string
              cls: string
              onClick: (e: Event) => void
              prefix?: unknown
              title?: string
            }> = []

            if (!isNotFound) {
              items.push({
                label: aboutLabel,
                cls: NAV_CLASSES.NAV_ABOUT_BTN,
                onClick: (e: Event) => {
                  nav._closeMenu()

                  nav.handleAbout(e)
                },
              })
            }

            if (!isNotFound) {
              items.push({
                label: actionText,
                cls: `${NAV_CLASSES.NAV_ACTION_BTN}${nav.onBottom ? ` ${NAV_CLASSES.NAV_SCROLL_UP}` : CHAR_STRINGS.EMPTY}`,
                onClick: (e: Event) => {
                  nav._closeMenu()

                  nav.handleAction(e)
                },
              })
            }

            if (!nav.isPlaygroundPage) {
              items.push({
                label: playgroundLabel,
                cls: CHAR_STRINGS.EMPTY,
                onClick: () => {
                  nav._closeMenu()

                  router.push(localePath(CMS_KEYS.EARTH_PLAYGROUND, nav.locale))
                },
              })
            }

            items.push({
              label: prefLabel,
              cls: NAV_CLASSES.NAV_PREF_BTN,
              onClick: (e: Event) => nav.handlePreferences(e),
            })

            // The docs portal is English-only — the language switcher is
            // suppressed there (prefs/about/playground/contact remain).
            if (!nav.currentRoute?.meta?.docsRoute) {
              items.push({
                label: langLabel,
                cls: `${NAV_MENU_CLASSES.NAV_MENU_MODAL_FLAG} ${NAV_CLASSES.NAV_LANG_OPEN_BTN}`,
                title: nav.currentLangLabel,
                prefix: nav.renderLocaleFlag(),
                onClick: (e: Event) => nav.handleLang(e),
              })
            }

            return (
              <div className={NAV_MENU_CLASSES.NAV_MENU_MODAL_CONTENT}>
                {items.map((item) => {
                  const timing = drawTiming(item.label)

                  // Active highlighting: only about/action rows can light
                  // up — matched by class since items are plain data.
                  const active =
                    item.cls === NAV_CLASSES.NAV_ABOUT_BTN
                      ? aboutActive
                      : item.cls.includes(NAV_CLASSES.NAV_ACTION_BTN)
                        ? actionActive
                        : false

                  return (
                    <button
                      className={`${itemClass(active)} ${item.cls}`.trim()}
                      type={FORM_ATTRS.TYPE_BUTTON}
                      aria-label={item.label}
                      title={item.title || undefined}
                      style={{ [MENU_CSS_PROPS.DRAW_MS]: `${timing.underline}ms` }}
                      onClick={item.onClick}
                    >
                      {item.prefix}
                      {itemLabel(item.label, timing.offset)}
                    </button>
                  )
                })}
              </div>
            )
          })()}
      </div>
    </nav>
  )
}
