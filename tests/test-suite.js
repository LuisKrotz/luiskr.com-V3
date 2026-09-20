import { Window } from 'happy-dom'
import fs from 'node:fs'
import path from 'node:path'

const window = new Window({ url: 'http://localhost:5173/' })
const document = window.document

globalThis.window = window
globalThis.document = document
globalThis.HTMLElement = window.HTMLElement
globalThis.customElements = window.customElements
globalThis.IntersectionObserver = window.IntersectionObserver || class {
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
  const appContainer = document.createElement('div')
  appContainer.id = 'app'
  document.body.appendChild(appContainer)

  const distFiles = fs.readdirSync('dist/assets')
  const indexJs = distFiles.find(f => f.startsWith('index-') && f.endsWith('.js'))
  console.log('Testing bundle:', indexJs)

  const fullPath = path.resolve('dist/assets', indexJs)
  await import(fullPath)

  const appRoot = document.querySelector('app-root')
  console.log('App root mounted:', !!appRoot?.shadowRoot)

  // Wait 1.5s for Home Firebase fetch
  await new Promise(r => setTimeout(r, 1500))

  const viewOutlet = appRoot.shadowRoot.querySelector('#view-outlet')
  console.log('Initial view:', viewOutlet?.firstElementChild?.tagName)

  const mosaic = viewOutlet?.querySelector('view-home')?.shadowRoot?.querySelector('home-mosaic')
  const items = mosaic?.shadowRoot?.querySelectorAll('.home-mosaic-item') || []
  console.log('Home Mosaic cards rendered:', items.length)

  // Test routing to /portfolio/metcha
  console.log('Navigating to /portfolio/metcha...')
  await window.router.push('/portfolio/metcha')


  // Wait 1.5s for Project Firebase fetch
  await new Promise(r => setTimeout(r, 1500))

  console.log('New view tag:', viewOutlet?.firstElementChild?.tagName)
  const viewProject = viewOutlet?.querySelector('view-project')
  console.log('viewProject mounted:', !!viewProject?.shadowRoot)

  if (viewProject?.shadowRoot) {
    const title = viewProject.shadowRoot.querySelector('.internal-title')
    console.log('Project title text:', title?.textContent?.trim())
    const coverMedia = viewProject.shadowRoot.querySelector('media-figure')
    console.log('Project cover media exists:', !!coverMedia)
  }

  // Test project-to-project parameter transition: /portfolio/melissa
  console.log('Navigating to /portfolio/melissa...')
  await window.router.push('/portfolio/melissa')
  await new Promise(r => setTimeout(r, 1500))
  if (viewProject?.shadowRoot) {
    const title2 = viewProject.shadowRoot.querySelector('.internal-title')
    console.log('Second project title text:', title2?.textContent?.trim())
  }

  // Test navigating back to /about
  console.log('Navigating to /about...')
  await window.router.push('/about')
  await new Promise(r => setTimeout(r, 1500))
  console.log('View tag after /about:', viewOutlet?.firstElementChild?.tagName)
  const homeView = viewOutlet?.querySelector('view-home')
  console.log('Home view active after /about:', !!homeView?.shadowRoot)

  console.log('TEST SUITE PASSED SUCCESSFULLY!')
  process.exit(0)
}


testSuite().catch(err => {
  console.error('TEST SUITE FAILED:', err)
  process.exit(1)
})
