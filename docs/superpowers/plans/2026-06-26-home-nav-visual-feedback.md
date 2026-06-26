# Home & Navigation Visual Feedback — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Tambah visual feedback — hero entrance animation, card hover lift, scroll reveal per section, dan mobile menu slide animation — menggunakan Tailwind CSS + native IntersectionObserver tanpa library baru.

**Architecture:** CSS `@keyframes` untuk hero entrance; custom React hook `useInView` (IntersectionObserver) + `FadeIn` wrapper component untuk scroll reveal; upgrade Tailwind classes untuk card hover; CSS `max-h` transition untuk mobile menu.

**Tech Stack:** React 18, Tailwind CSS 3, Vite 5. Tidak ada library baru. Tidak ada test framework — verifikasi dilakukan secara visual di browser (`npm run dev`).

## Global Constraints

- Tidak ada library baru yang ditambahkan ke `package.json`
- Semua animasi harus respek `prefers-reduced-motion: reduce`
- Hanya menyentuh file yang disebutkan di spec — tools, Campaign Schedule, Framework pages tidak tersentuh
- Jalankan dev server dengan `npm run dev` (bukan `pnpm run dev`)
- Working directory: `E:\Jova's Folders\School\D. KAMPUS UPI\PEMBELAJARAN\PENDIDIKAN MULTIMEDIA\SEMESTER 8\SKRIPSI\SEMPRO\WEBSITE`

---

### Task 1: CSS Foundation — Keyframes, Card Hover, Reduced Motion

**Files:**
- Modify: `src/index.css`

**Interfaces:**
- Produces: class `.animate-hero-1`, `.animate-hero-2`, `.animate-hero-3` (dipakai Task 4); upgrade `.card` dan `.card-hover` (otomatis berlaku di semua komponen yang sudah pakai class tersebut)

- [ ] **Step 1: Buka `src/index.css` dan temukan block `.card` dan `.card-hover`**

Saat ini:
```css
.card {
  @apply bg-white border border-slate-200 rounded transition-colors;
}
.card-hover {
  @apply hover:border-brand-400;
}
```

- [ ] **Step 2: Ganti `.card` dan `.card-hover` dengan versi yang di-upgrade**

```css
.card {
  @apply bg-white border border-slate-200 rounded transition-all duration-200;
}
.card-hover {
  @apply hover:border-brand-400 hover:-translate-y-0.5 hover:shadow-sm;
}
```

- [ ] **Step 3: Tambahkan hero animation keyframes di bawah `@layer components { ... }` block, sebelum closing `}`**

Tambah ini di akhir file `src/index.css` (setelah semua `@layer` blocks):

```css
/* ── Hero entrance animation ── */
@keyframes fadeSlideUp {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-hero-1 {
  animation: fadeSlideUp 400ms ease-out both;
  animation-delay: 0ms;
}
.animate-hero-2 {
  animation: fadeSlideUp 400ms ease-out both;
  animation-delay: 100ms;
}
.animate-hero-3 {
  animation: fadeSlideUp 400ms ease-out both;
  animation-delay: 220ms;
}

@media (prefers-reduced-motion: reduce) {
  .animate-hero-1,
  .animate-hero-2,
  .animate-hero-3 {
    animation: none;
    opacity: 1;
  }
}
```

- [ ] **Step 4: Verifikasi di browser**

Jalankan `npm run dev`, buka Home. Hover ke card framework component — harus ada micro-lift + shadow tipis. Tidak ada error di console.

- [ ] **Step 5: Commit**

```bash
git add src/index.css
git commit -m "feat: upgrade card hover + add hero animation CSS"
```

---

### Task 2: `useInView` Hook

**Files:**
- Create: `src/utils/useInView.js`

**Interfaces:**
- Produces: `useInView({ threshold?, triggerOnce? }) => { ref: React.RefObject, inView: boolean }`
  - `threshold` default: `0.1`
  - `triggerOnce` default: `true`
  - Jika `prefers-reduced-motion: reduce`, langsung return `inView: true` tanpa observer

- [ ] **Step 1: Buat file `src/utils/useInView.js`**

```js
import { useEffect, useRef, useState } from 'react'

export default function useInView({ threshold = 0.1, triggerOnce = true } = {}) {
  const ref = useRef(null)

  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const [inView, setInView] = useState(prefersReducedMotion)

  useEffect(() => {
    if (prefersReducedMotion) return
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          if (triggerOnce) observer.unobserve(el)
        }
      },
      { threshold }
    )

    observer.observe(el)
    return () => observer.unobserve(el)
  }, [threshold, triggerOnce, prefersReducedMotion])

  return { ref, inView }
}
```

- [ ] **Step 2: Verifikasi tidak ada error**

Jalankan `npm run dev`. Tidak perlu test visual di step ini — hook belum dipakai.

- [ ] **Step 3: Commit**

```bash
git add src/utils/useInView.js
git commit -m "feat: add useInView hook (IntersectionObserver)"
```

---

### Task 3: `FadeIn` Component

**Files:**
- Create: `src/components/ui/FadeIn.jsx`

**Interfaces:**
- Consumes: `useInView` dari `../../utils/useInView` — returns `{ ref, inView }`
- Produces: `<FadeIn delay={number} className={string}>children</FadeIn>`
  - `delay`: opsional, dalam milliseconds, untuk manual stagger
  - `className`: opsional, di-forward ke wrapper div
  - Saat `inView = false`: `opacity-0 translate-y-3`
  - Saat `inView = true`: `opacity-100 translate-y-0`
  - Transition: `duration-500 ease-out`

- [ ] **Step 1: Buat file `src/components/ui/FadeIn.jsx`**

```jsx
import useInView from '../../utils/useInView'

export default function FadeIn({ children, delay = 0, className = '' }) {
  const { ref, inView } = useInView()

  return (
    <div
      ref={ref}
      className={`transition-all duration-500 ease-out ${
        inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
      } ${className}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  )
}
```

- [ ] **Step 2: Verifikasi di browser**

`FadeIn` belum dipakai di mana pun, tidak ada yang berubah secara visual. Pastikan tidak ada error compile di console.

- [ ] **Step 3: Commit**

```bash
git add src/components/ui/FadeIn.jsx
git commit -m "feat: add FadeIn scroll reveal component"
```

---

### Task 4: Hero Animation + Section Scroll Reveal di `Home.jsx`

**Files:**
- Modify: `src/pages/Home.jsx`

**Interfaces:**
- Consumes: `FadeIn` dari `../components/ui/FadeIn`; class `.animate-hero-1`, `.animate-hero-2`, `.animate-hero-3` dari Task 1

- [ ] **Step 1: Tambah import `FadeIn` di `Home.jsx`**

Di baris import paling atas, setelah import yang sudah ada:
```jsx
import FadeIn from '../components/ui/FadeIn'
```

- [ ] **Step 2: Tambah hero animation classes ke elemen di dalam Hero section**

Cari `{/* Hero */}` section. Tambah classes berikut:

```jsx
{/* Hero */}
<section className="pt-12 pb-14 border-b border-slate-200">
  <div className="max-w-2xl">
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
</section>
```

- [ ] **Step 3: Wrap setiap section di bawah Hero dengan `<FadeIn>`**

Ganti tiap section mulai dari Problem Statement sampai CTA Feedback. Wrap isi dalam `<FadeIn>` — jangan bungkus `<section>` tagnya, cukup isinya, agar semantik HTML tetap bersih:

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

{/* Framework Components */}
<section className="py-12 border-b border-slate-200">
  <FadeIn>
    <div className="mb-6">
      <p className="eyebrow mb-1">/ Framework</p>
      <h2 className="section-heading">8 Komponen Konstitutif</h2>
      <p className="text-sm text-slate-500 mt-1">Klik komponen untuk baca dokumentasi lengkap</p>
    </div>
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
    <div className="mt-4">
      <Link to="/framework" className="text-sm text-brand-600 hover:text-brand-800 font-medium">
        Lihat semua komponen →
      </Link>
    </div>
  </FadeIn>
</section>

{/* Tools */}
<section className="py-12 border-b border-slate-200">
  <FadeIn>
    <div className="mb-6">
      <p className="eyebrow mb-1">/ Interactive Tools</p>
      <h2 className="section-heading">4 Tools Interaktif</h2>
      <p className="text-sm text-slate-500 mt-1">Berjalan sepenuhnya di browser — tidak ada data yang dikirim ke server</p>
    </div>
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
  </FadeIn>
</section>

{/* Campaign Schedule */}
<section className="py-12 border-b border-slate-200">
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

{/* CTA Feedback */}
<section className="py-12">
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

- [ ] **Step 4: Verifikasi di browser**

Buka Home. Checklist:
1. Eyebrow label, heading, paragraph+buttons masuk berurutan saat load (hero entrance)
2. Scroll ke bawah — setiap section muncul dengan fade + slide-up saat masuk viewport
3. Hover ke framework component card — ada micro-lift + shadow
4. Hover ke tool card — sama
5. Tidak ada layout shift atau flickering

- [ ] **Step 5: Commit**

```bash
git add src/pages/Home.jsx
git commit -m "feat: tambah hero entrance animation + scroll reveal di Home"
```

---

### Task 5: Mobile Menu Slide Animation di `Header.jsx`

**Files:**
- Modify: `src/components/layout/Header.jsx`

**Interfaces:**
- Consumes: state `menuOpen` yang sudah ada

- [ ] **Step 1: Ganti conditional render mobile menu ke CSS height transition**

Cari block berikut di `Header.jsx`:

```jsx
{/* Mobile menu */}
{menuOpen && (
  <div className="md:hidden border-t border-slate-100 bg-white px-4 py-3 space-y-0.5">
    {navItems.map(item => (
      ...
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
)}
```

Ganti dengan:

```jsx
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
            isActive ? 'bg-brand-50 text-brand-700' : 'text-slate-600 hover:bg-slate-50'
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
```

- [ ] **Step 2: Verifikasi di browser**

Resize browser ke mobile width (< 768px). Klik hamburger — menu harus slide-down dengan smooth. Klik lagi — slide-up dan hilang. Tidak ada border separator yang visible saat menu tertutup.

- [ ] **Step 3: Commit**

```bash
git add src/components/layout/Header.jsx
git commit -m "feat: ganti mobile menu jadi CSS slide animation"
```

---

## Self-Review Checklist

- [x] **Hero entrance** — `.animate-hero-1/2/3` defined di Task 1, dipakai di Task 4
- [x] **Card hover upgrade** — `.card` dan `.card-hover` diupgrade di Task 1, otomatis berlaku
- [x] **Scroll reveal** — `useInView` (Task 2) + `FadeIn` (Task 3) + dipakai di Task 4
- [x] **Mobile menu animation** — Task 5
- [x] **`prefers-reduced-motion`** — CSS `@media` block di Task 1; hook langsung return `inView: true` di Task 2
- [x] **Tidak ada library baru** — semua native/Tailwind
- [x] **Files non-terkait tidak tersentuh** — tools, Campaign, Framework tidak dimodifikasi
- [x] **Type consistency** — `useInView` return `{ ref, inView }`, FadeIn konsumsi keduanya dengan benar
