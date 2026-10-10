import puppeteer from 'puppeteer-core'
const chrome = '/home/luis/.cache/puppeteer/chrome/linux-154.0.8037.92/chrome-linux64/chrome'
const killTimer = setTimeout(() => {
  process.exit(2)
}, 90000)
const browser = await puppeteer.launch({
  executablePath: chrome,
  headless: true,
  args: ['--no-sandbox', '--no-zygote', '--single-process', '--disable-dev-shm-usage'],
  env: { ...process.env, LD_LIBRARY_PATH: '/tmp/sf-libs/extract/usr/lib/x86_64-linux-gnu' },
})
try {
  const page = await browser.newPage()
  const reqs = []
  page.on('request', (r) => {
    const u = r.url()
    if (/googleapis|firebase|accounts\.google/i.test(u)) reqs.push(u.slice(0, 140))
  })
  page.on('response', (r) => {
    const u = r.url()
    if (/googleapis|firebase|accounts\.google/i.test(u))
      reqs.push(`${r.status()} ${u.slice(0, 110)}`)
  })
  const popup = []
  page.on('popup', (p) => popup.push(p.url()))
  await page.goto('http://localhost:5175/cms/', { waitUntil: 'networkidle2', timeout: 30000 })
  await new Promise((r) => setTimeout(r, 4000))
  await page.evaluate(() =>
    document.querySelector('view-admin-login')?.shadowRoot?.querySelector('button')?.click()
  )
  await new Promise((r) => setTimeout(r, 10000))
  console.log('POPUPS', JSON.stringify(popup))
  console.log('REQS', JSON.stringify(reqs.slice(0, 15), null, 1))
  const devlog = await page.evaluate(() =>
    window.__lkDevLog ? window.__lkDevLog().slice(-10) : 'no devlog'
  )
  console.log('DEVLOG', JSON.stringify(devlog))
} finally {
  await browser.close().catch(() => {})
  browser.process()?.kill('SIGKILL')
  clearTimeout(killTimer)
}
