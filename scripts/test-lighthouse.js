import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'

const REPORTS_DIR = path.resolve(process.cwd(), 'lighthouse-reports')

if (!fs.existsSync(REPORTS_DIR)) {
  fs.mkdirSync(REPORTS_DIR, { recursive: true })
}

try {
  console.log('\n🚀 Step 1: Building production bundle...')
  execSync('npm run build', { stdio: 'inherit' })

  console.log('\n⚡ Step 2: Running Lighthouse CI (lhci autorun)...')
  execSync('npx lhci autorun', { stdio: 'inherit' })

  console.log('\n============================================================')
  console.log('  LIGHTHOUSE CI AUDIT COMPLETE')
  console.log('============================================================')
  console.log(`\n📄 Local audit reports saved to: ${REPORTS_DIR}\n`)

} catch (err) {
  console.error('\n❌ Lighthouse CI run encountered warnings or failures:', err.message)
  process.exit(1)
}
