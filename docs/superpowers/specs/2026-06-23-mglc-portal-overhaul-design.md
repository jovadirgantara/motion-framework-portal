# MGLC Portal Overhaul — Design Spec
**Date:** 2026-06-23
**Project:** Framework Produksi Motion Graphic Live Commerce Berbasis Visual Hierarchy
**Researcher:** Jova Dirgantara Putra (NIM 2201632) — S1 Pendidikan Multimedia, UPI Cibiru
**Approach:** Full Structural Overhaul (Pendekatan B)

---

## 1. Problem Statement

The current portal frames tools as the primary product and framework as secondary. Specific issues:

- Home hero has two equal CTAs — "Mulai dari Sini" and "Langsung ke Tools"
- Nav order puts "Mulai" after "Unduhan", weakening onboarding flow
- No Campaign Schedule page exists (Komponen 8 missing entirely)
- framework-components.json has only 7 components
- Tool pages have no framework context above them
- Home section "4 Interactive Tools" appears equal weight to "7 Komponen Framework"
- Feedback CTA reads "Sudah mencoba tools-nya?" — tools as primary product
- `/about` doubles as glossary (two unrelated purposes)
- `RenderCalculator` label is misleading — it's a recommendation assistant, not a calculator

**Core principle to enforce:** Framework is the product. Portal and tools are the medium.

---

## 2. Architecture

### Route Map

| Route | Status | Component |
|-------|--------|-----------|
| `/` | Rewrite | `Home.jsx` |
| `/framework` | Update | `FrameworkOverview.jsx` |
| `/framework/:slug` | Update | `FrameworkComponentPage.jsx` (new 5-section template) |
| `/tools` | Update | `ToolsHub.jsx` (framework-first framing) |
| `/tools/naming-generator` | Update | Add FrameworkContextBanner |
| `/tools/complexity-classifier` | Update | Add FrameworkContextBanner |
| `/tools/visual-hierarchy-checklist` | Update | Add FrameworkContextBanner |
| `/tools/render-settings-assistant` | Rename + Update | From `render-calculator` |
| `/campaign` | **New** | `CampaignSchedule.jsx` |
| `/downloads` | Minor | Content update only |
| `/feedback` | Update | 3-tab form structure |
| `/about` | Minor | Research context only |

### Redirects

```
/tools/render-calculator  →  /tools/render-settings-assistant
/get-started              →  /framework
```

### New Files

```
src/pages/CampaignSchedule.jsx
src/components/ui/FrameworkContextBanner.jsx
src/config/campaign-config.js
docs/superpowers/specs/2026-06-23-mglc-portal-overhaul-design.md
```

### Significantly Modified Files

```
src/App.jsx
src/components/layout/Header.jsx
src/components/layout/Sidebar.jsx
src/pages/Home.jsx
src/pages/framework/FrameworkOverview.jsx
src/pages/framework/FrameworkComponentPage.jsx
src/pages/tools/ToolsHub.jsx
src/pages/tools/NamingGenerator.jsx
src/pages/tools/ComplexityClassifier.jsx
src/pages/tools/VHChecklist.jsx
src/pages/tools/RenderCalculator.jsx → RenderSettingsAssistant.jsx
src/content/framework-components.json
src/content/downloads.json
```

### Unchanged Files

```
src/pages/Downloads.jsx
src/pages/Feedback.jsx
src/pages/About.jsx
src/config/naming-config.json
src/config/complexity-config.json
src/config/checklist-config.json
src/config/render-config.json
src/utils/*
src/components/ui/Badge.jsx, Button.jsx, SeedNote.jsx
src/components/layout/PageLayout.jsx
src/components/layout/FrameworkPageLayout.jsx
src/components/layout/Footer.jsx
```

---

## 3. Navigation

### Header Nav (New)

```
▶ MGLC Framework  |  Framework Documentation  Interactive Tools  Campaign Schedule  Unduhan  [Feedback]
```

| Old Label | New Label | Reason |
|-----------|-----------|--------|
| Framework | Framework Documentation | Clarifies this is documentation, not a landing |
| Tools | Interactive Tools | Positions as tools, not products |
| — | Campaign Schedule | Komponen 8 operational layer — new |
| Unduhan | Unduhan | No change |
| Mulai | Removed from nav | Merged into Framework Overview |

---

## 4. Home Page

### Structure (top to bottom)

1. **Hero** — Framework as research product, two CTAs (primary: framework, secondary: tools)
2. **Research Summary** — DDR context, explicit "portal is Produk 2, framework is Produk 1"
3. **8 Komponen Framework** — grid cards, framework first
4. **Alur Penggunaan Portal** — 5-step flow (Framework → Tools → Campaign → Downloads → Feedback)
5. **4 Tools Implementasi Framework** — reduced weight, tools as step 2 of 5
6. **Feedback CTA** — reframed: "Sudah membaca framework dan mencoba tools-nya?"

### Hero Changes

- Primary CTA: `Baca Framework Documentation →` (brand-filled)
- Secondary CTA: `Lihat Interactive Tools` (ghost/outline)
- Remove "Langsung ke Tools" as equal-weight CTA

### Research Summary (New Section)

Explicitly states:
- Metode: Design and Development Research (DDR)
- Produk 1: Framework (8 komponen konstitutif)
- Produk 2: Portal ini — media implementasi & validasi
- "Portal ini bukan produk utama. Framework-lah produknya."

### Alur Penggunaan Portal (Replaces "4 Interactive Tools" as equal section)

5-step numbered flow:
1. Baca Framework → `/framework`
2. Gunakan Tools → `/tools`
3. Pantau Campaign → `/campaign`
4. Unduh Template → `/downloads`
5. Beri Feedback → `/feedback`

---

## 5. Framework Documentation

### Framework Overview (`/framework`)

- Intro paragraph about framework as DDR Produk 1
- "Cara Membaca Framework" section (Komponen 1 = filosofis inti, 2–7 = teknis, 8 = operasional)
- Grid 8 komponen
- CTA: "Mulai dari Komponen 1: Visual Hierarchy Standards →"
- No more link to `/get-started` (page removed)

### Component Page Template (5-section standard)

Every `/framework/:slug` page renders:

```
[Breadcrumb: Framework Documentation > {Title}]
[Number + Icon] Title
Summary

{sections[].map → each heading + body rendered generically}

[Related Tool Card — if relatedToolId exists]
[Bottom nav: ← Previous Component | Next Component →]
```

**Implementation note on 5-section structure:**
The Definisi / Tujuan / Aturan / Implementasi / Contoh structure is the **editorial standard** for section headings in `framework-components.json` — not a hardcoded template. The `FrameworkComponentPage` component renders `sections[]` generically (each item has `heading` + `body`). Komponen 8 is written with these 5 headings already. Components 1–7 have existing headings that pre-date this standard; they are left as-is for this overhaul (content refinement is out of scope). The template renders whatever `sections[]` contains — no structural change to the component required.

### Komponen 8 — Campaign Usage Management

New entry in `framework-components.json`:

```json
{
  "id": "campaign-usage-management",
  "order": 8,
  "title": "Campaign Usage Management",
  "summary": "Lapisan visibilitas operasional yang mendokumentasikan jadwal penggunaan aset, periode campaign, dan status aktif per platform.",
  "route": "/framework/campaign-usage-management",
  "relatedToolId": null,
  "relatedCampaignSchedule": true,
  "icon": "📅",
  "sections": [
    {
      "heading": "Definisi",
      "body": "Campaign Usage Management adalah sistem pencatatan dan pemantauan penggunaan aset motion graphic dalam konteks operasional live commerce. Komponen ini menjembatani standar produksi (Komponen 1–7) dengan realitas jadwal siaran dan siklus campaign."
    },
    {
      "heading": "Tujuan",
      "body": "Memastikan aset yang telah diproduksi sesuai standar dapat dilacak penggunaannya — kapan dipakai, di platform mana, dalam campaign apa, dan apakah masih aktif atau sudah kadaluarsa."
    },
    {
      "heading": "Aturan",
      "body": "- Setiap aset di Campaign Schedule harus sudah melewati QC Checklist (Komponen 7)\n- Nama aset harus mengikuti Naming Convention (Komponen 5)\n- Status harus diperbarui setiap pergantian periode campaign\n- Aset Expired tidak boleh digunakan ulang tanpa review ulang VH Checklist"
    },
    {
      "heading": "Implementasi",
      "body": "Data dikelola di Google Sheets dan ditampilkan read-only di portal. Creative manager atau operator bertanggung jawab memperbarui data."
    },
    {
      "heading": "Contoh",
      "body": "Aset `SHP_FlashSale_CountdownTimer_L3_v02_JDP_20260115.mov`:\n- Platform: Shopee Live\n- Period: 15–20 Januari 2026\n- Status: Expired\n- Tidak boleh dipakai ulang tanpa QC review baru."
    }
  ]
}
```

---

## 6. Interactive Tools

### FrameworkContextBanner Component

Props: `componentId` (string matching framework-components.json id)

Renders above every tool's input form:
```
┌──────────────────────────────────────────────────────────┐
│ 📖 Tool ini mengimplementasikan:                         │
│ Komponen {N} — {Title}                                   │
│ {Summary}                                                │
│ [Baca dokumentasi lengkap →]                             │
└──────────────────────────────────────────────────────────┘
```

Component mapping:
- Naming Generator → `naming-convention`
- Complexity Classifier → `complexity`
- VH Checklist → `quality-control`
- Render Settings Assistant → `render-standard`

### Tools Hub

Header changed to explain tools as framework implementation aids.
Each tool card shows: tool title + "Implementasi: Komponen N — {title}" + two CTAs: [Baca Komponen] and [Buka Tool →].

### Render Calculator Rename

- Old file: `RenderCalculator.jsx`
- New file: `RenderSettingsAssistant.jsx`
- Old route: `/tools/render-calculator`
- New route: `/tools/render-settings-assistant`
- Add redirect: old route → new route
- Rename in Sidebar, ToolsHub, Header

---

## 7. Campaign Schedule

### Data Source

- Google Sheets ID: `17wR3rfsiRJjQPev1SHk55CPkvw6xzmLGdmAb2_OWUiQ`
- Endpoint: `https://docs.google.com/spreadsheets/d/17wR3rfsiRJjQPev1SHk55CPkvw6xzmLGdmAb2_OWUiQ/edit?usp=sharing`
- Fetch strategy: on component mount, no caching
- Sheet must be published to web (File → Share → Publish to web)

### Expected Columns (Google Sheets)

| Column | Field | Type |
|--------|-------|------|
| A | `assetName` | String |
| B | `platform` | SHP / TTS / TKP / GEN |
| C | `campaignName` | String |
| D | `periodStart` | DD/MM/YYYY |
| E | `periodEnd` | DD/MM/YYYY |
| F | `status` | Active / Upcoming / Expired |
| G | `assetLink` | URL (optional) |

### Config File

`src/config/campaign-config.js`:
```js
export const SHEET_ID = '17wR3rfsiRJjQPev1SHk55CPkvw6xzmLGdmAb2_OWUiQ'
export const SHEET_GID = '0'
```

### UI States

- **Loading:** skeleton rows
- **Error:** "Data tidak dapat dimuat. Coba muat ulang halaman." + Retry button
- **Empty:** "Belum ada data campaign yang tersedia."
- **Data:** filterable table with status badges

### Status Badges

| Status | Color | Badge |
|--------|-------|-------|
| Active | Green | 🟢 Aktif |
| Upcoming | Yellow | 🟡 Upcoming |
| Expired | Gray | ⚫ Expired |

### Page Layout

```
Campaign Schedule
Operational Visibility Layer — Komponen 8 Framework

[Link: Baca Campaign Usage Management →]   [Last updated timestamp]

Filter: [Semua] [Active] [Upcoming] [Expired]

Table: Nama Aset | Platform | Campaign | Periode | Status | Link
```

---

## 8. Sidebar Separation

| Context | Sidebar Content |
|---------|----------------|
| `/framework/*` | Framework Documentation (8 items) |
| `/tools/*` | Interactive Tools (4 items) |
| All other pages | No sidebar |

Sidebar for framework adds Komponen 8 — Campaign Usage Management.
Sidebar for tools renames item 4 to "Render Settings Assistant".

---

## 9. Entity Relationship Model (Conceptual — Static Portal)

```
FrameworkComponent
  id (slug), order (1–8), title, icon, summary, route
  relatedToolId? (FK → Tool.id)
  relatedCampaignSchedule? (boolean)
  sections[]: { heading, body }

Tool
  id, title, route
  relatedFrameworkComponentId (FK → FrameworkComponent.id)
  inputFields[], outputLogic (client-side)

ToolUsageEvent (optional, session-only analytics)
  toolId, timestamp, outputGenerated

FeedbackResponse
  formType: pilot-testing | user-feedback | research-evaluation
  → Handled by Google Forms (external)

CampaignSchedule (external dataset — Google Sheets)
  assetName, platform, campaignName
  periodStart, periodEnd, status, assetLink?
```

---

## 10. User Journeys

### Researcher / Validator
```
Home → Framework Documentation (all 8 components)
     → Feedback (Research Evaluation Form)
     → Downloads (Documentation Package)
```

### Motion Designer (New User)
```
Home → Framework Documentation (start Komponen 1)
     → Interactive Tools (practice each component)
     → Campaign Schedule (check active assets)
     → Feedback (Pilot Testing Form)
```

### Creative Manager / Operator
```
Home → Campaign Schedule (check asset status)
     → Framework Documentation (reference standards)
     → Downloads (templates)
```

---

## 11. Data Flow

```
[User Browser]
  ├── Framework Content     ← src/content/framework-components.json (static)
  ├── Tool Logic            ← src/config/*.json + React state (no server calls)
  ├── Campaign Schedule     ← Google Sheets gviz/tq JSON endpoint (fetch on load)
  ├── Downloads             ← Static file links (Vercel-hosted)
  └── Feedback              ← Google Forms embed / external link
```

---

## 12. Implementation Checklist

### Phase 1 — Data & Config
- [ ] Add Komponen 8 to `framework-components.json`
- [ ] Create `src/config/campaign-config.js`
- [ ] Update `src/content/downloads.json`

### Phase 2 — New Components
- [ ] Create `FrameworkContextBanner.jsx`
- [ ] Create `CampaignSchedule.jsx` with Google Sheets fetch

### Phase 3 — Navigation & Layout
- [ ] Update `Header.jsx` — new nav items, new order
- [ ] Update `Sidebar.jsx` — separate framework/tools, add Komponen 8, rename item 4
- [ ] Update `App.jsx` — new routes, redirects

### Phase 4 — Framework Pages
- [ ] Update `FrameworkOverview.jsx` — 8 components, research summary, cara baca
- [ ] Update `FrameworkComponentPage.jsx` — 5-section template, bottom nav

### Phase 5 — Home
- [ ] Rewrite `Home.jsx` — framework-first hero, research summary section, alur penggunaan portal, tools as secondary

### Phase 6 — Tools
- [ ] Update `ToolsHub.jsx` — framework-first framing
- [ ] Add `FrameworkContextBanner` to `NamingGenerator.jsx`
- [ ] Add `FrameworkContextBanner` to `ComplexityClassifier.jsx`
- [ ] Add `FrameworkContextBanner` to `VHChecklist.jsx`
- [ ] Rename `RenderCalculator.jsx` → `RenderSettingsAssistant.jsx`, add Banner

### Phase 7 — Minor Pages
- [ ] Update `Downloads.jsx` / `downloads.json` labels
- [ ] Update `Feedback.jsx` — 3-tab structure
- [ ] Update `About.jsx` — research context only

---

## 13. Design Principles (Non-Negotiable)

1. **Framework first** — every page reinforces that framework is the research product
2. **Tools are subordinate** — always framed as "implementasi framework", never as standalone products
3. **Campaign Schedule is operational layer** — not a tool, not a calculator, read-only visibility
4. **Static portal** — no backend, no database, Google Sheets is the only external data source
5. **Academic tone where appropriate** — DDR, Produk 1/2, komponen konstitutif; operational tone in tool UX
