import puppeteer from 'puppeteer-core'
const CHROME = '/home/luis/.cache/puppeteer/chrome/linux-154.0.8037.92/chrome-linux64/chrome'
const browser = await puppeteer.launch({ executablePath: CHROME, args: ['--no-sandbox','--disable-gpu'] })
try {
  const page = await browser.newPage()
  const ctx = browser.defaultBrowserContext()
  await ctx.overridePermissions('http://localhost:8899', [])
  await page.evaluateOnNewDocument(() => {
    // block service worker so we always test fresh dist
    Object.defineProperty(navigator, 'serviceWorker', { get: () => undefined })
  })
  const errors = []
  page.on('console', m => { if (m.type() === 'error' || m.type() === 'warning') errors.push(m.text().slice(0,200)) })
  await page.goto('http://localhost:8899/docs/docs/animations/physics-simulations/README.md', { waitUntil: 'domcontentloaded', timeout: 60000 })
  await page.waitForSelector('custom-docs, [class*="docs"]', { timeout: 30000 }).catch(()=>{})
  await new Promise(r => setTimeout(r, 12000))
  const res = await page.evaluate(() => {
    const out = { blocks: 0, rendered: 0, sources: 0, errorGfx: 0, samples: [] }
    const walk = (root) => {
      if (!root) return
      const els = root.querySelectorAll ? root.querySelectorAll('*') : []
      for (const el of els) {
        if (el.classList?.contains('docs-mermaid')) {
          out.blocks++
          const svg = el.querySelector('svg')
          const err = el.querySelector('.error-icon, .error-text')
          if (svg) { out.rendered++; out.samples.push({ svgLen: el.innerHTML.length }) }
          else if (err) out.errorGfx++
          else out.sources++
        }
        if (el.shadowRoot) walk(el.shadowRoot)
      }
    }
    walk(document)
    return out
  })
  console.log(JSON.stringify(res, null, 1))
  console.log('CONSOLE:', JSON.stringify(errors.slice(0,10), null, 1))
} finally { await browser.close() }
