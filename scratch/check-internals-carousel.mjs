import { Window } from 'happy-dom'
import fs from 'node:fs'
import path from 'node:path'

const window = new Window({ url: 'http://localhost:5173/' })
const document = window.document

globalThis.window = window
globalThis.document = document
globalThis.HTMLElement = window.HTMLElement
globalThis.Element = window.Element
globalThis.Node = window.Node
globalThis.customElements = window.customElements
globalThis.IntersectionObserver = class {
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

const appContainer = document.createElement('div')
appContainer.id = 'app'
document.body.appendChild(appContainer)

const distFiles = fs.readdirSync('dist/assets')
const indexJs = distFiles.find(f => f.startsWith('index-') && f.endsWith('.js'))
const fullPath = path.resolve('dist/assets', indexJs)
await import(fullPath)

const appRoot = document.querySelector('app-root')
console.log('App root mounted:', !!appRoot?.shadowRoot)

// Wait 1.5s for initial load
await new Promise(r => setTimeout(r, 1500))

console.log('Navigating to /portfolio/cicb...')
await window.router.push('/portfolio/cicb')
await new Promise(r => setTimeout(r, 2000))

const viewOutlet = appRoot.shadowRoot.querySelector('#view-outlet')
const viewProject = viewOutlet?.querySelector('view-project')
console.log('viewProject mounted:', !!viewProject?.shadowRoot)

if (viewProject?.shadowRoot) {
  const sections = viewProject.shadowRoot.querySelectorAll('section')
  console.log('sections count:', sections.length)
  sections.forEach((sec, idx) => {
    console.log(`\n--- Section ${idx} ---`)
    console.log('section innerHTML summary:')
    for (const child of sec.children) {
      console.log(`  <${child.tagName.toLowerCase()} class="${child.className}">`)
      if (child.tagName.toLowerCase() === 'custom-carousel') {
        console.log(`    custom-carousel items: ${child.items?.length}, isActive: ${child.isActive}`)
        const shadow = child.shadowRoot
        if (shadow) {
          const carousel = shadow.querySelector('.carousel')
          console.log(`    shadow .carousel class: "${carousel?.className}"`)
          const track = shadow.querySelector('.carousel-track')
          console.log(`    track slides count: ${track?.children?.length}`)
          if (track?.children?.length) {
            for (let s = 0; s < Math.min(track.children.length, 3); s++) {
              const slide = track.children[s]
              console.log(`      slide ${s} class: "${slide.className}" HTML: ${slide.innerHTML.slice(0, 150)}...`)
            }
          }
        }
      }
    }
  })
}
process.exit(0)
