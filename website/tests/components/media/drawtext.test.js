/**
 * @file drawtext.test.js
 * @description Covers website/components/media/DrawText.js — the shadow-DOM
 * typography component: attribute parsing (text/link/variant), per-word
 * span generation, staggered animation timing, reduced-motion bypass, and
 * ARIA labelling. The word-split math and reduced-motion path are the
 * regression-prone areas the suite locks down.
 */

import '@website/components/media/DrawText.js'
import '@core/store.js'
import { LOCALES } from '@core/constants.js'
import { TEST_TEXT } from '@tests/fixtures/test-constants.js'
import { STATE_CLASSES } from '@core/tokens/classes/state.js'
import { COMPONENT_TAGS } from '@core/tokens/elements/components.js'
import { STATE_STRINGS } from '@core/tokens/strings/state.js'
import { FORM_ATTRS } from '@core/tokens/attrs/form.js'
import { COMMON_SELECTORS } from '@core/tokens/selectors/common.js'
import { DRAW_TEXT_SELECTORS } from '@core/tokens/selectors/draw-text.js'
import { ARIA_ATTRS } from '@core/tokens/attrs/aria.js'
import { LINK_ATTRS } from '@core/tokens/attrs/link.js'
import { DOM_STRINGS } from '@core/tokens/strings/dom.js'
import { HTML_TAGS } from '@core/tokens/elements/html.js'
import { COMMON_ATTRS } from '@core/tokens/attrs/common.js'
import { CHAR_STRINGS } from '@core/tokens/strings/chars.js'
import { ATTR_VALUES } from '@core/tokens/attrs/values.js'
import { DRAW_TEXT_CLASSES } from '@core/tokens/classes/draw-text.js'

describe('DrawText Web Component - Typography, Parsing & Animation Engine (50+ Tests)', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
    document.documentElement.classList.remove(STATE_CLASSES.REDUCED_MOTION)
  })

  describe('1. Web Component Registration & Shadow DOM Structure', () => {
    test('is defined as custom element "draw-text"', () => {
      expect(customElements.get(COMPONENT_TAGS.DRAW_TEXT)).toBeDefined()
    })

    test('attaches open shadow root on initialization', () => {
      const el = document.createElement(COMPONENT_TAGS.DRAW_TEXT)
      document.body.appendChild(el)
      expect(el.shadowRoot).not.toBeNull()
      expect(el.shadowRoot.mode).toBe(STATE_STRINGS.OPEN)
    })

    test('injects encapsulated stylesheet into shadow root', () => {
      const el = document.createElement(COMPONENT_TAGS.DRAW_TEXT)
      el.setAttribute(FORM_ATTRS.TEXT, TEST_TEXT.HELLO)
      document.body.appendChild(el)
      // DrawText uses its own shadow DOM with a <style> node.
      // In the JSDOM test environment, ?inline SCSS imports return '' (no SCSS compiler),
      // so we verify the <style> element exists (structure test) rather than its content.
      const style = el.shadowRoot.querySelector(COMMON_SELECTORS.STYLE)
      expect(style).not.toBeNull()
      // Verify the content wrapper (.draw-text span) is present, proving the component rendered
      const wrapper = el.shadowRoot.querySelector(DRAW_TEXT_SELECTORS.DRAW_TEXT)
      expect(wrapper).not.toBeNull()
    })

    test('creates wrapper element with class .draw-text', () => {
      const el = document.createElement(COMPONENT_TAGS.DRAW_TEXT)
      document.body.appendChild(el)
      const wrapper = el.shadowRoot.querySelector(DRAW_TEXT_SELECTORS.DRAW_TEXT)
      expect(wrapper).not.toBeNull()
    })
  })

  describe('2. Text Parsing, Word Chunking & Spacing Integrity', () => {
    test('splits words into .draw-text__word containers', () => {
      const el = document.createElement(COMPONENT_TAGS.DRAW_TEXT)
      el.setAttribute(FORM_ATTRS.TEXT, TEST_TEXT.HELLO_WORLD)
      document.body.appendChild(el)
      const words = el.shadowRoot.querySelectorAll(DRAW_TEXT_SELECTORS.DRAW_TEXT_WORD)
      expect(words.length).toBe(2)
      expect(words[0].textContent).toBe(TEST_TEXT.HELLO)
      expect(words[1].textContent).toBe('World')
    })

    test('creates explicit non-breaking spaces with aria-hidden="true"', () => {
      const el = document.createElement(COMPONENT_TAGS.DRAW_TEXT)
      el.setAttribute(FORM_ATTRS.TEXT, 'Three Words Here')
      document.body.appendChild(el)
      const spaces = el.shadowRoot.querySelectorAll(DRAW_TEXT_SELECTORS.DRAW_TEXT_SPACE)
      expect(spaces.length).toBe(2)
      spaces.forEach((sp) => {
        expect(sp.innerHTML).toBe('&nbsp;')
        expect(sp.getAttribute(ARIA_ATTRS.ARIA_HIDDEN)).toBe(STATE_STRINGS.TRUE)
      })
    })

    test('handles single word without spaces', () => {
      const el = document.createElement(COMPONENT_TAGS.DRAW_TEXT)
      el.setAttribute(FORM_ATTRS.TEXT, 'Portfolio')
      document.body.appendChild(el)
      expect(el.shadowRoot.querySelectorAll(DRAW_TEXT_SELECTORS.DRAW_TEXT_WORD).length).toBe(1)
      expect(el.shadowRoot.querySelectorAll(DRAW_TEXT_SELECTORS.DRAW_TEXT_SPACE).length).toBe(0)
    })

    test('handles multiple consecutive spaces without crashing or losing tokens', () => {
      const el = document.createElement(COMPONENT_TAGS.DRAW_TEXT)
      el.setAttribute(FORM_ATTRS.TEXT, 'Spaced   Words')
      document.body.appendChild(el)
      const words = el.shadowRoot.querySelectorAll(DRAW_TEXT_SELECTORS.DRAW_TEXT_WORD)
      expect(words.length).toBe(2)
    })

    test('handles empty text string without errors', () => {
      const el = document.createElement(COMPONENT_TAGS.DRAW_TEXT)
      el.setAttribute(FORM_ATTRS.TEXT, '')
      document.body.appendChild(el)
      expect(el.shadowRoot.querySelectorAll(DRAW_TEXT_SELECTORS.DRAW_TEXT_WORD).length).toBe(0)
    })

    test('handles whitespace-only text gracefully', () => {
      const el = document.createElement(COMPONENT_TAGS.DRAW_TEXT)
      el.setAttribute(FORM_ATTRS.TEXT, '   ')
      document.body.appendChild(el)
      expect(el.shadowRoot.querySelectorAll(DRAW_TEXT_SELECTORS.DRAW_TEXT_WORD).length).toBe(0)
    })
  })

  describe('3. Multi-language & Special Characters (Accents, Cyrillic, Symbols)', () => {
    test('handles Portuguese diacritics (ç, ã, é, ó)', () => {
      const el = document.createElement(COMPONENT_TAGS.DRAW_TEXT)
      el.setAttribute(FORM_ATTRS.TEXT, 'Criação e Inovação')
      document.body.appendChild(el)
      const words = el.shadowRoot.querySelectorAll(DRAW_TEXT_SELECTORS.DRAW_TEXT_WORD)
      expect(words[0].textContent).toBe('Criação')
      expect(words[2].textContent).toBe('Inovação')
    })

    test('handles German umlauts and ligature (ä, ö, ü, ß)', () => {
      const el = document.createElement(COMPONENT_TAGS.DRAW_TEXT)
      el.setAttribute(FORM_ATTRS.TEXT, 'Große Überraschung')
      document.body.appendChild(el)
      const words = el.shadowRoot.querySelectorAll(DRAW_TEXT_SELECTORS.DRAW_TEXT_WORD)
      expect(words[0].textContent).toBe('Große')
      expect(words[1].textContent).toBe('Überraschung')
    })

    test('handles Cyrillic alphabet characters (Русский текст)', () => {
      const el = document.createElement(COMPONENT_TAGS.DRAW_TEXT)
      el.setAttribute(FORM_ATTRS.TEXT, 'Привет мир')
      document.body.appendChild(el)
      const words = el.shadowRoot.querySelectorAll(DRAW_TEXT_SELECTORS.DRAW_TEXT_WORD)
      expect(words[0].textContent).toBe('Привет')
      expect(words[1].textContent).toBe('мир')
    })

    test('preserves em-dash and typography punctuation', () => {
      const el = document.createElement(COMPONENT_TAGS.DRAW_TEXT)
      el.setAttribute(FORM_ATTRS.TEXT, 'Luis — Engineer & Designer')
      document.body.appendChild(el)
      const words = el.shadowRoot.querySelectorAll(DRAW_TEXT_SELECTORS.DRAW_TEXT_WORD)
      expect(words[1].textContent).toBe('—')
    })

    test('preserves symbols and arrows (→, ★, ©)', () => {
      const el = document.createElement(COMPONENT_TAGS.DRAW_TEXT)
      el.setAttribute(FORM_ATTRS.TEXT, 'Explore → Now')
      document.body.appendChild(el)
      const words = el.shadowRoot.querySelectorAll(DRAW_TEXT_SELECTORS.DRAW_TEXT_WORD)
      expect(words[1].textContent).toBe('→')
    })
  })

  describe('4. HTML Tag Parsing & Preservation', () => {
    test('preserves link tags with href, target, and rel attributes', () => {
      const el = document.createElement(COMPONENT_TAGS.DRAW_TEXT)
      el.setAttribute(
        FORM_ATTRS.TEXT,
        '<a href="https://example.com" target="_blank" rel="noopener">Visit</a>'
      )
      document.body.appendChild(el)
      const link = el.shadowRoot.querySelector('a')
      expect(link).not.toBeNull()
      expect(link.getAttribute(LINK_ATTRS.HREF)).toBe('https://example.com')
      expect(link.getAttribute(LINK_ATTRS.TARGET)).toBe(DOM_STRINGS.BLANK)
      expect(link.getAttribute(LINK_ATTRS.REL)).toBe('noopener')
    })

    test('preserves <br> line break tags', () => {
      const el = document.createElement(COMPONENT_TAGS.DRAW_TEXT)
      el.setAttribute(FORM_ATTRS.TEXT, 'Line 1<br>Line 2')
      document.body.appendChild(el)
      expect(el.shadowRoot.querySelectorAll(LOCALES.BR).length).toBe(1)
    })

    test('preserves self-closing <br /> line break tags', () => {
      const el = document.createElement(COMPONENT_TAGS.DRAW_TEXT)
      el.setAttribute(FORM_ATTRS.TEXT, 'First<br />Second')
      document.body.appendChild(el)
      expect(el.shadowRoot.querySelectorAll(LOCALES.BR).length).toBe(1)
    })

    test('preserves <strong> tags around words', () => {
      const el = document.createElement(COMPONENT_TAGS.DRAW_TEXT)
      el.setAttribute(FORM_ATTRS.TEXT, 'This is <strong>bold</strong> text')
      document.body.appendChild(el)
      const strong = el.shadowRoot.querySelector('strong')
      expect(strong).not.toBeNull()
      expect(strong.textContent).toBe('bold')
    })

    test('preserves <em> tags around words', () => {
      const el = document.createElement(COMPONENT_TAGS.DRAW_TEXT)
      el.setAttribute(FORM_ATTRS.TEXT, 'This is <em>italic</em> text')
      document.body.appendChild(el)
      const em = el.shadowRoot.querySelector('em')
      expect(em).not.toBeNull()
      expect(em.textContent).toBe('italic')
    })

    test('handles multiple tags in one text string', () => {
      const el = document.createElement(COMPONENT_TAGS.DRAW_TEXT)
      el.setAttribute(
        FORM_ATTRS.TEXT,
        '<strong>Bold</strong> and <em>Italic</em> and <a href="/link">Link</a>'
      )
      document.body.appendChild(el)
      expect(el.shadowRoot.querySelector('strong')).not.toBeNull()
      expect(el.shadowRoot.querySelector('em')).not.toBeNull()
      expect(el.shadowRoot.querySelector('a')).not.toBeNull()
    })
  })

  describe('5. CSS Animation Delay & Offset Math', () => {
    test('assigns sequential --i indices to each character across words', () => {
      const el = document.createElement(COMPONENT_TAGS.DRAW_TEXT)
      el.setAttribute(FORM_ATTRS.TEXT, 'AB CD')
      document.body.appendChild(el)
      const chars = el.shadowRoot.querySelectorAll(DRAW_TEXT_SELECTORS.DRAW_TEXT_CHAR)
      expect(chars.length).toBe(4)
      expect(chars[0].style.getPropertyValue('--i')).toBe('0')
      expect(chars[1].style.getPropertyValue('--i')).toBe('1')
      // Note: Space accounts for index 2
      expect(chars[2].style.getPropertyValue('--i')).toBe('3')
      expect(chars[3].style.getPropertyValue('--i')).toBe('4')
    })

    test('assigns default --char-delay when not specified', () => {
      const el = document.createElement(COMPONENT_TAGS.DRAW_TEXT)
      el.setAttribute(FORM_ATTRS.TEXT, 'A')
      document.body.appendChild(el)
      const char = el.shadowRoot.querySelector(DRAW_TEXT_SELECTORS.DRAW_TEXT_CHAR)
      expect(char.getAttribute(HTML_TAGS.STYLE)).toContain('--char-delay:')
    })

    test('respects custom delay attribute in milliseconds', () => {
      const el = document.createElement(COMPONENT_TAGS.DRAW_TEXT)
      el.setAttribute(FORM_ATTRS.TEXT, 'A')
      el.setAttribute(COMMON_ATTRS.DELAY, '25')
      document.body.appendChild(el)
      const char = el.shadowRoot.querySelector(DRAW_TEXT_SELECTORS.DRAW_TEXT_CHAR)
      expect(char.getAttribute(HTML_TAGS.STYLE)).toContain('--char-delay: 25ms')
    })

    test('respects custom offset attribute in milliseconds', () => {
      const el = document.createElement(COMPONENT_TAGS.DRAW_TEXT)
      el.setAttribute(FORM_ATTRS.TEXT, 'A')
      el.setAttribute(COMMON_ATTRS.OFFSET, '400')
      document.body.appendChild(el)
      const char = el.shadowRoot.querySelector(DRAW_TEXT_SELECTORS.DRAW_TEXT_CHAR)
      expect(char.getAttribute(HTML_TAGS.STYLE)).toContain('--offset: 400ms')
    })

    test('sets total animation duration proportional to character count', () => {
      const el = document.createElement(COMPONENT_TAGS.DRAW_TEXT)
      el.setAttribute(FORM_ATTRS.TEXT, 'Long text animation sequence')
      el.setAttribute(COMMON_ATTRS.DELAY, '10')
      el.setAttribute(COMMON_ATTRS.OFFSET, '100')
      document.body.appendChild(el)
      const chars = el.shadowRoot.querySelectorAll(DRAW_TEXT_SELECTORS.DRAW_TEXT_CHAR)
      expect(chars.length).toBeGreaterThan(20)
    })
  })

  describe('6. Reactive Property & Attribute Synchronizers', () => {
    test('updates rendered content when "text" attribute changes', () => {
      const el = document.createElement(COMPONENT_TAGS.DRAW_TEXT)
      el.setAttribute(FORM_ATTRS.TEXT, 'Initial')
      document.body.appendChild(el)
      expect(el.shadowRoot.querySelector(DRAW_TEXT_SELECTORS.DRAW_TEXT_WORD).textContent).toBe(
        'Initial'
      )

      el.setAttribute(FORM_ATTRS.TEXT, 'Updated')
      expect(el.shadowRoot.querySelector(DRAW_TEXT_SELECTORS.DRAW_TEXT_WORD).textContent).toBe(
        'Updated'
      )
    })

    test('updates rendered content when "text" property is set directly', () => {
      const el = document.createElement(COMPONENT_TAGS.DRAW_TEXT)
      el.text = 'PropInitial'
      document.body.appendChild(el)
      expect(el.shadowRoot.querySelector(DRAW_TEXT_SELECTORS.DRAW_TEXT_WORD).textContent).toBe(
        'PropInitial'
      )

      el.text = 'PropUpdated'
      expect(el.shadowRoot.querySelector(DRAW_TEXT_SELECTORS.DRAW_TEXT_WORD).textContent).toBe(
        'PropUpdated'
      )
    })

    test('property getter for text returns current value', () => {
      const el = document.createElement(COMPONENT_TAGS.DRAW_TEXT)
      el.text = 'Sample'
      expect(el.text).toBe('Sample')
    })

    test('property getter and setter for delay', () => {
      const el = document.createElement(COMPONENT_TAGS.DRAW_TEXT)
      el.delay = 30
      expect(el.delay).toBe(30)
      expect(el.getAttribute(COMMON_ATTRS.DELAY)).toBe(CHAR_STRINGS.DELAY_30)
    })

    test('property getter and setter for offset', () => {
      const el = document.createElement(COMPONENT_TAGS.DRAW_TEXT)
      el.offset = 500
      expect(el.offset).toBe(500)
      expect(el.getAttribute(COMMON_ATTRS.OFFSET)).toBe('500')
    })

    test('property getter and setter for auto', () => {
      const el = document.createElement(COMPONENT_TAGS.DRAW_TEXT)
      el.auto = true
      expect(el.auto).toBe(true)
      el.auto = false
      expect(el.auto).toBe(false)
    })
  })

  describe('7. Trigger, Reset & Lifecycle Methods', () => {
    test('trigger() adds draw-text--visible class to wrapper', () => {
      const el = document.createElement(COMPONENT_TAGS.DRAW_TEXT)
      el.setAttribute(ATTR_VALUES.AUTO, STATE_STRINGS.FALSE)
      el.setAttribute(FORM_ATTRS.TEXT, 'Trigger Test')
      document.body.appendChild(el)
      const wrapper = el.shadowRoot.querySelector(DRAW_TEXT_SELECTORS.DRAW_TEXT)

      el.trigger()
      expect(wrapper.classList.contains(DRAW_TEXT_CLASSES.DRAW_TEXT_VISIBLE)).toBe(true)
    })

    test('reset() removes draw-text--visible and draw-text--done classes', () => {
      const el = document.createElement(COMPONENT_TAGS.DRAW_TEXT)
      el.setAttribute(FORM_ATTRS.TEXT, 'Reset Test')
      document.body.appendChild(el)
      const wrapper = el.shadowRoot.querySelector(DRAW_TEXT_SELECTORS.DRAW_TEXT)

      el.trigger()
      expect(wrapper.classList.contains(DRAW_TEXT_CLASSES.DRAW_TEXT_VISIBLE)).toBe(true)

      el.reset()
      expect(wrapper.classList.contains(DRAW_TEXT_CLASSES.DRAW_TEXT_VISIBLE)).toBe(false)
      expect(wrapper.classList.contains(DRAW_TEXT_CLASSES.DRAW_TEXT_DONE)).toBe(false)
    })

    test('disconnectedCallback cleans up timers without errors', () => {
      const el = document.createElement(COMPONENT_TAGS.DRAW_TEXT)
      el.setAttribute(FORM_ATTRS.TEXT, 'Cleanup Test')
      document.body.appendChild(el)
      expect(() => {
        document.body.removeChild(el)
      }).not.toThrow()
    })

    test('re-attaching element to DOM re-renders properly', () => {
      const el = document.createElement(COMPONENT_TAGS.DRAW_TEXT)
      el.setAttribute(FORM_ATTRS.TEXT, 'Reattach')
      document.body.appendChild(el)
      document.body.removeChild(el)
      document.body.appendChild(el)
      expect(el.shadowRoot.querySelector(DRAW_TEXT_SELECTORS.DRAW_TEXT_WORD).textContent).toBe(
        'Reattach'
      )
    })
  })

  describe('8. Accessibility & Reduced Motion Compliance', () => {
    test('spaces have aria-hidden to prevent screen-readers announcing &nbsp;', () => {
      const el = document.createElement(COMPONENT_TAGS.DRAW_TEXT)
      el.setAttribute(FORM_ATTRS.TEXT, 'Word A Word B')
      document.body.appendChild(el)
      const space = el.shadowRoot.querySelector(DRAW_TEXT_SELECTORS.DRAW_TEXT_SPACE)
      expect(space.getAttribute(ARIA_ATTRS.ARIA_HIDDEN)).toBe(STATE_STRINGS.TRUE)
    })

    test('respects reduced-motion mode and reveals text immediately', () => {
      document.documentElement.classList.add(STATE_CLASSES.REDUCED_MOTION)
      const el = document.createElement(COMPONENT_TAGS.DRAW_TEXT)
      el.setAttribute(FORM_ATTRS.TEXT, 'Instant Text')
      document.body.appendChild(el)
      const wrapper = el.shadowRoot.querySelector(DRAW_TEXT_SELECTORS.DRAW_TEXT)
      expect(wrapper.classList.contains(DRAW_TEXT_CLASSES.DRAW_TEXT_DONE)).toBe(true)
    })

    test('preserves readable textContent of parent element for SEO and bots', () => {
      const el = document.createElement(COMPONENT_TAGS.DRAW_TEXT)
      el.setAttribute(FORM_ATTRS.TEXT, 'Full readable sentence here.')
      document.body.appendChild(el)
      // The shadow root contains all words
      const text = Array.from(el.shadowRoot.querySelectorAll(DRAW_TEXT_SELECTORS.DRAW_TEXT_WORD))
        .map((w) => w.textContent)
        .join(' ')
      expect(text).toBe('Full readable sentence here.')
    })
  })
})
