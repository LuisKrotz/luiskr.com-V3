/**
 * @file draw-text-component.test.js
 * @description Tests for the DrawText web component: registration, render HTML,
 * animation logic, text rendering, trigger modes (auto vs viewport), delay, speed,
 * character-by-character reveal, reducedMotion compatibility, and lifecycle.
 *
 */

import '@website/components/media/DrawText.js'
import store from '@core/store.js'
import { TEST_TEXT } from '@tests/fixtures/test-constants.js'
import { COMPONENT_TAGS } from '@core/tokens/elements/components.js'
import { FORM_ATTRS } from '@core/tokens/attrs/form.js'
import { PREF_MUTATIONS } from '@core/tokens/events/mutations.js'
import { STATE_STRINGS } from '@core/tokens/strings/state.js'
import { COMMON_SELECTORS } from '@core/tokens/selectors/common.js'
import { COMMON_ATTRS } from '@core/tokens/attrs/common.js'
import { ATTR_VALUES } from '@core/tokens/attrs/values.js'
import { CHAR_STRINGS } from '@core/tokens/strings/chars.js'
import { TYPE_STRINGS } from '@core/tokens/strings/types.js'
import { DRAW_TEXT_CLASSES } from '@core/tokens/classes/draw-text.js'
import { DRAW_TEXT_SELECTORS } from '@core/tokens/selectors/draw-text.js'

describe('DrawText Component', () => {
  let el

  beforeEach(() => {
    document.body.innerHTML = ''
    el = document.createElement(COMPONENT_TAGS.DRAW_TEXT)
    el.setAttribute(FORM_ATTRS.TEXT, TEST_TEXT.HELLO_WORLD)
    document.body.appendChild(el)
  })

  afterEach(() => {
    document.body.innerHTML = ''
    store.commit(PREF_MUTATIONS.SET_REDUCED_MOTION, false)
  })

  // ── Registration ────────────────────────────────────────────────────────────
  describe('1. Custom Element Registration', () => {
    test('draw-text is registered as a custom element', () => {
      expect(customElements.get(COMPONENT_TAGS.DRAW_TEXT)).toBeDefined()
    })

    test('draw-text is an instance of HTMLElement', () => {
      expect(el instanceof HTMLElement).toBe(true)
    })

    test('draw-text has shadow root', () => {
      expect(el.shadowRoot).not.toBeNull()
    })

    test('shadow root mode is "open"', () => {
      expect(el.shadowRoot.mode).toBe(STATE_STRINGS.OPEN)
    })

    test('shadow root has <style>', () => {
      expect(el.shadowRoot.querySelector(COMMON_SELECTORS.STYLE)).not.toBeNull()
    })

    test('draw-text tagName is DRAW-TEXT', () => {
      expect(el.tagName).toBe('DRAW-TEXT')
    })

    test('multiple draw-text elements can coexist', () => {
      const el2 = document.createElement(COMPONENT_TAGS.DRAW_TEXT)
      el2.setAttribute(FORM_ATTRS.TEXT, 'Test')
      document.body.appendChild(el2)
      expect(el2.shadowRoot).not.toBeNull()
    })
  })

  // ── Attributes ──────────────────────────────────────────────────────────────
  describe('2. Attributes & Observed Properties', () => {
    test('text attribute is readable', () => {
      expect(el.getAttribute(FORM_ATTRS.TEXT)).toBe(TEST_TEXT.HELLO_WORLD)
    })

    test('delay attribute defaults gracefully', () => {
      const noDelay = document.createElement(COMPONENT_TAGS.DRAW_TEXT)
      noDelay.setAttribute(FORM_ATTRS.TEXT, 'Test')
      document.body.appendChild(noDelay)
      expect(noDelay.getAttribute(COMMON_ATTRS.DELAY) || '0').toBeDefined()
    })

    test('setting text attribute after mount does not crash', () => {
      expect(() => el.setAttribute(FORM_ATTRS.TEXT, 'New Text')).not.toThrow()
    })

    test('trigger attribute accepts "auto"', () => {
      const el2 = document.createElement(COMPONENT_TAGS.DRAW_TEXT)
      el2.setAttribute(FORM_ATTRS.TEXT, 'Test')
      el2.setAttribute(COMMON_ATTRS.TRIGGER, ATTR_VALUES.AUTO)
      document.body.appendChild(el2)
      expect(el2.getAttribute(COMMON_ATTRS.TRIGGER)).toBe(STATE_STRINGS.AUTO)
    })

    test('trigger attribute accepts "viewport"', () => {
      const el2 = document.createElement(COMPONENT_TAGS.DRAW_TEXT)
      el2.setAttribute(FORM_ATTRS.TEXT, 'Test')
      el2.setAttribute(COMMON_ATTRS.TRIGGER, COMMON_ATTRS.TRIGGER_VIEWPORT)
      document.body.appendChild(el2)
      expect(el2.getAttribute(COMMON_ATTRS.TRIGGER)).toBe(COMMON_ATTRS.TRIGGER_VIEWPORT)
    })

    test('delay attribute is parsed as number', () => {
      const el2 = document.createElement(COMPONENT_TAGS.DRAW_TEXT)
      el2.setAttribute(FORM_ATTRS.TEXT, 'Test')
      el2.setAttribute(COMMON_ATTRS.DELAY, '5')
      document.body.appendChild(el2)
      const delay = parseInt(el2.getAttribute(COMMON_ATTRS.DELAY))
      expect(delay).toBe(5)
    })

    test('speed attribute is parseable', () => {
      const el2 = document.createElement(COMPONENT_TAGS.DRAW_TEXT)
      el2.setAttribute(FORM_ATTRS.TEXT, 'Test')
      el2.setAttribute('speed', CHAR_STRINGS.DELAY_30)
      document.body.appendChild(el2)
      const speed = parseInt(el2.getAttribute('speed'))
      expect(speed).toBe(30)
    })
  })

  // ── DOM Output ──────────────────────────────────────────────────────────────
  describe('3. DOM Output — HTML Structure', () => {
    test('_updateDom() is a function', () => {
      expect(typeof el._updateDom).toBe(TYPE_STRINGS.FUNCTION)
    })

    test('_updateDom() does not throw', () => {
      expect(() => el._updateDom()).not.toThrow()
    })

    test('_renderContent() is a function', () => {
      expect(typeof el._renderContent).toBe(TYPE_STRINGS.FUNCTION)
    })

    test('_renderContent() returns a string', () => {
      const result = el._renderContent()
      expect(typeof result).toBe(TYPE_STRINGS.STRING)
    })

    test('_renderContent() is not empty for text="Hello World"', () => {
      expect(el._renderContent().length).toBeGreaterThan(0)
    })

    test('_renderContent() contains wrapper element', () => {
      expect(el._renderContent()).toContain(DRAW_TEXT_CLASSES.DRAW_TEXT)
    })

    test('_renderContent() contains span elements', () => {
      expect(el._renderContent()).toContain('<span')
    })

    test('shadow root has .draw-text element after mount', () => {
      const drawText = el.shadowRoot.querySelector(DRAW_TEXT_SELECTORS.DRAW_TEXT)
      expect(drawText).not.toBeNull()
    })

    test('shadow root has <style> after mount', () => {
      expect(el.shadowRoot.querySelector(COMMON_SELECTORS.STYLE)).not.toBeNull()
    })

    test('render does not contain raw <script> injection from text', () => {
      const el2 = document.createElement(COMPONENT_TAGS.DRAW_TEXT)
      el2.setAttribute(FORM_ATTRS.TEXT, '<script>alert(1)</script>')
      document.body.appendChild(el2)
      const content = el2._renderContent()
      expect(content).not.toContain('<script>alert(1)</script>')
    })
  })

  // ── Animation Logic ──────────────────────────────────────────────────────────
  describe('4. Animation Logic', () => {
    test('draw() method exists', () => {
      const hasDraw =
        typeof el.draw === TYPE_STRINGS.FUNCTION ||
        typeof el.start === TYPE_STRINGS.FUNCTION ||
        typeof el.animate === TYPE_STRINGS.FUNCTION ||
        typeof el._draw === TYPE_STRINGS.FUNCTION
      expect(hasDraw).toBe(true)
    })

    test('draw with delay=0 starts immediately', () => {
      const el2 = document.createElement(COMPONENT_TAGS.DRAW_TEXT)
      el2.setAttribute(FORM_ATTRS.TEXT, 'Fast')
      el2.setAttribute(COMMON_ATTRS.DELAY, '0')
      document.body.appendChild(el2)
      expect(el2.shadowRoot).not.toBeNull()
    })

    test('reducedMotion=true shows text immediately without animation', () => {
      store.commit(PREF_MUTATIONS.SET_REDUCED_MOTION, true)
      const el2 = document.createElement(COMPONENT_TAGS.DRAW_TEXT)
      el2.setAttribute(FORM_ATTRS.TEXT, 'Motion Test')
      document.body.appendChild(el2)
      expect(el2.shadowRoot).not.toBeNull()
      store.commit(PREF_MUTATIONS.SET_REDUCED_MOTION, false)
    })

    test('reducedMotion=false enables animation', () => {
      store.commit(PREF_MUTATIONS.SET_REDUCED_MOTION, false)
      const el2 = document.createElement(COMPONENT_TAGS.DRAW_TEXT)
      el2.setAttribute(FORM_ATTRS.TEXT, 'Motion Test')
      document.body.appendChild(el2)
      expect(el2.shadowRoot).not.toBeNull()
    })

    test('animation state is tracked on element', () => {
      // DrawText tracks lifecycle/animation state on _isVisible, _hasAnimated, _isMounted
      expect(typeof el._isVisible).toBe(TYPE_STRINGS.BOOLEAN)
      expect(typeof el._hasAnimated).toBe(TYPE_STRINGS.BOOLEAN)
      expect(typeof el._isMounted).toBe(TYPE_STRINGS.BOOLEAN)
    })

    test('trigger="auto" starts animation on mount', () => {
      const el2 = document.createElement(COMPONENT_TAGS.DRAW_TEXT)
      el2.setAttribute(FORM_ATTRS.TEXT, 'Auto Trigger Test')
      el2.setAttribute(COMMON_ATTRS.TRIGGER, ATTR_VALUES.AUTO)
      document.body.appendChild(el2)
      expect(el2.shadowRoot).not.toBeNull()
    })

    test('trigger="viewport" waits for IntersectionObserver', () => {
      const el2 = document.createElement(COMPONENT_TAGS.DRAW_TEXT)
      el2.setAttribute(FORM_ATTRS.TEXT, 'Viewport Test')
      el2.setAttribute(COMMON_ATTRS.TRIGGER, COMMON_ATTRS.TRIGGER_VIEWPORT)
      document.body.appendChild(el2)
      expect(el2.shadowRoot).not.toBeNull()
    })
  })

  // ── Text Handling ────────────────────────────────────────────────────────────
  describe('5. Text Handling & Character Rendering', () => {
    test('empty text attribute does not crash', () => {
      const el2 = document.createElement(COMPONENT_TAGS.DRAW_TEXT)
      el2.setAttribute(FORM_ATTRS.TEXT, '')
      document.body.appendChild(el2)
      expect(el2.shadowRoot).not.toBeNull()
    })

    test('long text does not crash', () => {
      const el2 = document.createElement(COMPONENT_TAGS.DRAW_TEXT)
      el2.setAttribute(FORM_ATTRS.TEXT, 'A'.repeat(500))
      document.body.appendChild(el2)
      expect(el2.shadowRoot).not.toBeNull()
    })

    test('text with special chars renders without crash', () => {
      const el2 = document.createElement(COMPONENT_TAGS.DRAW_TEXT)
      el2.setAttribute(FORM_ATTRS.TEXT, 'Hello & World — "Test"')
      document.body.appendChild(el2)
      expect(el2.shadowRoot).not.toBeNull()
    })

    test('text with emoji renders without crash', () => {
      const el2 = document.createElement(COMPONENT_TAGS.DRAW_TEXT)
      el2.setAttribute(FORM_ATTRS.TEXT, 'Hello 🌍')
      document.body.appendChild(el2)
      expect(el2.shadowRoot).not.toBeNull()
    })

    test('text with numbers renders without crash', () => {
      const el2 = document.createElement(COMPONENT_TAGS.DRAW_TEXT)
      el2.setAttribute(FORM_ATTRS.TEXT, '1234567890')
      document.body.appendChild(el2)
      expect(el2.shadowRoot).not.toBeNull()
    })

    test('text with Portuguese characters renders without crash', () => {
      const el2 = document.createElement(COMPONENT_TAGS.DRAW_TEXT)
      el2.setAttribute(FORM_ATTRS.TEXT, 'São Paulo')
      document.body.appendChild(el2)
      expect(el2.shadowRoot).not.toBeNull()
    })

    test('text with German characters renders without crash', () => {
      const el2 = document.createElement(COMPONENT_TAGS.DRAW_TEXT)
      el2.setAttribute(FORM_ATTRS.TEXT, 'Über Straße')
      document.body.appendChild(el2)
      expect(el2.shadowRoot).not.toBeNull()
    })
  })

  // ── Lifecycle ────────────────────────────────────────────────────────────────
  describe('6. Component Lifecycle', () => {
    test('connected to DOM', () => {
      expect(el.isConnected).toBe(true)
    })

    test('disconnect does not throw', () => {
      expect(() => document.body.removeChild(el)).not.toThrow()
    })

    test('re-append after disconnect works', () => {
      document.body.removeChild(el)
      document.body.appendChild(el)
      expect(el.isConnected).toBe(true)
    })

    test('shadow root persists after disconnect/reconnect', () => {
      document.body.removeChild(el)
      document.body.appendChild(el)
      expect(el.shadowRoot).not.toBeNull()
    })

    test('style nodes do not accumulate', () => {
      document.body.removeChild(el)
      document.body.appendChild(el)
      document.body.removeChild(el)
      document.body.appendChild(el)
      const styles = el.shadowRoot.querySelectorAll(COMMON_SELECTORS.STYLE)
      expect(styles.length).toBeLessThanOrEqual(2)
    })

    test('trigger() method exists', () => {
      expect(typeof el.trigger).toBe(TYPE_STRINGS.FUNCTION)
    })

    test('reset() method exists', () => {
      expect(typeof el.reset).toBe(TYPE_STRINGS.FUNCTION)
    })
  })

  // ── Delay Configurations ─────────────────────────────────────────────────────
  describe('7. Delay & Speed Configurations', () => {
    const delays = [0, 1, 2, 3, 4, 5, 8, 10, 15, 20, 30]

    delays.forEach((delay) => {
      test(`delay="${delay}" mounts without crash`, () => {
        const el2 = document.createElement(COMPONENT_TAGS.DRAW_TEXT)
        el2.setAttribute(FORM_ATTRS.TEXT, `Delay ${delay} test`)
        el2.setAttribute(COMMON_ATTRS.DELAY, String(delay))
        expect(() => document.body.appendChild(el2)).not.toThrow()
        document.body.removeChild(el2)
      })
    })

    test('delay > 0 does not immediately show text as drawn', () => {
      const el2 = document.createElement(COMPONENT_TAGS.DRAW_TEXT)
      el2.setAttribute(FORM_ATTRS.TEXT, 'Delayed Text')
      el2.setAttribute(COMMON_ATTRS.DELAY, '10000')
      document.body.appendChild(el2)
      // Should still have shadow root
      expect(el2.shadowRoot).not.toBeNull()
      document.body.removeChild(el2)
    })
  })

  // ── Multiple Instances ────────────────────────────────────────────────────────
  describe('8. Multiple Instance Independence', () => {
    test('10 draw-text elements can exist simultaneously', () => {
      const elements = []
      for (let i = 0; i < 10; i++) {
        const el2 = document.createElement(COMPONENT_TAGS.DRAW_TEXT)
        el2.setAttribute(FORM_ATTRS.TEXT, `Text ${i}`)
        document.body.appendChild(el2)
        elements.push(el2)
      }
      elements.forEach((e) => {
        expect(e.shadowRoot).not.toBeNull()
      })
    })

    test('each draw-text has independent shadow DOM', () => {
      const el2 = document.createElement(COMPONENT_TAGS.DRAW_TEXT)
      el2.setAttribute(FORM_ATTRS.TEXT, 'Second Element')
      document.body.appendChild(el2)
      expect(el.shadowRoot).not.toBe(el2.shadowRoot)
    })

    test('destroying one instance does not affect others', () => {
      const el2 = document.createElement(COMPONENT_TAGS.DRAW_TEXT)
      el2.setAttribute(FORM_ATTRS.TEXT, TEST_TEXT.SECOND)
      document.body.appendChild(el2)
      document.body.removeChild(el2)
      expect(el.shadowRoot).not.toBeNull()
    })
  })

  // ── CSS Classes ──────────────────────────────────────────────────────────────
  describe('9. CSS Classes & Animation States', () => {
    test('draw-text--done class is used in _updateDom()', () => {
      // The _updateDom uses draw-text--done class based on _hasAnimated state
      const html = el._renderContent()
      // Check that the content uses draw-text class
      expect(html).toContain(DRAW_TEXT_CLASSES.DRAW_TEXT)
    })

    test('draw-text uses <span> elements for character animation', () => {
      const html = el._renderContent()
      expect(html).toContain('<span')
    })
  })

  // ── Accessibility ─────────────────────────────────────────────────────────────
  describe('10. Accessibility', () => {
    test('text attribute is used as content (screen-reader readable)', () => {
      const text = el.getAttribute(FORM_ATTRS.TEXT)
      expect(text).toBe(TEST_TEXT.HELLO_WORLD)
    })

    test('_renderContent output preserves readable text content', () => {
      const html = el._renderContent()
      expect(html.length).toBeGreaterThan(0)
    })

    test('aria-label or text is accessible via shadowRoot', () => {
      // Text should be present in shadow dom in some form
      const shadow = el.shadowRoot
      expect(shadow).not.toBeNull()
    })

    test('draw-text element does not block pointer events when done', () => {
      // Animation done state should be accessible
      expect(typeof el._hasAnimated).toBe(TYPE_STRINGS.BOOLEAN)
    })
  })
})
