import puppeteer from 'puppeteer-core'

const chrome = '/home/luis/.cache/puppeteer/chrome/linux-154.0.8037.92/chrome-linux64/chrome'
const killTimer = setTimeout(() => {
  console.error('timeout')
  process.exit(2)
}, 90000)

const browser = await puppeteer.launch({
  executablePath: chrome,
  headless: true,
  args: [
    '--no-sandbox',
    '--no-zygote',
    '--single-process',
    '--disable-dev-shm-usage',
    '--window-size=1280,800',
  ],
  env: { ...process.env, LD_LIBRARY_PATH: '/tmp/sf-libs/extract/usr/lib/x86_64-linux-gnu' },
})

try {
  const page = await browser.newPage()
  await page.setViewport({ width: 1280, height: 800 })
  const errors = []
  page.on('console', (m) => {
    const t = m.text()
    if (/error|fail/i.test(t)) errors.push(t.slice(0, 200))
  })
  page.on('pageerror', (e) => errors.push('PAGEERR ' + String(e).slice(0, 300)))

  await page.goto('http://localhost:5175/cms/', { waitUntil: 'networkidle2', timeout: 30000 })
  await new Promise((r) => setTimeout(r, 5000))

  const state = await page.evaluate(() => {
    const root = document.getElementById('cms')
    return {
      rootKids: root ? [...root.children].map((c) => c.tagName) : 'NO ROOT',
      login: !!document.querySelector('view-admin-login'),
      dash: !!document.querySelector('view-cms-dashboard'),
    }
  })
  console.log('STATE', JSON.stringify(state))

  // click the Google sign-in button inside the shadow root
  const btnInfo = await page.evaluate(() => {
    const el = document.querySelector('view-admin-login')
    const btn = el?.shadowRoot?.querySelector('button')
    if (!btn) return 'NO BTN'
    btn.click()
    return 'CLICKED'
  })
  console.log('BTN', btnInfo)

  await new Promise((r) => setTimeout(r, 8000))

  const after = await page.evaluate(() => {
    const el = document.querySelector('view-admin-login')
    const errEl = el?.shadowRoot?.querySelector('[class*="error"], [class*="msg"]')
    return {
      errText: errEl?.textContent?.trim() || null,
      dash: !!document.querySelector('view-cms-dashboard'),
      login: !!document.querySelector('view-admin-login'),
    }
  })
  console.log('AFTER', JSON.stringify(after))
  console.log('CONSOLE-ERRS', JSON.stringify(errors.slice(0, 10), null, 1))
} finally {
  await browser.close().catch(() => {})
  browser.process()?.kill('SIGKILL')
  clearTimeout(killTimer)
}
