/**
 * @file starfield/star-render.test.js
 * @description renderStarField branch coverage — loader shown/hidden, CSS
 * fallback surface, drawer open/closed, dossier panel states (empty,
 * loading, loaded, unknown kind), action buttons and the translated
 * group titles.
 */
import { describe, test, expect, jest } from '@jest/globals'

import { SF_CLASSES } from '@core/tokens/classes/starfield.js'
import { ARIA_ATTRS } from '@core/tokens/attrs/aria.js'
import { renderStarField } from '../../star/render.js'

const mount = (host) => {
  const node = renderStarField(host)
  const div = document.createElement('div')

  div.appendChild(node)

  return div
}

const makeHost = (overrides = {}) => ({
  _sfReady: true,
  _sfFailed: false,
  _navOpen: false,
  _selectedId: null,
  _dossier: null,
  _dossierLoading: false,
  _liveText: '',
  translations: null,
  _toggleNav: jest.fn(),
  _selectBody: jest.fn(),
  _closePanel: jest.fn(),
  _takeScreenshot: jest.fn(),
  _flyHome: jest.fn(),
  ...overrides,
})

describe('star render', () => {
  test('shows the loader until ready and the fallback on failure', () => {
    const booting = mount(makeHost({ _sfReady: false }))

    expect(booting.querySelector(`.${SF_CLASSES.SF_LOADER}`)).toBeTruthy()
    expect(booting.querySelector(`.${SF_CLASSES.SF_FALLBACK}`)).toBeNull()

    const failed = mount(makeHost({ _sfFailed: true }))

    expect(failed.querySelector(`.${SF_CLASSES.SF_FALLBACK}`)).toBeTruthy()
    expect(failed.querySelector(`.${SF_CLASSES.SF_LOADER}`)).toBeNull()

    const ready = mount(makeHost())

    expect(ready.querySelector(`.${SF_CLASSES.SF_LOADER}`)).toBeNull()
  })

  test('drawer aria state and group titles follow the translation node', () => {
    const host = makeHost({
      _navOpen: true,
      translations: { explore: 'Carta', solar: 'Solsystem' },
    })
    const root = mount(host)
    const toggle = root.querySelector(`.${SF_CLASSES.SF_NAV_TOGGLE}`)

    expect(toggle.getAttribute(ARIA_ATTRS.ARIA_EXPANDED)).toBe('true')
    expect(root.querySelector(`.${SF_CLASSES.SF_NAV}`).className).toContain(SF_CLASSES.SF_NAV_OPEN)

    const titles = [...root.querySelectorAll(`.${SF_CLASSES.SF_NAV_GROUP_TITLE}`)].map(
      (n) => n.textContent
    )

    expect(titles).toContain('Solsystem')

    toggle.click()

    expect(host._toggleNav).toHaveBeenCalled()
  })

  test('nav body buttons route clicks to _selectBody', () => {
    const host = makeHost({ _navOpen: true })
    const root = mount(host)
    const btn = root.querySelector(`.${SF_CLASSES.SF_NAV_ITEM}`)

    btn.click()

    expect(host._selectBody).toHaveBeenCalledWith('sun')

    const host2 = makeHost({ _navOpen: true, _selectedId: 'sun' })
    const root2 = mount(host2)

    expect(root2.querySelector(`.${SF_CLASSES.SF_NAV_ITEM}`).className).toContain(
      SF_CLASSES.SF_NAV_ITEM_ACTIVE
    )
  })

  test('panel renders loading, dossier content, and unknown-kind tag', () => {
    const loading = mount(makeHost({ _selectedId: 'mars', _dossierLoading: true }))

    expect(loading.querySelector(`.${SF_CLASSES.SF_PANEL}`).className).toContain(
      SF_CLASSES.SF_PANEL_OPEN
    )
    expect(loading.querySelector(`.${SF_CLASSES.SF_PANEL_LOADING}`)).toBeTruthy()

    const dossier = {
      id: 'mars',
      name: 'Mars',
      kind: 'planet',
      tagline: 'Red world',
      facts: [{ label: 'Day', value: '24.6 h' }],
      history: 'Ancient observations.',
      source: 'NASA',
    }
    const loaded = mount(makeHost({ _selectedId: 'mars', _dossier: dossier }))

    expect(loaded.querySelector(`.${SF_CLASSES.SF_PANEL_TITLE}`).textContent).toBe('Mars')
    expect(loaded.querySelector(`.${SF_CLASSES.SF_FACT}`)).toBeTruthy()
    expect(loaded.querySelector(`.${SF_CLASSES.SF_PANEL_TAG}`).textContent).toBe('Planet')

    const oddKind = mount(
      makeHost({ _selectedId: 'x', _dossier: { ...dossier, kind: 'quasi-moon' } })
    )

    expect(oddKind.querySelector(`.${SF_CLASSES.SF_PANEL_TAG}`).textContent).toBe('quasi-moon')
  })

  test('action buttons call screenshot and overview handlers', () => {
    const host = makeHost()
    const root = mount(host)
    const [shot, home] = root.querySelectorAll(`.${SF_CLASSES.SF_BTN}`)

    shot.click()
    home.click()

    expect(host._takeScreenshot).toHaveBeenCalled()
    expect(host._flyHome).toHaveBeenCalled()
  })

  test('close button + live region wire the panel dismissal and announcements', () => {
    const host = makeHost({
      _selectedId: 'mars',
      _dossier: { id: 'mars', name: 'Mars', kind: 'planet' },
      _liveText: 'Mars',
    })
    const root = mount(host)

    expect(root.querySelector(`.${SF_CLASSES.SF_LIVE}`).textContent).toBe('Mars')

    root.querySelector(`.${SF_CLASSES.SF_PANEL_CLOSE}`).click()

    expect(host._closePanel).toHaveBeenCalled()
  })
})
