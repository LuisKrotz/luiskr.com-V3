// Usage: node cov-miss.mjs <moduleDir> <srcFileSuffix>
// Dumps uncovered statement/branch/function locations from the last
// coverage-run report, mapped onto the rolldown-transformed source.
import { transformSync } from 'rolldown/utils'
import fs from 'node:fs'

const [dir, suffix] = process.argv.slice(2)
const report = process.env.REPORT || `${dir}/reports/coverage/coverage-final.json`
const d = JSON.parse(fs.readFileSync(report, 'utf8'))
const k = Object.keys(d).find((f) => f.endsWith(suffix))

if (!k) {
  console.log('no key for', suffix, '— keys:', Object.keys(d).length)
  process.exit(0)
}

const c = d[k].data || d[k]
const src = fs.readFileSync(k, 'utf8')
const LANG = { '.ts': 'ts', '.tsx': 'tsx', '.js': 'jsx', '.jsx': 'jsx' }
const ext = k.slice(k.lastIndexOf('.'))
const t = transformSync(k, src, {
  lang: LANG[ext] || 'ts',
  jsx: { runtime: 'classic', pragma: 'h', pragmaFrag: 'Fragment' },
  define: {
    'import.meta.env': 'globalThis.__VITE_ENV__',
    'import.meta.hot': 'globalThis.__VITE_HOT__',
  },
})
const tl = t.code.split('\n')

const show = (line) => {
  for (let i = line - 1; i <= line + 1; i++) {
    if (i >= 1 && i <= tl.length) console.log(`    ${i}: ${tl[i - 1]}`)
  }
}

for (const [id, v] of Object.entries(c.s)) {
  if (v === 0) {
    const L = c.statementMap[id]
    console.log(`MISS s${id} TL${L.start.line}:${L.start.column}-${L.end.line}:${L.end.column}`)
    show(L.start.line)
  }
}
for (const [id, v] of Object.entries(c.f)) {
  if (v === 0) {
    const L = c.fnMap[id]
    console.log(`MISS f${id} ${L.name} decl TL${L.decl.start.line}`)
    show(L.decl.start.line)
  }
}
for (const [id, arr] of Object.entries(c.b)) {
  arr.forEach((v, i) => {
    if (v === 0) {
      const L = c.branchMap[id]
      const ll = L.locations[i]
      const line = ll && ll.start ? ll.start.line : L.loc.start.line
      console.log(
        `MISS b${id}[${i}] ${L.type} TL${line} (ifloc ${L.loc.start.line}:${L.loc.start.column}-${L.loc.end.column})`
      )
      show(line)
    }
  })
}
