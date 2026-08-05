import { useState, useEffect, useMemo, useRef } from 'react'
import { Link } from 'react-router-dom'
import PageLayout from '../components/layout/PageLayout'
import Reveal from '../components/ui/Reveal'

// ─── CONFIG ──────────────────────────────────────────────────────────────────
const SHEET_ID = '1aXZ2STMDwPa-zFeZj37aa_Ko4-IE5WYzIKKe3EMm8rs'
const GID      = '1476491661'
const CSV_URL  = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=${GID}`

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

// ─── HELPERS ─────────────────────────────────────────────────────────────────
function parseCSV(text) {
  const lines = text.trim().split(/\r?\n/)
  if (lines.length < 3) return []
  function parseLine(line) {
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
  // lines[0] is the grouping-label row ("by Design" / "by Strategic" / ...),
  // lines[1] is the real header row, data starts at lines[2].
  const headers = parseLine(lines[1])
  function resolveField(header) {
    for (const [field, aliases] of Object.entries(COL_MAP)) {
      if (aliases.some(a => a.toLowerCase() === header.toLowerCase())) return field
    }
    return null
  }
  const fieldMap = headers.map(h => resolveField(h))
  // Rows that only have Motion-stage data (e.g. BAU requests) sometimes carry
  // their identifying name in Final Asset Name instead of Brand, with Brand
  // left blank — filtering on `r.brand` alone silently dropped those rows
  // entirely. Keep any row that has data in at least one field instead, and
  // only discard genuinely blank sheet rows.
  return lines.slice(2).map((line, idx) => {
    const cells = parseLine(line)
    const row = { id: `sheet-${idx + 1}` }
    fieldMap.forEach((field, i) => { if (field) row[field] = cells[i] ?? '' })
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

// ─── DESIGN TOKENS ───────────────────────────────────────────────────────────
const DEFAULT_BADGE = 'bg-slate-100 text-slate-600 ring-1 ring-slate-200'

const OPERATIONAL_CONFIG = {
  Excellence: 'bg-green-50 text-green-700 ring-1 ring-green-200',
  Good:       'bg-blue-50 text-blue-700 ring-1 ring-blue-200',
  Bad:        'bg-red-50 text-red-700 ring-1 ring-red-200',
}

const DIFFICULTY_CONFIG = {
  Low:    'bg-green-50 text-green-700 ring-1 ring-green-200',
  Medium: 'bg-orange-50 text-orange-700 ring-1 ring-orange-200',
  High:   'bg-red-50 text-red-700 ring-1 ring-red-200',
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

// When Status Motion is blank but the stages that feed into it are already
// done, the row isn't really "empty" — it's ready and simply waiting on the
// Motion team. Surface that instead of a bare "—" so a finished upstream
// request doesn't read as untouched. If Status Motion already has its own
// value (including a value from a row with no Design/Strategic data at all),
// that value is left as-is.
function deriveMotionStatus(row) {
  const raw = row.statusMotion
  if (classifyStatus(raw) !== 'empty') return raw
  const designDone    = classifyStatus(row.statusDesign) === 'done'
  const stratRequired = (row.withStrategic ?? '').trim().toLowerCase() === 'yes'
  const stratDone      = classifyStatus(row.statusStrat) === 'done'
  const upstreamReady  = designDone && (!stratRequired || stratDone)
  return upstreamReady ? 'Waiting for Motion' : raw
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

const DIFFICULTY_ORDER   = { Low: 0, Medium: 1, High: 2 }
const OPERATIONAL_ORDER  = { Bad: 0, Good: 1, Excellence: 2 }

// Shared badge class — 6px top/bottom (py-1.5), 10px left/right (px-2.5), rounded-full, 12px/600
const BADGE = 'inline-flex items-center gap-1 py-1.5 px-2.5 rounded-full text-[12px] font-semibold leading-none transition-colors duration-150'

// Shared filter chip class
const CHIP_BASE  = 'h-9 px-4 rounded-xl text-[13px] font-medium border transition-all duration-150 ease-out whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-1'
const CHIP_OFF   = 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:border-slate-300'
const CHIP_ON    = 'bg-brand-600 text-white border-brand-600 shadow-sm'

// ─── TAB / COLUMN SPECS ──────────────────────────────────────────────────────
// Every tab leads with Month Request / Req. Date / Brand and trails with
// Remark — these are cross-team identity/notes columns, not exclusive to
// one work category (matches the sheet's own "by All Team" grouping for
// Remark, and the team's explicit call for the identity columns).
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
    columns: [
      ...IDENTITY_COLUMNS,
      { key: 'finalAssetName',   label: 'Final Asset Name', type: 'text-strong' },
      { key: 'motionPIC',        label: 'Motion PIC',       type: 'text' },
      { key: 'typeOfCampaign',   label: 'Campaign',         type: 'text' },
      { key: 'applyDate',        label: 'Apply Date',       type: 'date' },
      { key: 'motionDifficulty', label: 'Difficulty',       type: 'badge-difficulty' },
      { key: 'motionRevision',   label: 'Revision',         type: 'number' },
      { key: 'statusMotion',     label: 'Status',           type: 'badge-generic' },
      { key: 'linkMotion',       label: 'File',             type: 'link' },
      REMARK_COLUMN,
    ],
  },
]

const DATE_SORT_KEYS    = new Set(['reqDate', 'dueDate', 'submissionDate', 'applyDate'])
const NUMERIC_SORT_KEYS = new Set(['reqQty', 'outputQty', 'workingDay', 'designRevision', 'stratRevision', 'motionRevision'])

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
    setSortKey('reqDate')
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

  const isLoading   = rawData === null && fetchError === null
  const isLive      = rawData !== null && rawData.length > 0
  const displayData = isLive ? rawData : SEED_DATA

  const allMonths = useMemo(() => {
    const seen = new Set(FIXED_MONTHS)
    displayData.forEach(r => {
      const sk = getMonthKey(r.reqDate), ek = getMonthKey(r.dueDate), ak = getMonthKey(r.applyDate)
      if (sk) seen.add(sk); if (ek) seen.add(ek); if (ak) seen.add(ak)
    })
    return Array.from(seen).sort()
  }, [displayData])

  const brands = useMemo(
    () => Array.from(new Set(displayData.map(r => r.brand).filter(Boolean))).sort((a, b) => a.localeCompare(b, 'id')),
    [displayData],
  )

  const typesOfContent = useMemo(
    () => Array.from(new Set(displayData.map(r => r.typeOfContent).filter(Boolean))).sort((a, b) => a.localeCompare(b, 'id')),
    [displayData],
  )

  const filtered = useMemo(
    () => displayData.filter(row => {
      const matchTS = filterTaksSource === 'semua' || row.taksSource === filterTaksSource
      const matchTC = filterTypeOfContent.length === 0 || filterTypeOfContent.includes(row.typeOfContent)
      const matchDf = filterDifficulty === 'semua' || row.designDifficulty === filterDifficulty
      const matchOp = filterOperational === 'semua' || row.operationalExcellence === filterOperational
      const matchB  = filterBrand === 'semua' || (row.brand ?? '').toLowerCase() === filterBrand.toLowerCase()
      const matchMReq   = filterBulanReq.length === 0 || filterBulanReq.some(k => reqMonthOverlaps(row, k))
      const matchMApply = filterBulanApply.length === 0 || filterBulanApply.some(k => applyMonthOverlaps(row, k))
      let matchC = true
      if (filterCampaign !== 'semua') {
        const k = (row.typeOfCampaign ?? '').toLowerCase()
        const isPayDay = k.includes('payday'), isBaU = k.includes('bau'), isDD = k.includes('dd')
        if (filterCampaign === 'PayDay') matchC = isPayDay
        else if (filterCampaign === 'BaU') matchC = isBaU
        else if (filterCampaign === 'DD') matchC = isDD
        else if (filterCampaign === 'Other') matchC = !isPayDay && !isBaU && !isDD
      }
      return matchTS && matchTC && matchDf && matchOp && matchB && matchMReq && matchMApply && matchC
    }),
    [displayData, filterTaksSource, filterTypeOfContent, filterDifficulty, filterOperational, filterBrand, filterBulanReq, filterBulanApply, filterCampaign],
  )

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

  const operationalCounts = useMemo(() => {
    const c = { Excellence: 0, Good: 0, Bad: 0 }
    displayData.forEach(r => { if (c[r.operationalExcellence] !== undefined) c[r.operationalExcellence]++ })
    return c
  }, [displayData])

  // ── STAT CARDS config ──
  const STAT_CARDS = [
    { key: 'Excellence', label: 'Excellence', dot: '🟢', num: 'text-green-700', bg: 'bg-white border-green-100', sub: 'text-green-600' },
    { key: 'Good',       label: 'Good',       dot: '🔵', num: 'text-blue-700',  bg: 'bg-white border-blue-100',  sub: 'text-blue-600'  },
    { key: 'Bad',        label: 'Bad',        dot: '🔴', num: 'text-red-700',   bg: 'bg-white border-red-100',   sub: 'text-red-600'   },
  ]

  return (
    <PageLayout maxWidthClassName="max-w-none">
      {/* ── SCOPED INTER FONT wrapper ── */}
      <div className="font-inter">

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
            {fetchError === 'sheet-empty'
              ? <>Sheet masih kosong — tambahkan data di Google Sheets lalu refresh.</>
              : <>SEED — gagal memuat dari Sheets ({fetchError}). Set sheet ke <em>Anyone with the link can view</em> lalu refresh.</>
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
                  {s === 'semua' ? `Semua (${displayData.length})` : `${s} (${operationalCounts[s]})`}
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
          <div className="overflow-x-auto border border-[#E5E7EB] rounded-xl shadow-[0_1px_2px_rgba(16,24,40,.05)]">
            <table className="w-full text-left border-collapse">
              <thead className="sticky top-14 z-10">
                <tr className="bg-slate-50 border-b border-[#E5E7EB]">
                  {activeTabConfig.columns.map(col => {
                    const sortable = col.type !== 'link'
                    return (
                      <th key={col.key} onClick={sortable ? () => handleSort(col.key) : undefined}
                        className={`align-middle px-4 py-3 text-[13px] font-semibold text-slate-500 uppercase tracking-[0.06em] select-none transition-colors duration-150 whitespace-nowrap ${
                          sortable ? 'cursor-pointer hover:text-slate-700 hover:bg-slate-100' : ''
                        }`}>
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
                  const displayRow = activeTab === 'motion' ? { ...row, statusMotion: deriveMotionStatus(row) } : row
                  const statusCat = statusCol ? classifyStatus(displayRow[statusCol.key]) : 'unknown'
                  const rowAccent = STATUS_CONFIG[statusCat].row
                  return (
                    <tr
                      key={row.id}
                      className={`transition-colors duration-150 ease-out hover:bg-slate-50 ${rowAccent} ${
                        isEven && statusCat === 'empty' ? 'bg-slate-50/30' : ''
                      }`}
                    >
                      {activeTabConfig.columns.map(col => (
                        <td key={col.key}
                          className={`px-4 py-0 h-[52px] align-middle ${
                            col.type === 'text-muted' ? 'text-[12px] text-slate-500 max-w-[160px]' : ''
                          } ${col.type === 'date' || col.type === 'number' || col.type.startsWith('badge') || col.type === 'yes-no' ? 'whitespace-nowrap' : ''} ${
                            col.type === 'date' ? 'font-mono text-[12px] text-slate-500' : ''
                          }`}>
                          {renderCell(displayRow, col, statusCat)}
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
            { col: 'Tab',           note: 'Tiga tab — By Design, By Strategic, By Motion to OP — menampilkan kolom yang relevan untuk tiap kategori kerja dari satu data yang sama (satu kali fetch). Month Request, Req. Date, Brand, dan Remark tampil di semua tab karena bersifat identitas/lintas tim.' },
            { col: 'Status',        note: 'Kolom Status Strat / Status Design / Status Motion menampilkan nilai apa adanya dari sheet, diwarnai otomatis berdasarkan kata kunci: hijau (Done/Selesai), biru (On Progress), kuning (Waiting/Approval), merah (Blocked/Issue). Baris yang Done ditandai border hijau dan teks tebal agar langsung kelihatan pas scroll. Kosong berarti tahap tersebut belum diisi timnya. Khusus tab By Motion to OP: kalau Status Motion masih kosong tapi Design (dan Strategic, kalau dipakai) sudah Done, statusnya otomatis tampil "Waiting for Motion" — menandakan request sudah siap dikerjakan tim Motion.' },
            { col: 'Excellence',    note: 'Kolom Operational Exellence dari sheet (tab By Design): Excellence, Good, atau Bad.' },
            { col: 'Difficulty',    note: 'Design Difficulty (tab By Design) dan Motion Difficulty (tab By Motion to OP) dari sheet: Low, Medium, atau High.' },
            { col: 'Final Asset Name', note: 'Nama aset final dari sheet — tampil di tab By Design maupun By Motion to OP, kosong sampai request mencapai tahap yang mengisinya.' },
            { col: 'Source',        note: 'Kolom Taks Source dari sheet: Ecommerce atau Orca — sumber sistem request, bukan platform siaran.' },
            { col: 'Campaign',      note: 'Kolom Type of Campaign dari sheet, dipakai juga untuk filter Campaign (PayDay / BaU / DD / Other). Masih kosong di sebagian besar data karena tahap Motion belum berjalan.' },
            { col: 'Sort',          note: 'Default sort mengikuti Req. Date secara ascending, dan direset tiap kali ganti tab agar indikator sort tidak menunjuk ke kolom yang tidak ditampilkan di tab tersebut.' },
            { col: 'Remark',        note: 'Kolom Remark (Wardrobe, Gimmick, Concern on Live) dari sheet — catatan bebas, tampil di semua tab.' },
            { col: 'Filter Bulan',  note: 'Dua dropdown terpisah berdampingan — "Req/Due" mem-filter berdasarkan periode Req.–Due Date (kerja Design/Strategic), "Apply" mem-filter berdasarkan Apply Date (kerja Motion). Masing-masing bisa pilih lebih dari satu bulan, tersedia Januari 2025–Desember 2026, dan berlaku lintas tab. Dipisah karena satu request bisa punya bulan Req./Due dan bulan Apply yang berbeda — request yang baru punya Apply Date (belum ada Req./Due dari Design) tetap muncul lewat filter Apply tanpa perlu data di tab lain.' },
            {
              col: 'Setup Sheets',
              note: (
                <>
                  Sheet harus di-set <strong>Share → Anyone with the link → Viewer</strong> agar fetch berjalan.{' '}
                  <a href="https://docs.google.com/spreadsheets/d/1aXZ2STMDwPa-zFeZj37aa_Ko4-IE5WYzIKKe3EMm8rs/edit#gid=1476491661"
                    target="_blank" rel="noopener noreferrer" className="text-brand-600 hover:underline transition-colors duration-150">
                    Buka Google Sheets — tab 2026 →
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
