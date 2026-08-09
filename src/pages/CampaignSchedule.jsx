import { useState, useEffect, useMemo, useRef } from 'react'
import { Link } from 'react-router-dom'
import PageLayout from '../components/layout/PageLayout'
import Reveal from '../components/ui/Reveal'

// ─── CONFIG ──────────────────────────────────────────────────────────────────
const SHEET_ID = '1aXZ2STMDwPa-zFeZj37aa_Ko4-IE5WYzIKKe3EMm8rs'
const GID      = '1476491661'
const CSV_URL  = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=${GID}`

// By Motion to OP moved to its own "Motion Status" tab in the same
// spreadsheet — different structure (flat header, no grouping row) and no
// relation to the Design/Strategic rows, so it gets its own fetch/parse.
const MOTION_GID     = '820345676'
const MOTION_CSV_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=${MOTION_GID}`

// Row 1 of the sheet is a grouping label row ("by Design" / "by Strategic" /
// etc). Row 2 holds the actual column names — that's what COL_MAP matches.
const COL_MAP = {
  monthRequest:          ['Month Request'],
  reqDate:               ['Req. Date'],
  brand:                 ['Brand'],
  withStrategic:         ['With Strategic Concept'],
  stratPIC:              ['Strat PIC'],
  designPIC:             ['Design PIC'],
  typeOfContent:         ['Type of Content'],
  taksSource:            ['Taks Source'],
  reqQty:                ['Req. Qty'],
  outputQty:             ['Output Qty'],
  dueDate:               ['Due Date'],
  submissionDate:        ['Submission Date'],
  workingDay:            ['Working Day (SLA 3 Days)'],
  operationalExcellence: ['Operational Exellence'],
  designDifficulty:      ['Design Difficulty'],
  stratRevision:         ['Strat Revision'],
  statusStrat:           ['Status Strat'],
  designRevision:        ['Design Revision'],
  statusDesign:          ['Status Design'],
  finalAssetName:        ['Final Asset Name'],
  motionPIC:             ['Motion PIC'],
  typeOfCampaign:        ['Type of Campaign'],
  applyDate:             ['Apply Date'],
  motionDifficulty:      ['Motion Difficulty'],
  motionRevision:        ['Motion Revision'],
  statusMotion:          ['Status Motion'],
  linkMotion:            ['Link Motion'],
  remark:                ['Remark (Wardrobe, Gimmick, Concern on Live)'],
}

// "Motion Status" tab has a single flat header row (no grouping row above
// it). Field keys reuse names from COL_MAP wherever the concept matches
// (brand, typeOfCampaign, motionDifficulty, motionRevision, statusMotion,
// linkMotion) so the shared filters/renderCell types keep working unchanged.
const MOTION_COL_MAP = {
  namaAset:         ['Nama Aset'],
  brand:            ['Brand'],
  platform:         ['Platform'],
  tipe:             ['Tipe'],
  typeOfCampaign:   ['Kampanye'],
  periodeMulai:     ['Periode Mulai'],
  periodeSelesai:   ['Periode Selesai'],
  jamTayang:        ['Jam Tayang'],
  motionPIC:        ['Motion PIC'],
  motionDifficulty: ['Motion Difficulty'],
  motionRevision:   ['Motion Revision'],
  statusMotion:      ['Status Mockup'],
  linkMotion:        ['Link File'],
  catatan:          ['Catatan'],
  studio:           ['Studio'],
}

const SEED_DATA = [
  {
    id: 'seed-1',
    monthRequest: 'November',
    reqDate: '03/11/2025',
    brand: 'Greenfields',
    withStrategic: '',
    stratPIC: '',
    designPIC: 'Alfie',
    typeOfContent: 'Mockup',
    taksSource: 'Orca',
    reqQty: '1',
    outputQty: '1',
    dueDate: '06/11/2025',
    submissionDate: '04/11/2025',
    workingDay: '2',
    operationalExcellence: 'Excellence',
    designDifficulty: 'High',
    stratRevision: '',
    statusStrat: '',
    designRevision: '',
    statusDesign: '',
    finalAssetName: '',
    motionPIC: '',
    typeOfCampaign: '',
    applyDate: '',
    motionDifficulty: '',
    motionRevision: '',
    statusMotion: '',
    linkMotion: '',
    remark: '',
  },
  {
    id: 'seed-2',
    monthRequest: 'November',
    reqDate: '07/11/2025',
    brand: 'Quaker',
    withStrategic: '',
    stratPIC: '',
    designPIC: 'Nadya A',
    typeOfContent: 'Mockup',
    taksSource: 'Orca',
    reqQty: '1',
    outputQty: '1',
    dueDate: '10/11/2025',
    submissionDate: '11/11/2025',
    workingDay: '3',
    operationalExcellence: 'Good',
    designDifficulty: 'High',
    stratRevision: '',
    statusStrat: 'Done',
    designRevision: '',
    statusDesign: '',
    finalAssetName: '',
    motionPIC: '',
    typeOfCampaign: '',
    applyDate: '',
    motionDifficulty: '',
    motionRevision: '',
    statusMotion: '',
    linkMotion: '',
    remark: '',
  },
  {
    id: 'seed-3',
    monthRequest: 'November',
    reqDate: '05/11/2025',
    brand: 'DuaBelibis',
    withStrategic: 'Yes',
    stratPIC: 'Nadya A',
    designPIC: 'Alfie',
    typeOfContent: 'Banner Marketplace',
    taksSource: 'Ecommerce',
    reqQty: '1',
    outputQty: '1',
    dueDate: '08/11/2025',
    submissionDate: '05/11/2025',
    workingDay: '1',
    operationalExcellence: 'Bad',
    designDifficulty: 'Medium',
    stratRevision: '',
    statusStrat: 'Done',
    designRevision: '',
    statusDesign: '',
    finalAssetName: '',
    motionPIC: '',
    typeOfCampaign: '',
    applyDate: '',
    motionDifficulty: '',
    motionRevision: '',
    statusMotion: '',
    linkMotion: '',
    remark: '',
  },
]

const MOTION_SEED_DATA = [
  {
    id: 'motion-seed-1',
    namaAset: 'ANLENE BAU',
    brand: 'FONTERRA',
    platform: 'TikTok',
    tipe: 'Sepeda Chaos',
    typeOfCampaign: 'BaU',
    periodeMulai: '2026-07-26',
    periodeSelesai: '2026-07-28',
    jamTayang: 'Pas Running',
    motionPIC: '',
    motionDifficulty: '',
    motionRevision: '',
    statusMotion: 'Ready',
    linkMotion: 'https://drive.google.com/drive/folders/1Uwm_aDwjqkUQ2mjIZnXvv5plbhNinThl',
    catatan: 'Update Promo',
    studio: 'Jakarta',
  },
  {
    id: 'motion-seed-2',
    namaAset: 'BETADINE DD',
    brand: 'BETADINE',
    platform: 'TikTok',
    tipe: '',
    typeOfCampaign: 'DD',
    periodeMulai: '2026-07-07',
    periodeSelesai: '2026-07-07',
    jamTayang: '00:00',
    motionPIC: '',
    motionDifficulty: '',
    motionRevision: '',
    statusMotion: 'Ready',
    linkMotion: 'https://drive.google.com/drive/folders/1tkoB-b3mSFppCtknHIcN7YmdwjGHSOcG',
    catatan: '',
    studio: 'Jakarta',
  },
  {
    id: 'motion-seed-3',
    namaAset: 'BETADINE PAYDAY',
    brand: 'BETADINE',
    platform: 'TikTok',
    tipe: '',
    typeOfCampaign: 'PayDay',
    periodeMulai: '2026-07-25',
    periodeSelesai: '2026-07-31',
    jamTayang: 'Pas Running',
    motionPIC: '',
    motionDifficulty: '',
    motionRevision: '',
    statusMotion: 'Ready',
    linkMotion: 'https://drive.google.com/drive/folders/1nLyzUK_U5ZiNv0dtX9apIaqZYjHEwwS9',
    catatan: '',
    studio: 'Jakarta',
  },
]

// ─── HELPERS ─────────────────────────────────────────────────────────────────
function parseCSVLine(line) {
  const cells = []
  let cur = '', inQ = false
  for (let i = 0; i < line.length; i++) {
    const c = line[i]
    if (c === '"') {
      if (inQ && line[i + 1] === '"') { cur += '"'; i++ }
      else inQ = !inQ
    } else if (c === ',' && !inQ) {
      cells.push(cur.trim()); cur = ''
    } else { cur += c }
  }
  cells.push(cur.trim())
  return cells
}

function makeFieldResolver(colMap) {
  return function resolveField(header) {
    for (const [field, aliases] of Object.entries(colMap)) {
      if (aliases.some(a => a.toLowerCase() === header.toLowerCase())) return field
    }
    return null
  }
}

function parseCSV(text) {
  const lines = text.trim().split(/\r?\n/)
  if (lines.length < 3) return []
  // lines[0] is the grouping-label row ("by Design" / "by Strategic" / ...),
  // lines[1] is the real header row, data starts at lines[2].
  const headers = parseCSVLine(lines[1])
  const resolveField = makeFieldResolver(COL_MAP)
  const fieldMap = headers.map(h => resolveField(h))
  // Rows that only have Motion-stage data (e.g. BAU requests) sometimes carry
  // their identifying name in Final Asset Name instead of Brand, with Brand
  // left blank — filtering on `r.brand` alone silently dropped those rows
  // entirely. Keep any row that has data in at least one field instead, and
  // only discard genuinely blank sheet rows.
  return lines.slice(2).map((line, idx) => {
    const cells = parseCSVLine(line)
    const row = { id: `sheet-${idx + 1}` }
    fieldMap.forEach((field, i) => { if (field) row[field] = cells[i] ?? '' })
    return row
  }).filter(r => Object.keys(r).some(k => k !== 'id' && r[k]))
}

const INDO_MONTHS = {
  januari: 1, februari: 2, maret: 3, april: 4, mei: 5, juni: 6,
  juli: 7, agustus: 8, september: 9, oktober: 10, november: 11, desember: 12,
}

// "Motion Status" sheet writes dates as "26 Juli 2026" — converted to
// YYYY-MM-DD here so normalizeDate/formatDate/getMonthKey (which all expect
// either DD/MM/YYYY or ISO) work on it unchanged.
function parseIndoDate(str) {
  const m = (str ?? '').trim().match(/^(\d{1,2})\s+([A-Za-zë]+)\s+(\d{4})$/)
  if (!m) return ''
  const month = INDO_MONTHS[m[2].toLowerCase()]
  if (!month) return ''
  return `${m[3]}-${String(month).padStart(2, '0')}-${m[1].padStart(2, '0')}`
}

// Motion Status has one flat header row (no grouping row above it) — data
// starts right after the header.
function parseMotionCSV(text) {
  const lines = text.trim().split(/\r?\n/)
  if (lines.length < 2) return []
  const headers = parseCSVLine(lines[0])
  const resolveField = makeFieldResolver(MOTION_COL_MAP)
  const fieldMap = headers.map(h => resolveField(h))
  return lines.slice(1).map((line, idx) => {
    const cells = parseCSVLine(line)
    const row = { id: `motion-sheet-${idx + 1}` }
    fieldMap.forEach((field, i) => {
      if (!field) return
      const raw = cells[i] ?? ''
      row[field] = (field === 'periodeMulai' || field === 'periodeSelesai')
        ? parseIndoDate(raw)
        : (raw === '-' ? '' : raw)
    })
    return row
  }).filter(r => Object.keys(r).some(k => k !== 'id' && r[k]))
}

function normalizeDate(str) {
  if (!str) return ''
  const m = str.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/)
  if (m) return `${m[3]}-${m[2].padStart(2,'0')}-${m[1].padStart(2,'0')}`
  return str
}

function formatDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(normalizeDate(dateStr))
  if (isNaN(d)) return dateStr
  return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
}

function getMonthKey(dateStr) {
  const d = new Date(normalizeDate(dateStr))
  if (isNaN(d)) return null
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

function formatMonthLabel(key) {
  const [year, month] = key.split('-').map(Number)
  return new Date(year, month - 1, 1).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })
}

function generateMonthRange(startY, startM, endY, endM) {
  const out = []
  let y = startY, m = startM
  while (y < endY || (y === endY && m <= endM)) {
    out.push(`${y}-${String(m).padStart(2, '0')}`)
    m++
    if (m > 12) { m = 1; y++ }
  }
  return out
}

// Month picklist always spans this fixed range regardless of what the sheet
// currently has data for, so future months (e.g. Agustus) are selectable
// ahead of time instead of only appearing once a row lands in them.
const FIXED_MONTHS = generateMonthRange(2025, 1, 2026, 12)

function toggleInArray(arr, value) {
  return arr.includes(value) ? arr.filter(v => v !== value) : [...arr, value]
}

// Two independent month filters — Req/Due Date drives Design/Strategic work,
// Apply Date drives Motion work, and a row can easily sit in different
// months on each axis. Keeping them separate (rather than one filter that
// ORs both together) lets a user pin down exactly which axis they mean
// instead of guessing why a row did or didn't match.
function reqMonthOverlaps(row, monthKey) {
  const [year, month] = monthKey.split('-').map(Number)
  const mStart = new Date(year, month - 1, 1)
  const mEnd   = new Date(year, month, 0, 23, 59, 59)
  const s = new Date(normalizeDate(row.reqDate))
  const e = new Date(normalizeDate(row.dueDate || row.reqDate))
  if (isNaN(s) && isNaN(e)) return false
  const start = isNaN(s) ? e : s
  const end   = isNaN(e) ? s : e
  return start <= mEnd && end >= mStart
}

function applyMonthOverlaps(row, monthKey) {
  const [year, month] = monthKey.split('-').map(Number)
  const mStart = new Date(year, month - 1, 1)
  const mEnd   = new Date(year, month, 0, 23, 59, 59)
  const a = new Date(normalizeDate(row.applyDate))
  return !isNaN(a) && a >= mStart && a <= mEnd
}

function addDays(date, n) {
  const d = new Date(date)
  d.setDate(d.getDate() + n)
  return d
}

// Motion Status rows are often left with Periode Selesai blank because the
// wrap date isn't known yet. Rather than treating that as "open forever" (and
// polluting every future month's filter), infer an end from the row's own
// Kampanye cycle — DD/PayDay are one-day-ish slots, BaU runs until the next
// DD/PayDay checkpoint. See design doc for the exact rule; this mirrors it.
function inferMotionEnd(row, start) {
  const kind = (row.typeOfCampaign ?? '').trim().toLowerCase()
  if (kind === 'dd' || kind === 'payday') return addDays(start, 1)

  // BaU (and anything unrecognized): bounded by that month's Double Date
  // (day-of-month === month number) and the 25th (PayDay), cycling into next
  // month's Double Date once past the 25th.
  const day = start.getDate()
  const month = start.getMonth() + 1 // 1-12
  const year = start.getFullYear()
  const ddDay = month
  const PAYDAY_DAY = 25
  if (day < ddDay)      return new Date(year, month - 1, ddDay - 1)
  if (day < PAYDAY_DAY) return new Date(year, month - 1, PAYDAY_DAY - 1)
  const nextMonth = month === 12 ? 1 : month + 1
  const nextYear  = month === 12 ? year + 1 : year
  return new Date(nextYear, nextMonth - 1, nextMonth - 1)
}

// Campaign lifecycle status for the "By Motion to OP" table's frozen STATUS
// column — reuses inferMotionEnd's DD/PayDay/BaU end-date rule so a row
// missing Periode Selesai still gets a sensible AKTIF/SELESAI read instead of
// looking permanently unresolved.
function campaignLifecycleStatus(row) {
  const start = new Date(normalizeDate(row.periodeMulai))
  if (isNaN(start)) return 'unknown'
  const selesai = new Date(normalizeDate(row.periodeSelesai))
  const end = !isNaN(selesai) ? selesai : inferMotionEnd(row, start)
  const now = new Date()
  if (now < start) return 'upcoming'
  if (now > end)   return 'ended'
  return 'active'
}

function motionApplyMonthOverlaps(row, monthKey) {
  const [year, month] = monthKey.split('-').map(Number)
  const mStart = new Date(year, month - 1, 1)
  const mEnd   = new Date(year, month, 0, 23, 59, 59)
  const start = new Date(normalizeDate(row.periodeMulai))
  if (isNaN(start)) return false
  const selesai = new Date(normalizeDate(row.periodeSelesai))
  const end = !isNaN(selesai) ? selesai : inferMotionEnd(row, start)
  return start <= mEnd && end >= mStart
}

// ─── DESIGN TOKENS ───────────────────────────────────────────────────────────
const DEFAULT_BADGE = 'bg-slate-100 text-slate-600 ring-1 ring-slate-200'

const OPERATIONAL_CONFIG = {
  Excellence: 'bg-green-50 text-green-700 ring-1 ring-green-200',
  Good:       'bg-blue-50 text-blue-700 ring-1 ring-blue-200',
  Bad:        'bg-red-50 text-red-700 ring-1 ring-red-200',
}

const DIFFICULTY_CONFIG = {
  Low:      'bg-green-50 text-green-700 ring-1 ring-green-200',
  Medium:   'bg-orange-50 text-orange-700 ring-1 ring-orange-200',
  High:     'bg-red-50 text-red-700 ring-1 ring-red-200',
  Campaign: 'bg-purple-50 text-purple-700 ring-1 ring-purple-200',
}

// Campaign lifecycle badge — separate from STATUS_CONFIG, which colors the
// freeform Status Strat/Design/Motion workflow text (Done/Progress/etc), a
// different concept from "is this campaign's period currently running".
const CAMPAIGN_LIFECYCLE_CONFIG = {
  active:   { label: 'Aktif',       badge: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200' },
  upcoming: { label: 'Akan Datang', badge: 'bg-blue-50 text-blue-700 ring-1 ring-blue-200' },
  ended:    { label: 'Selesai',     badge: 'bg-slate-100 text-slate-500 ring-1 ring-slate-200' },
  unknown:  { label: '-',           badge: 'bg-slate-50 text-slate-300 ring-1 ring-slate-200' },
}

const TAKS_SOURCE_CONFIG = {
  Ecommerce: 'bg-orange-50 text-orange-700 ring-1 ring-orange-200',
  Orca:      'bg-purple-50 text-purple-700 ring-1 ring-purple-200',
}

// Status Strat / Status Design / Status Motion carry freeform sheet text
// ("Done", "On Progress", "Waiting Approval", ...) that isn't consistently
// spelled across the three columns. Classify by keyword instead of exact
// match so new/typo'd variants still land in a sensible bucket.
function classifyStatus(raw) {
  const v = (raw ?? '').toString().trim().toLowerCase()
  if (!v) return 'empty'
  const has = (...kws) => kws.some(k => v.includes(k))
  if (has('done', 'ready', 'selesai', 'approved')) return 'done'
  if (has('block', 'issue', 'revisi berkali', 'stuck')) return 'blocked'
  if (has('waiting', 'approval', 'pending')) return 'waiting'
  if (has('progress', 'on strat', 'on gd', 'revisi', 'review')) return 'progress'
  return 'unknown'
}

const STATUS_CONFIG = {
  done: {
    badge: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-300 shadow-[0_0_0_3px_rgba(16,185,129,0.12)] font-bold',
    row:   'border-l-[3px] border-emerald-400 bg-emerald-50/40',
    icon:  '✓',
  },
  progress: {
    badge: 'bg-blue-50 text-blue-700 ring-1 ring-blue-200',
    row:   'border-l-[3px] border-blue-300 bg-blue-50/25',
  },
  waiting: {
    badge: 'bg-sun-50 text-sun-700 ring-1 ring-sun-200',
    row:   'border-l-[3px] border-sun-300 bg-sun-50/30',
  },
  blocked: {
    badge: 'bg-red-50 text-red-700 ring-1 ring-red-300',
    row:   'border-l-[3px] border-red-400 bg-red-50/30',
  },
  empty: {
    badge: DEFAULT_BADGE,
    row:   'border-l-[3px] border-transparent',
  },
  unknown: {
    badge: DEFAULT_BADGE,
    row:   'border-l-[3px] border-transparent',
  },
}

const DIFFICULTY_ORDER   = { Low: 0, Medium: 1, High: 2, Campaign: 3 }
const OPERATIONAL_ORDER  = { Bad: 0, Good: 1, Excellence: 2 }

// Shared badge class — 6px top/bottom (py-1.5), 10px left/right (px-2.5), rounded-full, 12px/600
const BADGE = 'inline-flex items-center gap-1 py-1.5 px-2.5 rounded-full text-[12px] font-semibold leading-none transition-colors duration-150'

// Shared filter chip class
const CHIP_BASE  = 'h-9 px-4 rounded-xl text-[13px] font-medium border transition-all duration-150 ease-out whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-1'
const CHIP_OFF   = 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:border-slate-300'
const CHIP_ON    = 'bg-brand-600 text-white border-brand-600 shadow-sm'

// ─── TAB / COLUMN SPECS ──────────────────────────────────────────────────────
// Design/Strategic tabs lead with Month Request / Req. Date / Brand and
// trail with Remark — these are cross-team identity/notes columns, not
// exclusive to one work category (matches the sheet's own "by All Team"
// grouping for Remark, and the team's explicit call for the identity
// columns). The Motion tab comes from a different sheet with no equivalent
// identity columns, so it doesn't use these.
const IDENTITY_COLUMNS = [
  { key: 'monthRequest', label: 'Month',    type: 'text' },
  { key: 'reqDate',      label: 'Req. Date', type: 'date' },
  { key: 'brand',        label: 'Brand',    type: 'badge-brand' },
]
const REMARK_COLUMN = { key: 'remark', label: 'Remark', type: 'text-muted' }

const TABS = [
  {
    key: 'design',
    label: 'By Design',
    columns: [
      ...IDENTITY_COLUMNS,
      { key: 'designPIC',             label: 'Design PIC',     type: 'text' },
      { key: 'typeOfContent',         label: 'Type of Content', type: 'text' },
      { key: 'taksSource',            label: 'Source',         type: 'badge-source' },
      { key: 'reqQty',                label: 'Req. Qty',       type: 'number' },
      { key: 'outputQty',             label: 'Output Qty',     type: 'number' },
      { key: 'dueDate',               label: 'Due Date',       type: 'date' },
      { key: 'submissionDate',        label: 'Submission',     type: 'date' },
      { key: 'workingDay',            label: 'SLA (Hari)',     type: 'number' },
      { key: 'operationalExcellence', label: 'Excellence',     type: 'badge-operational' },
      { key: 'designDifficulty',      label: 'Difficulty',     type: 'badge-difficulty' },
      { key: 'designRevision',        label: 'Revision',       type: 'number' },
      { key: 'statusDesign',          label: 'Status',         type: 'badge-generic' },
      { key: 'finalAssetName',        label: 'Final Asset Name', type: 'text-strong' },
      REMARK_COLUMN,
    ],
  },
  {
    key: 'strategic',
    label: 'By Strategic',
    columns: [
      ...IDENTITY_COLUMNS,
      { key: 'withStrategic', label: 'With Concept', type: 'yes-no' },
      { key: 'stratPIC',      label: 'Strat PIC',    type: 'text' },
      { key: 'stratRevision', label: 'Revision',     type: 'number' },
      { key: 'statusStrat',   label: 'Status',       type: 'badge-generic' },
      REMARK_COLUMN,
    ],
  },
  {
    key: 'motion',
    label: 'By Motion to OP',
    // Sourced from the separate "Motion Status" sheet — no Month
    // Request/Req. Date identity columns here, this sheet doesn't have them.
    columns: [
      { key: 'campaignStatus',   label: 'Status',     type: 'campaign-status' },
      { key: 'namaAset',         label: 'Nama Aset',  type: 'text-strong' },
      { key: 'brand',            label: 'Brand',      type: 'badge-brand' },
      { key: 'platform',         label: 'Platform',   type: 'text' },
      { key: 'tipe',             label: 'Tipe',       type: 'text' },
      { key: 'typeOfCampaign',   label: 'Campaign',   type: 'text' },
      { key: 'periodeMulai',     label: 'Periode Mulai',   type: 'date' },
      { key: 'periodeSelesai',   label: 'Periode Selesai', type: 'date' },
      { key: 'jamTayang',        label: 'Jam Tayang', type: 'text' },
      { key: 'motionPIC',        label: 'Motion PIC', type: 'text' },
      { key: 'motionDifficulty', label: 'Difficulty', type: 'badge-difficulty' },
      { key: 'motionRevision',   label: 'Revision',   type: 'number' },
      { key: 'statusMotion',     label: 'Status',     type: 'badge-generic' },
      { key: 'linkMotion',       label: 'File',       type: 'link' },
      { key: 'catatan',          label: 'Catatan',    type: 'text-muted' },
      { key: 'studio',           label: 'Studio',     type: 'text' },
    ],
  },
]

const DATE_SORT_KEYS    = new Set(['reqDate', 'dueDate', 'submissionDate', 'applyDate', 'periodeMulai', 'periodeSelesai'])
const NUMERIC_SORT_KEYS = new Set(['reqQty', 'outputQty', 'workingDay', 'designRevision', 'stratRevision', 'motionRevision'])

// Every column keeps a minimum width and stays single-line (except
// text-muted/Catatan, the one freeform notes field) so cells never compress
// under a narrow viewport or high browser zoom — that compression was what
// forced text to wrap and overflow into the sticky header on whichever row
// sat right below it. With this, a wide tab like By Motion to OP grows past
// the viewport and scrolls horizontally instead of squeezing every column.
// campaign-status gets a *fixed* (not just min) width — it's the first of two
// sticky columns on the Motion tab, and the second sticky column (Nama Aset)
// needs a matching fixed `left` offset (STICKY_STATUS_COL_LEFT below) to sit
// flush next to it instead of overlapping/gapping as other columns grow.
// Tailwind's class scanner is static, so this width is duplicated as a
// literal class here and as a literal `left-[140px]` at the usage site —
// keep both in sync if this ever changes.
//
// Sticky positioning only kicks in from the `sm` breakpoint up. Below that,
// campaign-status (140px) + Nama Aset (auto-grows past its 180px min for
// bold multi-word asset names, ~230px+ in practice) add up to more than a
// phone's own viewport width once page padding is subtracted — frozen at
// scrollLeft 0 that leaves nothing else on screen and no way to tell the
// rest of the table exists. On mobile the table just scrolls normally
// instead, so every column is reachable by swiping.
const STICKY_STATUS_COL_LEFT = 'sm:left-[140px]'

const COL_MIN_WIDTH = {
  'text-strong':       'min-w-[180px]',
  'campaign-status':   'w-[140px] min-w-[140px]',
  'text':              'min-w-[130px]',
  'text-muted':        'min-w-[180px] max-w-[220px]',
  'badge-brand':       'min-w-[130px]',
  'badge-source':      'min-w-[110px]',
  'badge-operational': 'min-w-[110px]',
  'badge-difficulty':  'min-w-[110px]',
  'badge-generic':     'min-w-[130px]',
  'yes-no':            'min-w-[110px]',
  'date':              'min-w-[110px]',
  'number':            'min-w-[80px]',
  'link':              'min-w-[90px]',
}

// Solid (non-transparent) equivalents of STATUS_CONFIG's row tints, used only
// on the frozen first column — a semi-transparent bg there would let
// horizontally-scrolled-away cells show through underneath it while sticky.
const STICKY_COL_BG = {
  done:     'bg-emerald-50',
  progress: 'bg-blue-50',
  waiting:  'bg-sun-50',
  blocked:  'bg-red-50',
  empty:    'bg-white',
  unknown:  'bg-white',
}

function renderCell(row, col, rowStatusCategory) {
  const value = row[col.key]
  switch (col.type) {
    case 'date':
      return formatDate(value) || <span className="text-slate-300">—</span>
    case 'number':
      return value || <span className="text-slate-300">—</span>
    case 'badge-brand':
      return value
        ? <span className={`${BADGE} bg-slate-100 text-slate-600 ring-1 ring-slate-200`}>{value}</span>
        : <span className="text-slate-300 text-[13px]">—</span>
    case 'badge-source':
      return value
        ? <span className={`${BADGE} ${TAKS_SOURCE_CONFIG[value] ?? DEFAULT_BADGE}`}>{value}</span>
        : <span className="text-slate-300 text-[13px]">—</span>
    case 'badge-operational':
      return value
        ? <span className={`${BADGE} ${OPERATIONAL_CONFIG[value] ?? DEFAULT_BADGE}`}>{value}</span>
        : <span className="text-slate-300 text-[13px]">—</span>
    case 'badge-difficulty':
      return value
        ? <span className={`${BADGE} ${DIFFICULTY_CONFIG[value] ?? DEFAULT_BADGE}`}>{value}</span>
        : <span className="text-slate-300 text-[13px]">—</span>
    case 'badge-generic': {
      const cat = classifyStatus(value)
      const cfg = STATUS_CONFIG[cat]
      return value
        ? (
          <span className={`${BADGE} ${cfg.badge}`}>
            {cat === 'done' && <span className="animate-pop-once">{cfg.icon}</span>}
            {value}
          </span>
        )
        : <span className="text-slate-300 text-[13px]">—</span>
    }
    case 'campaign-status': {
      const cfg = CAMPAIGN_LIFECYCLE_CONFIG[campaignLifecycleStatus(row)]
      return <span className={`${BADGE} ${cfg.badge}`}>{cfg.label}</span>
    }
    case 'yes-no':
      return value
        ? <span className={`${BADGE} ${value === 'Yes' ? 'bg-green-50 text-green-700 ring-1 ring-green-200' : 'bg-slate-100 text-slate-600 ring-1 ring-slate-200'}`}>{value}</span>
        : <span className="text-slate-300 text-[13px]">—</span>
    case 'link':
      return value
        ? <a href={value} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center h-9 px-4 bg-brand-600 hover:bg-brand-700 text-white text-[13px] font-semibold rounded-lg transition-all duration-150 ease-out shadow-[0_1px_2px_rgba(16,24,40,.05)] whitespace-nowrap">
            Buka →
          </a>
        : <span className="text-slate-300 text-[13px]">—</span>
    case 'text-strong': {
      const isDone = rowStatusCategory === 'done'
      return (
        <div className={`text-[14px] leading-snug ${isDone ? 'font-bold text-emerald-800' : 'font-medium text-slate-800'}`}>
          {value
            ? <>{isDone && <span className="text-emerald-500 mr-1">✓</span>}{value}</>
            : <span className="text-slate-300 font-normal">—</span>}
        </div>
      )
    }
    case 'text-muted':
      return value || <span className="text-slate-300">—</span>
    default:
      return value || <span className="text-slate-300">—</span>
  }
}

// ─── COMPONENT ───────────────────────────────────────────────────────────────
export default function CampaignSchedule() {
  const [rawData, setRawData]       = useState(null)
  const [fetchError, setFetchError] = useState(null)
  const [motionRawData, setMotionRawData]     = useState(null)
  const [motionFetchError, setMotionFetchError] = useState(null)
  const [filterTaksSource,   setFilterTaksSource]   = useState('semua')
  const [filterTypeOfContent,setFilterTypeOfContent]= useState([]) // [] = semua konten
  const [filterDifficulty,   setFilterDifficulty]   = useState('semua')
  const [filterOperational,  setFilterOperational]  = useState('semua')
  const [filterBrand,        setFilterBrand]        = useState('semua')
  const [filterBulanReq,     setFilterBulanReq]     = useState([]) // [] = semua bulan, by Req./Due Date
  const [filterBulanApply,   setFilterBulanApply]   = useState([]) // [] = semua bulan, by Apply Date
  const [filterCampaign,     setFilterCampaign]     = useState('semua')
  const [brandOpen,          setBrandOpen]          = useState(false)
  const [brandSearch,        setBrandSearch]        = useState('')
  const [bulanReqOpen,       setBulanReqOpen]       = useState(false)
  const [bulanApplyOpen,     setBulanApplyOpen]     = useState(false)
  const [contentOpen,        setContentOpen]        = useState(false)
  const brandRef = useRef(null)
  const bulanReqRef = useRef(null)
  const bulanApplyRef = useRef(null)
  const contentRef = useRef(null)
  const [activeTab, setActiveTab] = useState('motion')
  const [sortKey, setSortKey] = useState('reqDate')
  const [sortDir, setSortDir] = useState('asc')

  function handleTabChange(key) {
    setActiveTab(key)
    setSortKey(key === 'motion' ? 'periodeMulai' : 'reqDate')
    setSortDir('asc')
  }

  useEffect(() => {
    let cancelled = false
    fetch(CSV_URL)
      .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.text() })
      .then(text => {
        if (cancelled) return
        const rows = parseCSV(text)
        setRawData(rows.length > 0 ? rows : null)
        if (rows.length === 0) setFetchError('sheet-empty')
      })
      .catch(err => { if (!cancelled) { setFetchError(err.message); setRawData(null) } })
    return () => { cancelled = true }
  }, [])

  useEffect(() => {
    let cancelled = false
    fetch(MOTION_CSV_URL)
      .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.text() })
      .then(text => {
        if (cancelled) return
        const rows = parseMotionCSV(text)
        setMotionRawData(rows.length > 0 ? rows : null)
        if (rows.length === 0) setMotionFetchError('sheet-empty')
      })
      .catch(err => { if (!cancelled) { setMotionFetchError(err.message); setMotionRawData(null) } })
    return () => { cancelled = true }
  }, [])

  useEffect(() => {
    function handleOutside(e) {
      if (brandRef.current && !brandRef.current.contains(e.target)) {
        setBrandOpen(false); setBrandSearch('')
      }
      if (bulanReqRef.current && !bulanReqRef.current.contains(e.target)) {
        setBulanReqOpen(false)
      }
      if (bulanApplyRef.current && !bulanApplyRef.current.contains(e.target)) {
        setBulanApplyOpen(false)
      }
      if (contentRef.current && !contentRef.current.contains(e.target)) {
        setContentOpen(false)
      }
    }
    document.addEventListener('mousedown', handleOutside)
    return () => document.removeEventListener('mousedown', handleOutside)
  }, [])

  const isMotionTab = activeTab === 'motion'

  const oldIsLoading = rawData === null && fetchError === null
  const oldIsLive     = rawData !== null && rawData.length > 0
  const oldDisplayData = oldIsLive ? rawData : SEED_DATA

  const motionIsLoading  = motionRawData === null && motionFetchError === null
  const motionIsLive     = motionRawData !== null && motionRawData.length > 0
  const motionDisplayData = motionIsLive ? motionRawData : MOTION_SEED_DATA

  const isLoading   = isMotionTab ? motionIsLoading : oldIsLoading
  const isLive      = isMotionTab ? motionIsLive : oldIsLive
  const activeFetchError = isMotionTab ? motionFetchError : fetchError
  const displayData = isMotionTab ? motionDisplayData : oldDisplayData

  const allMonths = useMemo(() => {
    const seen = new Set(FIXED_MONTHS)
    oldDisplayData.forEach(r => {
      const sk = getMonthKey(r.reqDate), ek = getMonthKey(r.dueDate), ak = getMonthKey(r.applyDate)
      if (sk) seen.add(sk); if (ek) seen.add(ek); if (ak) seen.add(ak)
    })
    motionDisplayData.forEach(r => {
      const sk = getMonthKey(r.periodeMulai), ek = getMonthKey(r.periodeSelesai)
      if (sk) seen.add(sk); if (ek) seen.add(ek)
    })
    return Array.from(seen).sort()
  }, [oldDisplayData, motionDisplayData])

  const brands = useMemo(
    () => Array.from(new Set(displayData.map(r => r.brand).filter(Boolean))).sort((a, b) => a.localeCompare(b, 'id')),
    [displayData],
  )

  const typesOfContent = useMemo(
    () => Array.from(new Set(oldDisplayData.map(r => r.typeOfContent).filter(Boolean))).sort((a, b) => a.localeCompare(b, 'id')),
    [oldDisplayData],
  )

  // Campaign filter (PayDay/BaU/DD/Other) is shared by both tabs — same
  // keyword classification either way, just against whichever row's
  // typeOfCampaign value.
  function matchesCampaignFilter(row) {
    if (filterCampaign === 'semua') return true
    const k = (row.typeOfCampaign ?? '').toLowerCase()
    const isPayDay = k.includes('payday'), isBaU = k.includes('bau'), isDD = k.includes('dd')
    if (filterCampaign === 'PayDay') return isPayDay
    if (filterCampaign === 'BaU') return isBaU
    if (filterCampaign === 'DD') return isDD
    return !isPayDay && !isBaU && !isDD // Other
  }

  const filtered = useMemo(() => {
    if (isMotionTab) {
      // Only filters that have a real equivalent in the Motion Status sheet
      // apply here — Excellence/Source/Konten/Req-Due-bulan are Design-only
      // concepts and are left out entirely (not evaluated as "no match").
      return motionDisplayData.filter(row => {
        const matchB  = filterBrand === 'semua' || (row.brand ?? '').toLowerCase() === filterBrand.toLowerCase()
        const matchDf = filterDifficulty === 'semua' || row.motionDifficulty === filterDifficulty
        const matchMApply = filterBulanApply.length === 0 || filterBulanApply.some(k => motionApplyMonthOverlaps(row, k))
        return matchB && matchDf && matchMApply && matchesCampaignFilter(row)
      })
    }
    return oldDisplayData.filter(row => {
      const matchTS = filterTaksSource === 'semua' || row.taksSource === filterTaksSource
      const matchTC = filterTypeOfContent.length === 0 || filterTypeOfContent.includes(row.typeOfContent)
      const matchDf = filterDifficulty === 'semua' || row.designDifficulty === filterDifficulty
      const matchOp = filterOperational === 'semua' || row.operationalExcellence === filterOperational
      const matchB  = filterBrand === 'semua' || (row.brand ?? '').toLowerCase() === filterBrand.toLowerCase()
      const matchMReq   = filterBulanReq.length === 0 || filterBulanReq.some(k => reqMonthOverlaps(row, k))
      const matchMApply = filterBulanApply.length === 0 || filterBulanApply.some(k => applyMonthOverlaps(row, k))
      return matchTS && matchTC && matchDf && matchOp && matchB && matchMReq && matchMApply && matchesCampaignFilter(row)
    })
  }, [isMotionTab, oldDisplayData, motionDisplayData, filterTaksSource, filterTypeOfContent, filterDifficulty, filterOperational, filterBrand, filterBulanReq, filterBulanApply, filterCampaign])

  const filteredBrands = brandSearch.trim()
    ? brands.filter(b => b.toLowerCase().includes(brandSearch.toLowerCase()))
    : brands

  function handleSort(key) {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortKey(key); setSortDir('asc') }
  }

  const sorted = useMemo(() => {
    if (!sortKey) return filtered
    return [...filtered].sort((a, b) => {
      let av, bv
      if (DATE_SORT_KEYS.has(sortKey)) {
        av = new Date(normalizeDate(a[sortKey] ?? '')).getTime() || 0
        bv = new Date(normalizeDate(b[sortKey] ?? '')).getTime() || 0
      } else if (sortKey === 'designDifficulty' || sortKey === 'motionDifficulty') {
        av = DIFFICULTY_ORDER[a[sortKey]] ?? -1; bv = DIFFICULTY_ORDER[b[sortKey]] ?? -1
      } else if (sortKey === 'operationalExcellence') {
        av = OPERATIONAL_ORDER[a[sortKey]] ?? -1; bv = OPERATIONAL_ORDER[b[sortKey]] ?? -1
      } else if (NUMERIC_SORT_KEYS.has(sortKey)) {
        av = parseFloat(a[sortKey]) || 0; bv = parseFloat(b[sortKey]) || 0
      } else {
        av = (a[sortKey] ?? '').toString(); bv = (b[sortKey] ?? '').toString()
      }
      const cmp = typeof av === 'number' ? av - bv : av.localeCompare(bv, 'id', { sensitivity: 'base' })
      return sortDir === 'asc' ? cmp : -cmp
    })
  }, [filtered, sortKey, sortDir])

  const activeTabConfig = TABS.find(t => t.key === activeTab) ?? TABS[0]
  const statusCol = activeTabConfig.columns.find(c => c.type === 'badge-generic')
  // Design/Strategic freeze just their first (identity) column; Motion freezes
  // two — the new campaign-status badge plus Nama Aset right after it.
  const stickyColCount = activeTabConfig.columns[0]?.type === 'campaign-status' ? 2 : 1

  // Excellence overview is a Design-only concept — always computed off the
  // Design/Strategic sheet regardless of which tab is active.
  const operationalCounts = useMemo(() => {
    const c = { Excellence: 0, Good: 0, Bad: 0 }
    oldDisplayData.forEach(r => { if (c[r.operationalExcellence] !== undefined) c[r.operationalExcellence]++ })
    return c
  }, [oldDisplayData])

  // ── STAT CARDS config ──
  const STAT_CARDS = [
    { key: 'Excellence', label: 'Excellence', dot: '🟢', num: 'text-green-700', bg: 'bg-white border-green-100', sub: 'text-green-600' },
    { key: 'Good',       label: 'Good',       dot: '🔵', num: 'text-blue-700',  bg: 'bg-white border-blue-100',  sub: 'text-blue-600'  },
    { key: 'Bad',        label: 'Bad',        dot: '🔴', num: 'text-red-700',   bg: 'bg-white border-red-100',   sub: 'text-red-600'   },
  ]

  return (
    <PageLayout maxWidthClassName="max-w-none">
      {/* ── SCOPED INTER FONT wrapper ── */}
      <div className="font-inter overflow-x-hidden">

        {/* Header */}
        <Reveal>
          <div className="pt-8 pb-6 border-b border-[#E5E7EB] mb-8">
            <div className="flex items-center gap-2 font-mono text-[11px] text-slate-400 mb-4 tracking-wider">
              <Link to="/" className="hover:text-brand-600 transition-colors duration-150">Home</Link>
              <span>/</span>
              <span>Jadwal Kampanye</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div>
                <p className="font-mono text-[11px] text-brand-600 tracking-[0.12em] uppercase mb-2">
                  / Komponen 08 · Campaign Usage Management
                </p>
                <h1 className="font-display text-[30px] font-bold tracking-tight text-slate-900 mb-2 leading-tight">
                  Jadwal Penggunaan Mockup
                </h1>
                <p className="text-[14px] text-slate-500 max-w-xl leading-relaxed">
                  Daftar request Design, Strategic, dan Motion beserta status pengerjaannya.
                  Data dikelola tim internal via Google Sheets.
                </p>
              </div>
              <Link
                to="/framework/campaign-usage-management"
                className="shrink-0 text-[13px] text-brand-600 hover:text-brand-700 font-medium border border-brand-200 bg-brand-50 hover:bg-brand-100 rounded-xl px-4 py-2.5 whitespace-nowrap transition-all duration-150 ease-out shadow-[0_1px_2px_rgba(16,24,40,.05)]"
              >
                Dokumentasi →
              </Link>
            </div>
          </div>
        </Reveal>

        {/* Data source status */}
        {isLoading && (
          <div className="border border-[#E5E7EB] rounded-xl overflow-hidden mb-6 shadow-[0_1px_2px_rgba(16,24,40,.05)]">
            <div className="bg-slate-50 px-4 py-3 border-b border-[#E5E7EB] flex items-center gap-3">
              <div className="h-2.5 bg-slate-200 rounded-full animate-pulse w-48" />
              <div className="h-2.5 bg-slate-200 rounded-full animate-pulse w-32" />
            </div>
            {[1, 2, 3].map(i => (
              <div key={i} className="flex gap-4 px-4 py-4 border-b border-slate-100 last:border-0">
                <div className="h-4 bg-slate-100 rounded animate-pulse w-16 shrink-0" />
                <div className="h-4 bg-slate-100 rounded animate-pulse flex-1" />
                <div className="h-4 bg-slate-100 rounded animate-pulse w-24 shrink-0" />
              </div>
            ))}
          </div>
        )}
        {!isLoading && isLive && (
          <div className="flex items-center gap-2 border border-green-100 bg-green-50 rounded-xl px-4 py-3 mb-6 text-[13px] text-green-700 font-medium shadow-[0_1px_2px_rgba(16,24,40,.05)]">
            🟢 <strong>Data Live</strong> — ditarik dari Google Sheets. Refresh untuk memperbarui.
          </div>
        )}
        {!isLoading && !isLive && (
          <div className="border border-amber-100 bg-amber-50 rounded-xl px-4 py-3 mb-6 text-[13px] text-amber-700 font-medium shadow-[0_1px_2px_rgba(16,24,40,.05)]">
            {activeFetchError === 'sheet-empty'
              ? <>Sheet masih kosong — tambahkan data di Google Sheets lalu refresh.</>
              : <>SEED — gagal memuat dari Sheets ({activeFetchError}). Set sheet ke <em>Anyone with the link can view</em> lalu refresh.</>
            }
          </div>
        )}

        {/* ── STAT CARDS ── */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          {STAT_CARDS.map(s => (
            <div
              key={s.key}
              className={`border rounded-xl p-5 shadow-[0_1px_2px_rgba(16,24,40,.05)] transition-all duration-150 ease-out ${s.bg}`}
            >
              <div className={`text-[32px] font-bold leading-none mb-2 tracking-tight ${s.num}`}>
                {operationalCounts[s.key]}
              </div>
              <div className={`text-[12px] font-medium ${s.sub}`}>
                {s.dot} {s.label}
              </div>
            </div>
          ))}
        </div>

        {/* ── FILTERS ── */}
        <div className="space-y-3 mb-6">

          {/* Operational Excellence */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-semibold text-slate-400 tracking-[0.08em] uppercase w-28 shrink-0">Excellence</span>
            <div className="flex flex-wrap gap-1.5">
              {(['semua', 'Excellence', 'Good', 'Bad']).map(s => (
                <button key={s} onClick={() => setFilterOperational(s)}
                  className={`${CHIP_BASE} ${filterOperational === s ? CHIP_ON : CHIP_OFF}`}>
                  {s === 'semua' ? `Semua (${oldDisplayData.length})` : `${s} (${operationalCounts[s]})`}
                </button>
              ))}
            </div>
          </div>

          {/* Design Difficulty */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-semibold text-slate-400 tracking-[0.08em] uppercase w-28 shrink-0">Difficulty</span>
            <div className="flex flex-wrap gap-1.5">
              {(['semua', 'Low', 'Medium', 'High']).map(s => (
                <button key={s} onClick={() => setFilterDifficulty(s)}
                  className={`${CHIP_BASE} ${filterDifficulty === s ? CHIP_ON : CHIP_OFF}`}>
                  {s === 'semua' ? 'Semua' : s}
                </button>
              ))}
            </div>
          </div>

          {/* Bulan — two independent checkbox dropdowns side by side, since a
              row's Req./Due Date month and Apply Date month can differ (e.g.
              a Motion-only BAU request has no Req./Due Date at all). */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-semibold text-slate-400 tracking-[0.08em] uppercase w-28 shrink-0">Bulan</span>
            <div className="flex flex-wrap gap-2">

              <div className="relative" ref={bulanReqRef}>
                <button
                  onClick={() => setBulanReqOpen(o => !o)}
                  className={`${CHIP_BASE} flex items-center gap-1.5 ${filterBulanReq.length > 0 ? CHIP_ON : CHIP_OFF}`}
                >
                  <span className="text-[10px] opacity-70">Req/Due:</span>
                  {filterBulanReq.length === 0
                    ? 'Semua Bulan'
                    : filterBulanReq.length === 1
                      ? formatMonthLabel(filterBulanReq[0])
                      : `${filterBulanReq.length} bulan dipilih`}
                  <span className="text-[10px] opacity-60">{bulanReqOpen ? '▲' : '▼'}</span>
                </button>
                {bulanReqOpen && (
                  <div className="absolute z-10 top-full left-0 mt-1.5 w-64 bg-white border border-[#E5E7EB] rounded-xl shadow-lg overflow-hidden">
                    <div className="flex items-center justify-between px-3 py-2 border-b border-[#E5E7EB]">
                      <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-[0.06em]">Bulan (Req./Due Date)</span>
                      {filterBulanReq.length > 0 && (
                        <button onClick={() => setFilterBulanReq([])}
                          className="text-[12px] text-brand-600 hover:text-brand-700 font-medium transition-colors duration-150">
                          Reset
                        </button>
                      )}
                    </div>
                    <ul className="max-h-64 overflow-y-auto py-1">
                      {allMonths.map(k => (
                        <li key={k}>
                          <label className="flex items-center gap-2.5 px-3 py-2 text-[13px] text-slate-700 hover:bg-slate-50 cursor-pointer transition-colors duration-150">
                            <input
                              type="checkbox"
                              checked={filterBulanReq.includes(k)}
                              onChange={() => setFilterBulanReq(prev => toggleInArray(prev, k))}
                              className="rounded border-slate-300 text-brand-600 focus:ring-brand-400"
                            />
                            {formatMonthLabel(k)}
                          </label>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="relative" ref={bulanApplyRef}>
                <button
                  onClick={() => setBulanApplyOpen(o => !o)}
                  className={`${CHIP_BASE} flex items-center gap-1.5 ${filterBulanApply.length > 0 ? CHIP_ON : CHIP_OFF}`}
                >
                  <span className="text-[10px] opacity-70">Apply:</span>
                  {filterBulanApply.length === 0
                    ? 'Semua Bulan'
                    : filterBulanApply.length === 1
                      ? formatMonthLabel(filterBulanApply[0])
                      : `${filterBulanApply.length} bulan dipilih`}
                  <span className="text-[10px] opacity-60">{bulanApplyOpen ? '▲' : '▼'}</span>
                </button>
                {bulanApplyOpen && (
                  <div className="absolute z-10 top-full left-0 mt-1.5 w-64 bg-white border border-[#E5E7EB] rounded-xl shadow-lg overflow-hidden">
                    <div className="flex items-center justify-between px-3 py-2 border-b border-[#E5E7EB]">
                      <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-[0.06em]">Bulan (Apply Date)</span>
                      {filterBulanApply.length > 0 && (
                        <button onClick={() => setFilterBulanApply([])}
                          className="text-[12px] text-brand-600 hover:text-brand-700 font-medium transition-colors duration-150">
                          Reset
                        </button>
                      )}
                    </div>
                    <ul className="max-h-64 overflow-y-auto py-1">
                      {allMonths.map(k => (
                        <li key={k}>
                          <label className="flex items-center gap-2.5 px-3 py-2 text-[13px] text-slate-700 hover:bg-slate-50 cursor-pointer transition-colors duration-150">
                            <input
                              type="checkbox"
                              checked={filterBulanApply.includes(k)}
                              onChange={() => setFilterBulanApply(prev => toggleInArray(prev, k))}
                              className="rounded border-slate-300 text-brand-600 focus:ring-brand-400"
                            />
                            {formatMonthLabel(k)}
                          </label>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

            </div>
          </div>

          {/* Brand dropdown */}
          <div className="flex items-center gap-2" ref={brandRef}>
            <span className="text-[11px] font-semibold text-slate-400 tracking-[0.08em] uppercase w-28 shrink-0">Brand</span>
            <div className="relative">
              <button
                onClick={() => { setBrandOpen(o => !o); if (brandOpen) setBrandSearch('') }}
                className={`${CHIP_BASE} flex items-center gap-1.5 ${filterBrand !== 'semua' ? CHIP_ON : CHIP_OFF}`}
              >
                {filterBrand === 'semua' ? 'Semua Brand' : filterBrand}
                <span className="text-[10px] opacity-60">{brandOpen ? '▲' : '▼'}</span>
              </button>
              {brandOpen && (
                <div className="absolute z-10 top-full left-0 mt-1.5 w-60 bg-white border border-[#E5E7EB] rounded-xl shadow-lg overflow-hidden">
                  <div className="p-2.5 border-b border-[#E5E7EB]">
                    <input
                      type="text" value={brandSearch} onChange={e => setBrandSearch(e.target.value)}
                      placeholder="Cari brand..." autoFocus
                      className="w-full text-[13px] px-3 py-2 border border-[#E5E7EB] rounded-lg outline-none focus:border-brand-400 transition-colors duration-150"
                    />
                  </div>
                  <ul className="max-h-52 overflow-y-auto py-1">
                    {filterBrand !== 'semua' && !brandSearch && (
                      <li>
                        <button onClick={() => { setFilterBrand('semua'); setBrandOpen(false); setBrandSearch('') }}
                          className="w-full text-left px-3 py-2 text-[13px] text-slate-500 hover:bg-slate-50 transition-colors duration-150">
                          Semua Brand
                        </button>
                      </li>
                    )}
                    {filteredBrands.length === 0
                      ? <li className="px-3 py-3 text-[13px] text-slate-400 italic">Tidak ditemukan</li>
                      : filteredBrands.map(b => (
                          <li key={b}>
                            <button onClick={() => { setFilterBrand(b); setBrandOpen(false); setBrandSearch('') }}
                              className={`w-full text-left px-3 py-2 text-[13px] transition-colors duration-150 ${
                                filterBrand === b ? 'bg-brand-50 text-brand-700 font-semibold' : 'text-slate-700 hover:bg-slate-50'
                              }`}>
                              {b}
                            </button>
                          </li>
                        ))
                    }
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Type of Content — checkbox dropdown, multi-select */}
          <div className="flex items-center gap-2" ref={contentRef}>
            <span className="text-[11px] font-semibold text-slate-400 tracking-[0.08em] uppercase w-28 shrink-0">Konten</span>
            <div className="relative">
              <button
                onClick={() => setContentOpen(o => !o)}
                className={`${CHIP_BASE} flex items-center gap-1.5 ${filterTypeOfContent.length > 0 ? CHIP_ON : CHIP_OFF}`}
              >
                {filterTypeOfContent.length === 0
                  ? 'Semua Konten'
                  : filterTypeOfContent.length === 1
                    ? filterTypeOfContent[0]
                    : `${filterTypeOfContent.length} konten dipilih`}
                <span className="text-[10px] opacity-60">{contentOpen ? '▲' : '▼'}</span>
              </button>
              {contentOpen && (
                <div className="absolute z-10 top-full left-0 mt-1.5 w-64 bg-white border border-[#E5E7EB] rounded-xl shadow-lg overflow-hidden">
                  <div className="flex items-center justify-between px-3 py-2 border-b border-[#E5E7EB]">
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-[0.06em]">Pilih Konten</span>
                    {filterTypeOfContent.length > 0 && (
                      <button onClick={() => setFilterTypeOfContent([])}
                        className="text-[12px] text-brand-600 hover:text-brand-700 font-medium transition-colors duration-150">
                        Reset
                      </button>
                    )}
                  </div>
                  <ul className="max-h-64 overflow-y-auto py-1">
                    {typesOfContent.length === 0
                      ? <li className="px-3 py-3 text-[13px] text-slate-400 italic">Tidak ada data</li>
                      : typesOfContent.map(t => (
                          <li key={t}>
                            <label className="flex items-center gap-2.5 px-3 py-2 text-[13px] text-slate-700 hover:bg-slate-50 cursor-pointer transition-colors duration-150">
                              <input
                                type="checkbox"
                                checked={filterTypeOfContent.includes(t)}
                                onChange={() => setFilterTypeOfContent(prev => toggleInArray(prev, t))}
                                className="rounded border-slate-300 text-brand-600 focus:ring-brand-400"
                              />
                              {t}
                            </label>
                          </li>
                        ))
                    }
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Taks Source */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-semibold text-slate-400 tracking-[0.08em] uppercase w-28 shrink-0">Source</span>
            <div className="flex flex-wrap gap-1.5">
              {(['semua', 'Ecommerce', 'Orca']).map(s => (
                <button key={s} onClick={() => setFilterTaksSource(s)}
                  className={`${CHIP_BASE} ${filterTaksSource === s ? CHIP_ON : CHIP_OFF}`}>
                  {s === 'semua' ? 'Semua' : s}
                </button>
              ))}
            </div>
          </div>

          {/* Campaign */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-semibold text-slate-400 tracking-[0.08em] uppercase w-28 shrink-0">Campaign</span>
            <div className="flex flex-wrap gap-1.5">
              {(['semua', 'PayDay', 'BaU', 'DD', 'Other']).map(c => (
                <button key={c} onClick={() => setFilterCampaign(c)}
                  className={`${CHIP_BASE} ${filterCampaign === c ? CHIP_ON : CHIP_OFF}`}>
                  {c === 'semua' ? 'Semua' : c}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── TAB BAR ── */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {TABS.map(tab => (
            <button key={tab.key} onClick={() => handleTabChange(tab.key)}
              className={`${CHIP_BASE} ${activeTab === tab.key ? CHIP_ON : CHIP_OFF}`}>
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── TABLE ── */}
        {sorted.length === 0 ? (
          <div className="text-center py-16 text-slate-400 text-[14px] border border-[#E5E7EB] rounded-xl bg-slate-50">
            Tidak ada request yang cocok dengan filter yang dipilih.
          </div>
        ) : (
          <div key={activeTab} className="overflow-auto overscroll-contain max-h-[70vh] border border-[#E5E7EB] rounded-xl shadow-[0_1px_2px_rgba(16,24,40,.05)]">
            <table className="w-full text-left border-collapse table-auto">
              <thead className="sticky top-0 z-10">
                <tr className="bg-slate-50 border-b border-[#E5E7EB]">
                  {activeTabConfig.columns.map((col, colIdx) => {
                    const sortable = col.type !== 'link'
                    const isSticky = colIdx < stickyColCount
                    const stickyLeft = colIdx === 0 ? 'sm:left-0' : STICKY_STATUS_COL_LEFT
                    return (
                      <th key={col.key} onClick={sortable ? () => handleSort(col.key) : undefined}
                        className={`align-middle px-4 py-3 text-[13px] font-semibold text-slate-500 uppercase tracking-[0.06em] select-none transition-colors duration-150 whitespace-nowrap ${COL_MIN_WIDTH[col.type] ?? ''} ${
                          sortable ? 'cursor-pointer hover:text-slate-700 hover:bg-slate-100' : ''
                        } ${isSticky ? `sm:sticky ${stickyLeft} sm:z-20 bg-slate-50` : ''}`}>
                        <span className="flex items-center gap-1">
                          {col.label}
                          {sortable && (
                            <span className="text-[10px] opacity-50">
                              {sortKey === col.key ? (sortDir === 'asc' ? '↑' : '↓') : '↕'}
                            </span>
                          )}
                        </span>
                      </th>
                    )
                  })}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {sorted.map((row, idx) => {
                  const isEven = idx % 2 === 1
                  const statusCat = statusCol ? classifyStatus(row[statusCol.key]) : 'unknown'
                  const rowAccent = STATUS_CONFIG[statusCat].row
                  const rowIsEvenEmpty = isEven && statusCat === 'empty'
                  const stickyBg = rowIsEvenEmpty ? 'bg-slate-50' : STICKY_COL_BG[statusCat]
                  return (
                    <tr
                      key={row.id}
                      className={`transition-colors duration-150 ease-out hover:bg-slate-50 ${rowAccent} ${
                        rowIsEvenEmpty ? 'bg-slate-50/30' : ''
                      }`}
                    >
                      {activeTabConfig.columns.map((col, colIdx) => (
                        <td key={col.key}
                          className={`px-4 py-2 min-h-[52px] align-middle ${COL_MIN_WIDTH[col.type] ?? ''} ${
                            col.type === 'text-muted' ? 'text-[12px] text-slate-500' : 'whitespace-nowrap'
                          } ${col.type === 'date' ? 'font-mono text-[12px] text-slate-500' : ''} ${
                            colIdx < stickyColCount ? `sm:sticky ${colIdx === 0 ? 'sm:left-0' : STICKY_STATUS_COL_LEFT} sm:z-[5] ${stickyBg}` : ''
                          }`}>
                          {renderCell(row, col, statusCat)}
                        </td>
                      ))}
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Row count */}
        <div className="mt-3 text-[12px] text-slate-400 flex items-center justify-between">
          <span>{sorted.length} dari {displayData.length} request ditampilkan</span>
          <Link to="/framework/campaign-usage-management" className="text-brand-600 hover:text-brand-700 font-medium transition-colors duration-150">
            Dokumentasi Campaign Usage Management →
          </Link>
        </div>

        {/* ── NOTES ── */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-2">
          {[
            { col: 'Tab',           note: 'By Design dan By Strategic menampilkan kolom dari sheet Design/Strategic (satu kali fetch, tab berbagi data yang sama — Month Request, Req. Date, Brand, dan Remark tampil di kedua tab itu). By Motion to OP kini sumbernya sheet terpisah ("Motion Status"), fetch dan struktur kolomnya sendiri, gak nyambung ke Design/Strategic.' },
            { col: 'Status',        note: 'Kolom Status Strat / Status Design menampilkan nilai apa adanya dari sheet, diwarnai otomatis berdasarkan kata kunci: hijau (Done/Selesai), biru (On Progress), kuning (Waiting/Approval), merah (Blocked/Issue). Baris yang Done ditandai border hijau dan teks tebal agar langsung kelihatan pas scroll. Tab By Motion to OP pakai kolom Status Mockup dari sheet Motion Status dengan pewarnaan yang sama, apa adanya (tanpa derivasi dari status Design/Strategic).' },
            { col: 'Excellence',    note: 'Kolom Operational Exellence dari sheet (tab By Design): Excellence, Good, atau Bad. Stat card di atas selalu merujuk data ini walau lagi buka tab lain.' },
            { col: 'Final Asset Name', note: 'Nama aset final dari sheet Design/Strategic — cuma tampil di tab By Design, kosong sampai request mencapai tahap yang mengisinya. Tab By Motion to OP punya kolom sendiri, "Nama Aset", dari sheet Motion Status.' },
            { col: 'Difficulty',    note: 'Design Difficulty (tab By Design) dan Motion Difficulty (tab By Motion to OP, dari sheet Motion Status): Low, Medium, High, atau Campaign.' },
            { col: 'Source',        note: 'Kolom Taks Source dari sheet: Ecommerce atau Orca — sumber sistem request, bukan platform siaran. Cuma berlaku di tab By Design.' },
            { col: 'Campaign',      note: 'Kolom Type of Campaign (By Design/Strategic) atau Kampanye (By Motion to OP, dari sheet Motion Status) — dipakai juga untuk filter Campaign (PayDay / BaU / DD / Other).' },
            { col: 'Sort',          note: 'Default sort mengikuti Req. Date (By Design/Strategic) atau Periode Mulai (By Motion to OP), ascending, dan direset tiap kali ganti tab agar indikator sort tidak menunjuk ke kolom yang tidak ditampilkan di tab tersebut.' },
            { col: 'Remark',        note: 'By Design/Strategic pakai kolom Remark (Wardrobe, Gimmick, Concern on Live) dari sheet Design/Strategic. By Motion to OP pakai kolom Catatan dari sheet Motion Status — catatan bebas yang terpisah, bukan kolom yang sama.' },
            { col: 'Filter Bulan',  note: 'Dua dropdown terpisah berdampingan — "Req/Due" (kerja Design/Strategic, cuma berlaku di tab itu) dan "Apply" (By Motion to OP, dicek terhadap rentang Periode Mulai–Selesai di sheet Motion Status). Kalau Periode Selesai dikosongkan, batas aktifnya dihitung otomatis dari siklus Kampanye: DD/PayDay dianggap aktif 1 hari setelah mulai, BaU dianggap aktif sampai sebelum tanggal DD/PayDay checkpoint berikutnya. Masing-masing dropdown bisa pilih lebih dari satu bulan, tersedia Januari 2025–Desember 2026.' },
            {
              col: 'Setup Sheets',
              note: (
                <>
                  Kedua sheet harus di-set <strong>Share → Anyone with the link → Viewer</strong> agar fetch berjalan.{' '}
                  <a href="https://docs.google.com/spreadsheets/d/1aXZ2STMDwPa-zFeZj37aa_Ko4-IE5WYzIKKe3EMm8rs/edit#gid=1476491661"
                    target="_blank" rel="noopener noreferrer" className="text-brand-600 hover:underline transition-colors duration-150">
                    Buka Google Sheets — tab 2026 →
                  </a>{' '}
                  ·{' '}
                  <a href="https://docs.google.com/spreadsheets/d/1aXZ2STMDwPa-zFeZj37aa_Ko4-IE5WYzIKKe3EMm8rs/edit#gid=820345676"
                    target="_blank" rel="noopener noreferrer" className="text-brand-600 hover:underline transition-colors duration-150">
                    Motion Status →
                  </a>
                </>
              ),
            },
          ].map(({ col, note }) => (
            <div key={col} className="flex gap-2.5 bg-slate-50 border border-[#E5E7EB] rounded-xl px-3.5 py-3 text-[12px] text-slate-600">
              <span className="font-mono text-slate-300 shrink-0 pt-px">#</span>
              <div>
                <span className="font-semibold text-slate-700">{col}</span>
                <span className="text-slate-300 mx-1.5">—</span>
                <span>{note}</span>
              </div>
            </div>
          ))}
        </div>

      </div>{/* end font-inter wrapper */}
    </PageLayout>
  )
}
