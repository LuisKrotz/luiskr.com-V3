import { h, Fragment } from '../src/core/jsx.js'

describe('JSX Runtime & Native DOM Construction', () => {

  test('creates simple HTML element with properties', () => {
    const el = h('div', { id: 'test-div', className: 'my-class' }, 'Hello World')
    expect(el.tagName).toBe('DIV')
    expect(el.id).toBe('test-div')
    expect(el.className).toBe('my-class')
    expect(el.textContent).toBe('Hello World')
  })

  test('creates SVG elements in the SVG namespace', () => {
    const svg = h('svg', { viewBox: '0 0 100 100' },
      h('circle', { cx: '50', cy: '50', r: '40', fill: 'red' })
    )
    expect(svg.namespaceURI).toBe('http://www.w3.org/2000/svg')
    expect(svg.firstChild.namespaceURI).toBe('http://www.w3.org/2000/svg')
    expect(svg.getAttribute('viewBox')).toBe('0 0 100 100')
  })

  test('attaches event listeners', () => {
    let clicked = false
    const btn = h('button', { onClick: () => { clicked = true } }, 'Click Me')
    btn.click()
    expect(clicked).toBe(true)
  })

  test('supports Fragment with multiple children', () => {
    const frag = Fragment({
      children: [
        h('span', null, 'First'),
        h('span', null, 'Second'),
      ],
    })
    expect(frag.nodeType).toBe(Node.DOCUMENT_FRAGMENT_NODE)
    expect(frag.childNodes.length).toBe(2)
  })

  test('supports nested arrays of children', () => {
    const items = ['A', 'B', 'C']
    const ul = h('ul', null,
      items.map((it) => h('li', null, it))
    )
    expect(ul.children.length).toBe(3)
    expect(ul.children[0].textContent).toBe('A')
    expect(ul.children[1].textContent).toBe('B')
    expect(ul.children[2].textContent).toBe('C')
  })

  test('handles style object and style string', () => {
    const el1 = h('div', { style: 'width: 100%; height: 50px;' })
    expect(el1.style.width).toBe('100%')

    const el2 = h('div', { style: { display: 'flex', opacity: '0.8' } })
    expect(el2.style.display).toBe('flex')
    expect(el2.style.opacity).toBe('0.8')
  })

  test('functional components receive props and children', () => {
    const MyCard = (props) => h('div', { className: 'card' }, props.title, ...props.children)
    const card = h(MyCard, { title: 'Card Title' }, h('p', null, 'Body'))
    expect(card.className).toBe('card')
    expect(card.textContent).toContain('Card Title')
    expect(card.querySelector('p').textContent).toBe('Body')
  })

  // ── Boolean attribute handling — critical for video autoplay ──────────────
  // muted MUST be set as a DOM property (el.muted = true), not just setAttribute.
  // Chrome/Safari gate autoplay on the .muted IDL property, not the HTML attribute.
  test('sets muted as DOM property for video autoplay', () => {
    const vid = h('video', { muted: true })
    expect(vid.muted).toBe(true)
    expect(vid.hasAttribute('muted')).toBe(true)
  })

  test('sets loop as DOM property', () => {
    const vid = h('video', { loop: true })
    expect(vid.loop).toBe(true)
    expect(vid.hasAttribute('loop')).toBe(true)
  })

  test('sets disabled as DOM property', () => {
    const btn = h('button', { disabled: true })
    expect(btn.disabled).toBe(true)
    expect(btn.hasAttribute('disabled')).toBe(true)
  })

  test('playsInline maps to lowercase playsinline attribute', () => {
    const vid = h('video', { playsInline: true })
    // The attribute name must be lowercase 'playsinline' (not 'playsInline')
    // Use getAttributeNames() for a case-sensitive check since hasAttribute() is case-insensitive
    const attrNames = vid.getAttributeNames()
    expect(attrNames).toContain('playsinline')
    expect(attrNames).not.toContain('playsInline')
  })

  test('boolean false values are skipped and not applied', () => {
    const vid = h('video', { muted: false, loop: false })
    expect(vid.muted).toBe(false)
    expect(vid.hasAttribute('loop')).toBe(false)
  })

})
