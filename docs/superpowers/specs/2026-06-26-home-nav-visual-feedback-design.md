# Design Spec: Home & Navigation Visual Feedback

**Date:** 2026-06-26
**Scope:** Home page + mobile navigation
**Approach:** Tailwind CSS transitions + native IntersectionObserver (no new libraries)

---

## Problem

UI sudah clean dan minimalis, tapi interaksi terasa flat — card tidak memberi feedback hover yang kuat, section muncul tiba-tiba tanpa entrance, mobile menu muncul abrupt.

## Goal

Tambah visual feedback yang subtle tapi terasa — bukan dramatis, sesuai dengan estetika minimalis portal yang sudah ada.

---

## Changes

### 1. Hero Entrance Animation (`index.css` + `Home.jsx`)

CSS `@keyframes fadeSlideUp` — elemen bergerak dari `opacity: 0, translateY: 12px` ke `opacity: 1, translateY: 0`.

Tiga class dengan staggered delay:
- `.animate-hero-1` — delay 0ms (eyebrow label)
- `.animate-hero-2` — delay 100ms (heading)
- `.animate-hero-3` — delay 220ms (paragraph + CTA buttons)

Duration: 400ms, easing: `ease-out`. Tidak ada JS.

### 2. Card Hover Upgrade (`index.css`)

`.card-hover` sebelumnya: hanya `hover:border-brand-400`.

Setelah:
```
transition-all duration-200
hover:border-brand-400
hover:-translate-y-0.5
hover:shadow-sm
```

Efek: card terangkat sedikit + muncul shadow tipis + border brand. Terasa ada "lift" saat hover.

### 3. Scroll Reveal (`useInView.js` + `FadeIn.jsx`)

**`src/utils/useInView.js`** — custom hook wrapping `IntersectionObserver`:
- Props: `{ threshold: 0.1, triggerOnce: true }`
- Returns: `{ ref, inView }`

**`src/components/ui/FadeIn.jsx`** — wrapper component:
- Menerima `children` dan optional `delay` (untuk stagger manual)
- Default state: `opacity-0 translate-y-3`
- Saat `inView`: `opacity-100 translate-y-0`
- Transition: `duration-500 ease-out`

Dipakai di `Home.jsx` untuk wrap tiap `<section>`. Section Problem Statement, Framework Components, Tools, Campaign, Feedback CTA masing-masing punya `FadeIn` sendiri.

### 4. Mobile Menu Slide Animation (`Header.jsx`)

Sebelumnya: `{menuOpen && <div>...</div>}` — muncul tiba-tiba.

Setelah: selalu di-render, height di-toggle via CSS:
- Tutup: `max-h-0 overflow-hidden opacity-0`
- Buka: `max-h-96 opacity-100`
- Transition: `transition-all duration-200 ease-out`

---

## Files Affected

| File | Perubahan |
|---|---|
| `src/index.css` | Tambah `@keyframes fadeSlideUp`, `.animate-hero-*`, upgrade `.card-hover` |
| `src/utils/useInView.js` | File baru — IntersectionObserver hook |
| `src/components/ui/FadeIn.jsx` | File baru — scroll reveal wrapper |
| `src/pages/Home.jsx` | Tambah hero animation classes + wrap sections dengan `<FadeIn>` |
| `src/components/layout/Header.jsx` | Ganti conditional render mobile menu ke CSS height transition |

## Files NOT Affected

- Semua halaman tools (`/tools/*`)
- Campaign Schedule
- Framework pages
- Sidebar, Footer, PageLayout

---

## Constraints

- Tidak ada library baru
- Tidak ada perubahan markup yang breaking
- `FadeIn` harus gracefully degrade jika JS disabled (elemen tetap visible via CSS fallback)
- Animasi harus respek `prefers-reduced-motion`
