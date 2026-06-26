# MGLC Portal — Visual Overhaul Design Spec
**Date:** 2026-06-26
**Approach:** Section Visual Redesign (Approach B)
**Scope:** All pages — homepage full redesign, all other pages enriched

---

## 1. Design Principles

1. **Clean editorial stays** — Inter + JetBrains Mono, slate palette, brand purple `#542556` unchanged
2. **Section layouts stay** — same order, same content, same max-width container
3. **More visual, not more complex** — richer cards, photo placeholders, stronger hover/animation
4. **Placeholders are explicit** — all placeholder images use `PlaceholderImage` component with clear label
5. **Section rhythm** — alternating bg-white / bg-slate-50 creates visual breathing room on homepage

---

## 2. New Component: `PlaceholderImage`

**File:** `src/components/ui/PlaceholderImage.jsx`

**Props:**
- `label` (string) — describes the photo expected e.g. `"Foto: Suasana live streaming e-commerce"`
- `aspect` (string, default `"4/3"`) — CSS aspect-ratio value
- `className` (string, optional)

**Visual:**
```
┌ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┐
  border-2 border-dashed border-slate-300
│         bg-slate-50/50 rounded-lg      │

         📷
│    [Foto: deskripsi placeholder]       │
     font-mono text-2xs text-slate-400
└ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┘
```

When a real image is dropped in, the `PlaceholderImage` component is replaced by an `<img>` with `rounded-lg object-cover w-full`.

---

## 3. Global CSS Changes (`src/index.css`)

### Card hover — upgrade
```css
/* Before */
.card-hover { hover:border-brand-400 hover:-translate-y-0.5 hover:shadow-sm }

/* After */
.card-hover { hover:border-brand-300 hover:-translate-y-1 hover:shadow-md hover:shadow-brand-100/50 }
```

### New utility classes
```css
.section-alt { @apply bg-slate-50 }

.placeholder-img {
  @apply border-2 border-dashed border-slate-300 bg-slate-50/50 rounded-lg
         flex flex-col items-center justify-center gap-2
         text-slate-400 font-mono text-2xs text-center;
}
```

### Hero animation — add hero-4 for photo
```css
@keyframes fadeSlideRight {
  from { opacity: 0; transform: translateX(12px); }
  to   { opacity: 1; transform: translateX(0); }
}

.animate-hero-4 {
  animation: fadeSlideRight 500ms ease-out both;
  animation-delay: 320ms;
}
```

`hero-4` uses `fadeSlideRight` (slides in from right) specifically for the photo column.
`hero-1` through `hero-3` continue to use the existing `fadeSlideUp`.

### FadeIn — strengthen
Change `translate-y-3` → `translate-y-5`, `duration-500` → `duration-600` in `FadeIn.jsx`.

---

## 4. Header (`src/components/layout/Header.jsx`)

**Changes:**
- Logo mark: add `group-hover:scale-105 transition-transform` on the purple square
- Active nav item: replace `bg-brand-50 text-brand-700` with `text-brand-700 bg-brand-50 font-semibold` (keep bg, add font-semibold for more weight)
- Add subtle bottom border on header: `border-b-2 border-slate-100` (was `border-b border-slate-200`)
- No structural changes

---

## 5. Footer (`src/components/layout/Footer.jsx`)

**Changes:**
- Add `border-t-4 border-brand-600` as top accent (replaces plain `border-t border-slate-200`)
- Brand section: add eyebrow label above logo line: `/ MGLC Framework Portal`
- No structural changes

---

## 6. Homepage (`src/pages/Home.jsx`)

### 6.1 Section Background Scheme
```
Hero             → bg-white
Problem Statement → bg-slate-50
Framework         → bg-white
Tools             → bg-slate-50
Campaign          → bg-white
Feedback CTA      → bg-brand-600 (full brand — strongest CTA on page)
```

Each section in homepage gets `py-16` (up from `py-12`) for more breathing room.

### 6.2 Hero — Split Layout
**Before:** Full-width text block only  
**After:** Two-column split (text left 60%, photo right 40%)

```
┌────────────────────────────────────┬─────────────────────┐
│ [animate-hero-1]                   │                     │
│ DDR Research · UPI Cibiru          │  [animate-hero-4]   │
│                                    │                     │
│ [animate-hero-2]                   │  PlaceholderImage   │
│ Framework Produksi Motion Graphic  │  label: "Foto:      │
│ Live Commerce Berbasis             │  Suasana produksi   │
│ Visual Hierarchy                   │  live commerce"     │
│                                    │  aspect: "4/3"      │
│ [animate-hero-3]                   │  rounded-xl         │
│ [paragraph]                        │  shadow-lg          │
│ [CTA buttons]                      │                     │
└────────────────────────────────────┴─────────────────────┘
```

- On mobile: stacks, photo goes below text
- Photo column: `relative hidden md:block` — hidden on mobile, shown md+
- Placeholder gets `animate-hero-4` entrance (320ms delay, slight slide from right via `translateX(8px)`)

### 6.3 Problem Statement — Visual Row Upgrade
**Before:** Flat bordered list  
**After:** Same list structure on `bg-slate-50`, but each row gets:
- `hover:bg-white hover:shadow-sm` (lifts off the slate-50 bg)
- `border-l-2 border-transparent hover:border-brand-400 transition-all`
- Code badge: `bg-brand-100 text-brand-700 font-semibold px-1.5 py-0.5 rounded text-xs` (was just `text-slate-400`)
- Wrapper: `divide-y divide-slate-200 border border-slate-200 rounded-lg overflow-hidden`

### 6.4 Framework Components — Tall Cards with Icon Area
**Before:** Small flat cards, emoji + number + title + summary in one area  
**After:** Taller cards with distinct icon zone on top

```
┌──────────────────────────┐
│  bg-brand-50             │  ← top area: h-20
│     {emoji icon}         │     flex items-center justify-center
│     text-3xl             │     rounded-t-lg
├──────────────────────────┤
│  01  ←  font-mono 2xs    │  ← body: p-4
│  Title                   │     font-semibold text-slate-900
│  Summary text...         │     text-xs text-slate-500
└──────────────────────────┘
```

- Grid stays 4 columns on lg, 2 on sm, 1 on xs
- Hover: `hover:border-brand-300 hover:-translate-y-1 hover:shadow-md`
- Icon zone color: `bg-brand-50 group-hover:bg-brand-100 transition-colors`

### 6.5 Tools — Horizontal Cards with Icon Accent
**Before:** Vertical cards, code + title + desc + CTA  
**After:** Horizontal cards with icon on the left

```
┌──────┬──────────────────────────────────────────┐
│  bg  │  T01                                      │
│brand │  Naming Generator                         │
│  50  │  Generate nama file standar dari input... │
│ 2xl  │                              [buka →]     │
└──────┴──────────────────────────────────────────┘
```

- Icon area: `w-16 shrink-0 bg-brand-50 flex items-center justify-center text-2xl rounded-l-lg`
- Content area: `flex-1 p-4`
- CTA button: pushed to right via `flex items-center justify-between` in footer row
- Grid: stays 2 columns sm+, 1 column xs

### 6.6 Campaign Section — Accent Left Border
**Before:** Horizontal flex with plain border box  
**After:** Same layout but add `border-l-4 border-brand-600 pl-6` on the left, `bg-white` section, icon 📅 large on the right side (inline, not placeholder)

### 6.7 Feedback CTA — Full Brand Background
**Before:** `border border-slate-200 rounded p-8` box  
**After:** Full-width `bg-brand-600 rounded-xl p-10` section

```
bg-brand-600 text-white
eyebrow: text-brand-300
h2: text-white
p: text-brand-100
button: bg-white text-brand-700 hover:bg-brand-50
```

---

## 7. Framework Overview (`src/pages/framework/FrameworkOverview.jsx`)

**Changes:**
- Cards: same tall card with icon zone treatment as homepage Framework section
- Add page header band above the component list:
  ```
  bg-brand-50 border border-brand-100 rounded-lg p-5 mb-8
  → shows: eyebrow + h1 + summary + "Panduan Membaca" note
  ```
- "Panduan Membaca" moves into the header band (was separate bordered box below)

---

## 8. Framework Component Pages (`src/pages/framework/FrameworkComponentPage.jsx`)

**Changes:**
- Replace current `flex items-center gap-3` header with a page header band:

```
┌────────────────────────────────────────────────────┐
│  bg-brand-50 border-b border-brand-100             │
│  py-8 mb-8                                         │
│                                                    │
│  [decorative number: text-7xl font-bold text-      │
│   brand-100 absolute right-6 top-4 select-none]    │
│                                                    │
│  Komponen 01  ←  eyebrow                          │
│  {icon} {title}  ←  text-2xl icon + h1            │
│  {summary}  ←  text-slate-600                      │
└────────────────────────────────────────────────────┘
```

- Decorative number: positioned absolute in the band, `text-8xl font-bold text-brand-100 select-none pointer-events-none`
- Band wrapper: `relative overflow-hidden`
- Accordion sections: no change — already good

---

## 9. Tools Hub (`src/pages/tools/ToolsHub.jsx`)

**Changes:**
- Cards: same horizontal icon-left layout as homepage tools section
- Page header: add `bg-slate-50 rounded-lg p-5 mb-6` header band with eyebrow + h1 + desc
- Icon area uses emoji from `tools` array (already exists as `icon` field)

---

## 10. Campaign Schedule (`src/pages/CampaignSchedule.jsx`)

**Changes:**
- Add 3 summary stat cards above the table (aktif / akan-datang / kedaluwarsa counts):
  ```
  ┌──────────┐ ┌──────────────┐ ┌─────────────┐
  │ 🟢 Aktif │ │ 🟡 Akan Datang│ │ ⚫ Kedaluarsa│
  │    {n}   │ │    {n}       │ │    {n}      │
  └──────────┘ └──────────────┘ └─────────────┘
  ```
  Each card: `card p-4 text-center` with count `text-2xl font-bold` and label `text-xs text-slate-500`

- Loading skeleton: replace emoji spinner with a proper skeleton row animation (3 skeleton rows, `animate-pulse bg-slate-100 rounded h-4`)
- No structural changes to table

---

## 11. Downloads, About, Feedback — Light Treatment

All three get the same light treatment:
- Replace the plain `pt-8 pb-6 border-b` page header with a `bg-slate-50 border border-slate-200 rounded-lg p-6 mb-8` header band
- Add consistent eyebrow label format: `/ Page Name`
- No other changes

---

## 12. File List

### New Files
```
src/components/ui/PlaceholderImage.jsx
```

### Modified Files
```
src/index.css                                    ← card-hover, hero-4, section-alt, placeholder-img
src/components/ui/FadeIn.jsx                     ← strengthen translate + duration
src/components/layout/Header.jsx                 ← logo hover, active state weight, border
src/components/layout/Footer.jsx                 ← top accent border
src/pages/Home.jsx                               ← full visual redesign (split hero, section bgs, card treatments, brand CTA)
src/pages/framework/FrameworkOverview.jsx        ← header band, tall cards
src/pages/framework/FrameworkComponentPage.jsx   ← page header band with decorative number
src/pages/tools/ToolsHub.jsx                     ← header band, horizontal cards
src/pages/CampaignSchedule.jsx                   ← status stat cards, loading skeleton
src/pages/Downloads.jsx                          ← header band
src/pages/About.jsx                              ← header band
src/pages/Feedback.jsx                           ← header band
```

### Unchanged Files
```
tailwind.config.js           ← no new tokens needed
src/App.jsx                  ← no routing changes
src/components/layout/Sidebar.jsx
src/components/layout/PageLayout.jsx
src/components/layout/FrameworkPageLayout.jsx
src/components/ui/Badge.jsx
src/components/ui/Button.jsx
src/components/ui/SeedNote.jsx
src/content/*.json
src/config/*.json
src/utils/*
```

---

## 13. Placeholder Inventory

All placeholder images in the codebase after this overhaul:

| Location | Component | Label |
|----------|-----------|-------|
| `Home.jsx` — Hero | `PlaceholderImage` | `Foto: Suasana produksi live streaming e-commerce` |

Additional placeholder locations TBD by user (as discussed: "nanti dikasih tau").
When ready, each placeholder is replaced by dropping the real image file into `/public/images/` and replacing `<PlaceholderImage>` with `<img src="/images/filename.jpg" ... />`.

---

## 14. Implementation Order

| Phase | Files | Description |
|-------|-------|-------------|
| 1 | `PlaceholderImage.jsx`, `index.css`, `FadeIn.jsx` | Foundation: new component + CSS upgrades |
| 2 | `Header.jsx`, `Footer.jsx` | Global layout polish |
| 3 | `Home.jsx` | Homepage full redesign |
| 4 | `FrameworkOverview.jsx`, `FrameworkComponentPage.jsx` | Framework pages |
| 5 | `ToolsHub.jsx` | Tools hub |
| 6 | `CampaignSchedule.jsx` | Campaign stat cards + skeleton |
| 7 | `Downloads.jsx`, `About.jsx`, `Feedback.jsx` | Light treatment pass |
