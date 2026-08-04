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
  reqDate:               ['Req. Date'],
  brand:                 ['Brand'],
  withStrategic:         ['With Strategic Concept'],
  stratPIC:              ['Strat PIC'],
  designPIC:             ['Design PIC'],
  typeOfContent:         ['Type of Content'],
  taksSource:            ['Taks Source'],
  dueDate:               ['Due Date'],
  operationalExcellence: ['Operational Exellence'],
  designDifficulty:      ['Design Difficulty'],
  statusStrat:           ['Status Strat'],
  statusDesign:          ['Status Design'],
  finalAssetName:        ['Final Asset Name'],
  motionPIC:             ['Motion PIC'],
  typeOfCampaign:        ['Type of Campaign'],
  applyDate:             ['Apply Date'],
  motionDifficulty:      ['Motion Difficulty'],
  statusMotion:          ['Status Motion'],
  linkMotion:            ['Link Motion'],
  remark:                ['Remark (Wardrobe, Gimmick, Concern on Live)'],
}

const SEED_DATA = [
  {
    id: 'seed-1',
    reqDate: '03/11/2025',
    brand: 'Greenfields',
    withStrategic: '',
    stratPIC: '',
    designPIC: 'Alfie',
    typeOfContent: 'Mockup',
    taksSource: 'Orca',
    dueDate: '06/11/2025',
    operationalExcellence: 'Excellence',
    designDifficulty: 'High',
    statusStrat: '',
    statusDesign: '',
    finalAssetName: '',
    motionPIC: '',
    typeOfCampaign: '',
    applyDate: '',
    motionDifficulty: '',
    statusMotion: '',
    linkMotion: '',
    remark: '',
  },
  {
    id: 'seed-2',
    reqDate: '07/11/2025',
    brand: 'Quaker',
    withStrategic: '',
    stratPIC: '',
    designPIC: 'Nadya A',
    typeOfContent: 'Mockup',
    taksSource: 'Orca',
    dueDate: '10/11/2025',
    operationalExcellence: 'Good',
    designDifficulty: 'High',
    statusStrat: 'Done',
    statusDesign: '',
    finalAssetName: '',
    motionPIC: '',
    typeOfCampaign: '',
    applyDate: '',
    motionDifficulty: '',
    statusMotion: '',
    linkMotion: '',
    remark: '',
  },
  {
    id: 'seed-3',
    reqDate: '05/11/2025',
    brand: 'DuaBelibis',
    withStrategic: 'Yes',
    stratPIC: 'Nadya A',
    designPIC: 'Alfie',
    typeOfContent: 'Banner Marketplace',
    taksSource: 'Ecommerce',
    dueDate: '08/11/2025',
    operationalExcellence: 'Bad',
    designDifficulty: 'Medium',
    statusStrat: 'Done',
    statusDesign: '',
    finalAssetName: '',
    motionPIC: '',
    typeOfCampaign: '',
    applyDate: '',
    motionDifficulty: '',
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
  return lines.slice(2).map((line, idx) => {
    const cells = parseLine(line)
    const row = { id: `sheet-${idx + 1}` }
    fieldMap.forEach((field, i) => { if (field) row[field] = cells[i] ?? '' })
    return row
  }).filter(r => r.brand)
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

function monthOverlaps(reqDate, dueDate, monthKey) {
  const [year, month] = monthKey.split('-').map(Number)
  const mStart = new Date(year, month - 1, 1)
  const mEnd   = new Date(year, month, 0, 23, 59, 59)
  const s = new Date(normalizeDate(reqDate))
  const e = new Date(normalizeDate(dueDate || reqDate))
  if (isNaN(s) && isNaN(e)) return false
  const start = isNaN(s) ? e : s
  const end   = isNaN(e) ? s : e
  return start <= mEnd && end >= mStart
}

function getActivePIC(row) {
  return row.motionPIC || row.designPIC || row.stratPIC || ''
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

// Status Strat / Status Design / Status Motion carry freeform sheet values —
// only "Done" is populated in the source data today, so this stays generic
// rather than hardcoding a full enum that doesn't exist yet.
const KNOWN_STATUS_BADGE = {
  Done: 'bg-green-50 text-green-700 ring-1 ring-green-200',
}
function statusBadgeClass(value) {
  return KNOWN_STATUS_BADGE[value] ?? DEFAULT_BADGE
}

const DIFFICULTY_ORDER   = { Low: 0, Medium: 1, High: 2 }
const OPERATIONAL_ORDER  = { Bad: 0, Good: 1, Excellence: 2 }

// Shared badge class — 6px top/bottom (py-1.5), 10px left/right (px-2.5), rounded-full, 12px/600
const BADGE = 'inline-flex items-center gap-1 py-1.5 px-2.5 rounded-full text-[12px] font-semibold leading-none transition-colors duration-150'

// Shared filter chip class
const CHIP_BASE  = 'h-9 px-4 rounded-xl text-[13px] font-medium border transition-all duration-150 ease-out whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-1'
const CHIP_OFF   = 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:border-slate-300'
const CHIP_ON    = 'bg-brand-600 text-white border-brand-600 shadow-sm'

// ─── COMPONENT ───────────────────────────────────────────────────────────────
export default function CampaignSchedule() {
  const [rawData, setRawData]       = useState(null)
  const [fetchError, setFetchError] = useState(null)
  const [filterTaksSource,   setFilterTaksSource]   = useState('semua')
  const [filterTypeOfContent,setFilterTypeOfContent]= useState('semua')
  const [filterDifficulty,   setFilterDifficulty]   = useState('semua')
  const [filterOperational,  setFilterOperational]  = useState('semua')
  const [filterBrand,        setFilterBrand]        = useState('semua')
  const [filterBulan,        setFilterBulan]        = useState('semua')
  const [filterCampaign,     setFilterCampaign]     = useState('semua')
  const [brandOpen,          setBrandOpen]          = useState(false)
  const [brandSearch,        setBrandSearch]        = useState('')
  const brandRef = useRef(null)
  const [sortKey, setSortKey] = useState('dueDate')
  const [sortDir, setSortDir] = useState('asc')

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
    }
    document.addEventListener('mousedown', handleOutside)
    return () => document.removeEventListener('mousedown', handleOutside)
  }, [])

  const isLoading   = rawData === null && fetchError === null
  const isLive      = rawData !== null && rawData.length > 0
  const displayData = isLive ? rawData : SEED_DATA

  const allMonths = useMemo(() => {
    const seen = new Set()
    displayData.forEach(r => {
      const sk = getMonthKey(r.reqDate), ek = getMonthKey(r.dueDate)
      if (sk) seen.add(sk); if (ek) seen.add(ek)
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
      const matchTC = filterTypeOfContent === 'semua' || row.typeOfContent === filterTypeOfContent
      const matchDf = filterDifficulty === 'semua' || row.designDifficulty === filterDifficulty
      const matchOp = filterOperational === 'semua' || row.operationalExcellence === filterOperational
      const matchB  = filterBrand === 'semua' || (row.brand ?? '').toLowerCase() === filterBrand.toLowerCase()
      const matchM  = filterBulan === 'semua' || monthOverlaps(row.reqDate, row.dueDate, filterBulan)
      let matchC = true
      if (filterCampaign !== 'semua') {
        const k = (row.typeOfCampaign ?? '').toLowerCase()
        const isPayDay = k.includes('payday'), isBaU = k.includes('bau'), isDD = k.includes('dd')
        if (filterCampaign === 'PayDay') matchC = isPayDay
        else if (filterCampaign === 'BaU') matchC = isBaU
        else if (filterCampaign === 'DD') matchC = isDD
        else if (filterCampaign === 'Other') matchC = !isPayDay && !isBaU && !isDD
      }
      return matchTS && matchTC && matchDf && matchOp && matchB && matchM && matchC
    }),
    [displayData, filterTaksSource, filterTypeOfContent, filterDifficulty, filterOperational, filterBrand, filterBulan, filterCampaign],
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
      if (sortKey === 'reqDate' || sortKey === 'dueDate') {
        av = new Date(normalizeDate(a[sortKey] ?? '')).getTime() || 0
        bv = new Date(normalizeDate(b[sortKey] ?? '')).getTime() || 0
      } else if (sortKey === 'designDifficulty') {
        av = DIFFICULTY_ORDER[a[sortKey]] ?? -1; bv = DIFFICULTY_ORDER[b[sortKey]] ?? -1
      } else if (sortKey === 'operationalExcellence') {
        av = OPERATIONAL_ORDER[a[sortKey]] ?? -1; bv = OPERATIONAL_ORDER[b[sortKey]] ?? -1
      } else {
        av = (a[sortKey] ?? '').toString(); bv = (b[sortKey] ?? '').toString()
      }
      const cmp = typeof av === 'number' ? av - bv : av.localeCompare(bv, 'id', { sensitivity: 'base' })
      return sortDir === 'asc' ? cmp : -cmp
    })
  }, [filtered, sortKey, sortDir])

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

          {/* Bulan — horizontal scrollable pills */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold text-slate-400 tracking-[0.08em] uppercase w-28 shrink-0">Bulan</span>
            <div className="flex gap-1.5 overflow-x-auto pb-0.5" style={{ scrollbarWidth: 'thin' }}>
              <button onClick={() => setFilterBulan('semua')}
                className={`${CHIP_BASE} shrink-0 ${filterBulan === 'semua' ? CHIP_ON : CHIP_OFF}`}>
                Semua
              </button>
              {allMonths.map(k => (
                <button key={k} onClick={() => setFilterBulan(k)}
                  className={`${CHIP_BASE} shrink-0 ${filterBulan === k ? CHIP_ON : CHIP_OFF}`}>
                  {formatMonthLabel(k)}
                </button>
              ))}
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

          {/* Type of Content */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-semibold text-slate-400 tracking-[0.08em] uppercase w-28 shrink-0">Konten</span>
            <div className="flex flex-wrap gap-1.5">
              <button onClick={() => setFilterTypeOfContent('semua')}
                className={`${CHIP_BASE} ${filterTypeOfContent === 'semua' ? CHIP_ON : CHIP_OFF}`}>
                Semua
              </button>
              {typesOfContent.map(t => (
                <button key={t} onClick={() => setFilterTypeOfContent(t)}
                  className={`${CHIP_BASE} ${filterTypeOfContent === t ? CHIP_ON : CHIP_OFF}`}>
                  {t}
                </button>
              ))}
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

        {/* ── TABLE ── */}
        {sorted.length === 0 ? (
          <div className="text-center py-16 text-slate-400 text-[14px] border border-[#E5E7EB] rounded-xl bg-slate-50">
            Tidak ada request yang cocok dengan filter yang dipilih.
          </div>
        ) : (
          <div className="overflow-x-auto border border-[#E5E7EB] rounded-xl shadow-[0_1px_2px_rgba(16,24,40,.05)]">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-[#E5E7EB]">
                  {/* Status group */}
                  <th colSpan={3}
                    className="px-4 py-2 text-[13px] font-semibold text-slate-500 uppercase tracking-[0.06em] text-center border-b border-[#E5E7EB]">
                    Status
                  </th>
                  {/* Operational Excellence — rowspan 2 */}
                  <th rowSpan={2} onClick={() => handleSort('operationalExcellence')}
                    className="align-middle px-4 py-3 text-[13px] font-semibold text-slate-500 uppercase tracking-[0.06em] select-none cursor-pointer hover:text-slate-700 hover:bg-slate-100 transition-colors duration-150 whitespace-nowrap">
                    <span className="flex items-center gap-1">
                      Excellence
                      <span className="text-[10px] opacity-50">{sortKey === 'operationalExcellence' ? (sortDir === 'asc' ? '↑' : '↓') : '↕'}</span>
                    </span>
                  </th>
                  {/* Design Difficulty — rowspan 2 */}
                  <th rowSpan={2} onClick={() => handleSort('designDifficulty')}
                    className="align-middle px-4 py-3 text-[13px] font-semibold text-slate-500 uppercase tracking-[0.06em] select-none cursor-pointer hover:text-slate-700 hover:bg-slate-100 transition-colors duration-150 whitespace-nowrap">
                    <span className="flex items-center gap-1">
                      Difficulty
                      <span className="text-[10px] opacity-50">{sortKey === 'designDifficulty' ? (sortDir === 'asc' ? '↑' : '↓') : '↕'}</span>
                    </span>
                  </th>
                  {/* Period group */}
                  <th colSpan={2}
                    className="px-4 py-2 text-[13px] font-semibold text-slate-500 uppercase tracking-[0.06em] text-center border-b border-[#E5E7EB]">
                    Period
                  </th>
                  {/* Other columns */}
                  {[
                    { label: 'Final Asset Name', key: 'finalAssetName' },
                    { label: 'Brand',            key: 'brand'          },
                    { label: 'Type of Content',  key: 'typeOfContent'  },
                    { label: 'Source',           key: 'taksSource'     },
                    { label: 'PIC',              key: null             },
                    { label: 'Campaign',         key: 'typeOfCampaign' },
                    { label: 'Apply Date',       key: 'applyDate'      },
                    { label: 'Remark',           key: null             },
                    { label: 'Studio',           key: null             },
                    { label: 'Host Brief',       key: null             },
                    { label: 'File',             key: null             },
                  ].map(col => (
                    <th key={col.label} rowSpan={2}
                      onClick={col.key ? () => handleSort(col.key) : undefined}
                      className={`align-middle px-4 py-3 text-[13px] font-semibold text-slate-500 uppercase tracking-[0.06em] select-none transition-colors duration-150 whitespace-nowrap ${
                        col.key ? 'cursor-pointer hover:text-slate-700 hover:bg-slate-100' : ''
                      }`}>
                      <span className="flex items-center gap-1">
                        {col.label}
                        {col.key && (
                          <span className="text-[10px] opacity-50">
                            {sortKey === col.key ? (sortDir === 'asc' ? '↑' : '↓') : '↕'}
                          </span>
                        )}
                      </span>
                    </th>
                  ))}
                </tr>
                <tr className="bg-slate-50 border-b border-[#E5E7EB]">
                  <th className="px-4 py-2.5 text-[13px] font-semibold text-slate-500 uppercase tracking-[0.06em] whitespace-nowrap">Strat</th>
                  <th className="px-4 py-2.5 text-[13px] font-semibold text-slate-500 uppercase tracking-[0.06em] whitespace-nowrap">Design</th>
                  <th className="px-4 py-2.5 text-[13px] font-semibold text-slate-500 uppercase tracking-[0.06em] whitespace-nowrap">Motion</th>
                  <th onClick={() => handleSort('reqDate')}
                    className="px-4 py-2.5 text-[13px] font-semibold text-slate-500 uppercase tracking-[0.06em] select-none cursor-pointer hover:text-slate-700 hover:bg-slate-100 transition-colors duration-150 whitespace-nowrap">
                    <span className="flex items-center gap-1">
                      Req.
                      <span className="text-[10px] opacity-50">{sortKey === 'reqDate' ? (sortDir === 'asc' ? '↑' : '↓') : '↕'}</span>
                    </span>
                  </th>
                  <th onClick={() => handleSort('dueDate')}
                    className="px-4 py-2.5 text-[13px] font-semibold text-slate-500 uppercase tracking-[0.06em] select-none cursor-pointer hover:text-slate-700 hover:bg-slate-100 transition-colors duration-150 whitespace-nowrap">
                    <span className="flex items-center gap-1">
                      Due
                      <span className="text-[10px] opacity-50">{sortKey === 'dueDate' ? (sortDir === 'asc' ? '↑' : '↓') : '↕'}</span>
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {sorted.map((row, idx) => {
                  const isEven = idx % 2 === 1
                  const pic = getActivePIC(row)
                  return (
                    <tr
                      key={row.id}
                      className={`transition-colors duration-150 ease-out hover:bg-slate-50 ${isEven ? 'bg-slate-50/30' : ''}`}
                    >
                      {/* Status Strat */}
                      <td className="px-4 py-0 h-[52px] align-middle whitespace-nowrap">
                        {row.statusStrat
                          ? <span className={`${BADGE} ${statusBadgeClass(row.statusStrat)}`}>{row.statusStrat}</span>
                          : <span className="text-slate-300 text-[13px]">—</span>}
                      </td>
                      {/* Status Design */}
                      <td className="px-4 py-0 h-[52px] align-middle whitespace-nowrap">
                        {row.statusDesign
                          ? <span className={`${BADGE} ${statusBadgeClass(row.statusDesign)}`}>{row.statusDesign}</span>
                          : <span className="text-slate-300 text-[13px]">—</span>}
                      </td>
                      {/* Status Motion */}
                      <td className="px-4 py-0 h-[52px] align-middle whitespace-nowrap">
                        {row.statusMotion
                          ? <span className={`${BADGE} ${statusBadgeClass(row.statusMotion)}`}>{row.statusMotion}</span>
                          : <span className="text-slate-300 text-[13px]">—</span>}
                      </td>
                      {/* Operational Excellence */}
                      <td className="px-4 py-0 h-[52px] align-middle whitespace-nowrap">
                        {row.operationalExcellence
                          ? <span className={`${BADGE} ${OPERATIONAL_CONFIG[row.operationalExcellence] ?? DEFAULT_BADGE}`}>{row.operationalExcellence}</span>
                          : <span className="text-slate-300 text-[13px]">—</span>}
                      </td>
                      {/* Design Difficulty */}
                      <td className="px-4 py-0 h-[52px] align-middle whitespace-nowrap">
                        {row.designDifficulty
                          ? <span className={`${BADGE} ${DIFFICULTY_CONFIG[row.designDifficulty] ?? DEFAULT_BADGE}`}>{row.designDifficulty}</span>
                          : <span className="text-slate-300 text-[13px]">—</span>}
                      </td>
                      {/* Req Date */}
                      <td className="px-4 py-0 h-[52px] align-middle whitespace-nowrap font-mono text-[12px] text-slate-700 font-semibold">
                        {formatDate(row.reqDate) || <span className="text-slate-300 font-normal">—</span>}
                      </td>
                      {/* Due Date */}
                      <td className="px-4 py-0 h-[52px] align-middle whitespace-nowrap font-mono text-[12px] text-slate-500">
                        {formatDate(row.dueDate) || <span className="text-slate-300">—</span>}
                      </td>
                      {/* Final Asset Name */}
                      <td className="px-4 py-0 h-[52px] align-middle">
                        <div className="text-[14px] leading-snug font-medium text-slate-800">
                          {row.finalAssetName || `${row.brand} — ${row.typeOfContent || 'Request'}`}
                        </div>
                      </td>
                      {/* Brand */}
                      <td className="px-4 py-0 h-[52px] align-middle whitespace-nowrap">
                        {row.brand
                          ? <span className={`${BADGE} bg-slate-100 text-slate-600 ring-1 ring-slate-200`}>{row.brand}</span>
                          : <span className="text-slate-300 text-[13px]">—</span>}
                      </td>
                      {/* Type of Content */}
                      <td className="px-4 py-0 h-[52px] align-middle text-[14px] text-slate-600 font-medium">
                        {row.typeOfContent || <span className="text-slate-300">—</span>}
                      </td>
                      {/* Taks Source */}
                      <td className="px-4 py-0 h-[52px] align-middle whitespace-nowrap">
                        {row.taksSource
                          ? <span className={`${BADGE} ${TAKS_SOURCE_CONFIG[row.taksSource] ?? DEFAULT_BADGE}`}>{row.taksSource}</span>
                          : <span className="text-slate-300 text-[13px]">—</span>}
                      </td>
                      {/* PIC */}
                      <td className="px-4 py-0 h-[52px] align-middle whitespace-nowrap text-[13px] text-slate-600">
                        {pic || <span className="text-slate-300">—</span>}
                      </td>
                      {/* Type of Campaign */}
                      <td className="px-4 py-0 h-[52px] align-middle text-[14px] text-slate-600 font-medium">
                        {row.typeOfCampaign || <span className="text-slate-300">—</span>}
                      </td>
                      {/* Apply Date */}
                      <td className="px-4 py-0 h-[52px] align-middle whitespace-nowrap font-mono text-[12px] text-slate-500">
                        {formatDate(row.applyDate) || <span className="text-slate-300">—</span>}
                      </td>
                      {/* Remark */}
                      <td className="px-4 py-0 h-[52px] align-middle text-[12px] text-slate-500 max-w-[160px]">
                        {row.remark || <span className="text-slate-300">—</span>}
                      </td>
                      {/* Studio — manual field, no source column in the sheet yet */}
                      <td className="px-4 py-0 h-[52px] align-middle text-[12px] text-slate-300">
                        —
                      </td>
                      {/* Host Brief — manual field, no source column in the sheet yet */}
                      <td className="px-4 py-0 h-[52px] align-middle text-[12px] text-slate-300">
                        —
                      </td>
                      {/* File */}
                      <td className="px-4 py-0 h-[52px] align-middle">
                        {row.linkMotion
                          ? <a href={row.linkMotion} target="_blank" rel="noopener noreferrer"
                              className="inline-flex items-center h-9 px-4 bg-brand-600 hover:bg-brand-700 text-white text-[13px] font-semibold rounded-lg transition-all duration-150 ease-out shadow-[0_1px_2px_rgba(16,24,40,.05)] whitespace-nowrap">
                              Buka →
                            </a>
                          : <span className="text-slate-300 text-[13px]">—</span>}
                      </td>
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
            { col: 'Status',        note: 'Tiga kolom terpisah — Strat, Design, Motion — menampilkan nilai apa adanya dari sheet (mis. "Done"). Kosong berarti tahap tersebut belum diisi timnya.' },
            { col: 'Excellence',    note: 'Kolom Operational Exellence dari sheet: Excellence, Good, atau Bad.' },
            { col: 'Difficulty',    note: 'Kolom Design Difficulty dari sheet: Low, Medium, atau High.' },
            { col: 'Final Asset Name', note: 'Nama aset final dari sheet. Kosong sampai request mencapai tahap Motion — sebelum itu ditampilkan sebagai "Brand — Type of Content".' },
            { col: 'Brand',         note: 'Nama brand pada request, langsung dari kolom Brand di sheet.' },
            { col: 'Type of Content', note: 'Jenis konten yang diminta: Mockup, Social Media, Banner Marketplace, PDP Marketplace, dsb.' },
            { col: 'Source',        note: 'Kolom Taks Source dari sheet: Ecommerce atau Orca — sumber sistem request, bukan platform siaran.' },
            { col: 'PIC',           note: 'PIC aktif pada tahap terakhir yang sudah dikerjakan: Motion PIC jika ada, lalu Design PIC, lalu Strat PIC.' },
            { col: 'Campaign',      note: 'Kolom Type of Campaign dari sheet, dipakai untuk filter Campaign (PayDay / BaU / DD / Other). Masih kosong di sebagian besar data karena tahap Motion belum berjalan.' },
            { col: 'Period',        note: 'Header "Period" menaungi 2 sub-kolom: Req. (Req. Date) & Due (Due Date). Sort tabel mengikuti Req. Date secara default.' },
            { col: 'Remark',        note: 'Kolom Remark (Wardrobe, Gimmick, Concern on Live) dari sheet — catatan bebas.' },
            { col: 'Studio',        note: 'Belum ada kolom sumber di sheet baru — field manual, belum bisa diisi lewat UI ini.' },
            { col: 'Host Brief',    note: 'Belum ada kolom sumber di sheet baru — field manual, belum bisa diisi lewat UI ini.' },
            { col: 'File',          note: 'Tautan dari kolom Link Motion. Kosong jika file belum diupload atau request belum sampai tahap Motion.' },
            { col: 'Filter Bulan',  note: 'Tampil otomatis dari data — tiap bulan baru di sheet muncul sebagai pill baru ke kanan. Filter menampilkan request yang periodenya (Req.–Due) tumpang tindih dengan bulan tersebut.' },
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
