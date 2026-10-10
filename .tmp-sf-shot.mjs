/* Temp screenshot probe — deleted after use. */
import puppeteer from 'puppeteer-core'

const URL_ = process.argv[2] || 'http://localhost:5173/star-field-experiment'
const OUT = process.argv[3] || '/tmp/sf-shot.png'
const WAIT = parseInt(process.argv[4] || '9000', 10)

const chrome = '/home/luis/.cache/puppeteer/chrome/linux-154.0.8037.92/chrome-linux64/chrome'

const killTimer = setTimeout(() => {
  console.error('timeout — killing')
  process.exit(2)
}, 120000)

const browser = await puppeteer.launch({
  executablePath: chrome,
  headless: 'shell' === 'never' ? false : true,
  args: [
    '--no-sandbox',
    '--no-zygote',
    '--single-process',
    '--disable-dev-shm-usage',
    '--use-angle=swiftshader',
    '--enable-unsafe-swiftshader',
    '--window-size=1280,800',
  ],
  env: {
    ...process.env,
    LD_LIBRARY_PATH: '/tmp/sf-libs/extract/usr/lib/x86_64-linux-gnu',
  },
})

try {
  const page = await browser.newPage()
  await page.setViewport({ width: 1280, height: 800 })
  page.on('console', (m) => {
    const t = m.text()
    if (/error|fail|warn/i.test(t)) console.log('[pg]', t.slice(0, 200))
  })
  page.on('pageerror', (e) => console.log('[pageerror]', String(e).slice(0, 300)))

  await page.goto(URL_, { waitUntil: 'domcontentloaded', timeout: 45000 })
  await new Promise((r) => setTimeout(r, WAIT))

  const dbg = await page.evaluate(() => {
    const d = window.__sfDebug
    if (!d) return null
    return {
      camera: d.camera ? [d.camera.position.x, d.camera.position.y, d.camera.position.z] : null,
      nodes: d.nodes ? d.nodes.length : 0,
    }
  })
  console.log('debug:', JSON.stringify(dbg))

  await page.screenshot({ path: OUT })
  console.log('saved', OUT)
} finally {
  clearTimeout(killTimer)
  await browser.close()
  browser.process()?.kill('SIGKILL')
}
