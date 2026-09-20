/**
 * @file component-lifecycle.test.js
 * @description Tests the BaseComponent lifecycle, _updateDom style isolation,
 * event listener cleanup, store subscription cleanup, and Shadow DOM structure.
 * and the critical fix that styles are only injected once (not on every update).
 */

import { BaseComponent } from '../src/core/Component.js'
import store from '../src/core/store.js'

// Create a minimal test component for lifecycle testing
class TestComponent extends BaseComponent {
  constructor() {
    super('/* test styles */')
    this.renderCount = 0
    this.mountCount = 0
    this.destroyCount = 0
    this.updatedCount = 0
    this.storeUpdateCount = 0
    this._testValue = 'initial'
  }

  set testValue(v) {
    this._testValue = v
    if (this._isMounted) this._updateDom()
  }

  get testValue() { return this._testValue }

  onMounted() { this.mountCount++ }
  onDestroy() { this.destroyCount++ }
  onUpdated() { this.updatedCount++ }
  onStoreUpdate() { this.storeUpdateCount++ }

  render() {
    this.renderCount++
    return `<div class="test-content" data-value="${this._testValue}">content ${this.renderCount}</div>`
  }
}

if (!customElements.get('test-base-component')) {
  customElements.define('test-base-component', TestComponent)
}

// ─────────────────────────────────────────────────────────────────────────────

describe('BaseComponent Lifecycle & Architecture', () => {
  let el

  beforeEach(() => {
    document.body.innerHTML = ''
    el = document.createElement('test-base-component')
  })

  afterEach(() => {
    document.body.innerHTML = ''
  })

  // ── Shadow DOM Structure ──────────────────────────────────────────────────
  describe('1. Shadow DOM Structure', () => {
    test('attachShadow is called in constructor with mode open', () => {
      expect(el.shadowRoot).not.toBeNull()
      expect(el.shadowRoot.mode).toBe('open')
    })

    test('shadowRoot exists before connectedCallback', () => {
      expect(el.shadowRoot).toBeTruthy()
    })

    test('after mount, shadowRoot has a <style> child node', () => {
      document.body.appendChild(el)
      const style = el.shadowRoot.querySelector('style')
      expect(style).not.toBeNull()
    })

    test('after mount, shadowRoot has a content wrapper [data-content]', () => {
      document.body.appendChild(el)
      const content = el.shadowRoot.querySelector('[data-content]')
      expect(content).not.toBeNull()
    })

    test('style node contains the component styles passed to constructor', () => {
      document.body.appendChild(el)
      const style = el.shadowRoot.querySelector('style')
      expect(style.textContent).toContain('test styles')
    })

    test('style node contains BASE_HOST_STYLES with :host', () => {
      document.body.appendChild(el)
      const style = el.shadowRoot.querySelector('style')
      expect(style.textContent).toContain(':host')
    })

    test('content wrapper has display:contents style', () => {
      document.body.appendChild(el)
      const style = el.shadowRoot.querySelector('style')
      expect(style.textContent).toContain('display: contents')
    })

    test('content wrapper contains rendered HTML from render()', () => {
      document.body.appendChild(el)
      const content = el.shadowRoot.querySelector('[data-content]')
      expect(content.innerHTML).toContain('test-content')
    })
  })

  // ── Critical: Styles injected only ONCE ──────────────────────────────────
  describe('2. Style Injection — Once Only (Critical Fix)', () => {
    test('there is exactly 1 <style> node after mount', () => {
      document.body.appendChild(el)
      const styles = el.shadowRoot.querySelectorAll('style')
      expect(styles).toHaveLength(1)
    })

    test('there is still exactly 1 <style> node after _updateDom()', () => {
      document.body.appendChild(el)
      el.testValue = 'updated'
      const styles = el.shadowRoot.querySelectorAll('style')
      expect(styles).toHaveLength(1)
    })

    test('there is still exactly 1 <style> node after 5 updates', () => {
      document.body.appendChild(el)
      for (let i = 0; i < 5; i++) {
        el.testValue = `update-${i}`
      }
      const styles = el.shadowRoot.querySelectorAll('style')
      expect(styles).toHaveLength(1)
    })

    test('style node identity is preserved across updates (same node)', () => {
      document.body.appendChild(el)
      const styleNodeBefore = el.shadowRoot.querySelector('style')
      el.testValue = 'changed'
      const styleNodeAfter = el.shadowRoot.querySelector('style')
      // Same node reference — not recreated
      expect(styleNodeBefore).toBe(styleNodeAfter)
    })

    test('_styleNode property is set after mount', () => {
      document.body.appendChild(el)
      expect(el._styleNode).not.toBeNull()
    })

    test('_contentNode property is set after mount', () => {
      document.body.appendChild(el)
      expect(el._contentNode).not.toBeNull()
    })

    test('_contentNode innerHTML changes on _updateDom()', () => {
      document.body.appendChild(el)
      const before = el._contentNode.innerHTML
      el.testValue = 'new-value'
      const after = el._contentNode.innerHTML
      expect(before).not.toBe(after)
    })

    test('_styleNode.textContent does NOT change on _updateDom()', () => {
      document.body.appendChild(el)
      const styleContent = el._styleNode.textContent
      el.testValue = 'changed-value'
      expect(el._styleNode.textContent).toBe(styleContent)
    })
  })

  // ── Lifecycle Hooks ───────────────────────────────────────────────────────
  describe('3. Lifecycle Hook Execution', () => {
    test('onMounted() is called once after connectedCallback', () => {
      document.body.appendChild(el)
      expect(el.mountCount).toBe(1)
    })

    test('onMounted() is not called again on _updateDom()', () => {
      document.body.appendChild(el)
      el.testValue = 'changed'
      expect(el.mountCount).toBe(1)
    })

    test('onDestroy() is called once after disconnectedCallback', () => {
      document.body.appendChild(el)
      document.body.removeChild(el)
      expect(el.destroyCount).toBe(1)
    })

    test('onUpdated() is called from connectedCallback (initial render)', () => {
      document.body.appendChild(el)
      expect(el.updatedCount).toBeGreaterThanOrEqual(1)
    })

    test('onUpdated() is called from _updateDom()', () => {
      document.body.appendChild(el)
      const beforeCount = el.updatedCount
      el.testValue = 'changed'
      expect(el.updatedCount).toBe(beforeCount + 1)
    })

    test('_isMounted is false before connectedCallback', () => {
      expect(el._isMounted).toBe(false)
    })

    test('_isMounted is true after connectedCallback', () => {
      document.body.appendChild(el)
      expect(el._isMounted).toBe(true)
    })

    test('_isMounted is false after disconnectedCallback', () => {
      document.body.appendChild(el)
      document.body.removeChild(el)
      expect(el._isMounted).toBe(false)
    })

    test('render() is called during _renderInitial()', () => {
      document.body.appendChild(el)
      expect(el.renderCount).toBeGreaterThanOrEqual(1)
    })

    test('render() is called again during _updateDom()', () => {
      document.body.appendChild(el)
      const before = el.renderCount
      el.testValue = 'new'
      expect(el.renderCount).toBe(before + 1)
    })
  })

  // ── setState() ────────────────────────────────────────────────────────────
  describe('4. setState() Reactive Updates', () => {
    test('setState() with object merges into this.state', () => {
      document.body.appendChild(el)
      el.setState({ count: 5 })
      expect(el.state.count).toBe(5)
    })

    test('setState() with function receives current state', () => {
      document.body.appendChild(el)
      el.setState({ count: 10 })
      el.setState((s) => ({ count: s.count + 1 }))
      expect(el.state.count).toBe(11)
    })

    test('setState() does not lose previous state keys', () => {
      document.body.appendChild(el)
      el.setState({ a: 1, b: 2 })
      el.setState({ c: 3 })
      expect(el.state.a).toBe(1)
      expect(el.state.b).toBe(2)
      expect(el.state.c).toBe(3)
    })

    test('setState() triggers _updateDom() which calls onUpdated()', () => {
      document.body.appendChild(el)
      const before = el.updatedCount
      el.setState({ x: 99 })
      expect(el.updatedCount).toBe(before + 1)
    })
  })

  // ── Event Listener Management ─────────────────────────────────────────────
  describe('5. Event Listener Cleanup', () => {
    test('_eventDisposers array starts empty', () => {
      expect(el._eventDisposers).toHaveLength(0)
    })

    test('addScopedListener() adds a disposer', () => {
      const handler = () => {}
      el.addScopedListener(document.body, 'click', handler)
      expect(el._eventDisposers).toHaveLength(1)
    })

    test('addScopedListener() with null target is a no-op', () => {
      el.addScopedListener(null, 'click', () => {})
      expect(el._eventDisposers).toHaveLength(0)
    })

    test('disconnectedCallback() clears _eventDisposers', () => {
      document.body.appendChild(el)
      el.addScopedListener(document.body, 'click', () => {})
      document.body.removeChild(el)
      expect(el._eventDisposers).toHaveLength(0)
    })

    test('event handler is actually removed after disconnect', () => {
      document.body.appendChild(el)
      let fired = false
      el.addScopedListener(document.body, 'click', () => { fired = true })
      document.body.removeChild(el)
      document.body.dispatchEvent(new MouseEvent('click'))
      expect(fired).toBe(false)
    })

    test('multiple listeners are all cleaned up on disconnect', () => {
      document.body.appendChild(el)
      const counts = [0, 0, 0]
      el.addScopedListener(document.body, 'click', () => { counts[0]++ })
      el.addScopedListener(document.body, 'mouseover', () => { counts[1]++ })
      el.addScopedListener(window, 'resize', () => { counts[2]++ })
      document.body.removeChild(el)
      document.body.dispatchEvent(new MouseEvent('click'))
      document.body.dispatchEvent(new MouseEvent('mouseover'))
      expect(counts[0]).toBe(0)
      expect(counts[1]).toBe(0)
    })
  })

  // ── Store Subscriptions ───────────────────────────────────────────────────
  describe('6. Store Subscription Lifecycle', () => {
    test('_storeUnsubscribers starts empty', () => {
      expect(el._storeUnsubscribers).toHaveLength(0)
    })

    test('subscribe() adds an unsubscriber', () => {
      el.subscribe(store)
      expect(el._storeUnsubscribers).toHaveLength(1)
    })

    test('subscribe() with null store is a no-op', () => {
      el.subscribe(null)
      expect(el._storeUnsubscribers).toHaveLength(0)
    })

    test('subscribe() with store without .subscribe() is a no-op', () => {
      el.subscribe({ noSubscribeMethod: true })
      expect(el._storeUnsubscribers).toHaveLength(0)
    })

    test('disconnectedCallback() calls all store unsubscribers', () => {
      document.body.appendChild(el)
      let unsubCalled = false
      el._storeUnsubscribers.push(() => { unsubCalled = true })
      document.body.removeChild(el)
      expect(unsubCalled).toBe(true)
    })

    test('disconnectedCallback() clears _storeUnsubscribers array', () => {
      document.body.appendChild(el)
      el._storeUnsubscribers.push(() => {})
      document.body.removeChild(el)
      expect(el._storeUnsubscribers).toHaveLength(0)
    })

    test('onStoreUpdate() is not called after disconnect', () => {
      document.body.appendChild(el)
      el.subscribe(store)
      document.body.removeChild(el)
      const before = el.storeUpdateCount
      store.commit('setTheme', 'dark')
      // storeUpdateCount should not increase after disconnect
      expect(el.storeUpdateCount).toBe(before)
    })
  })

  // ── $ and $$ helpers ──────────────────────────────────────────────────────
  describe('7. $ and $$ Shadow Root Query Helpers', () => {
    test('$(selector) returns matching element from shadowRoot', () => {
      document.body.appendChild(el)
      const found = el.$('.test-content')
      expect(found).not.toBeNull()
    })

    test('$(selector) returns null when no match', () => {
      document.body.appendChild(el)
      expect(el.$('.nonexistent')).toBeNull()
    })

    test('$(selector) returns null when shadowRoot is absent', () => {
      const noShadow = { shadowRoot: null }
      const proto = BaseComponent.prototype
      const result = proto.$.call(noShadow, '.anything')
      expect(result).toBeNull()
    })

    test('$$(selector) returns array of matching elements', () => {
      document.body.appendChild(el)
      const found = el.$$('.test-content')
      expect(Array.isArray(found)).toBe(true)
      expect(found.length).toBe(1)
    })

    test('$$(selector) returns empty array when no match', () => {
      document.body.appendChild(el)
      const found = el.$$('.nonexistent')
      expect(found).toHaveLength(0)
    })

    test('$$(selector) returns empty array when shadowRoot is absent', () => {
      const noShadow = { shadowRoot: null }
      const proto = BaseComponent.prototype
      const result = proto.$$.call(noShadow, '.anything')
      expect(result).toHaveLength(0)
    })
  })

  // ── Multiple Instances ────────────────────────────────────────────────────
  describe('8. Multiple Instances — No Cross-Contamination', () => {
    test('two instances have independent shadowRoots', () => {
      const a = document.createElement('test-base-component')
      const b = document.createElement('test-base-component')
      document.body.appendChild(a)
      document.body.appendChild(b)
      expect(a.shadowRoot).not.toBe(b.shadowRoot)
    })

    test('two instances have independent render counts', () => {
      const a = document.createElement('test-base-component')
      const b = document.createElement('test-base-component')
      document.body.appendChild(a)
      document.body.appendChild(b)
      a.testValue = 'for-a-only'
      expect(a.renderCount).toBeGreaterThan(b.renderCount)
    })

    test('destroying one instance does not affect the other', () => {
      const a = document.createElement('test-base-component')
      const b = document.createElement('test-base-component')
      document.body.appendChild(a)
      document.body.appendChild(b)
      document.body.removeChild(a)
      expect(b._isMounted).toBe(true)
      expect(a._isMounted).toBe(false)
    })

    test('instances have independent event disposer lists', () => {
      const a = document.createElement('test-base-component')
      const b = document.createElement('test-base-component')
      document.body.appendChild(a)
      document.body.appendChild(b)
      a.addScopedListener(document.body, 'click', () => {})
      expect(a._eventDisposers).toHaveLength(1)
      expect(b._eventDisposers).toHaveLength(0)
    })
  })

  // ── Re-mount behavior ─────────────────────────────────────────────────────
  describe('9. Re-mount After Disconnect', () => {
    test('element can be re-mounted after disconnect', () => {
      document.body.appendChild(el)
      document.body.removeChild(el)
      document.body.appendChild(el)
      expect(el._isMounted).toBe(true)
    })

    test('onMounted() is called again on re-mount', () => {
      document.body.appendChild(el)
      document.body.removeChild(el)
      document.body.appendChild(el)
      expect(el.mountCount).toBe(2)
    })

    test('shadowRoot has exactly 1 style node after re-mount', () => {
      document.body.appendChild(el)
      document.body.removeChild(el)
      document.body.appendChild(el)
      const styles = el.shadowRoot.querySelectorAll('style')
      expect(styles).toHaveLength(1)
    })
  })

  // ── _updateDom() without shadow root ─────────────────────────────────────
  describe('10. Edge Cases', () => {
    test('_updateDom() without shadowRoot is a no-op', () => {
      // Create a minimal object that looks like a component but has no shadowRoot
      // _updateDom() guards with `if (!this.shadowRoot) return`
      const orphan = {
        shadowRoot: null,
        _contentNode: null,
        render: () => '<div>test</div>',
        onUpdated: () => {},
      }
      // Should not throw — the guard `if (!this.shadowRoot) return` prevents any DOM access
      expect(() => {
        const proto = Object.getPrototypeOf(el)
        Object.getPrototypeOf(proto)._updateDom?.call(orphan)
        // If no prototype method, just call directly
        if (!Object.getPrototypeOf(proto)._updateDom) {
          if (!orphan.shadowRoot) return // replicate the guard
        }
      }).not.toThrow()
    })

    test('render() default implementation returns empty string', () => {
      const base = Object.create(BaseComponent.prototype)
      expect(base.render()).toBe('')
    })

    test('subscribe() stores the returned unsubscribe function', () => {
      const mockStore = {
        subscribe: (fn) => {
          return () => { /* unsubscribe */ }
        }
      }
      el.subscribe(mockStore)
      expect(typeof el._storeUnsubscribers[0]).toBe('function')
    })
  })
})
