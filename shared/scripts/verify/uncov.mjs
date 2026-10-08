// Report uncovered branch arms + statements for given src files, mapped to
// source lines via the oxc transform (comments stripped → offsets vary).
import { transformSync } from 'rolldown/utils'
import fs from 'fs'

const cov = JSON.parse(fs.readFileSync('coverage/coverage-final.json', 'utf8'))
const targets = process.argv.slice(2)

for (const t of targets) {
  const key = Object.keys(cov).find((k) => k.endsWith(t))
  if (!key) {
    console.log(`NO COVERAGE: ${t}`)
    continue
  }
  const f = cov[key]
  const xsrc = transformSync('x.jsx', fs.readFileSync(key, 'utf8'), {
    lang: 'jsx',
    jsx: { runtime: 'classic', pragma: 'h', pragmaFrag: 'Fragment' },
  })
  const lines = xsrc.code.split('\n')
  console.log(`\n=== ${t} ===`)
  const missB = {}
  for (const [bid, hits] of Object.entries(f.b)) {
    const loc = f.branchMap[bid]
    hits.forEach((h, i) => {
      if (h === 0) {
        const l = loc.loc.start.line
        missB[l] = missB[l] || []
        missB[l].push(`${loc.type}[${i}]`)
      }
    })
  }
  for (const l of Object.keys(missB).sort((a, b) => a - b)) {
    console.log(`B T${l} ${missB[l].join(',')}: ${(lines[l - 1] || '').trim().slice(0, 110)}`)
  }
  const missS = [
    ...new Set(
      Object.keys(f.s)
        .filter((k) => f.s[k] === 0)
        .map((k) => f.statementMap[k].start.line)
    ),
  ].sort((a, b) => a - b)
  if (missS.length) console.log(`S uncovered: ${missS.map((l) => `T${l}`).join(' ')}`)
  missS
    .slice(0, 15)
    .forEach((l) => console.log(`  T${l}: ${(lines[l - 1] || '').trim().slice(0, 100)}`))
  const missF = Object.keys(f.f)
    .filter((k) => f.f[k] === 0)
    .map((k) => f.fnMap[k].decl.start.line)
  if (missF.length)
    missF.forEach((l) => console.log(`F T${l}: ${(lines[l - 1] || '').trim().slice(0, 100)}`))
}
