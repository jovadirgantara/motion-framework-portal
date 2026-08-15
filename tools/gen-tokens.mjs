// Generates src/styles/tokens.css — the light/dark CSS-variable ramps that
// tailwind.config.js maps every colour utility onto.
import tw from 'tailwindcss/colors.js'
import { writeFileSync, mkdirSync } from 'node:fs'
import { dirname } from 'node:path'

const OUT = process.argv[2]
const SURFACE_DARK = [11, 11, 16] // #0B0B10 — the dark page ground

const hex = h => {
  const s = h.replace('#', '')
  return [0, 2, 4].map(i => parseInt(s.slice(i, i + 2), 16))
}
const mix = (c, into, p) => c.map((v, i) => Math.round(v * (1 - p) + into[i] * p))
const chan = c => c.join(' ')

const SHADES = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]

// Dark ramp derived from a light ramp: low shades collapse toward the page
// ground (so `bg-x-100` chips read as tinted dark blocks), high shades rise to
// the light end (so `text-x-800` on those chips stays legible), and 500/600 —
// the solid-accent slots — land on the light ramp's 400/500 so white-on-accent
// becomes ink-on-accent at a comfortable ratio.
const deriveDark = L => ({
  50:  mix(hex(L[900]), SURFACE_DARK, 0.86),
  100: mix(hex(L[900]), SURFACE_DARK, 0.78),
  200: mix(hex(L[800]), SURFACE_DARK, 0.66),
  300: mix(hex(L[700]), SURFACE_DARK, 0.46),
  400: mix(hex(L[500]), SURFACE_DARK, 0.18),
  500: hex(L[500]),
  600: hex(L[400]),
  700: hex(L[300]),
  800: hex(L[300]),
  900: hex(L[200]),
  950: hex(L[100]),
})

// ── Hand-tuned ramps ────────────────────────────────────────────────────────
// slate: light end bumped so `text-slate-400` (used for meta text throughout)
// clears 4.5:1 on white; dark end is a violet-leaning neutral, inverted.
const slateLight = {
  50: '#F8FAFC', 100: '#F1F5F9', 200: '#E4E8EF', 300: '#CBD3DF', 400: '#64748B',
  500: '#556070', 600: '#475569', 700: '#334155', 800: '#1E293B', 900: '#0F172A', 950: '#020617',
}
const slateDark = {
  50: '#12121A', 100: '#16161F', 200: '#1E1E29', 300: '#2C2C3A', 400: '#9A9AAE',
  500: '#ADADC0', 600: '#C3C3D2', 700: '#D8D8E2', 800: '#E9E9F0', 900: '#F3F3F7', 950: '#FAFAFC',
}

// brand: violet, raised from the old #542556 plum. 600 is the solid-accent slot
// in both modes — light #6D28D9 carries white text at 6.4:1, dark #8B5CF6
// carries ink text at 6.2:1.
const brandLight = {
  50: '#F5F3FF', 100: '#EDE9FE', 200: '#DDD6FE', 300: '#C4B5FD', 400: '#A78BFA',
  500: '#8B5CF6', 600: '#6D28D9', 700: '#5B21B6', 800: '#4C1D95', 900: '#3B1370', 950: '#250B4D',
}
const brandDark = {
  50: '#1A1230', 100: '#221640', 200: '#2E1C52', 300: '#3F2470', 400: '#6D46D0',
  500: '#7C5CFF', 600: '#8B5CF6', 700: '#A78BFA', 800: '#C4B5FD', 900: '#DDD6FE', 950: '#EDE9FE',
}

const sunLight = {
  50: '#FFFBEB', 100: '#FEF3C7', 200: '#FDE68A', 300: '#FCD34D', 400: '#FBBF24',
  500: '#F59E0B', 600: '#D97706', 700: '#B45309', 800: '#92400E', 900: '#78350F', 950: '#451A03',
}

// Stock Tailwind teal-600 (#0D9488) and green-600 (#16A34A) are too light to
// carry white text or to sit on white as label text — both land near 3.3–3.7:1.
// Shade 600 is exactly the solid-accent/label slot in this app, so those two
// families get their 600/700 darkened one step in light mode. Dark mode is
// unaffected: it derives 600 from the light ramp's 400.
const LIGHT_OVERRIDES = {
  teal:  { 600: '#0F766E', 700: '#115E59' },
  green: { 600: '#15803D', 700: '#166534' },
}

const withOverrides = (name, ramp) =>
  LIGHT_OVERRIDES[name] ? { ...ramp, ...LIGHT_OVERRIDES[name] } : ramp

const families = {
  slate:   { light: slateLight, dark: slateDark },
  brand:   { light: brandLight, dark: brandDark },
  sun:     { light: sunLight,   dark: deriveDark(sunLight) },
  red:     { light: tw.red },
  orange:  { light: tw.orange },
  amber:   { light: tw.amber },
  yellow:  { light: tw.yellow },
  green:   { light: tw.green },
  emerald: { light: tw.emerald },
  teal:    { light: tw.teal },
  blue:    { light: tw.blue },
  purple:  { light: tw.purple },
  pink:    { light: tw.pink },
}

// The code/output panels in the tools are always dark, in both modes — they
// read as a terminal, not as a surface. Their internals therefore must NOT
// come from the flipping ramps, so they get their own fixed tokens.
const CODE_FIXED = {
  'code-ink': '226 232 240',
  'code-muted': '148 163 184',
  'code-accent': '74 222 128',
  'code-line': '30 41 59',
}

const SEMANTIC = {
  light: {
    surface: '255 255 255', 'surface-sunken': '247 247 250',
    elevated: '255 255 255', 'elevated-hover': '250 250 253',
    ink: '18 18 26', 'ink-muted': '85 96 112', 'ink-subtle': '100 116 139',
    line: '230 230 236', 'line-strong': '203 211 223',
    'on-accent': '255 255 255',
    'code-bg': '15 23 42', ...CODE_FIXED,
  },
  dark: {
    surface: '11 11 16', 'surface-sunken': '8 8 12',
    elevated: '20 20 28', 'elevated-hover': '26 26 36',
    ink: '244 244 247', 'ink-muted': '173 173 192', 'ink-subtle': '154 154 174',
    line: '38 38 47', 'line-strong': '52 52 64',
    'on-accent': '11 11 16',
    'code-bg': '6 6 10', ...CODE_FIXED,
  },
}

const SHADOWS = {
  light: {
    lift: '0 12px 32px -12px rgb(109 40 217 / 0.28)',
    'lift-sm': '0 6px 20px -8px rgb(109 40 217 / 0.20)',
  },
  dark: {
    lift: '0 16px 40px -14px rgb(0 0 0 / 0.75)',
    'lift-sm': '0 8px 24px -10px rgb(0 0 0 / 0.6)',
  },
}

function block(mode) {
  const lines = []
  for (const [name, def] of Object.entries(families)) {
    const light = withOverrides(name, def.light)
    const ramp = mode === 'light' ? light : (def.dark ?? deriveDark(light))
    for (const s of SHADES) {
      const v = ramp[s]
      lines.push(`  --c-${name}-${s}: ${chan(typeof v === 'string' ? hex(v) : v)};`)
    }
  }
  for (const [k, v] of Object.entries(SEMANTIC[mode])) lines.push(`  --t-${k}: ${v};`)
  for (const [k, v] of Object.entries(SHADOWS[mode])) lines.push(`  --shadow-${k}: ${v};`)
  return lines.join('\n')
}

const css = `/* GENERATED — do not edit by hand. Regenerate with tools/gen-tokens.mjs */
/*
 * Every colour utility in this app resolves through these variables (see the
 * \`colors\` block in tailwind.config.js), so the whole UI re-themes by toggling
 * the \`dark\` class on <html> — no per-component \`dark:\` variants needed.
 */
:root {
${block('light')}
  color-scheme: light;
}

.dark {
${block('dark')}
  color-scheme: dark;
}
`

mkdirSync(dirname(OUT), { recursive: true })
writeFileSync(OUT, css, 'utf8')
console.log(`wrote ${OUT} — ${css.split('\n').length} lines`)
