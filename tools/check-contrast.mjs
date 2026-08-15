import { readFileSync } from 'node:fs'

const css = readFileSync(process.argv[2], 'utf8')

// Split on the two top-level blocks rather than regex-matching braces.
const rootStart = css.indexOf(':root {')
const darkStart = css.indexOf('.dark {')
const parse = text => {
  const o = {}
  for (const line of text.split('\n')) {
    const m = line.match(/--([\w-]+):\s*([\d ]+);/)
    if (m) o[m[1]] = m[2].trim().split(/\s+/).map(Number)
  }
  return o
}
const L = parse(css.slice(rootStart, darkStart))
const D = parse(css.slice(darkStart))

const lum = ([r, g, b]) => {
  const f = v => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4 }
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b)
}
const ratio = (a, b) => {
  const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p)
  return (x + 0.05) / (y + 0.05)
}

const pairs = [
  ['ink on surface', 't-ink', 't-surface'],
  ['ink-muted on surface', 't-ink-muted', 't-surface'],
  ['ink-subtle on surface', 't-ink-subtle', 't-surface'],
  ['ink-muted on elevated', 't-ink-muted', 't-elevated'],
  ['on-accent on brand-600', 't-on-accent', 'c-brand-600'],
  ['brand-600 link on surface', 'c-brand-600', 't-surface'],
  ['brand-700 on brand-100 chip', 'c-brand-700', 'c-brand-100'],
  ['brand-800 on brand-100 chip', 'c-brand-800', 'c-brand-100'],
  ['brand-800 on brand-50 band', 'c-brand-800', 'c-brand-50'],
  ['slate-400 meta on surface', 'c-slate-400', 't-surface'],
  ['slate-500 on elevated', 'c-slate-500', 't-elevated'],
  ['teal-800 on teal-100', 'c-teal-800', 'c-teal-100'],
  ['teal-600 label on surface', 'c-teal-600', 't-surface'],
  ['green-800 on green-100', 'c-green-800', 'c-green-100'],
  ['red-800 on red-100', 'c-red-800', 'c-red-100'],
  ['amber-800 on amber-50', 'c-amber-800', 'c-amber-50'],
  ['sun-700 on sun-100', 'c-sun-700', 'c-sun-100'],
  ['pink-800 on pink-100', 'c-pink-800', 'c-pink-100'],
  ['on-accent on red-600', 't-on-accent', 'c-red-600'],
  ['on-accent on teal-600', 't-on-accent', 'c-teal-600'],
  ['on-accent on green-600', 't-on-accent', 'c-green-600'],
  ['code-ink on code-bg', 't-code-ink', 't-code-bg'],
  ['code-muted on code-bg', 't-code-muted', 't-code-bg'],
  ['code-accent on code-bg', 't-code-accent', 't-code-bg'],
]

const fmt = n => n.toFixed(2).padStart(5)
console.log('pair'.padEnd(30) + '  light    dark')
console.log('-'.repeat(48))
const failures = []
for (const [name, a, b] of pairs) {
  if (!L[a] || !L[b]) { console.log(name.padEnd(30), 'MISSING TOKEN'); continue }
  const l = ratio(L[a], L[b])
  const d = ratio(D[a], D[b])
  const mark = v => (v < 4.5 ? '✗' : ' ')
  if (l < 4.5) failures.push(`${name} (light ${l.toFixed(2)})`)
  if (d < 4.5) failures.push(`${name} (dark ${d.toFixed(2)})`)
  console.log(name.padEnd(30), fmt(l) + mark(l), fmt(d) + mark(d))
}
console.log('-'.repeat(48))
console.log(failures.length ? `BELOW 4.5:1 →\n  ${failures.join('\n  ')}` : 'all pairs pass 4.5:1')
