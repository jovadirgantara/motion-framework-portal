# Visual Overhaul Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Enrich the MGLC portal's visual design across all pages — split hero with photo placeholder, tall icon-zone cards, horizontal tool cards, brand-colored CTA, page header bands — while keeping fonts, layout structure, and content order unchanged.

**Architecture:** Approach B (Section Visual Redesign) — same content structure, redesigned visual presentation per section. Foundation layer (CSS + new PlaceholderImage component) is applied first, then pages are updated top-down: Header/Footer → Homepage → Framework → Tools → Campaign → minor pages.

**Tech Stack:** React 18, Vite, Tailwind CSS v3, PNPM, React Router v6. No test suite exists — visual verification via `pnpm dev` is the quality gate for each task.

## Global Constraints

- Brand color: `#542556` (`brand-600`) — do not change
- Fonts: Inter (sans) + JetBrains Mono (mono) — do not change
- Layout container: `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8` — do not change
- Section content order — do not change
- `tailwind.config.js` — do not modify (all new styles go in `index.css`)
- Dev server: `pnpm dev` → `http://localhost:5173`
- All new/modified files are in `SEMPRO/WEBSITE/motion-framework-portal/`

---

## File Map

| File | Action | Responsibility |
|------|--------|----------------|
| `src/components/ui/PlaceholderImage.jsx` | **Create** | Reusable dashed-border photo placeholder |
| `src/index.css` | **Modify** | Upgrade card-hover, add hero-4 animation, add placeholder-img class |
| `src/components/ui/FadeIn.jsx` | **Modify** | Strengthen scroll animation (translate + duration) |
| `src/components/layout/Header.jsx` | **Modify** | Logo hover scale, active nav weight, shadow |
| `src/components/layout/Footer.jsx` | **Modify** | Top accent border brand-600, eyebrow label |
| `src/pages/Home.jsx` | **Modify** | Split hero, section bgs, tall cards, horizontal tools, brand CTA |
| `src/pages/framework/FrameworkOverview.jsx` | **Modify** | Header band, horizontal icon cards |
| `src/pages/framework/FrameworkComponentPage.jsx` | **Modify** | Page header band with decorative number |
| `src/pages/tools/ToolsHub.jsx` | **Modify** | Header band, horizontal icon cards |
| `src/pages/CampaignSchedule.jsx` | **Modify** | Status stat cards, skeleton loading |
| `src/pages/Downloads.jsx` | **Modify** | Page header band |
| `src/pages/About.jsx` | **Modify** | Page header band |
| `src/pages/Feedback.jsx` | **Modify** | Page header band |

---

### Task 1: Foundation — PlaceholderImage + index.css + FadeIn

**Files:**
- Create: `src/components/ui/PlaceholderImage.jsx`
- Modify: `src/index.css`
- Modify: `src/components/ui/FadeIn.jsx`

**Interfaces:**
- Produces: `PlaceholderImage` component — props `label: string`, `aspect?: string` (CSS aspect-ratio, default `"4/3"`), `className?: string`
- Produces: `.placeholder-img` CSS class
- Produces: `.animate-hero-4` CSS class (slide from right)
- Produces: `.section-alt` CSS class (`bg-slate-50`)
- Produces: upgraded `.card-hover` (stronger lift + shadow)
- Produces: strengthened `FadeIn` (more visible entrance animation)

- [ ] **Step 1: Create PlaceholderImage component**

Write `src/components/ui/PlaceholderImage.jsx`:

```jsx
export default function PlaceholderImage({ label, aspect = '4/3', className = '' }) {
  return (
    <div
      className={`placeholder-img ${className}`}
      style={{ aspectRatio: aspect }}
    >
      <span className="text-3xl">📷</span>
      <span className="max-w-[80%] text-center leading-relaxed px-4">{label}</span>
    </div>
  )
}
```

- [ ] **Step 2: Update `src/index.css` — upgrade card-hover**

Find and replace the `.card-hover` rule:

```css
/* BEFORE */
.card-hover {
  @apply hover:border-brand-400 hover:-translate-y-0.5 hover:shadow-sm;
}

/* AFTER */
.card-hover {
  @apply hover:border-brand-300 hover:-translate-y-1 hover:shadow-md;
}
```

- [ ] **Step 3: Update `src/index.css` — add new utility classes**

After the `.card-hover` rule, add:

```css
/* ── Alternate section background ── */
.section-alt {
  @apply bg-slate-50;
}

/* ── Photo placeholder ── */
.placeholder-img {
  @apply border-2 border-dashed border-slate-300 bg-slate-50 rounded-xl
         flex flex-col items-center justify-center gap-2
         text-slate-400 font-mono text-2xs text-center;
}
```

- [ ] **Step 4: Update `src/index.css` — add hero-4 animation**

After the existing `.animate-hero-3` block, add:

```css
@keyframes fadeSlideRight {
  from {
    opacity: 0;
    transform: translateX(12px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.animate-hero-4 {
  animation: fadeSlideRight 500ms ease-out both;
  animation-delay: 320ms;
}

@media (prefers-reduced-motion: reduce) {
  .animate-hero-4 {
    animation: none;
    opacity: 1;
  }
}
```

- [ ] **Step 5: Strengthen FadeIn component**

Full replacement of `src/components/ui/FadeIn.jsx`:

```jsx
import useInView from '../../utils/useInView'

export default function FadeIn({ children, delay = 0, className = '' }) {
  const { ref, inView } = useInView()

  return (
    <div
      ref={ref}
      className={`transition-all duration-600 ease-out ${
        inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
      } ${className}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  )
}
```

- [ ] **Step 6: Verify in browser**

Run `pnpm dev` (or check it's already running at `http://localhost:5173`).

Check:
- Open any page with cards (e.g., `/framework`) — hover a card, it should lift more than before (`-translate-y-1` + `shadow-md`)
- Open `/` — scroll down, sections should fade in with a more visible entrance (from lower, slightly more distance)

- [ ] **Step 7: Commit**

```bash
git add src/components/ui/PlaceholderImage.jsx src/index.css src/components/ui/FadeIn.jsx
git commit -m "feat: add PlaceholderImage component, upgrade card-hover and FadeIn animations"
```

---

### Task 2: Header + Footer Visual Polish

**Files:**
- Modify: `src/components/layout/Header.jsx`
- Modify: `src/components/layout/Footer.jsx`

**Interfaces:**
- Consumes: existing `Header` and `Footer` component structure
- Produces: no API changes — purely visual

- [ ] **Step 1: Update Header — logo hover + nav weight + shadow**

Full replacement of `src/components/layout/Header.jsx`:

```jsx
import { useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'

const navItems = [
  { label: 'Framework', to: '/framework' },
  { label: 'Tools', to: '/tools' },
  { label: 'Jadwal', to: '/campaign' },
  { label: 'Unduhan', to: '/downloads' },
]

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-12">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-6 h-6 bg-brand-600 rounded-sm flex items-center justify-center shrink-0 transition-transform group-hover:scale-105">
              <span className="text-white text-xs font-mono font-bold leading-none">MG</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold tracking-tight text-slate-900 group-hover:text-brand-700 transition-colors">
                MGLC Framework
              </span>
              <span className="hidden sm:inline font-mono text-2xs text-slate-400 border border-slate-200 rounded px-1.5 py-0.5">
                v0.1-seed
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-0.5">
            {navItems.map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `px-3 py-1.5 text-sm rounded transition-colors font-medium ${
                    isActive || location.pathname.startsWith(item.to)
                      ? 'text-brand-700 bg-brand-50 font-semibold'
                      : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
            <div className="w-px h-4 bg-slate-200 mx-2" />
            <Link
              to="/feedback"
              className="px-3 py-1.5 text-sm font-medium text-white bg-brand-600 rounded hover:bg-brand-700 transition-colors"
            >
              Feedback
            </Link>
          </nav>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-1.5 rounded text-slate-500 hover:bg-slate-100 transition-colors"
            onClick={() => setMenuOpen(prev => !prev)}
            aria-label="Toggle menu"
          >
            {menuOpen ? (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden bg-white px-4 overflow-hidden transition-all duration-200 ease-out ${
          menuOpen ? 'max-h-96 border-t border-slate-100 py-3' : 'max-h-0 py-0'
        }`}
      >
        <div className="space-y-0.5">
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                `block px-3 py-2 text-sm rounded font-medium ${
                  isActive ? 'bg-brand-50 text-brand-700 font-semibold' : 'text-slate-600 hover:bg-slate-50'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
          <div className="pt-2">
            <Link
              to="/feedback"
              onClick={() => setMenuOpen(false)}
              className="block px-3 py-2 text-sm font-medium text-white bg-brand-600 rounded text-center hover:bg-brand-700 transition-colors"
            >
              Feedback
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
```

- [ ] **Step 2: Update Footer — top accent border + eyebrow**

In `src/components/layout/Footer.jsx`:

Change the opening `<footer>` tag from:
```jsx
<footer className="border-t border-slate-200 bg-white mt-16">
```
to:
```jsx
<footer className="border-t-4 border-brand-600 bg-white mt-16">
```

In the Brand column, add the eyebrow label before the logo flex div. Find:
```jsx
<div className="flex items-center gap-2 mb-3">
```
Replace with:
```jsx
<p className="eyebrow mb-2">/ MGLC Framework Portal</p>
<div className="flex items-center gap-2 mb-3">
```

- [ ] **Step 3: Verify in browser**

Open any page. Check:
- Header has a faint shadow (separates from page content on scroll)
- Active nav item is `font-semibold` (heavier weight)
- Logo square scales slightly on hover
- Footer has a thick brand-purple top border
- Footer brand column shows `/ MGLC FRAMEWORK PORTAL` eyebrow

- [ ] **Step 4: Commit**

```bash
git add src/components/layout/Header.jsx src/components/layout/Footer.jsx
git commit -m "feat: visual polish — header shadow + nav weight, footer brand accent border"
```

---

### Task 3: Homepage Hero — Split Layout with Photo Placeholder

**Files:**
- Modify: `src/pages/Home.jsx` (hero section only)

**Interfaces:**
- Consumes: `PlaceholderImage` from Task 1
- Consumes: existing `Link` from react-router-dom
- Produces: two-column hero — text 3/5, photo 2/5 on md+

- [ ] **Step 1: Add PlaceholderImage import to Home.jsx**

At the top of `src/pages/Home.jsx`, after the existing imports, add:
```jsx
import PlaceholderImage from '../components/ui/PlaceholderImage'
```

- [ ] **Step 2: Rewrite the hero section**

Find the hero section in `Home.jsx` (starts with `{/* Hero */}`):
```jsx
{/* Hero */}
<section className="pt-12 pb-14 border-b border-slate-200">
  <div className="max-w-2xl">
    ...
  </div>
</section>
```

Replace the entire hero section with:
```jsx
{/* Hero */}
<section className="pt-12 pb-16 border-b border-slate-200">
  <div className="grid grid-cols-1 md:grid-cols-5 gap-8 md:gap-12 items-center">
    {/* Text — 3/5 */}
    <div className="md:col-span-3">
      <div className="font-mono text-2xs text-brand-600 tracking-widest uppercase mb-4 animate-hero-1">
        DDR Research · S1 Pendidikan Multimedia · UPI Cibiru
      </div>
      <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-slate-900 leading-tight mb-4 animate-hero-2">
        Framework Produksi Motion Graphic{' '}
        <span className="text-brand-600">Live Commerce</span>{' '}
        Berbasis Visual Hierarchy
      </h1>
      <div className="animate-hero-3">
        <p className="text-slate-500 text-base leading-relaxed mb-8 max-w-xl">
          Sebuah framework yang membantu tim live commerce menentukan prioritas informasi visual,
          mempercepat produksi aset, serta menjaga konsistensi kualitas motion graphic pada berbagai campaign marketplace.
        </p>
        <div className="flex items-center gap-3">
          <Link
            to="/framework"
            className="px-4 py-2 bg-brand-600 text-white text-sm font-medium rounded hover:bg-brand-700 transition-colors"
          >
            Baca Framework
          </Link>
          <Link
            to="/tools"
            className="px-4 py-2 text-sm font-medium text-slate-700 border border-slate-300 rounded hover:bg-slate-50 transition-colors"
          >
            Langsung ke Tools
          </Link>
        </div>
      </div>
    </div>
    {/* Photo — 2/5, hidden on mobile */}
    <div className="hidden md:block md:col-span-2 animate-hero-4">
      <PlaceholderImage
        label="Foto: Suasana produksi live streaming e-commerce"
        aspect="4/3"
        className="w-full shadow-lg"
      />
    </div>
  </div>
</section>
```

- [ ] **Step 3: Verify in browser**

Open `http://localhost:5173/`. Check:
- On desktop (≥768px): hero is two columns — text on left, placeholder on right
- Placeholder shows 📷 + label with dashed border
- Placeholder slides in from the right after the text appears (hero-4 animation)
- On mobile (narrow browser): only text shown, no placeholder
- All three text entrance animations still work (hero-1, hero-2, hero-3)

- [ ] **Step 4: Commit**

```bash
git add src/pages/Home.jsx src/components/ui/PlaceholderImage.jsx
git commit -m "feat: homepage hero split layout with photo placeholder"
```

---

### Task 4: Homepage — Problem Statement + Section Backgrounds

**Files:**
- Modify: `src/pages/Home.jsx` (problem statement section + all section background classes)

**Interfaces:**
- Consumes: existing `problems` array and `FadeIn` component
- Produces: alternating section backgrounds, visual row badges

- [ ] **Step 1: Update Problem Statement section in Home.jsx**

Find the Problem Statement section:
```jsx
{/* Problem Statement */}
<section className="py-12 border-b border-slate-200">
  <FadeIn>
    <div className="mb-6">
      <p className="eyebrow mb-1">/ Problem Statement</p>
      <h2 className="section-heading">6 Masalah yang Diselesaikan</h2>
      <p className="text-sm text-slate-500 mt-1">Kondisi aktual produksi motion graphic live commerce di Indonesia</p>
    </div>
    <div className="divide-y divide-slate-100 border border-slate-200 rounded">
      {problems.map(p => (
        <div key={p.code} className="flex items-start gap-4 px-4 py-3 hover:bg-slate-50 transition-colors">
          <span className="font-mono text-2xs text-slate-400 pt-0.5 shrink-0 w-8">{p.code}</span>
          <p className="text-sm text-slate-700">{p.text}</p>
        </div>
      ))}
    </div>
  </FadeIn>
</section>
```

Replace with:
```jsx
{/* Problem Statement */}
<section className="py-16 border-b border-slate-200 section-alt">
  <FadeIn>
    <div className="mb-6">
      <p className="eyebrow mb-1">/ Problem Statement</p>
      <h2 className="section-heading">6 Masalah yang Diselesaikan</h2>
      <p className="text-sm text-slate-500 mt-1">Kondisi aktual produksi motion graphic live commerce di Indonesia</p>
    </div>
    <div className="divide-y divide-slate-200 border border-slate-200 rounded-lg overflow-hidden bg-white">
      {problems.map(p => (
        <div key={p.code} className="flex items-start gap-4 px-4 py-3.5 hover:bg-brand-50 transition-colors">
          <span className="font-mono text-xs text-brand-700 bg-brand-100 px-1.5 py-0.5 rounded font-semibold shrink-0 mt-0.5">
            {p.code}
          </span>
          <p className="text-sm text-slate-700">{p.text}</p>
        </div>
      ))}
    </div>
  </FadeIn>
</section>
```

- [ ] **Step 2: Update section backgrounds across all remaining homepage sections**

Apply `section-alt` and update `py-12` → `py-16` on Framework and Tools sections to match rhythm:

Find:
```jsx
{/* Framework Components */}
<section className="py-12 border-b border-slate-200">
```
Replace with:
```jsx
{/* Framework Components */}
<section className="py-16 border-b border-slate-200">
```

Find:
```jsx
{/* Tools */}
<section className="py-12 border-b border-slate-200">
```
Replace with:
```jsx
{/* Tools */}
<section className="py-16 border-b border-slate-200 section-alt">
```

Find:
```jsx
{/* Campaign Schedule */}
<section className="py-12 border-b border-slate-200">
```
Replace with:
```jsx
{/* Campaign Schedule */}
<section className="py-16 border-b border-slate-200">
```

Find:
```jsx
{/* CTA Feedback */}
<section className="py-12">
```
Replace with:
```jsx
{/* CTA Feedback */}
<section className="py-16">
```

- [ ] **Step 3: Verify in browser**

Open `/`. Check:
- Problem rows have brand-colored code badges (purple bg, purple text)
- Hovering a problem row turns it brand-50 (light purple tint)
- Problem section has a slightly different background from hero (slate-50)
- Tools section background is also slate-50
- Framework section background is white
- More breathing room (py-16 vs py-12)

- [ ] **Step 4: Commit**

```bash
git add src/pages/Home.jsx
git commit -m "feat: homepage problem statement visual badges, section backgrounds + spacing"
```

---

### Task 5: Homepage — Framework Tall Cards with Icon Zone

**Files:**
- Modify: `src/pages/Home.jsx` (Framework Components section cards only)

**Interfaces:**
- Consumes: `frameworkComponents` data (each item has `.icon`, `.order`, `.title`, `.summary`, `.route`)
- Produces: tall cards with icon zone at top, content below

- [ ] **Step 1: Replace Framework Components card markup**

In `src/pages/Home.jsx`, find the framework cards grid inside the Framework Components section:

```jsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
  {mainComponents.map(comp => (
    <Link
      key={comp.id}
      to={comp.route}
      className="card card-hover group p-4 block"
    >
      <div className="flex items-start justify-between mb-3">
        <span className="font-mono text-2xs text-brand-600">
          {String(comp.order).padStart(2, '0')}
        </span>
        <span className="text-base">{comp.icon}</span>
      </div>
      <h3 className="text-sm font-semibold tracking-tight text-slate-900 mb-1.5 group-hover:text-brand-700 transition-colors leading-snug">
        {comp.title}
      </h3>
      <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">{comp.summary}</p>
    </Link>
  ))}
</div>
```

Replace with:
```jsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
  {mainComponents.map(comp => (
    <Link
      key={comp.id}
      to={comp.route}
      className="card card-hover group block overflow-hidden"
    >
      {/* Icon zone */}
      <div className="h-20 bg-brand-50 flex items-center justify-center group-hover:bg-brand-100 transition-colors">
        <span className="text-3xl">{comp.icon}</span>
      </div>
      {/* Content */}
      <div className="p-4">
        <span className="font-mono text-2xs text-brand-600 block mb-2">
          {String(comp.order).padStart(2, '0')}
        </span>
        <h3 className="text-sm font-semibold tracking-tight text-slate-900 mb-1.5 group-hover:text-brand-700 transition-colors leading-snug">
          {comp.title}
        </h3>
        <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">{comp.summary}</p>
      </div>
    </Link>
  ))}
</div>
```

- [ ] **Step 2: Verify in browser**

Open `/`. Scroll to the Framework section. Check:
- Each card has a top zone with icon on brand-50 background
- Hovering a card: icon zone turns brand-100, card lifts with shadow
- Number and text content below the icon zone
- Grid stays 4 columns on desktop, 2 on tablet, 1 on mobile

- [ ] **Step 3: Commit**

```bash
git add src/pages/Home.jsx
git commit -m "feat: homepage framework cards — tall cards with icon zone"
```

---

### Task 6: Homepage — Tools Horizontal Cards

**Files:**
- Modify: `src/pages/Home.jsx` (tools array + Tools section cards)

**Interfaces:**
- Consumes: `tools` array — needs `icon` field added
- Produces: horizontal cards with icon zone on left

- [ ] **Step 1: Add icon field to the tools array in Home.jsx**

Find the `tools` array at the top of `Home.jsx`:
```jsx
const tools = [
  {
    to: '/tools/naming-generator',
    code: 'T01',
    title: 'Naming Generator',
    desc: 'Generate nama file standar dari input terkontrol. Hilangkan inkonsistensi penamaan selamanya.',
  },
  {
    to: '/tools/complexity-classifier',
    code: 'T02',
    title: 'Complexity Classifier',
    desc: 'Klasifikasikan level kompleksitas aset. Dapatkan estimasi waktu pengerjaan yang realistis.',
  },
  {
    to: '/tools/visual-hierarchy-checklist',
    code: 'T03',
    title: 'VH Checklist',
    desc: 'Review aset terhadap 6 prinsip visual hierarchy. Output: skor adherence terukur + daftar isu.',
  },
  {
    to: '/tools/render-calculator',
    code: 'T04',
    title: 'Render Calculator',
    desc: 'Rekomendasi render setting per platform — codec, resolusi, fps, alpha channel.',
  },
]
```

Replace with:
```jsx
const tools = [
  {
    to: '/tools/naming-generator',
    code: 'T01',
    icon: '🏷️',
    title: 'Naming Generator',
    desc: 'Generate nama file standar dari input terkontrol. Hilangkan inkonsistensi penamaan selamanya.',
  },
  {
    to: '/tools/complexity-classifier',
    code: 'T02',
    icon: '📊',
    title: 'Complexity Classifier',
    desc: 'Klasifikasikan level kompleksitas aset. Dapatkan estimasi waktu pengerjaan yang realistis.',
  },
  {
    to: '/tools/visual-hierarchy-checklist',
    code: 'T03',
    icon: '✅',
    title: 'VH Checklist',
    desc: 'Review aset terhadap 6 prinsip visual hierarchy. Output: skor adherence terukur + daftar isu.',
  },
  {
    to: '/tools/render-calculator',
    code: 'T04',
    icon: '🎬',
    title: 'Render Calculator',
    desc: 'Rekomendasi render setting per platform — codec, resolusi, fps, alpha channel.',
  },
]
```

- [ ] **Step 2: Replace Tools card markup**

Find the tools grid inside the Tools section:
```jsx
<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
  {tools.map(tool => (
    <Link
      key={tool.to}
      to={tool.to}
      className="card card-hover group p-5 block"
    >
      <div className="flex items-center gap-2 mb-3">
        <span className="font-mono text-2xs text-brand-600">{tool.code}</span>
        <div className="flex-1 h-px bg-slate-100" />
      </div>
      <h3 className="text-sm font-semibold tracking-tight text-slate-900 mb-1.5 group-hover:text-brand-700 transition-colors">
        {tool.title}
      </h3>
      <p className="text-xs text-slate-500 leading-relaxed mb-3">{tool.desc}</p>
      <span className="text-xs text-brand-600 font-medium font-mono group-hover:underline">
        buka →
      </span>
    </Link>
  ))}
</div>
```

Replace with:
```jsx
<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
  {tools.map(tool => (
    <Link
      key={tool.to}
      to={tool.to}
      className="card card-hover group flex overflow-hidden"
    >
      {/* Icon zone */}
      <div className="w-16 shrink-0 bg-brand-50 flex items-center justify-center text-2xl group-hover:bg-brand-100 transition-colors">
        {tool.icon}
      </div>
      {/* Content */}
      <div className="flex-1 p-4 flex flex-col">
        <span className="font-mono text-2xs text-brand-600 mb-1">{tool.code}</span>
        <h3 className="text-sm font-semibold tracking-tight text-slate-900 mb-1.5 group-hover:text-brand-700 transition-colors">
          {tool.title}
        </h3>
        <p className="text-xs text-slate-500 leading-relaxed mb-3 flex-1">{tool.desc}</p>
        <span className="text-xs text-brand-600 font-medium font-mono group-hover:underline self-start">
          buka →
        </span>
      </div>
    </Link>
  ))}
</div>
```

- [ ] **Step 3: Verify in browser**

Open `/`. Scroll to Tools section. Check:
- Each tool card is horizontal — icon on left in brand-50 zone, text content on right
- Icon zone lifts to brand-100 on hover
- Card lifts with shadow on hover
- Grid: 2 columns on sm+, 1 column on mobile

- [ ] **Step 4: Commit**

```bash
git add src/pages/Home.jsx
git commit -m "feat: homepage tools — horizontal cards with icon zone"
```

---

### Task 7: Homepage — Campaign Accent Border + Feedback Brand CTA

**Files:**
- Modify: `src/pages/Home.jsx` (campaign section + feedback CTA section)

**Interfaces:**
- Consumes: existing `Link` from react-router-dom
- Produces: campaign with brand left-border accent, feedback CTA as full brand-600 block

- [ ] **Step 1: Update Campaign Schedule section**

Find the Campaign Schedule section:
```jsx
{/* Campaign Schedule */}
<section className="py-16 border-b border-slate-200">
  <FadeIn>
    <div className="flex flex-col sm:flex-row sm:items-center gap-6">
      <div className="flex-1">
        <p className="eyebrow mb-1">/ Komponen 08 · Campaign Usage Management</p>
        <h2 className="section-heading mb-1.5">Jadwal Penggunaan Mockup</h2>
        <p className="text-sm text-slate-500 leading-relaxed max-w-lg">
          Cek aset mana yang sedang aktif, akan datang, atau sudah kedaluwarsa.
          Data dikelola Motion Designer Lead via Google Sheets — operator tidak perlu koordinasi manual.
        </p>
      </div>
      <div className="shrink-0">
        <Link
          to="/campaign"
          className="inline-flex items-center gap-2 px-4 py-2 border border-brand-600 text-brand-700 text-sm font-medium rounded hover:bg-brand-50 transition-colors"
        >
          Buka Jadwal →
        </Link>
      </div>
    </div>
  </FadeIn>
</section>
```

Replace with:
```jsx
{/* Campaign Schedule */}
<section className="py-16 border-b border-slate-200">
  <FadeIn>
    <div className="flex flex-col sm:flex-row sm:items-center gap-6 border-l-4 border-brand-600 pl-6">
      <div className="flex-1">
        <p className="eyebrow mb-1">/ Komponen 08 · Campaign Usage Management</p>
        <h2 className="section-heading mb-1.5">Jadwal Penggunaan Mockup</h2>
        <p className="text-sm text-slate-500 leading-relaxed max-w-lg">
          Cek aset mana yang sedang aktif, akan datang, atau sudah kedaluwarsa.
          Data dikelola Motion Designer Lead via Google Sheets — operator tidak perlu koordinasi manual.
        </p>
      </div>
      <div className="shrink-0">
        <Link
          to="/campaign"
          className="inline-flex items-center gap-2 px-4 py-2 border border-brand-600 text-brand-700 text-sm font-medium rounded hover:bg-brand-50 transition-colors"
        >
          Buka Jadwal →
        </Link>
      </div>
    </div>
  </FadeIn>
</section>
```

- [ ] **Step 2: Update Feedback CTA section to full brand background**

Find the CTA Feedback section:
```jsx
{/* CTA Feedback */}
<section className="py-16">
  <FadeIn>
    <div className="border border-slate-200 rounded p-8 flex flex-col sm:flex-row sm:items-center gap-6">
      <div className="flex-1">
        <p className="eyebrow mb-1">/ Feedback</p>
        <h2 className="section-heading mb-1.5">Sudah mencoba tools-nya?</h2>
        <p className="text-sm text-slate-500">
          Feedback Anda membantu mengkalibrasi framework dan menyempurnakan portal ini sebagai bahan penelitian.
        </p>
      </div>
      <Link
        to="/feedback"
        className="shrink-0 px-4 py-2 bg-brand-600 text-white text-sm font-medium rounded hover:bg-brand-700 transition-colors"
      >
        Beri Feedback →
      </Link>
    </div>
  </FadeIn>
</section>
```

Replace with:
```jsx
{/* CTA Feedback */}
<section className="py-16">
  <FadeIn>
    <div className="bg-brand-600 rounded-xl p-10 flex flex-col sm:flex-row sm:items-center gap-6">
      <div className="flex-1">
        <p className="font-mono text-2xs text-brand-300 tracking-widest uppercase mb-1">/ Feedback</p>
        <h2 className="text-xl font-semibold tracking-tight text-white mb-1.5">Sudah mencoba tools-nya?</h2>
        <p className="text-sm text-brand-100">
          Feedback Anda membantu mengkalibrasi framework dan menyempurnakan portal ini sebagai bahan penelitian.
        </p>
      </div>
      <Link
        to="/feedback"
        className="shrink-0 px-4 py-2 bg-white text-brand-700 text-sm font-medium rounded hover:bg-brand-50 transition-colors"
      >
        Beri Feedback →
      </Link>
    </div>
  </FadeIn>
</section>
```

- [ ] **Step 3: Verify in browser**

Open `/`. Scroll to bottom. Check:
- Campaign section has a thick brand-purple left border
- Feedback CTA is a rounded brand-purple block — white text, white button
- Visual hierarchy: Feedback CTA is clearly the strongest CTA on the page

- [ ] **Step 4: Commit**

```bash
git add src/pages/Home.jsx
git commit -m "feat: homepage campaign accent border, feedback CTA full brand background"
```

---

### Task 8: Framework Overview — Header Band + Horizontal Icon Cards

**Files:**
- Modify: `src/pages/framework/FrameworkOverview.jsx`

**Interfaces:**
- Consumes: `frameworkComponents` data (same as homepage — `.icon`, `.order`, `.title`, `.summary`, `.route`)
- Produces: header band wrapping eyebrow/title/summary/panduan, horizontal icon cards in grid

- [ ] **Step 1: Rewrite FrameworkOverview.jsx**

Full replacement of `src/pages/framework/FrameworkOverview.jsx`:

```jsx
import { Link } from 'react-router-dom'
import FrameworkPageLayout from '../../components/layout/FrameworkPageLayout'
import FadeIn from '../../components/ui/FadeIn'
import frameworkComponents from '../../content/framework-components.json'

const overview = frameworkComponents.find(c => c.id === 'framework-overview')
const components = frameworkComponents.filter(c => c.id !== 'framework-overview').sort((a, b) => a.order - b.order)

export default function FrameworkOverview() {
  return (
    <FrameworkPageLayout component={overview}>
      {/* Header band */}
      <FadeIn>
        <div className="bg-brand-50 border border-brand-100 rounded-xl p-6 mb-8">
          <p className="eyebrow mb-1">/ MGLC Framework</p>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 mb-1">{overview.title}</h1>
          <p className="text-sm text-slate-600 mb-4">{overview.summary}</p>
          <div className="border-t border-brand-100 pt-4">
            <p className="font-mono text-2xs text-slate-400 tracking-widest uppercase mb-2">Panduan Membaca</p>
            <p className="text-sm text-slate-700">
              Komponen 1 (Visual Hierarchy) adalah <strong>inti filosofis</strong> — baca ini terlebih dahulu.
              Komponen 2–7 adalah sistem pendukung. Komponen 8 adalah lapisan operasional.
            </p>
          </div>
        </div>
      </FadeIn>

      {/* Component grid */}
      <FadeIn delay={80}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {components.map(comp => (
            <Link
              key={comp.id}
              to={comp.route}
              className="group card card-hover p-4 flex gap-4 items-start"
            >
              <div className="w-10 h-10 shrink-0 bg-brand-50 rounded-lg flex items-center justify-center text-xl group-hover:bg-brand-100 transition-colors">
                {comp.icon}
              </div>
              <div>
                <span className="font-mono text-2xs text-brand-600 block mb-0.5">
                  {String(comp.order).padStart(2, '0')}
                </span>
                <h3 className="text-sm font-semibold text-slate-900 group-hover:text-brand-700 transition-colors mb-1">
                  {comp.title}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">{comp.summary}</p>
              </div>
            </Link>
          ))}
        </div>
      </FadeIn>
    </FrameworkPageLayout>
  )
}
```

- [ ] **Step 2: Verify in browser**

Open `/framework`. Check:
- Brand-50 header band at top with eyebrow, title, summary, and panduan membaca
- Component cards are horizontal — icon box on left, text on right
- Icon box turns brand-100 on hover
- The old separate "Panduan Membaca" bordered box is gone (merged into header band)

- [ ] **Step 3: Commit**

```bash
git add src/pages/framework/FrameworkOverview.jsx
git commit -m "feat: framework overview header band, horizontal icon cards"
```

---

### Task 9: Framework Component Pages — Page Header Band with Decorative Number

**Files:**
- Modify: `src/pages/framework/FrameworkComponentPage.jsx`

**Interfaces:**
- Consumes: `component.order` (number 1–8), `component.icon` (emoji string), `component.title`, `component.summary`
- Produces: brand-50 header band with decorative background number behind content

- [ ] **Step 1: Rewrite the page header in FrameworkComponentPage.jsx**

In `src/pages/framework/FrameworkComponentPage.jsx`, find and replace the first `<FadeIn>` block:

```jsx
{/* BEFORE */}
<FadeIn>
  <div className="flex items-center gap-3 mb-2">
    <span className="text-3xl">{component.icon}</span>
    <div>
      <div className="text-xs text-brand-600 font-medium">Komponen {component.order}</div>
      <h1 className="text-2xl font-bold text-slate-900">{component.title}</h1>
    </div>
  </div>
  <p className="text-slate-600 mb-8 ml-12">{component.summary}</p>
</FadeIn>
```

Replace with:
```jsx
<FadeIn>
  <div className="relative overflow-hidden bg-brand-50 border border-brand-100 rounded-xl p-6 mb-8">
    {/* Decorative background number */}
    <span className="absolute right-4 top-0 text-8xl font-bold text-brand-100 select-none pointer-events-none leading-none">
      {String(component.order).padStart(2, '0')}
    </span>
    {/* Content */}
    <div className="relative">
      <p className="eyebrow mb-2">Komponen {component.order}</p>
      <div className="flex items-center gap-3 mb-2">
        <span className="text-3xl">{component.icon}</span>
        <h1 className="text-2xl font-bold text-slate-900">{component.title}</h1>
      </div>
      <p className="text-slate-600 max-w-xl">{component.summary}</p>
    </div>
  </div>
</FadeIn>
```

- [ ] **Step 2: Verify in browser**

Open any framework component page, e.g., `/framework/visual-hierarchy` or `/framework/naming-convention`. Check:
- Brand-50 header band at top
- Large decorative component number (e.g., "01") visible in the background, faded (brand-100)
- Icon + title aligned left
- Summary text below
- Accordion sections unchanged below the header band

- [ ] **Step 3: Commit**

```bash
git add src/pages/framework/FrameworkComponentPage.jsx
git commit -m "feat: framework component pages — header band with decorative number"
```

---

### Task 10: Tools Hub — Header Band + Horizontal Icon Cards

**Files:**
- Modify: `src/pages/tools/ToolsHub.jsx`

**Interfaces:**
- Consumes: existing `tools` array (already has `icon`, `badge`, `title`, `desc`, `to`, `relatedFramework`, `relatedLabel`)
- Produces: slate-50 header band, horizontal cards with icon zone

- [ ] **Step 1: Rewrite ToolsHub.jsx**

Full replacement of `src/pages/tools/ToolsHub.jsx`:

```jsx
import { Link } from 'react-router-dom'
import PageLayout from '../../components/layout/PageLayout'
import FadeIn from '../../components/ui/FadeIn'

const tools = [
  {
    to: '/tools/naming-generator',
    icon: '🏷️',
    badge: 'Tool 1',
    title: 'Naming Convention Generator',
    desc: 'Generate nama file standar dari input terkontrol. Hilangkan inkonsistensi penamaan selamanya.',
    usedFor: 'Setiap mulai proyek baru',
    relatedFramework: '/framework/naming-convention',
    relatedLabel: 'Baca: Naming Convention',
  },
  {
    to: '/tools/complexity-classifier',
    icon: '📊',
    badge: 'Tool 2',
    title: 'Complexity Classifier',
    desc: 'Jawab 6 pertanyaan, dapatkan Level 1–4 + estimasi waktu produksi yang realistis.',
    usedFor: 'Saat planning / estimasi timeline',
    relatedFramework: '/framework/complexity',
    relatedLabel: 'Baca: Klasifikasi Kompleksitas',
  },
  {
    to: '/tools/visual-hierarchy-checklist',
    icon: '✅',
    badge: 'Tool 3',
    title: 'Visual Hierarchy Checklist',
    desc: 'Review aset Anda terhadap 6 prinsip visual hierarchy. Dapatkan skor adherence % + daftar isu.',
    usedFor: 'QC sebelum export',
    relatedFramework: '/framework/quality-control',
    relatedLabel: 'Baca: Quality Control',
  },
  {
    to: '/tools/render-calculator',
    icon: '🎬',
    badge: 'Tool 4',
    title: 'Render Settings Calculator',
    desc: 'Pilih platform + jenis output + software, dapatkan rekomendasi codec/resolusi/fps/bitrate yang tepat.',
    usedFor: 'Saat setup render di After Effects',
    relatedFramework: '/framework/render-standard',
    relatedLabel: 'Baca: Render Standard',
  },
]

export default function ToolsHub() {
  return (
    <PageLayout sidebar="tools">
      {/* Header band */}
      <FadeIn>
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 mb-6">
          <p className="eyebrow mb-1">/ Interactive Tools</p>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 mb-1">4 Interactive Tools</h1>
          <p className="text-sm text-slate-500">
            Semua tool berjalan sepenuhnya di browser — tidak ada data yang dikirim ke server.
          </p>
        </div>
      </FadeIn>

      <FadeIn delay={80}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {tools.map((tool) => (
            <div key={tool.to} className="card card-hover group flex overflow-hidden">
              {/* Icon zone */}
              <div className="w-16 shrink-0 bg-brand-50 flex items-center justify-center text-2xl group-hover:bg-brand-100 transition-colors">
                {tool.icon}
              </div>
              {/* Content */}
              <div className="flex-1 p-5 flex flex-col">
                <span className="font-mono text-2xs text-brand-600 mb-1">{tool.badge}</span>
                <h2 className="text-sm font-semibold text-slate-900 mb-1 group-hover:text-brand-700 transition-colors">
                  {tool.title}
                </h2>
                <p className="text-xs text-slate-500 mb-3 flex-1 leading-relaxed">{tool.desc}</p>
                <div className="flex items-center justify-between">
                  <Link
                    to={tool.to}
                    className="px-3 py-1.5 bg-brand-600 text-white text-xs font-medium rounded hover:bg-brand-700 transition-colors"
                  >
                    buka →
                  </Link>
                  <Link
                    to={tool.relatedFramework}
                    className="font-mono text-2xs text-slate-400 hover:text-brand-600 transition-colors"
                  >
                    {tool.relatedLabel}
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </FadeIn>
    </PageLayout>
  )
}
```

- [ ] **Step 2: Verify in browser**

Open `/tools`. Check:
- Slate-50 header band at top with eyebrow, h1, desc
- Tool cards are horizontal — icon zone on left, content on right
- Icon zone turns brand-100 on hover
- "buka →" button and framework link in card footer

- [ ] **Step 3: Commit**

```bash
git add src/pages/tools/ToolsHub.jsx
git commit -m "feat: tools hub — header band, horizontal icon cards"
```

---

### Task 11: Campaign Schedule — Status Stat Cards + Loading Skeleton

**Files:**
- Modify: `src/pages/CampaignSchedule.jsx`

**Interfaces:**
- Consumes: `counts` object (already computed as `{ aktif: number, 'akan-datang': number, kedaluwarsa: number }`)
- Consumes: `isLoading` boolean (already in component state)
- Produces: 3 stat cards above filters, skeleton rows replacing emoji spinner

- [ ] **Step 1: Add stat cards after the status bar blocks**

In `src/pages/CampaignSchedule.jsx`, find the comment `{/* Status filter */}`:
```jsx
{/* Status filter */}
<div className="flex flex-wrap gap-2 mb-4">
```

Insert the following BEFORE this line (after the `!isLoading && !isLive` block):
```jsx
{/* Stat cards */}
<div className="grid grid-cols-3 gap-3 mb-6">
  {[
    { key: 'aktif',         label: 'Aktif',        dot: '🟢', bg: 'bg-green-50  border-green-200',  text: 'text-green-800'  },
    { key: 'akan-datang',   label: 'Akan Datang',  dot: '🟡', bg: 'bg-yellow-50 border-yellow-200', text: 'text-yellow-800' },
    { key: 'kedaluwarsa',   label: 'Kedaluwarsa',  dot: '🔴', bg: 'bg-red-50    border-red-200',    text: 'text-red-800'    },
  ].map(s => (
    <div key={s.key} className={`border rounded-lg p-4 text-center ${s.bg}`}>
      <div className={`text-2xl font-bold mb-1 ${s.text}`}>{counts[s.key]}</div>
      <div className={`text-xs font-mono ${s.text}`}>{s.dot} {s.label}</div>
    </div>
  ))}
</div>
```

- [ ] **Step 2: Replace the loading spinner with a skeleton**

Find the loading status bar block:
```jsx
{isLoading && (
  <div className="flex items-center gap-2 border border-slate-200 rounded px-4 py-2.5 mb-6 text-xs text-slate-500 font-mono">
    <span className="animate-spin">⏳</span> Memuat data dari Google Sheets…
  </div>
)}
```

Replace with:
```jsx
{isLoading && (
  <div className="border border-slate-200 rounded-lg overflow-hidden mb-6">
    <div className="bg-slate-50 px-4 py-2.5 border-b border-slate-200 flex items-center gap-2">
      <div className="h-3 bg-slate-200 rounded animate-pulse w-48" />
      <div className="h-3 bg-slate-200 rounded animate-pulse w-32" />
    </div>
    {[1, 2, 3].map(i => (
      <div key={i} className="flex gap-4 px-4 py-3 border-b border-slate-100 last:border-0">
        <div className="h-4 bg-slate-100 rounded animate-pulse w-16 shrink-0" />
        <div className="h-4 bg-slate-100 rounded animate-pulse flex-1" />
        <div className="h-4 bg-slate-100 rounded animate-pulse w-24 shrink-0" />
      </div>
    ))}
  </div>
)}
```

- [ ] **Step 3: Verify in browser**

Open `/campaign`. Check:
- 3 colored stat cards (green/yellow/red) above the filter buttons, showing counts
- Counts match what's in the table below
- To test skeleton: temporarily change `isLoading` to always true in the component, reload, check skeleton rows animate with pulse, then revert

- [ ] **Step 4: Commit**

```bash
git add src/pages/CampaignSchedule.jsx
git commit -m "feat: campaign schedule — status stat cards, loading skeleton"
```

---

### Task 12: Downloads, About, Feedback — Page Header Bands

**Files:**
- Modify: `src/pages/Downloads.jsx`
- Modify: `src/pages/About.jsx`
- Modify: `src/pages/Feedback.jsx`

**Interfaces:**
- Produces: consistent `bg-slate-50 border border-slate-200 rounded-xl p-6 mb-8` header band on each page

- [ ] **Step 1: Update Downloads.jsx header**

In `src/pages/Downloads.jsx`, find:
```jsx
<FadeIn>
  <h1 className="text-2xl font-bold text-slate-900 mb-2">Unduhan</h1>
  <p className="text-slate-600 mb-8">Template, checklist, dan panduan dalam format yang bisa langsung dipakai.</p>
```

Replace with:
```jsx
<FadeIn>
  <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 mb-8">
    <p className="eyebrow mb-1">/ Unduhan</p>
    <h1 className="text-2xl font-semibold tracking-tight text-slate-900 mb-1">Unduhan</h1>
    <p className="text-sm text-slate-500">Template, checklist, dan panduan dalam format yang bisa langsung dipakai.</p>
  </div>
```

- [ ] **Step 2: Update About.jsx header**

In `src/pages/About.jsx`, find:
```jsx
<FadeIn>
<h1 className="text-2xl font-bold text-slate-900 mb-6">Tentang</h1>
```

Replace with:
```jsx
<FadeIn>
<div className="bg-slate-50 border border-slate-200 rounded-xl p-6 mb-6">
  <p className="eyebrow mb-1">/ Tentang</p>
  <h1 className="text-2xl font-semibold tracking-tight text-slate-900 mb-1">Tentang Portal</h1>
  <p className="text-sm text-slate-500">Konteks penelitian, metodologi DDR, dan glosarium istilah framework.</p>
</div>
```

- [ ] **Step 3: Update Feedback.jsx header**

In `src/pages/Feedback.jsx`, find:
```jsx
<FadeIn>
<div className="max-w-2xl mx-auto">
  <h1 className="text-2xl font-bold text-slate-900 mb-2">Feedback Penelitian</h1>
  <p className="text-slate-600 mb-6">
    Feedback Anda membantu mengkalibrasi framework dan menyempurnakan portal ini
    sebagai bagian dari penelitian Design and Development Research.
  </p>
```

Replace with:
```jsx
<FadeIn>
<div className="max-w-2xl mx-auto">
  <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 mb-6">
    <p className="eyebrow mb-1">/ Feedback</p>
    <h1 className="text-2xl font-semibold tracking-tight text-slate-900 mb-1">Feedback Penelitian</h1>
    <p className="text-sm text-slate-500">
      Feedback Anda membantu mengkalibrasi framework dan menyempurnakan portal ini
      sebagai bagian dari penelitian Design and Development Research.
    </p>
  </div>
```

- [ ] **Step 4: Verify in browser**

Open `/downloads`, `/about`, `/feedback`. Each should show a consistent slate-50 rounded header band at the top with eyebrow + title + description. Visual rhythm matches Campaign Schedule page header treatment.

- [ ] **Step 5: Commit**

```bash
git add src/pages/Downloads.jsx src/pages/About.jsx src/pages/Feedback.jsx
git commit -m "feat: downloads, about, feedback — consistent page header bands"
```

---

## Self-Review

**Spec coverage check:**

| Spec Section | Task |
|---|---|
| S2: PlaceholderImage component | Task 1 |
| S3: card-hover upgrade, hero-4 animation, placeholder-img class | Task 1 |
| S3: FadeIn strengthen | Task 1 |
| S4: Header logo hover, nav weight | Task 2 |
| S5: Footer border-t-4 + eyebrow | Task 2 |
| S6.2: Hero split layout, photo placeholder | Task 3 |
| S6.3: Problem statement visual rows, section-alt | Task 4 |
| S6.4: Framework tall cards with icon zone | Task 5 |
| S6.5: Tools horizontal cards with icon zone | Task 6 |
| S6.6: Campaign accent border | Task 7 |
| S6.7: Feedback full brand background | Task 7 |
| S7: Framework Overview header band + cards | Task 8 |
| S8: Framework Component page header band + decorative number | Task 9 |
| S9: Tools Hub header band + horizontal cards | Task 10 |
| S10: Campaign stat cards + skeleton loading | Task 11 |
| S11: Downloads/About/Feedback header band | Task 12 |

No gaps found.

**Placeholder scan:** No TBD, TODO, or "similar to Task N" found. All code blocks are complete.

**Type/name consistency:**
- `PlaceholderImage` props (`label`, `aspect`, `className`) — defined in Task 1, used in Task 3. ✓
- `counts` object keys (`aktif`, `akan-datang`, `kedaluwarsa`) — already defined in CampaignSchedule.jsx, used in Task 11. ✓
- `comp.icon` — already present in frameworkComponents data, used in Tasks 5, 8, 9. ✓
- `tool.icon` — added to tools array in Task 6, used in same task; Task 10 ToolsHub has its own local tools array with icons already. ✓
