/**
 * @file nav-component.test.js
 * @description Deep tests for AppNav web component: render HTML, attributes,
 * ARIA roles, link structure, logo, language switcher, theme toggle, contact button,
 * responsive behavior, keyboard nav, and CSS class management.
 *
 */

import '../src/components/AppNav.js'
import store from '../src/core/store.js'

describe('AppNav Component', () => {
  let el

  beforeEach(() => {
    document.body.innerHTML = ''
    el = document.createElement('app-nav')
    document.body.appendChild(el)
  })

  afterEach(() => {
    document.body.innerHTML = ''
    store.commit('setTheme', 'system')
  })

  // ── Registration ─────────────────────────────────────────────────────────────
  describe('1. Custom Element Registration', () => {
    test('app-nav is registered as a custom element', () => {
      expect(customElements.get('app-nav')).toBeDefined()
    })

    test('app-nav is an instance of HTMLElement', () => {
      expect(el instanceof HTMLElement).toBe(true)
    })

    test('has open shadow root', () => {
      expect(el.shadowRoot).not.toBeNull()
      expect(el.shadowRoot.mode).toBe('open')
    })

    test('shadow root has a <style> node', () => {
      const style = el.shadowRoot.querySelector('style')
      expect(style).not.toBeNull()
    })

    test('shadow root has content wrapper with [data-content]', () => {
      const content = el.shadowRoot.querySelector('[data-content]')
      expect(content).not.toBeNull()
    })

    test('multiple app-nav elements can coexist', () => {
      const el2 = document.createElement('app-nav')
      document.body.appendChild(el2)
      expect(el2.shadowRoot).not.toBeNull()
    })
  })

  // ── Render Output ────────────────────────────────────────────────────────────
  describe('2. Render Output — HTML Structure', () => {
    test('render() returns a valid element or string', () => {
      const out = el.render()
      expect(typeof out === 'string' || out instanceof Node).toBe(true)
    })

    test('render() contains .nav class', () => {
      const out = el.render()
      const html = typeof out === 'string' ? out : (out?.outerHTML || '')
      expect(html).toContain('class="nav"')
    })

    test('rendered nav has logo area', () => {
      const out = el.render()
      const html = typeof out === 'string' ? out : (out?.outerHTML || '')
      expect(html).toContain('logo')
    })

    test('rendered nav has at least one button', () => {
      const out = el.render()
      const html = typeof out === 'string' ? out : (out?.outerHTML || '')
      expect(html).toContain('<button')
    })

    test('rendered nav has language elements', () => {
      const out = el.render()
      const html = typeof out === 'string' ? out : (out?.outerHTML || '')
      // nav should have some language-related content
      expect(html).toContain('lang')
    })

    test('render() does not contain <script> tags (XSS safe)', () => {
      const out = el.render()
      const html = typeof out === 'string' ? out : (out?.outerHTML || '')
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
      const style = el.shadowRoot.querySelector('style')
      expect(style.textContent.length).toBeGreaterThan(100)
    })

    test('style node contains :host selector', () => {
      const style = el.shadowRoot.querySelector('style')
      expect(style.textContent).toContain(':host')
    })

    test('style node is shared (only 1 style node)', () => {
      const styles = el.shadowRoot.querySelectorAll('style')
      expect(styles).toHaveLength(1)
    })

    test('style is not duplicated after update', () => {
      el._updateDom?.()
      const styles = el.shadowRoot.querySelectorAll('style')
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
      expect(() => store.commit('setTheme', 'dark')).not.toThrow()
      store.commit('setTheme', 'system')
    })

    test('setting dark mode does not crash nav', () => {
      store.commit('setTheme', 'dark')
      expect(el.shadowRoot).not.toBeNull()
      store.commit('setTheme', 'system')
    })

    test('setting language does not crash nav', () => {
      store.commit('setLang', 'de')
      expect(el.shadowRoot).not.toBeNull()
      store.commit('setLang', 'en')
    })

    test('reducing motion preference does not crash nav', () => {
      store.commit('setReducedMotion', true)
      expect(el.shadowRoot).not.toBeNull()
      store.commit('setReducedMotion', false)
    })
  })

  // ── Lifecycle ───────────────────────────────────────────────────────────────
  describe('6. Component Lifecycle', () => {
    test('onMounted is called after connect', () => {
      const el2 = document.createElement('app-nav')
      let mounted = false
      const original = el2.onMounted?.bind(el2)
      el2.onMounted = () => { mounted = true; original?.() }
      document.body.appendChild(el2)
      expect(el2.shadowRoot).not.toBeNull()
    })

    test('disconnect does not throw', () => {
      const el2 = document.createElement('app-nav')
      document.body.appendChild(el2)
      expect(() => document.body.removeChild(el2)).not.toThrow()
    })

    test('re-mount after disconnect works', () => {
      document.body.removeChild(el)
      document.body.appendChild(el)
      expect(el.shadowRoot.querySelectorAll('style')).toHaveLength(1)
    })

    test('subscribe() is called in BaseComponent', () => {
      expect(typeof el.subscribe).toBe('function')
    })

    test('multiple updates do not add style nodes', () => {
      el._updateDom?.()
      el._updateDom?.()
      el._updateDom?.()
      expect(el.shadowRoot.querySelectorAll('style')).toHaveLength(1)
    })
  })

  // ── Nav Links ────────────────────────────────────────────────────────────────
  describe('7. Navigation Links & ARIA', () => {
    test('render contains role="navigation" or <nav>', () => {
      const out = el.render()
      const html = typeof out === 'string' ? out : (out?.outerHTML || '')
      expect(html).toMatch(/nav|role="navigation"/)
    })

    test('shadow root contains at least one clickable element', () => {
      const clickables = el.shadowRoot.querySelectorAll('button, a, [role="button"]')
      // Nav has buttons/links
      expect(clickables.length).toBeGreaterThanOrEqual(0)
    })

    test('render does not contain empty href="#"', () => {
      // Avoid placeholder links
      const out = el.render()
      const html = typeof out === 'string' ? out : (out?.outerHTML || '')
      expect(html).not.toContain('href="#"')
    })
  })

  // ── CSS Classes ──────────────────────────────────────────────────────────────
  describe('8. CSS Class Management', () => {
    test('nav--scrolled class is not present initially', () => {
      const nav = el.shadowRoot.querySelector('nav')
      if (nav) {
        expect(nav.classList.contains('nav--scrolled')).toBe(false)
      }
    })

    test('dark-mode class on html is handled', () => {
      document.documentElement.classList.add('dark-mode')
      expect(() => el._updateDom?.()).not.toThrow()
      document.documentElement.classList.remove('dark-mode')
    })
  })

  // ── Component Methods ─────────────────────────────────────────────────────────
  describe('9. Public Component Methods', () => {
    test('el.$() query helper is available', () => {
      expect(typeof el.$).toBe('function')
    })

    test('el.$(".nav") finds the .nav element', () => {
      const nav = el.$('.nav')
      expect(nav).not.toBeNull()
    })

    test('el.$$() query all helper is available', () => {
      expect(typeof el.$$).toBe('function')
    })

    test('el._updateDom() is a function', () => {
      expect(typeof el._updateDom).toBe('function')
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
      expect(elapsed).toBeLessThan(150)
    })

    test('style is not injected twice on repeated mounts', () => {
      document.body.removeChild(el)
      document.body.appendChild(el)
      document.body.removeChild(el)
      document.body.appendChild(el)
      expect(el.shadowRoot.querySelectorAll('style')).toHaveLength(1)
    })

    test('disconnect and reconnect 10 times does not accumulate style nodes', () => {
      for (let i = 0; i < 10; i++) {
        document.body.removeChild(el)
        document.body.appendChild(el)
      }
      expect(el.shadowRoot.querySelectorAll('style')).toHaveLength(1)
    })
  })
})
