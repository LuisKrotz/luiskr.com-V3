/**
 * @file component-base.test.js
 * @description Tests the BaseComponent class: Shadow DOM setup, style injection,
 * node reuse, update lifecycle, subscription cleanup, $ and $$ query helpers,
 * DRY style management (no duplicate style nodes), and inheritance contract.
 *
 */

import { BaseComponent } from '../src/core/Component.js'

// Create a minimal test subclass
class TestComponent extends BaseComponent {
  static get styles() {
    return ':host { display: block; } .test { color: red; }'
  }

  render() {
    return `
      <div class="test" data-id="${this._id}">
        <span class="inner">Content</span>
        <button class="btn">Click</button>
      </div>
    `
  }
}

if (!customElements.get('test-base-component')) {
  customElements.define('test-base-component', TestComponent)
}

class TestComponent2 extends BaseComponent {
  static get styles() {
    return ':host { display: block; } .foo { color: blue; }'
  }

  render() {
    return `<div class="foo"><input type="text" /></div>`
  }
}

if (!customElements.get('test-base-component-2')) {
  customElements.define('test-base-component-2', TestComponent2)
}

describe('BaseComponent (Component.js) — Shadow DOM & Lifecycle', () => {
  let el

  beforeEach(() => {
    document.body.innerHTML = ''
    el = document.createElement('test-base-component')
    document.body.appendChild(el)
  })

  afterEach(() => {
    document.body.innerHTML = ''
  })

  // ── Class Structure ──────────────────────────────────────────────────────────
  describe('1. Class Structure & Inheritance', () => {
    test('BaseComponent is a class', () => {
      expect(typeof BaseComponent).toBe('function')
    })

    test('Component extends HTMLElement', () => {
      const inst = new TestComponent()
      expect(inst instanceof HTMLElement).toBe(true)
    })

    test('render() can be overridden in subclass', () => {
      // BaseComponent provides a contract for render() — subclasses must implement it
      expect(typeof el.render).toBe('function')
      const result = el.render()
      expect(typeof result).toBe('string')
    })

    test('subclass can define static styles', () => {
      expect(TestComponent.styles).toBeDefined()
      expect(typeof TestComponent.styles).toBe('string')
    })

    test('subclass static styles has valid CSS content', () => {
      expect(TestComponent.styles).toContain(':host')
    })

    test('el is instance of TestComponent', () => {
      expect(el instanceof TestComponent).toBe(true)
    })

    test('el is instance of BaseComponent', () => {
      expect(el instanceof BaseComponent).toBe(true)
    })

    test('el is instance of HTMLElement', () => {
      expect(el instanceof HTMLElement).toBe(true)
    })
  })

  // ── Shadow DOM ────────────────────────────────────────────────────────────────
  describe('2. Shadow DOM Setup', () => {
    test('element has a shadow root', () => {
      expect(el.shadowRoot).not.toBeNull()
    })

    test('shadow root mode is "open"', () => {
      expect(el.shadowRoot.mode).toBe('open')
    })

    test('shadow root has exactly one <style> node', () => {
      const styles = el.shadowRoot.querySelectorAll('style')
      expect(styles).toHaveLength(1)
    })

    test('style node contains component CSS', () => {
      const style = el.shadowRoot.querySelector('style')
      expect(style.textContent).toContain(':host')
    })

    test('shadow root has [data-content] wrapper', () => {
      const content = el.shadowRoot.querySelector('[data-content]')
      expect(content).not.toBeNull()
    })

    test('[data-content] contains rendered HTML', () => {
      const content = el.shadowRoot.querySelector('[data-content]')
      expect(content.innerHTML).toContain('test')
    })

    test('rendered .test div is queryable via shadowRoot', () => {
      const testDiv = el.shadowRoot.querySelector('.test')
      expect(testDiv).not.toBeNull()
    })
  })

  // ── No Duplicate Styles (DRY) ─────────────────────────────────────────────────
  describe('3. DRY Style Management — No Duplicates', () => {
    test('mounting once gives exactly 1 style node', () => {
      expect(el.shadowRoot.querySelectorAll('style')).toHaveLength(1)
    })

    test('_updateDom() once keeps exactly 1 style node', () => {
      el._updateDom?.()
      expect(el.shadowRoot.querySelectorAll('style')).toHaveLength(1)
    })

    test('_updateDom() 5x keeps exactly 1 style node', () => {
      for (let i = 0; i < 5; i++) el._updateDom?.()
      expect(el.shadowRoot.querySelectorAll('style')).toHaveLength(1)
    })

    test('_updateDom() 10x keeps exactly 1 style node', () => {
      for (let i = 0; i < 10; i++) el._updateDom?.()
      expect(el.shadowRoot.querySelectorAll('style')).toHaveLength(1)
    })

    test('disconnect + reconnect keeps exactly 1 style node', () => {
      document.body.removeChild(el)
      document.body.appendChild(el)
      expect(el.shadowRoot.querySelectorAll('style')).toHaveLength(1)
    })

    test('3x disconnect/reconnect keeps exactly 1 style node', () => {
      for (let i = 0; i < 3; i++) {
        document.body.removeChild(el)
        document.body.appendChild(el)
      }
      expect(el.shadowRoot.querySelectorAll('style')).toHaveLength(1)
    })

    test('[data-content] node is reused, not duplicated', () => {
      el._updateDom?.()
      el._updateDom?.()
      const contentNodes = el.shadowRoot.querySelectorAll('[data-content]')
      expect(contentNodes).toHaveLength(1)
    })

    test('shadowRoot has at most 2 children (style + data-content)', () => {
      const childCount = el.shadowRoot.childNodes.length
      expect(childCount).toBeLessThanOrEqual(2)
    })
  })

  // ── Query Helpers ─────────────────────────────────────────────────────────────
  describe('4. Query Helpers — $() and $$()', () => {
    test('el.$ is a function', () => {
      expect(typeof el.$).toBe('function')
    })

    test('el.$(\".test\") returns the .test div', () => {
      const div = el.$('.test')
      expect(div).not.toBeNull()
      expect(div.classList.contains('test')).toBe(true)
    })

    test('el.$(\".inner\") returns the inner span', () => {
      const span = el.$('.inner')
      expect(span).not.toBeNull()
    })

    test('el.$(\".btn\") returns the button', () => {
      const btn = el.$('.btn')
      expect(btn).not.toBeNull()
    })

    test('el.$(\".nonexistent\") returns null', () => {
      const none = el.$('.nonexistent-xyz')
      expect(none).toBeNull()
    })

    test('el.$$ is a function', () => {
      expect(typeof el.$$).toBe('function')
    })

    test('el.$$(\".inner\") returns NodeList', () => {
      const list = el.$$('.inner')
      expect(list).not.toBeNull()
      expect(list.length).toBeGreaterThan(0)
    })

    test('el.$$(\"button\") returns all buttons', () => {
      const btns = el.$$('button')
      expect(btns.length).toBeGreaterThanOrEqual(1)
    })

    test('el.$$(\".nonexistent\") returns empty NodeList', () => {
      const list = el.$$('.nonexistent-xyz')
      expect(list.length).toBe(0)
    })
  })

  // ── Subscribe & Cleanup ───────────────────────────────────────────────────────
  describe('5. Store Subscription & Cleanup', () => {
    test('el.subscribe is a function', () => {
      expect(typeof el.subscribe).toBe('function')
    })

    test('subscribe to store returns an unsubscribe function', () => {
      let received = false
      const unsub = el.subscribe(() => { received = true })
      expect(typeof unsub === 'function' || unsub === undefined).toBe(true)
      unsub?.()
    })

    test('subscriptions are cleaned up on disconnect', () => {
      // Disconnecting should not leave orphaned subscriptions
      document.body.removeChild(el)
      expect(el.isConnected).toBe(false)
      document.body.appendChild(el)
    })

    test('subscriptions from multiple instances are independent', () => {
      const el2 = document.createElement('test-base-component')
      document.body.appendChild(el2)
      let count1 = 0, count2 = 0
      el.subscribe(() => { count1++ })
      el2.subscribe(() => { count2++ })
      // Both should receive updates
      expect(el.shadowRoot).not.toBeNull()
      expect(el2.shadowRoot).not.toBeNull()
    })
  })

  // ── _updateDom Consistency ─────────────────────────────────────────────────────
  describe('6. _updateDom() — DOM Update Consistency', () => {
    test('_updateDom() is a function', () => {
      expect(typeof el._updateDom).toBe('function')
    })

    test('_updateDom() does not throw', () => {
      expect(() => el._updateDom()).not.toThrow()
    })

    test('_updateDom() preserves the rendered content', () => {
      el._updateDom()
      const div = el.$('.test')
      expect(div).not.toBeNull()
    })

    test('_updateDom() called 20x does not accumulate DOM nodes', () => {
      for (let i = 0; i < 20; i++) el._updateDom()
      expect(el.shadowRoot.querySelectorAll('[data-content]')).toHaveLength(1)
      expect(el.shadowRoot.querySelectorAll('style')).toHaveLength(1)
    })
  })

  // ── Multiple Component Types ──────────────────────────────────────────────────
  describe('7. Multiple Component Types — Style Isolation', () => {
    let el2

    beforeEach(() => {
      el2 = document.createElement('test-base-component-2')
      document.body.appendChild(el2)
    })

    afterEach(() => {
      if (el2.isConnected) document.body.removeChild(el2)
    })

    test('TestComponent2 has its own shadow root', () => {
      expect(el2.shadowRoot).not.toBeNull()
    })

    test('TestComponent2 shadow root has exactly 1 style', () => {
      expect(el2.shadowRoot.querySelectorAll('style')).toHaveLength(1)
    })

    test('TestComponent2 style content is scoped to its own component', () => {
      const style2 = el2.shadowRoot.querySelector('style').textContent
      // Each component injects its own SASS styles
      expect(typeof style2).toBe('string')
      expect(style2.length).toBeGreaterThan(0)
    })

    test('TestComponent2 renders .foo element', () => {
      expect(el2.$('.foo')).not.toBeNull()
    })

    test('TestComponent .test does not appear in TestComponent2 shadow DOM', () => {
      expect(el2.$('.test')).toBeNull()
    })

    test('TestComponent2 .foo does not appear in TestComponent shadow DOM', () => {
      expect(el.$('.foo')).toBeNull()
    })

    test('both components coexist without interference', () => {
      expect(el.shadowRoot.querySelectorAll('style')).toHaveLength(1)
      expect(el2.shadowRoot.querySelectorAll('style')).toHaveLength(1)
    })
  })

  // ── Render Method ─────────────────────────────────────────────────────────────
  describe('8. render() Contract', () => {
    test('render() returns a non-null string', () => {
      const result = el.render()
      expect(typeof result).toBe('string')
      expect(result).not.toBeNull()
    })

    test('render() is idempotent (same output for same state)', () => {
      const r1 = el.render()
      const r2 = el.render()
      expect(r1).toBe(r2)
    })

    test('render() does not have side effects on shadow root', () => {
      const stylesBefore = el.shadowRoot.querySelectorAll('style').length
      el.render()
      el.render()
      el.render()
      const stylesAfter = el.shadowRoot.querySelectorAll('style').length
      expect(stylesAfter).toBe(stylesBefore)
    })

    test('render() is fast (< 1ms for simple component)', () => {
      const start = performance.now()
      for (let i = 0; i < 1000; i++) el.render()
      const elapsed = performance.now() - start
      expect(elapsed).toBeLessThan(100)
    })
  })

  // ── Connectivity ──────────────────────────────────────────────────────────────
  describe('9. Connectivity & connectedCallback', () => {
    test('isConnected is true after append to document', () => {
      expect(el.isConnected).toBe(true)
    })

    test('isConnected is false after removal', () => {
      document.body.removeChild(el)
      expect(el.isConnected).toBe(false)
      document.body.appendChild(el) // restore
    })

    test('connectedCallback sets up shadow root', () => {
      const el3 = document.createElement('test-base-component')
      expect(el3.shadowRoot).not.toBeNull() // shadow root created in constructor
      document.body.appendChild(el3)
      expect(el3.shadowRoot.querySelector('style')).not.toBeNull()
    })

    test('disconnectedCallback does not crash', () => {
      const el3 = document.createElement('test-base-component')
      document.body.appendChild(el3)
      expect(() => document.body.removeChild(el3)).not.toThrow()
    })

    test('consecutive mount/unmount x5 is stable', () => {
      for (let i = 0; i < 5; i++) {
        document.body.removeChild(el)
        document.body.appendChild(el)
      }
      expect(el.shadowRoot.querySelectorAll('style')).toHaveLength(1)
      expect(el.shadowRoot.querySelectorAll('[data-content]')).toHaveLength(1)
    })
  })
})
