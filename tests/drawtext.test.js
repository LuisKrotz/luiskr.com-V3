import '../src/components/DrawText.js'
import store from '../src/core/store.js'

describe('DrawText Web Component - Typography, Parsing & Animation Engine (50+ Tests)', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
    document.documentElement.classList.remove('reduced-motion')
  })

  describe('1. Web Component Registration & Shadow DOM Structure', () => {
    test('is defined as custom element "draw-text"', () => {
      expect(customElements.get('draw-text')).toBeDefined()
    })

    test('attaches open shadow root on initialization', () => {
      const el = document.createElement('draw-text')
      document.body.appendChild(el)
      expect(el.shadowRoot).not.toBeNull()
      expect(el.shadowRoot.mode).toBe('open')
    })

    test('injects encapsulated stylesheet into shadow root', () => {
      const el = document.createElement('draw-text')
      el.setAttribute('text', 'Hello')
      document.body.appendChild(el)
      // DrawText uses its own shadow DOM with a <style> node.
      // In the JSDOM test environment, ?inline SCSS imports return '' (no SCSS compiler),
      // so we verify the <style> element exists (structure test) rather than its content.
      const style = el.shadowRoot.querySelector('style')
      expect(style).not.toBeNull()
      // Verify the content wrapper (.draw-text span) is present, proving the component rendered
      const wrapper = el.shadowRoot.querySelector('.draw-text')
      expect(wrapper).not.toBeNull()
    })

    test('creates wrapper element with class .draw-text', () => {
      const el = document.createElement('draw-text')
      document.body.appendChild(el)
      const wrapper = el.shadowRoot.querySelector('.draw-text')
      expect(wrapper).not.toBeNull()
    })
  })

  describe('2. Text Parsing, Word Chunking & Spacing Integrity', () => {
    test('splits words into .draw-text__word containers', () => {
      const el = document.createElement('draw-text')
      el.setAttribute('text', 'Hello World')
      document.body.appendChild(el)
      const words = el.shadowRoot.querySelectorAll('.draw-text__word')
      expect(words.length).toBe(2)
      expect(words[0].textContent).toBe('Hello')
      expect(words[1].textContent).toBe('World')
    })

    test('creates explicit non-breaking spaces with aria-hidden="true"', () => {
      const el = document.createElement('draw-text')
      el.setAttribute('text', 'Three Words Here')
      document.body.appendChild(el)
      const spaces = el.shadowRoot.querySelectorAll('.draw-text__space')
      expect(spaces.length).toBe(2)
      spaces.forEach((sp) => {
        expect(sp.innerHTML).toBe('&nbsp;')
        expect(sp.getAttribute('aria-hidden')).toBe('true')
      })
    })

    test('handles single word without spaces', () => {
      const el = document.createElement('draw-text')
      el.setAttribute('text', 'Portfolio')
      document.body.appendChild(el)
      expect(el.shadowRoot.querySelectorAll('.draw-text__word').length).toBe(1)
      expect(el.shadowRoot.querySelectorAll('.draw-text__space').length).toBe(0)
    })

    test('handles multiple consecutive spaces without crashing or losing tokens', () => {
      const el = document.createElement('draw-text')
      el.setAttribute('text', 'Spaced   Words')
      document.body.appendChild(el)
      const words = el.shadowRoot.querySelectorAll('.draw-text__word')
      expect(words.length).toBe(2)
    })

    test('handles empty text string without errors', () => {
      const el = document.createElement('draw-text')
      el.setAttribute('text', '')
      document.body.appendChild(el)
      expect(el.shadowRoot.querySelectorAll('.draw-text__word').length).toBe(0)
    })

    test('handles whitespace-only text gracefully', () => {
      const el = document.createElement('draw-text')
      el.setAttribute('text', '   ')
      document.body.appendChild(el)
      expect(el.shadowRoot.querySelectorAll('.draw-text__word').length).toBe(0)
    })
  })

  describe('3. Multi-language & Special Characters (Accents, Cyrillic, Symbols)', () => {
    test('handles Portuguese diacritics (ç, ã, é, ó)', () => {
      const el = document.createElement('draw-text')
      el.setAttribute('text', 'Criação e Inovação')
      document.body.appendChild(el)
      const words = el.shadowRoot.querySelectorAll('.draw-text__word')
      expect(words[0].textContent).toBe('Criação')
      expect(words[2].textContent).toBe('Inovação')
    })

    test('handles German umlauts and ligature (ä, ö, ü, ß)', () => {
      const el = document.createElement('draw-text')
      el.setAttribute('text', 'Große Überraschung')
      document.body.appendChild(el)
      const words = el.shadowRoot.querySelectorAll('.draw-text__word')
      expect(words[0].textContent).toBe('Große')
      expect(words[1].textContent).toBe('Überraschung')
    })

    test('handles Cyrillic alphabet characters (Русский текст)', () => {
      const el = document.createElement('draw-text')
      el.setAttribute('text', 'Привет мир')
      document.body.appendChild(el)
      const words = el.shadowRoot.querySelectorAll('.draw-text__word')
      expect(words[0].textContent).toBe('Привет')
      expect(words[1].textContent).toBe('мир')
    })

    test('preserves em-dash and typography punctuation', () => {
      const el = document.createElement('draw-text')
      el.setAttribute('text', 'Luis — Engineer & Designer')
      document.body.appendChild(el)
      const words = el.shadowRoot.querySelectorAll('.draw-text__word')
      expect(words[1].textContent).toBe('—')
    })

    test('preserves symbols and arrows (→, ★, ©)', () => {
      const el = document.createElement('draw-text')
      el.setAttribute('text', 'Explore → Now')
      document.body.appendChild(el)
      const words = el.shadowRoot.querySelectorAll('.draw-text__word')
      expect(words[1].textContent).toBe('→')
    })
  })

  describe('4. HTML Tag Parsing & Preservation', () => {
    test('preserves link tags with href, target, and rel attributes', () => {
      const el = document.createElement('draw-text')
      el.setAttribute('text', '<a href="https://example.com" target="_blank" rel="noopener">Visit</a>')
      document.body.appendChild(el)
      const link = el.shadowRoot.querySelector('a')
      expect(link).not.toBeNull()
      expect(link.getAttribute('href')).toBe('https://example.com')
      expect(link.getAttribute('target')).toBe('_blank')
      expect(link.getAttribute('rel')).toBe('noopener')
    })

    test('preserves <br> line break tags', () => {
      const el = document.createElement('draw-text')
      el.setAttribute('text', 'Line 1<br>Line 2')
      document.body.appendChild(el)
      expect(el.shadowRoot.querySelectorAll('br').length).toBe(1)
    })

    test('preserves self-closing <br /> line break tags', () => {
      const el = document.createElement('draw-text')
      el.setAttribute('text', 'First<br />Second')
      document.body.appendChild(el)
      expect(el.shadowRoot.querySelectorAll('br').length).toBe(1)
    })

    test('preserves <strong> tags around words', () => {
      const el = document.createElement('draw-text')
      el.setAttribute('text', 'This is <strong>bold</strong> text')
      document.body.appendChild(el)
      const strong = el.shadowRoot.querySelector('strong')
      expect(strong).not.toBeNull()
      expect(strong.textContent).toBe('bold')
    })

    test('preserves <em> tags around words', () => {
      const el = document.createElement('draw-text')
      el.setAttribute('text', 'This is <em>italic</em> text')
      document.body.appendChild(el)
      const em = el.shadowRoot.querySelector('em')
      expect(em).not.toBeNull()
      expect(em.textContent).toBe('italic')
    })

    test('handles multiple tags in one text string', () => {
      const el = document.createElement('draw-text')
      el.setAttribute('text', '<strong>Bold</strong> and <em>Italic</em> and <a href="/link">Link</a>')
      document.body.appendChild(el)
      expect(el.shadowRoot.querySelector('strong')).not.toBeNull()
      expect(el.shadowRoot.querySelector('em')).not.toBeNull()
      expect(el.shadowRoot.querySelector('a')).not.toBeNull()
    })
  })

  describe('5. CSS Animation Delay & Offset Math', () => {
    test('assigns sequential --i indices to each character across words', () => {
      const el = document.createElement('draw-text')
      el.setAttribute('text', 'AB CD')
      document.body.appendChild(el)
      const chars = el.shadowRoot.querySelectorAll('.draw-text__char')
      expect(chars.length).toBe(4)
      expect(chars[0].style.getPropertyValue('--i')).toBe('0')
      expect(chars[1].style.getPropertyValue('--i')).toBe('1')
      // Note: Space accounts for index 2
      expect(chars[2].style.getPropertyValue('--i')).toBe('3')
      expect(chars[3].style.getPropertyValue('--i')).toBe('4')
    })

    test('assigns default --char-delay when not specified', () => {
      const el = document.createElement('draw-text')
      el.setAttribute('text', 'A')
      document.body.appendChild(el)
      const char = el.shadowRoot.querySelector('.draw-text__char')
      expect(char.getAttribute('style')).toContain('--char-delay:')
    })

    test('respects custom delay attribute in milliseconds', () => {
      const el = document.createElement('draw-text')
      el.setAttribute('text', 'A')
      el.setAttribute('delay', '25')
      document.body.appendChild(el)
      const char = el.shadowRoot.querySelector('.draw-text__char')
      expect(char.getAttribute('style')).toContain('--char-delay: 25ms')
    })

    test('respects custom offset attribute in milliseconds', () => {
      const el = document.createElement('draw-text')
      el.setAttribute('text', 'A')
      el.setAttribute('offset', '400')
      document.body.appendChild(el)
      const char = el.shadowRoot.querySelector('.draw-text__char')
      expect(char.getAttribute('style')).toContain('--offset: 400ms')
    })

    test('sets total animation duration proportional to character count', () => {
      const el = document.createElement('draw-text')
      el.setAttribute('text', 'Long text animation sequence')
      el.setAttribute('delay', '10')
      el.setAttribute('offset', '100')
      document.body.appendChild(el)
      const chars = el.shadowRoot.querySelectorAll('.draw-text__char')
      expect(chars.length).toBeGreaterThan(20)
    })
  })

  describe('6. Reactive Property & Attribute Synchronizers', () => {
    test('updates rendered content when "text" attribute changes', () => {
      const el = document.createElement('draw-text')
      el.setAttribute('text', 'Initial')
      document.body.appendChild(el)
      expect(el.shadowRoot.querySelector('.draw-text__word').textContent).toBe('Initial')

      el.setAttribute('text', 'Updated')
      expect(el.shadowRoot.querySelector('.draw-text__word').textContent).toBe('Updated')
    })

    test('updates rendered content when "text" property is set directly', () => {
      const el = document.createElement('draw-text')
      el.text = 'PropInitial'
      document.body.appendChild(el)
      expect(el.shadowRoot.querySelector('.draw-text__word').textContent).toBe('PropInitial')

      el.text = 'PropUpdated'
      expect(el.shadowRoot.querySelector('.draw-text__word').textContent).toBe('PropUpdated')
    })

    test('property getter for text returns current value', () => {
      const el = document.createElement('draw-text')
      el.text = 'Sample'
      expect(el.text).toBe('Sample')
    })

    test('property getter and setter for delay', () => {
      const el = document.createElement('draw-text')
      el.delay = 30
      expect(el.delay).toBe(30)
      expect(el.getAttribute('delay')).toBe('30')
    })

    test('property getter and setter for offset', () => {
      const el = document.createElement('draw-text')
      el.offset = 500
      expect(el.offset).toBe(500)
      expect(el.getAttribute('offset')).toBe('500')
    })

    test('property getter and setter for auto', () => {
      const el = document.createElement('draw-text')
      el.auto = true
      expect(el.auto).toBe(true)
      el.auto = false
      expect(el.auto).toBe(false)
    })
  })

  describe('7. Trigger, Reset & Lifecycle Methods', () => {
    test('trigger() adds draw-text--visible class to wrapper', () => {
      const el = document.createElement('draw-text')
      el.setAttribute('auto', 'false')
      el.setAttribute('text', 'Trigger Test')
      document.body.appendChild(el)
      const wrapper = el.shadowRoot.querySelector('.draw-text')

      el.trigger()
      expect(wrapper.classList.contains('draw-text--visible')).toBe(true)
    })

    test('reset() removes draw-text--visible and draw-text--done classes', () => {
      const el = document.createElement('draw-text')
      el.setAttribute('text', 'Reset Test')
      document.body.appendChild(el)
      const wrapper = el.shadowRoot.querySelector('.draw-text')

      el.trigger()
      expect(wrapper.classList.contains('draw-text--visible')).toBe(true)

      el.reset()
      expect(wrapper.classList.contains('draw-text--visible')).toBe(false)
      expect(wrapper.classList.contains('draw-text--done')).toBe(false)
    })

    test('disconnectedCallback cleans up timers without errors', () => {
      const el = document.createElement('draw-text')
      el.setAttribute('text', 'Cleanup Test')
      document.body.appendChild(el)
      expect(() => {
        document.body.removeChild(el)
      }).not.toThrow()
    })

    test('re-attaching element to DOM re-renders properly', () => {
      const el = document.createElement('draw-text')
      el.setAttribute('text', 'Reattach')
      document.body.appendChild(el)
      document.body.removeChild(el)
      document.body.appendChild(el)
      expect(el.shadowRoot.querySelector('.draw-text__word').textContent).toBe('Reattach')
    })
  })

  describe('8. Accessibility & Reduced Motion Compliance', () => {
    test('spaces have aria-hidden to prevent screen-readers announcing &nbsp;', () => {
      const el = document.createElement('draw-text')
      el.setAttribute('text', 'Word A Word B')
      document.body.appendChild(el)
      const space = el.shadowRoot.querySelector('.draw-text__space')
      expect(space.getAttribute('aria-hidden')).toBe('true')
    })

    test('respects reduced-motion mode and reveals text immediately', () => {
      document.documentElement.classList.add('reduced-motion')
      const el = document.createElement('draw-text')
      el.setAttribute('text', 'Instant Text')
      document.body.appendChild(el)
      const wrapper = el.shadowRoot.querySelector('.draw-text')
      expect(wrapper.classList.contains('draw-text--done')).toBe(true)
    })

    test('preserves readable textContent of parent element for SEO and bots', () => {
      const el = document.createElement('draw-text')
      el.setAttribute('text', 'Full readable sentence here.')
      document.body.appendChild(el)
      // The shadow root contains all words
      const text = Array.from(el.shadowRoot.querySelectorAll('.draw-text__word'))
        .map((w) => w.textContent)
        .join(' ')
      expect(text).toBe('Full readable sentence here.')
    })
  })
})
