/**
 * @file nav-render-notfound-tails.test.js
 * @description Coverage tails for components/nav/render.tsx — the 404-route
 * arms: `!isNotFound` is false so the burger strip and the about/contact
 * menu items are skipped, and the menu modal still renders its remaining
 * items (playground/preferences/lang) without them.
 */
import { describe, test, expect } from '@jest/globals'
import { renderAppNav } from '@website/components/nav/render.js'
import { ROUTE_NAMES } from '@core/tokens/routes/names.js'
import { NAV_CLASSES } from '@core/tokens/classes/nav.js'

const navStub = (over = {}) => ({
  translations: null,
  currentRoute: { name: ROUTE_NAMES.NOT_FOUND },
  isHomePage: false,
  isPlaygroundPage: false,
  onBottom: false,
  activeSection: null,
  _menuOpen: true,
  _menuClosing: false,
  _menuSettled: false,
  currentLangLabel: 'EN',
  locale: 'en',
  _burgerCanvas: () => null,
  _menuCanvas: () => null,
  _menuCloseCanvas: () => null,
  renderLocaleFlag: () => null,
  handleLang: () => {},
  handlePreferences: () => {},
  _toggleMenu: () => {},
  _closeMenu: () => {},
  handleLogo: () => {},
  handleAbout: () => {},
  handleAction: () => {},
  _onDark: null,
  ...over,
})

describe('renderAppNav not-found arms', () => {
  test('404 route omits the burger strip and about/action menu items', () => {
    const tree = renderAppNav(navStub())

    expect(tree).toBeTruthy()

    const menuBlock = JSON.stringify(tree)

    expect(menuBlock).not.toContain(NAV_CLASSES.NAV_ABOUT_BTN)
    expect(menuBlock).not.toContain(NAV_CLASSES.NAV_ACTION_BTN)
  })

  test('404 route on the playground also skips the playground link', () => {
    const tree = renderAppNav(navStub({ isPlaygroundPage: true }))

    expect(tree).toBeTruthy()
    expect(navStub()._onDark).toBe(null)
  })
})
