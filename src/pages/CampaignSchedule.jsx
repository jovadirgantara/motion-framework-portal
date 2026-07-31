import { useState, useEffect, useMemo, useRef } from 'react'
import { Link } from 'react-router-dom'
import PageLayout from '../components/layout/PageLayout'
import Reveal from '../components/ui/Reveal'

// ─── CONFIG ──────────────────────────────────────────────────────────────────
const SHEET_ID = '17wR3rfsiRJjQPev1SHk55CPkvw6xzmLGdmAb2_OWUiQ'
const GID      = '0'
const CSV_URL  = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=${GID}`

const COL_MAP = {
  namaAset:      ['Nama Aset', 'nama aset', 'Nama', 'nama', 'Display Name'],
  brand:         ['Brand', 'brand', 'Merek', 'merek'],
  platform:      ['Platform', 'platform'],
  studio:        ['Studio', 'studio'],
  mockupType:    ['Tipe', 'tipe', 'Mockup Type', 'Type', 'type'],
  kampanye:      ['Kampanye', 'kampanye', 'Campaign', 'campaign'],
  periodeStart:  ['Periode Mulai', 'periode mulai', 'Mulai', 'mulai', 'Start', 'start', 'Tanggal Mulai'],
  periodeEnd:    ['Periode Selesai', 'periode selesai', 'Selesai', 'selesai', 'End', 'end', 'Tanggal Selesai'],
  jamTayang:     ['Jam Tayang', 'jam tayang', 'Jam', 'jam', 'Time', 'time'],
  statusMockup:  ['Status Mockup', 'status mockup', 'Mockup Status', 'mockup status'],
  statusMotion:  ['Status Motion', 'status motion', 'Motion Status', 'motion status'],
  linkFile:      ['Link File', 'link file', 'Link', 'link', 'File', 'Drive Link', 'drive link'],
  catatan:       ['Catatan', 'catatan', 'Notes', 'notes', 'Keterangan', 'keterangan'],
  hostBrief:     ['Host Brief', 'host brief', 'Briefing Host', 'briefing host', 'Host Briefing'],
}

const BRAND_LIST = [
  'FONTERRA', 'QUAKER', 'PHILIPS JAKARTA', 'WIZ', 'GREENFIELDS',
  'I-MEAL', 'KOEPOE-KOEPOE', 'DUA BELIBIS', 'BANANA BOAT',
  'SCHICK & INTUITION', 'PHILIPS SURABAYA', 'PCI', 'BATISTE',
  'MOIST DIANE', 'MUTOUCH', 'SCHWARZKOPF', 'PSL JAKARTA',
  'PSL SURABAYA', 'PURE PREMIUM', 'PRO BABY', 'DELFI', 'KOSE',
  'KCS', 'ALKAHFI', 'TWININGS', 'SOSRO', 'RUMAH TEH', 'SNICKERS',
  'OCTOPUS', 'NUTRIMART', 'MAMA HILO', 'SLEEK BABY', 'ELLIPS',
  'HILO TEEN', 'Hilo Official', 'MOMYPOKO ROYAL SOFT',
  'MOMYPOKO NEW BORN', 'CLICKS', 'KINO HAIR & BEAUTY CARE',
  'RECLOWW', 'BETADINE', 'PLOSSA', 'ASTRA OTOSHOP', 'UFS',
  'HUNT4TOYS', 'L-MEN',
]

const SEED_DATA = [
  {
    id: 'seed-1',
    namaAset: 'Preview [Shopee] Snickers Mingyu BaU',
    brand: 'SNICKERS',
    platform: 'Shopee Live',
    studio: 'Jakarta',
    mockupType: 'BaU',
    kampanye: 'Business as Usual – Juni',
    periodeStart: '2026-06-07',
    periodeEnd: '2026-06-24',
    jamTayang: '09:00 – 10:00',
    statusMockup: 'On AE',
    statusMotion: 'On Progress',
    linkFile: '',
    catatan: 'Kolaborasi Mingyu ENHYPEN',
    hostBrief: '',
  },
  {
    id: 'seed-2',
    namaAset: 'BG Sweety Festive PayDay',
    brand: '',
    platform: 'Shopee Live',
    studio: 'Bandung',
    mockupType: 'PayDay',
    kampanye: 'PayDay Juni',
    periodeStart: '2026-06-25',
    periodeEnd: '2026-06-30',
    jamTayang: '20:00 – 22:00',
    statusMockup: 'On Strat',
    statusMotion: 'Revision',
    linkFile: '',
    catatan: '',
    hostBrief: '',
  },
  {
    id: 'seed-3',
    namaAset: 'Preview [TikTok] L-MEN Period Pack',
    brand: 'L-MEN',
    platform: 'TikTok Shop',
    studio: 'Jakarta',
    mockupType: 'Period',
    kampanye: 'BaU – Multiple Period',
    periodeStart: '2026-06-01',
    periodeEnd: '2026-07-15',
    jamTayang: 'Sepanjang hari',
    statusMockup: 'On GD',
    statusMotion: 'Ready',
    linkFile: '',
    catatan: 'LVL 4 – multiple usage date',
    hostBrief: '',
  },
]

// ─── HELPERS ─────────────────────────────────────────────────────────────────
function parseCSV(text) {
  const lines = text.trim().split(/\r?\n/)
  if (lines.length < 2) return []
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
  const headers = parseLine(lines[0])
  function resolveField(header) {
    for (const [field, aliases] of Object.entries(COL_MAP)) {
      if (aliases.some(a => a.toLowerCase() === header.toLowerCase())) return field
    }
    return null
  }
  const fieldMap = headers.map(h => resolveField(h))
  return lines.slice(1).map((line, idx) => {
    const cells = parseLine(line)
    const row = { id: `sheet-${idx + 1}` }
    fieldMap.forEach((field, i) => { if (field) row[field] = cells[i] ?? '' })
    return row
  }).filter(r => r.namaAset)
}

function normalizeDate(str) {
  if (!str) return ''
  const m = str.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/)
  if (m) return `${m[3]}-${m[2].padStart(2,'0')}-${m[1].padStart(2,'0')}`
  return str
}

function normalizeStudio(str) {
  if (!str) return ''
  const s = str.trim().toLowerCase()
  if (s === 'jakarta') return 'Jakarta'
  if (s === 'bandung') return 'Bandung'
  return str.trim()
}

function getStatus(periodeStart, periodeEnd, statusMockup) {
  const today = new Date(); today.setHours(12, 0, 0, 0)
  const start = new Date(normalizeDate(periodeStart))
  const end   = new Date(normalizeDate(periodeEnd)); end.setHours(23, 59, 59)
  const isReady = (statusMockup ?? '').toLowerCase() === 'ready'
  if (today < start) return 'akan-datang'
  if (today > end)   return isReady ? 'kedaluwarsa' : 'missing'
  return isReady ? 'aktif' : 'belum-siap'
}

function formatDate(dateStr) {
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

function monthOverlaps(periodeStart, periodeEnd, monthKey) {
  const [year, month] = monthKey.split('-').map(Number)
  const mStart = new Date(year, month - 1, 1)
  const mEnd   = new Date(year, month, 0, 23, 59, 59)
  const s = new Date(normalizeDate(periodeStart))
  const e = new Date(normalizeDate(periodeEnd))
  if (isNaN(s) || isNaN(e)) return false
  return s <= mEnd && e >= mStart
}

// ─── DESIGN TOKENS ───────────────────────────────────────────────────────────
const STATUS_CONFIG = {
  missing:       { label: 'Missing',      dot: '⚫', badge: 'bg-slate-100 text-slate-600 ring-1 ring-slate-200' },
  'belum-siap':  { label: 'Belum Siap',   dot: '🟠', badge: 'bg-orange-50 text-orange-700 ring-1 ring-orange-200' },
  aktif:         { label: 'Aktif',        dot: '🟢', badge: 'bg-green-50 text-green-700 ring-1 ring-green-200' },
  'akan-datang': { label: 'Akan Datang',  dot: '🟡', badge: 'bg-yellow-50 text-yellow-700 ring-1 ring-yellow-200' },
  kedaluwarsa:   { label: 'Kedaluwarsa',  dot: '🔴', badge: 'bg-red-50 text-red-700 ring-1 ring-red-200' },
}

const STATUS_ORDER = { aktif: 0, 'akan-datang': 1, 'belum-siap': 2, kedaluwarsa: 3, missing: 4 }

const ROW_STATUS_BG = {
  missing:       'bg-slate-50/60',
  'belum-siap':  '',
  aktif:         'bg-green-50/40',
  'akan-datang': '',
  kedaluwarsa:   'bg-red-50/30',
}

const MOCKUP_STATUS_CONFIG = {
  'On GD':     { badge: 'bg-blue-50 text-blue-700 ring-1 ring-blue-200' },
  'On AE':     { badge: 'bg-purple-50 text-purple-700 ring-1 ring-purple-200' },
  'On Strat':  { badge: 'bg-orange-50 text-orange-700 ring-1 ring-orange-200' },
  'On Motion': { badge: 'bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200' },
  'Revision':  { badge: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200' },
  'Ready':     { badge: 'bg-green-50 text-green-700 ring-1 ring-green-200' },
}

const DEFAULT_BADGE = 'bg-slate-100 text-slate-600 ring-1 ring-slate-200'

function getPlatformBadge(platform) {
  const p = (platform ?? '').toLowerCase()
  if (p.includes('shopee') && p.includes('tiktok')) return 'bg-purple-50 text-purple-700 ring-1 ring-purple-200'
  if (p.includes('shopee')) return 'bg-orange-50 text-orange-700 ring-1 ring-orange-200'
  if (p.includes('tiktok')) return 'bg-slate-100 text-slate-700 ring-1 ring-slate-200'
  return DEFAULT_BADGE
}

const STUDIO_CONFIG = {
  bandung: 'bg-blue-50 text-blue-700 ring-1 ring-blue-200',
  jakarta: 'bg-pink-50 text-pink-700 ring-1 ring-pink-200',
}

const MOCKUP_TYPE_CONFIG = {
  bau:    'bg-green-50 text-green-700 ring-1 ring-green-200',
  dd:     'bg-blue-50 text-blue-700 ring-1 ring-blue-200',
  payday: 'bg-orange-50 text-orange-700 ring-1 ring-orange-200',
}

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
  const [filterPlatform,     setFilterPlatform]     = useState('semua')
  const [filterStatus,       setFilterStatus]       = useState('semua')
  const [filterStatusMockup, setFilterStatusMockup] = useState('semua')
  const [filterStudio,       setFilterStudio]       = useState('semua')
  const [filterBrand,        setFilterBrand]        = useState('semua')
  const [filterBulan,        setFilterBulan]        = useState('semua')
  const [filterCampaign,     setFilterCampaign]     = useState('semua')
  const [brandOpen,          setBrandOpen]          = useState(false)
  const [brandSearch,        setBrandSearch]        = useState('')
  const brandRef = useRef(null)
  const [sortKey, setSortKey] = useState('status')
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

  const enriched = useMemo(
    () => displayData.map(row => ({
      ...row,
      studio: normalizeStudio(row.studio),
      status: getStatus(row.periodeStart, row.periodeEnd, row.statusMockup),
    })),
    [displayData],
  )

  const allMonths = useMemo(() => {
    const seen = new Set()
    displayData.forEach(r => {
      const sk = getMonthKey(r.periodeStart), ek = getMonthKey(r.periodeEnd)
      if (sk) seen.add(sk); if (ek) seen.add(ek)
    })
    return Array.from(seen).sort()
  }, [displayData])

  const filtered = useMemo(
    () => enriched.filter(row => {
      const matchP  = filterPlatform === 'semua' || row.platform === filterPlatform
      const matchS  = filterStatus   === 'semua' || row.status   === filterStatus
      const matchSM = filterStatusMockup === 'semua' || row.statusMockup === filterStatusMockup
      const matchSt = filterStudio  === 'semua' || row.studio.toLowerCase() === filterStudio.toLowerCase()
      const matchB  = filterBrand   === 'semua' || (row.brand ?? '').toLowerCase() === filterBrand.toLowerCase()
      const matchM  = filterBulan   === 'semua' || monthOverlaps(row.periodeStart, row.periodeEnd, filterBulan)
      let matchC = true
      if (filterCampaign !== 'semua') {
        const k = (row.kampanye ?? '').toLowerCase()
        const isPayDay = k.includes('payday'), isBaU = k.includes('bau'), isDD = k.includes('dd')
        if (filterCampaign === 'PayDay') matchC = isPayDay
        else if (filterCampaign === 'BaU') matchC = isBaU
        else if (filterCampaign === 'DD') matchC = isDD
        else if (filterCampaign === 'Other') matchC = !isPayDay && !isBaU && !isDD
      }
      return matchP && matchS && matchSM && matchSt && matchB && matchM && matchC
    }),
    [enriched, filterPlatform, filterStatus, filterStatusMockup, filterStudio, filterBrand, filterBulan, filterCampaign],
  )

  const platforms = ['semua', ...Array.from(new Set(displayData.map(r => r.platform).filter(Boolean)))]
  const filteredBrands = brandSearch.trim()
    ? BRAND_LIST.filter(b => b.toLowerCase().includes(brandSearch.toLowerCase()))
    : BRAND_LIST

  function handleSort(key) {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortKey(key); setSortDir('asc') }
  }

  const sorted = useMemo(() => {
    if (!sortKey) return filtered
    return [...filtered].sort((a, b) => {
      let av, bv
      if (sortKey === 'status') {
        av = STATUS_ORDER[a.status] ?? 99; bv = STATUS_ORDER[b.status] ?? 99
      } else if (sortKey === 'periodeStart' || sortKey === 'periodeEnd') {
        av = new Date(normalizeDate(a[sortKey] ?? '')).getTime() || 0
        bv = new Date(normalizeDate(b[sortKey] ?? '')).getTime() || 0
      } else {
        av = (a[sortKey] ?? '').toString(); bv = (b[sortKey] ?? '').toString()
      }
      const cmp = typeof av === 'number' ? av - bv : av.localeCompare(bv, 'id', { sensitivity: 'base' })
      return sortDir === 'asc' ? cmp : -cmp
    })
  }, [filtered, sortKey, sortDir])

  const counts = useMemo(() => {
    const c = { missing: 0, 'belum-siap': 0, aktif: 0, 'akan-datang': 0, kedaluwarsa: 0 }
    enriched.forEach(r => c[r.status]++)
    return c
  }, [enriched])

  const statusMockups = Object.keys(MOCKUP_STATUS_CONFIG)
  const mockupCounts = useMemo(() => {
    const c = {}; statusMockups.forEach(s => { c[s] = 0 })
    enriched.forEach(r => { if (r.statusMockup && c[r.statusMockup] !== undefined) c[r.statusMockup]++ })
    return c
  }, [enriched])

  // ── STAT CARDS config ──
  const STAT_CARDS = [
    { key: 'aktif',       label: 'Aktif',       dot: '🟢', num: 'text-green-700',  bg: 'bg-white border-green-100',    sub: 'text-green-600'  },
    { key: 'akan-datang', label: 'Akan Datang', dot: '🟡', num: 'text-yellow-700', bg: 'bg-white border-yellow-100',   sub: 'text-yellow-600' },
    { key: 'belum-siap',  label: 'Belum Siap',  dot: '🟠', num: 'text-orange-700', bg: 'bg-white border-orange-100',   sub: 'text-orange-600' },
    { key: 'kedaluwarsa', label: 'Kedaluwarsa', dot: '🔴', num: 'text-red-700',    bg: 'bg-white border-red-100',      sub: 'text-red-600'    },
    { key: 'missing',     label: 'Missing',     dot: '⚫', num: 'text-slate-700',  bg: 'bg-white border-slate-200',    sub: 'text-slate-500'  },
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
                  Daftar aset motion graphic yang sedang aktif, akan datang, dan sudah kedaluwarsa.
                  Data dikelola Motion Designer Lead via Google Sheets.
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
        <div className="grid grid-cols-5 gap-3 mb-8">
          {STAT_CARDS.map(s => (
            <div
              key={s.key}
              className={`border rounded-xl p-5 shadow-[0_1px_2px_rgba(16,24,40,.05)] transition-all duration-150 ease-out ${s.bg}`}
            >
              <div className={`text-[32px] font-bold leading-none mb-2 tracking-tight ${s.num}`}>
                {counts[s.key]}
              </div>
              <div className={`text-[12px] font-medium ${s.sub}`}>
                {s.dot} {s.label}
              </div>
            </div>
          ))}
        </div>

        {/* ── FILTERS ── */}
        <div className="space-y-3 mb-6">

          {/* Status */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-semibold text-slate-400 tracking-[0.08em] uppercase w-24 shrink-0">Status</span>
            <div className="flex flex-wrap gap-1.5">
              {(['semua', 'aktif', 'akan-datang', 'belum-siap', 'kedaluwarsa', 'missing']).map(s => {
                const label = s === 'semua'
                  ? `Semua (${enriched.length})`
                  : `${STATUS_CONFIG[s].dot} ${STATUS_CONFIG[s].label} (${counts[s]})`
                return (
                  <button key={s} onClick={() => setFilterStatus(s)}
                    className={`${CHIP_BASE} ${filterStatus === s ? CHIP_ON : CHIP_OFF}`}>
                    {label}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Status Mockup */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-semibold text-slate-400 tracking-[0.08em] uppercase w-24 shrink-0">Mockup</span>
            <div className="flex flex-wrap gap-1.5">
              {(['semua', ...statusMockups]).map(s => {
                const label = s === 'semua'
                  ? `Semua (${enriched.length})`
                  : `${s} (${mockupCounts[s]})`
                return (
                  <button key={s} onClick={() => setFilterStatusMockup(s)}
                    className={`${CHIP_BASE} ${filterStatusMockup === s ? CHIP_ON : CHIP_OFF}`}>
                    {label}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Bulan — horizontal scrollable pills */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold text-slate-400 tracking-[0.08em] uppercase w-24 shrink-0">Bulan</span>
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
            <span className="text-[11px] font-semibold text-slate-400 tracking-[0.08em] uppercase w-24 shrink-0">Brand</span>
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

          {/* Platform */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-semibold text-slate-400 tracking-[0.08em] uppercase w-24 shrink-0">Platform</span>
            <div className="flex flex-wrap gap-1.5">
              {platforms.map(p => (
                <button key={p} onClick={() => setFilterPlatform(p)}
                  className={`${CHIP_BASE} ${filterPlatform === p ? CHIP_ON : CHIP_OFF}`}>
                  {p === 'semua' ? 'Semua' : p}
                </button>
              ))}
            </div>
          </div>

          {/* Studio */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-semibold text-slate-400 tracking-[0.08em] uppercase w-24 shrink-0">Studio</span>
            <div className="flex flex-wrap gap-1.5">
              {(['semua', 'Jakarta', 'Bandung']).map(s => (
                <button key={s} onClick={() => setFilterStudio(s)}
                  className={`${CHIP_BASE} ${filterStudio === s ? CHIP_ON : CHIP_OFF}`}>
                  {s === 'semua' ? 'Semua' : s}
                </button>
              ))}
            </div>
          </div>

          {/* Campaign */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-semibold text-slate-400 tracking-[0.08em] uppercase w-24 shrink-0">Campaign</span>
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
            Tidak ada aset yang cocok dengan filter yang dipilih.
          </div>
        ) : (
          <div className="overflow-x-auto border border-[#E5E7EB] rounded-xl shadow-[0_1px_2px_rgba(16,24,40,.05)]">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-[#E5E7EB]">
                  {/* Status — rowspan 2 */}
                  <th rowSpan={2} onClick={() => handleSort('status')}
                    className="align-middle px-4 py-3 text-[13px] font-semibold text-slate-500 uppercase tracking-[0.06em] select-none cursor-pointer hover:text-slate-700 hover:bg-slate-100 transition-colors duration-150 whitespace-nowrap">
                    <span className="flex items-center gap-1">
                      Status
                      <span className="text-[10px] opacity-50">{sortKey === 'status' ? (sortDir === 'asc' ? '↑' : '↓') : '↕'}</span>
                    </span>
                  </th>
                  {/* Status Mockup — rowspan 2 */}
                  <th rowSpan={2} onClick={() => handleSort('statusMockup')}
                    className="align-middle px-4 py-3 text-[13px] font-semibold text-slate-500 uppercase tracking-[0.06em] select-none cursor-pointer hover:text-slate-700 hover:bg-slate-100 transition-colors duration-150 whitespace-nowrap">
                    <span className="flex items-center gap-1">
                      Mockup
                      <span className="text-[10px] opacity-50">{sortKey === 'statusMockup' ? (sortDir === 'asc' ? '↑' : '↓') : '↕'}</span>
                    </span>
                  </th>
                  {/* Period group */}
                  <th colSpan={2}
                    className="px-4 py-2 text-[13px] font-semibold text-slate-500 uppercase tracking-[0.06em] text-center border-b border-[#E5E7EB]">
                    Period
                  </th>
                  {/* Other columns */}
                  {[
                    { label: 'Nama Aset',   key: 'namaAset'  },
                    { label: 'Brand',       key: 'brand'     },
                    { label: 'Type',        key: 'mockupType'},
                    { label: 'Platform',    key: 'platform'  },
                    { label: 'Studio',      key: 'studio'    },
                    { label: 'Kampanye',    key: 'kampanye'  },
                    { label: 'Jam',         key: 'jamTayang' },
                    { label: 'Catatan',     key: null        },
                    { label: 'Host Brief',  key: null        },
                    { label: 'File',        key: null        },
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
                  <th onClick={() => handleSort('periodeStart')}
                    className="px-4 py-2.5 text-[13px] font-semibold text-slate-500 uppercase tracking-[0.06em] select-none cursor-pointer hover:text-slate-700 hover:bg-slate-100 transition-colors duration-150 whitespace-nowrap">
                    <span className="flex items-center gap-1">
                      Start
                      <span className="text-[10px] opacity-50">{sortKey === 'periodeStart' ? (sortDir === 'asc' ? '↑' : '↓') : '↕'}</span>
                    </span>
                  </th>
                  <th className="px-4 py-2.5 text-[13px] font-semibold text-slate-500 uppercase tracking-[0.06em] whitespace-nowrap">
                    End
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {sorted.map((row, idx) => {
                  const cfg = STATUS_CONFIG[row.status]
                  const isEven = idx % 2 === 1
                  return (
                    <tr
                      key={row.id}
                      className={`transition-colors duration-150 ease-out hover:bg-slate-50 ${
                        ROW_STATUS_BG[row.status] ?? ''
                      } ${isEven ? 'bg-slate-50/30' : ''}`}
                    >
                      {/* Status badge */}
                      <td className="px-4 py-0 h-[52px] align-middle">
                        <span className={`${BADGE} ${cfg.badge}`}>
                          {cfg.dot} {cfg.label}
                        </span>
                      </td>
                      {/* Mockup status badge */}
                      <td className="px-4 py-0 h-[52px] align-middle">
                        {row.statusMockup
                          ? <span className={`${BADGE} ${MOCKUP_STATUS_CONFIG[row.statusMockup]?.badge ?? DEFAULT_BADGE}`}>{row.statusMockup}</span>
                          : <span className="text-slate-300 text-[13px]">—</span>}
                      </td>
                      {/* Periode Start */}
                      <td className="px-4 py-0 h-[52px] align-middle whitespace-nowrap font-mono text-[12px] text-slate-700 font-semibold">
                        {formatDate(row.periodeStart)}
                      </td>
                      {/* Periode End */}
                      <td className="px-4 py-0 h-[52px] align-middle whitespace-nowrap font-mono text-[12px] text-slate-500">
                        {formatDate(row.periodeEnd)}
                      </td>
                      {/* Nama Aset */}
                      <td className="px-4 py-0 h-[52px] align-middle">
                        <div className={`text-[14px] leading-snug ${row.status === 'aktif' ? 'font-semibold text-slate-900' : 'font-medium text-slate-800'}`}>
                          {row.namaAset}
                        </div>
                      </td>
                      {/* Brand */}
                      <td className="px-4 py-0 h-[52px] align-middle whitespace-nowrap">
                        {row.brand
                          ? <span className={`${BADGE} bg-slate-100 text-slate-600 ring-1 ring-slate-200`}>{row.brand}</span>
                          : <span className="text-slate-300 text-[13px]">—</span>}
                      </td>
                      {/* Mockup Type */}
                      <td className="px-4 py-0 h-[52px] align-middle whitespace-nowrap">
                        {row.mockupType
                          ? <span className={`${BADGE} ${MOCKUP_TYPE_CONFIG[row.mockupType.toLowerCase()] ?? DEFAULT_BADGE}`}>{row.mockupType}</span>
                          : <span className="text-slate-300 text-[13px]">—</span>}
                      </td>
                      {/* Platform */}
                      <td className="px-4 py-0 h-[52px] align-middle whitespace-nowrap">
                        {row.platform
                          ? <span className={`${BADGE} ${getPlatformBadge(row.platform)}`}>{row.platform}</span>
                          : <span className="text-slate-300 text-[13px]">—</span>}
                      </td>
                      {/* Studio */}
                      <td className="px-4 py-0 h-[52px] align-middle whitespace-nowrap">
                        {row.studio
                          ? <span className={`${BADGE} ${STUDIO_CONFIG[row.studio.toLowerCase()] ?? DEFAULT_BADGE}`}>{row.studio}</span>
                          : <span className="text-slate-300 text-[13px]">—</span>}
                      </td>
                      {/* Kampanye */}
                      <td className="px-4 py-0 h-[52px] align-middle text-[14px] text-slate-600 font-medium">
                        {row.kampanye || <span className="text-slate-300">—</span>}
                      </td>
                      {/* Jam Tayang */}
                      <td className="px-4 py-0 h-[52px] align-middle whitespace-nowrap font-mono text-[12px] text-slate-500">
                        {row.jamTayang || <span className="text-slate-300">—</span>}
                      </td>
                      {/* Catatan */}
                      <td className="px-4 py-0 h-[52px] align-middle text-[12px] text-slate-500 max-w-[160px]">
                        {row.catatan || <span className="text-slate-300">—</span>}
                      </td>
                      {/* Host Brief */}
                      <td className="px-4 py-0 h-[52px] align-middle text-[12px] text-slate-500 max-w-[160px]">
                        {row.hostBrief || <span className="text-slate-300">—</span>}
                      </td>
                      {/* File */}
                      <td className="px-4 py-0 h-[52px] align-middle">
                        {row.linkFile
                          ? <a href={row.linkFile} target="_blank" rel="noopener noreferrer"
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
          <span>{sorted.length} dari {enriched.length} aset ditampilkan</span>
          <Link to="/framework/campaign-usage-management" className="text-brand-600 hover:text-brand-700 font-medium transition-colors duration-150">
            Dokumentasi Campaign Usage Management →
          </Link>
        </div>

        {/* ── NOTES ── */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-2">
          {[
            { col: 'Status',       note: 'Dihitung otomatis: Aktif jika periode berjalan & statusMockup = Ready, Belum Siap jika berjalan tapi belum Ready, Akan Datang jika belum mulai, Kedaluwarsa jika sudah lewat & Ready, Missing jika lewat & belum Ready.' },
            { col: 'Nama Aset',    note: 'Nama display aset — biasanya format: Preview [Platform] Brand Tipe.' },
            { col: 'Brand',        note: 'Nama brand kampanye, mis. SNICKERS, L-MEN, dsb.' },
            { col: 'Mockup Type',  note: 'Tipe kampanye aset: BaU (Business as Usual), PayDay, Period, DD, dsb.' },
            { col: 'Platform',     note: 'Platform siaran live: Shopee Live, TikTok Shop, dsb.' },
            { col: 'Studio',       note: 'Lokasi studio produksi mockup: Jakarta atau Bandung.' },
            { col: 'Status Mockup',note: 'Tahap produksi mockup di pipeline. Nilai valid: On GD, On AE, On Strat, On Motion, Revision, Ready.' },
            { col: 'Kampanye',     note: 'Nama kampanye atau periode dari Google Sheets, dipakai untuk filter Campaign (PayDay / BaU / DD / Other).' },
            { col: 'Period',       note: 'Header "Period" menaungi 2 sub-kolom: Start (tanggal mulai) & End (tanggal selesai). Sort tabel mengikuti Start saja. Format di Sheets: YYYY-MM-DD atau DD/MM/YYYY.' },
            { col: 'Jam Tayang',   note: 'Jam siaran live sesuai jadwal kampanye, mis. 09:00–10:00 atau "Sepanjang hari".' },
            { col: 'Catatan',      note: 'Keterangan tambahan bebas — kolaborasi talent, informasi level, dsb.' },
            { col: 'Host Brief',   note: 'Ringkasan briefing untuk host siaran live. Diisi oleh Motion Designer atau tim strategis.' },
            { col: 'File',         note: 'Tautan Google Drive ke file mockup. Kosong jika file belum diupload.' },
            { col: 'Filter Bulan', note: 'Tampil otomatis dari data — tiap bulan baru di sheet muncul sebagai pill baru ke kanan. Filter menampilkan aset yang periodenya tumpang tindih dengan bulan tersebut.' },
            {
              col: 'Setup Sheets',
              note: (
                <>
                  Sheet harus di-set <strong>Share → Anyone with the link → Viewer</strong> agar fetch berjalan.{' '}
                  <a href="https://docs.google.com/spreadsheets/d/17wR3rfsiRJjQPev1SHk55CPkvw6xzmLGdmAb2_OWUiQ/edit"
                    target="_blank" rel="noopener noreferrer" className="text-brand-600 hover:underline transition-colors duration-150">
                    Buka Google Sheets Campaign 2026 →
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
