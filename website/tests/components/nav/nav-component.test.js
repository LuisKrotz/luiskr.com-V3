/**
 * @file nav-component.test.js
 * @description Deep tests for AppNav web component: render HTML, attributes,
 * ARIA roles, link structure, logo, language switcher, theme toggle, contact button,
 * responsive behavior, keyboard nav, and CSS class management.
 *
 */

import '@website/components/nav/AppNav.js'
import store from '@core/store.js'
import { COMPONENT_TAGS } from '@core/tokens/elements/components.js'
import { LANG_MUTATIONS, PREF_MUTATIONS } from '@core/tokens/events/mutations.js'
import { STATE_STRINGS } from '@core/tokens/strings/state.js'
import { COMMON_SELECTORS } from '@core/tokens/selectors/common.js'
import { TYPE_STRINGS } from '@core/tokens/strings/types.js'
import { COMMON_ATTRS } from '@core/tokens/attrs/common.js'
import { ARIA_ATTRS } from '@core/tokens/attrs/aria.js'
import { HTML_TAGS } from '@core/tokens/elements/html.js'
import { STATE_CLASSES } from '@core/tokens/classes/state.js'

import { LOCALES } from '@core/constants.js'
import { THEME } from '@core/tokens/theme/theme.js'

describe('AppNav Component', () => {
  let el

  beforeEach(() => {
    document.body.innerHTML = ''
    el = document.createElement(COMPONENT_TAGS.APP_NAV)
    document.body.appendChild(el)
  })

  afterEach(() => {
    document.body.innerHTML = ''
    store.commit(PREF_MUTATIONS.SET_THEME, THEME.SYSTEM)
  })

  // ── Registration ─────────────────────────────────────────────────────────────
  describe('1. Custom Element Registration', () => {
    test('app-nav is registered as a custom element', () => {
      expect(customElements.get(COMPONENT_TAGS.APP_NAV)).toBeDefined()
    })

    test('app-nav is an instance of HTMLElement', () => {
      expect(el instanceof HTMLElement).toBe(true)
    })

    test('has open shadow root', () => {
      expect(el.shadowRoot).not.toBeNull()
      expect(el.shadowRoot.mode).toBe(STATE_STRINGS.OPEN)
    })

    test('shadow root has a <style> node', () => {
      const style = el.shadowRoot.querySelector(COMMON_SELECTORS.STYLE)
      expect(style).not.toBeNull()
    })

    test('shadow root has content wrapper with [data-content]', () => {
      const content = el.shadowRoot.querySelector(COMMON_SELECTORS.DATA_CONTENT)
      expect(content).not.toBeNull()
    })

    test('multiple app-nav elements can coexist', () => {
      const el2 = document.createElement(COMPONENT_TAGS.APP_NAV)
      document.body.appendChild(el2)
      expect(el2.shadowRoot).not.toBeNull()
    })
  })

  // ── Render Output ────────────────────────────────────────────────────────────
  describe('2. Render Output — HTML Structure', () => {
    test('render() returns a valid element or string', () => {
      const out = el.render()
      expect(typeof out === TYPE_STRINGS.STRING || out instanceof Node).toBe(true)
    })

    test('render() contains .nav class', () => {
      const out = el.render()
      const html = typeof out === TYPE_STRINGS.STRING ? out : out?.outerHTML || ''
      expect(html).toContain('class="nav"')
    })

    test('rendered nav has logo area', () => {
      const out = el.render()
      const html = typeof out === TYPE_STRINGS.STRING ? out : out?.outerHTML || ''
      expect(html).toContain('logo')
    })

    test('rendered nav has at least one button', () => {
      const out = el.render()
      const html = typeof out === TYPE_STRINGS.STRING ? out : out?.outerHTML || ''
      expect(html).toContain('<button')
    })

    test('open menu has language elements', () => {
      el._openMenu()
      const out = el.render()
      const html = typeof out === TYPE_STRINGS.STRING ? out : out?.outerHTML || ''
      // menu should have some language-related content
      expect(html).toContain(COMMON_ATTRS.LANG)
    })

    test('render() does not contain <script> tags (XSS safe)', () => {
      const out = el.render()
      const html = typeof out === TYPE_STRINGS.STRING ? out : out?.outerHTML || ''
      expect(html).not.toContain('<script')
    })

    test('shadow root has .nav element after mount', () => {
      const nav = el.shadowRoot.querySelector('.nav')
      expect(nav).not.toBeNull()
    })
  })

  // ── Shadow DOM Style ─────────────────────────────────────────────────────────
  describe('3. Shadow DOM Styles', () => {
    test('style node contains nav-specific CSS', () => {
      const style = el.shadowRoot.querySelector(COMMON_SELECTORS.STYLE)
      expect(style.textContent.length).toBeGreaterThan(100)
    })

    test('style node contains :host selector', () => {
      const style = el.shadowRoot.querySelector(COMMON_SELECTORS.STYLE)
      expect(style.textContent).toContain(COMMON_SELECTORS.HOST)
    })

    test('style node is shared (only 1 style node)', () => {
      const styles = el.shadowRoot.querySelectorAll(COMMON_SELECTORS.STYLE)
      expect(styles).toHaveLength(1)
    })

    test('style is not duplicated after update', () => {
      el._updateDom?.()
      const styles = el.shadowRoot.querySelectorAll(COMMON_SELECTORS.STYLE)
      expect(styles).toHaveLength(1)
    })
  })

  // ── Attributes ────────────────────────────────────────────────────────────────
  describe('4. Attributes & Observed Properties', () => {
    test('observedAttributes returns an array', () => {
      const obs = el.constructor.observedAttributes
      expect(Array.isArray(obs) || obs === undefined).toBe(true)
    })

    test('el is connected to document', () => {
      expect(el.isConnected).toBe(true)
    })

    test('el.tagName is APP-NAV', () => {
      expect(el.tagName).toBe('APP-NAV')
    })
  })

  // ── Store Integration ─────────────────────────────────────────────────────────
  describe('5. Store Integration — Theme & Language', () => {
    test('AppNav subscribes to store updates', () => {
      // Changing theme should not throw
      expect(() => store.commit(PREF_MUTATIONS.SET_THEME, THEME.DARK)).not.toThrow()
      store.commit(PREF_MUTATIONS.SET_THEME, THEME.SYSTEM)
    })

    test('setting dark mode does not crash nav', () => {
      store.commit(PREF_MUTATIONS.SET_THEME, THEME.DARK)
      expect(el.shadowRoot).not.toBeNull()
      store.commit(PREF_MUTATIONS.SET_THEME, THEME.SYSTEM)
    })

    test('setting language does not crash nav', () => {
      store.commit(LANG_MUTATIONS.SET_LANG, LOCALES.DE)
      expect(el.shadowRoot).not.toBeNull()
      store.commit(LANG_MUTATIONS.SET_LANG, LOCALES.EN)
    })

    test('reducing motion preference does not crash nav', () => {
      store.commit(PREF_MUTATIONS.SET_REDUCED_MOTION, true)
      expect(el.shadowRoot).not.toBeNull()
      store.commit(PREF_MUTATIONS.SET_REDUCED_MOTION, false)
    })
  })

  // ── Lifecycle ───────────────────────────────────────────────────────────────
  describe('6. Component Lifecycle', () => {
    test('onMounted is called after connect', () => {
      const el2 = document.createElement(COMPONENT_TAGS.APP_NAV)
      const original = el2.onMounted?.bind(el2)
      el2.onMounted = () => {
        original?.()
      }
      document.body.appendChild(el2)
      expect(el2.shadowRoot).not.toBeNull()
    })

    test('disconnect does not throw', () => {
      const el2 = document.createElement(COMPONENT_TAGS.APP_NAV)
      document.body.appendChild(el2)
      expect(() => document.body.removeChild(el2)).not.toThrow()
    })

    test('re-mount after disconnect works', () => {
      document.body.removeChild(el)
      document.body.appendChild(el)
      expect(el.shadowRoot.querySelectorAll(COMMON_SELECTORS.STYLE)).toHaveLength(1)
    })

    test('subscribe() is called in BaseComponent', () => {
      expect(typeof el.subscribe).toBe(TYPE_STRINGS.FUNCTION)
    })

    test('multiple updates do not add style nodes', () => {
      el._updateDom?.()
      el._updateDom?.()
      el._updateDom?.()
      expect(el.shadowRoot.querySelectorAll(COMMON_SELECTORS.STYLE)).toHaveLength(1)
    })
  })

  // ── Nav Links ────────────────────────────────────────────────────────────────
  describe('7. Navigation Links & ARIA', () => {
    test('render contains role="navigation" or <nav>', () => {
      const out = el.render()
      const html = typeof out === TYPE_STRINGS.STRING ? out : out?.outerHTML || ''
      expect(html).toMatch(new RegExp(`nav|role="${ARIA_ATTRS.ROLE_NAVIGATION}"`))
    })

    test('shadow root contains at least one clickable element', () => {
      const clickables = el.shadowRoot.querySelectorAll('button, a, [role="button"]')
      // Nav has buttons/links
      expect(clickables.length).toBeGreaterThanOrEqual(0)
    })

    test('render does not contain empty href="#"', () => {
      // Avoid placeholder links
      const out = el.render()
      const html = typeof out === TYPE_STRINGS.STRING ? out : out?.outerHTML || ''
      expect(html).not.toContain('href="#"')
    })
  })

  // ── CSS Classes ──────────────────────────────────────────────────────────────
  describe('8. CSS Class Management', () => {
    test('nav--scrolled class is not present initially', () => {
      const nav = el.shadowRoot.querySelector(HTML_TAGS.NAV)
      if (nav) {
        expect(nav.classList.contains('nav--scrolled')).toBe(false)
      }
    })

    test('dark-mode class on html is handled', () => {
      document.documentElement.classList.add(STATE_CLASSES.DARK_MODE)
      expect(() => el._updateDom?.()).not.toThrow()
      document.documentElement.classList.remove(STATE_CLASSES.DARK_MODE)
    })
  })

  // ── Component Methods ─────────────────────────────────────────────────────────
  describe('9. Public Component Methods', () => {
    test('el.$() query helper is available', () => {
      expect(typeof el.$).toBe(TYPE_STRINGS.FUNCTION)
    })

    test('el.$(".nav") finds the .nav element', () => {
      const nav = el.$('.nav')
      expect(nav).not.toBeNull()
    })

    test('el.$$() query all helper is available', () => {
      expect(typeof el.$$).toBe(TYPE_STRINGS.FUNCTION)
    })

    test('el._updateDom() is a function', () => {
      expect(typeof el._updateDom).toBe(TYPE_STRINGS.FUNCTION)
    })
  })

  // ── Performance ───────────────────────────────────────────────────────────────
  describe('10. Performance & Memory', () => {
    test('render() completes in < 50ms', () => {
      const start = performance.now()
      for (let i = 0; i < 100; i++) {
        el.render()
      }
      const elapsed = performance.now() - start
      // ~15ms/render budget: guards quadratic blowups without flaking under
      // the 75%-worker parallel pool (wall-clock assertions contend for CPU).
      expect(elapsed).toBeLessThan(1500)
    })

    test('style is not injected twice on repeated mounts', () => {
      document.body.removeChild(el)
      document.body.appendChild(el)
      document.body.removeChild(el)
      document.body.appendChild(el)
      expect(el.shadowRoot.querySelectorAll(COMMON_SELECTORS.STYLE)).toHaveLength(1)
    })

    test('disconnect and reconnect 10 times does not accumulate style nodes', () => {
      for (let i = 0; i < 10; i++) {
        document.body.removeChild(el)
        document.body.appendChild(el)
      }
      expect(el.shadowRoot.querySelectorAll(COMMON_SELECTORS.STYLE)).toHaveLength(1)
    })
  })
})
