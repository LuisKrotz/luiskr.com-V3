import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { execSync } from 'child_process'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, '..')
const dbPath = path.join(rootDir, 'database.json')

const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'))

const locales = ['en', 'br', 'es', 'de', 'fr', 'it', 'ru', 'hrk', 'cas', 'riv', 'gn', 'tln']

for (const loc of locales) {
  const earthData = db.translations[loc]?.pages?.['earth-playground']
  const appEarth = db.translations[loc]?.APP?.earthPlayground
  if (!earthData) continue

  console.log(`Uploading translations for locale [${loc}]...`)

  const tmpPage = path.join(rootDir, `tmp-ep-${loc}.json`)
  const tmpApp = path.join(rootDir, `tmp-app-${loc}.json`)
  fs.writeFileSync(tmpPage, JSON.stringify(earthData), 'utf8')
  fs.writeFileSync(tmpApp, JSON.stringify({ earthPlayground: appEarth, spacePlayground: appEarth }), 'utf8')

  try {
    execSync(`firebase database:set /translations/${loc}/pages/earth-playground ${tmpPage} -f`, {
      encoding: 'utf8',
      stdio: 'pipe',
    })
    execSync(`firebase database:set /translations/${loc}/pages/space-playground ${tmpPage} -f`, {
      encoding: 'utf8',
      stdio: 'pipe',
    })
    execSync(`firebase database:update /translations/${loc}/APP ${tmpApp} -f`, {
      encoding: 'utf8',
      stdio: 'pipe',
    })
    console.log(`✅ [${loc}] uploaded successfully`)
  } catch (err) {
    console.error(`❌ [${loc}] failed:`, err.message)
  } finally {
    if (fs.existsSync(tmpPage)) fs.unlinkSync(tmpPage)
    if (fs.existsSync(tmpApp)) fs.unlinkSync(tmpApp)
  }
}

console.log('🎉 Finished uploading all Earth Playground translations to Firebase!')
