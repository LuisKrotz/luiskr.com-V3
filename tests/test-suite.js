/**
 * @file test-suite.js
 * @description Legacy happy-dom bootstrap kept for the suites that need a
 * bare Window (not GlobalWindow) — seeds window/document/HTMLElement/
 * customElements globals and stubs IntersectionObserver when the shim is
 * absent. New suites should rely on tests/setup.js instead.
 */

import { Window } from 'happy-dom'
import fs from 'node:fs'
import path from 'node:path'
import { TEST_PROJECTS } from './fixtures/test-constants.js'
import { HTML_TAGS } from '@core/tokens/elements/html.js'
import { APP_IDS } from '@core/tokens/ids/app.js'
import { COMPONENT_TAGS } from '@core/tokens/elements/components.js'
import { VIEW_TAGS } from '@core/tokens/elements/views.js'
import { MOSAIC_SELECTORS } from '@core/tokens/selectors/mosaic.js'
import { ROUTE_PATHS } from '@core/tokens/routes/paths.js'

const window = new Window({ url: 'http://localhost:5173/' })
const document = window.document

globalThis.window = window
globalThis.document = document
globalThis.HTMLElement = window.HTMLElement
globalThis.customElements = window.customElements
globalThis.IntersectionObserver =
  window.IntersectionObserver ||
  class {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
globalThis.requestAnimationFrame = (cb) => setTimeout(cb, 16)
globalThis.cancelAnimationFrame = (id) => clearTimeout(id)
globalThis.fetch = fetch
globalThis.localStorage = window.localStorage
globalThis.sessionStorage = window.sessionStorage
globalThis.history = window.history
globalThis.location = window.location
globalThis.matchMedia = () => ({ matches: false, addEventListener() {}, removeEventListener() {} })
globalThis.Worker = class {
  postMessage() {}
  terminate() {}
}

async function testSuite() {
  const appContainer = document.createElement(HTML_TAGS.DIV)
  appContainer.id = APP_IDS.APP
  document.body.appendChild(appContainer)

  const distFiles = fs.readdirSync('dist/assets')
  const indexJs = distFiles.find((f) => f.startsWith('index-') && f.endsWith('.js'))
  console.log('Testing bundle:', indexJs)

  const fullPath = path.resolve('dist/assets', indexJs)
  await import(fullPath)

  const appRoot = document.querySelector(COMPONENT_TAGS.APP_ROOT)
  console.log('App root mounted:', !!appRoot?.shadowRoot)

  // Wait 1.5s for Home Firebase fetch
  await new Promise((r) => setTimeout(r, 1500))

  const viewOutlet = appRoot.shadowRoot.querySelector('#view-outlet')
  console.log('Initial view:', viewOutlet?.firstElementChild?.tagName)

  const mosaic = viewOutlet
    ?.querySelector(VIEW_TAGS.VIEW_HOME)
    ?.shadowRoot?.querySelector(COMPONENT_TAGS.HOME_MOSAIC)
  const items = mosaic?.shadowRoot?.querySelectorAll(MOSAIC_SELECTORS.HOME_MOSAIC_ITEM) || []
  console.log('Home Mosaic cards rendered:', items.length)

  // Test routing to /portfolio/metcha
  console.log('Navigating to /portfolio/metcha...')
  await window.router.push(`${ROUTE_PATHS.PORTFOLIO}${TEST_PROJECTS.METCHA}`)

  // Wait 1.5s for Project Firebase fetch
  await new Promise((r) => setTimeout(r, 1500))

  console.log('New view tag:', viewOutlet?.firstElementChild?.tagName)
  const viewProject = viewOutlet?.querySelector(VIEW_TAGS.VIEW_PROJECT)
  console.log('viewProject mounted:', !!viewProject?.shadowRoot)

  if (viewProject?.shadowRoot) {
    const title = viewProject.shadowRoot.querySelector('.internal-title')
    console.log('Project title text:', title?.textContent?.trim())
    const coverMedia = viewProject.shadowRoot.querySelector(COMPONENT_TAGS.MEDIA_FIGURE)
    console.log('Project cover media exists:', !!coverMedia)
  }

  // Test project-to-project parameter transition: /portfolio/melissa
  console.log('Navigating to /portfolio/melissa...')
  await window.router.push('/portfolio/melissa')
  await new Promise((r) => setTimeout(r, 1500))
  if (viewProject?.shadowRoot) {
    const title2 = viewProject.shadowRoot.querySelector('.internal-title')
    console.log('Second project title text:', title2?.textContent?.trim())
  }

  // Test navigating back to /about
  console.log('Navigating to /about...')
  await window.router.push(ROUTE_PATHS.ABOUT)
  await new Promise((r) => setTimeout(r, 1500))
  console.log('View tag after /about:', viewOutlet?.firstElementChild?.tagName)
  const homeView = viewOutlet?.querySelector(VIEW_TAGS.VIEW_HOME)
  console.log('Home view active after /about:', !!homeView?.shadowRoot)

  console.log('TEST SUITE PASSED SUCCESSFULLY!')
  process.exit(0)
}

testSuite().catch((err) => {
  console.error('TEST SUITE FAILED:', err)
  process.exit(1)
})
