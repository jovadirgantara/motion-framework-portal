import { useState, useEffect, useMemo, useRef } from 'react'
import { Link } from 'react-router-dom'
import PageLayout from '../components/layout/PageLayout'
import FadeIn from '../components/ui/FadeIn'

// ─── CONFIG ──────────────────────────────────────────────────────────────────
// Sheet harus di-set "Anyone with the link can view" agar fetch bisa berjalan.
const SHEET_ID = '17wR3rfsiRJjQPev1SHk55CPkvw6xzmLGdmAb2_OWUiQ'
const GID      = '0'
const CSV_URL  = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=${GID}`

// Mapping nama kolom header di Google Sheets → field internal.
// Jika nama kolom di sheet kamu berbeda, ubah di sini.
const COL_MAP = {
  namaAset:      ['Nama Aset', 'nama aset', 'Nama', 'nama', 'Display Name'],
  platform:      ['Platform', 'platform'],
  mockupType:    ['Tipe', 'tipe', 'Mockup Type', 'Type', 'type'],
  kampanye:      ['Kampanye', 'kampanye', 'Campaign', 'campaign'],
  periodeStart:  ['Periode Mulai', 'periode mulai', 'Mulai', 'mulai', 'Start', 'start', 'Tanggal Mulai'],
  periodeEnd:    ['Periode Selesai', 'periode selesai', 'Selesai', 'selesai', 'End', 'end', 'Tanggal Selesai'],
  jamTayang:     ['Jam Tayang', 'jam tayang', 'Jam', 'jam', 'Time', 'time'],
  statusMockup:  ['Status Mockup', 'status mockup', 'Mockup Status', 'mockup status'],
  statusMotion:  ['Status Motion', 'status motion', 'Motion Status', 'motion status'],
  linkFile:      ['Link File', 'link file', 'Link', 'link', 'File', 'Drive Link', 'drive link'],
  catatan:       ['Catatan', 'catatan', 'Notes', 'notes', 'Keterangan', 'keterangan'],
  brand:         ['Brand', 'brand', 'Merek', 'merek'],
}

// ─── BRAND LIST ──────────────────────────────────────────────────────────────
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

// ─── SEED (fallback jika sheet kosong / belum public) ────────────────────────
const SEED_DATA = [
  {
    id: 'seed-1',
    namaAset: 'Preview [Shopee] Snickers Mingyu BaU',
    platform: 'Shopee Live',
    mockupType: 'BaU',
    kampanye: 'Business as Usual – Juni',
    periodeStart: '2026-06-07',
    periodeEnd: '2026-06-24',
    jamTayang: '09:00 – 10:00',
    statusMockup: 'On AE',
    statusMotion: 'On Progress',
    linkFile: '',
    catatan: 'Kolaborasi Mingyu ENHYPEN',
    brand: 'SNICKERS',
  },
  {
    id: 'seed-2',
    namaAset: 'BG Sweety Festive PayDay',
    platform: 'Shopee Live',
    mockupType: 'PayDay',
    kampanye: 'PayDay Juni',
    periodeStart: '2026-06-25',
    periodeEnd: '2026-06-30',
    jamTayang: '20:00 – 22:00',
    statusMockup: 'On Strat',
    statusMotion: 'Revision',
    linkFile: '',
    catatan: '',
    brand: '',
  },
  {
    id: 'seed-3',
    namaAset: 'Preview [TikTok] L-MEN Period Pack',
    platform: 'TikTok Shop',
    mockupType: 'Period',
    kampanye: 'BaU – Multiple Period',
    periodeStart: '2026-06-01',
    periodeEnd: '2026-07-15',
    jamTayang: 'Sepanjang hari',
    statusMockup: 'On GD',
    statusMotion: 'Ready',
    linkFile: '',
    catatan: 'LVL 4 – multiple usage date',
    brand: 'L-MEN',
  },
]

// ─── HELPERS ─────────────────────────────────────────────────────────────────
function parseCSV(text) {
  const lines = text.trim().split(/\r?\n/)
  if (lines.length < 2) return []

  // Parse satu baris CSV (handle quoted commas)
  function parseLine(line) {
    const cells = []
    let cur = ''
    let inQ = false
    for (let i = 0; i < line.length; i++) {
      const c = line[i]
      if (c === '"') {
        if (inQ && line[i + 1] === '"') { cur += '"'; i++ }
        else inQ = !inQ
      } else if (c === ',' && !inQ) {
        cells.push(cur.trim()); cur = ''
      } else {
        cur += c
      }
    }
    cells.push(cur.trim())
    return cells
  }

  const headers = parseLine(lines[0])

  // Resolve header → field name
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
    fieldMap.forEach((field, i) => {
      if (field) row[field] = cells[i] ?? ''
    })
    return row
  }).filter(r => r.namaAset) // skip baris kosong
}

// Normalisasi format tanggal dari sheet (DD/MM/YYYY atau YYYY-MM-DD) → YYYY-MM-DD
function normalizeDate(str) {
  if (!str) return ''
  // DD/MM/YYYY
  const m = str.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/)
  if (m) return `${m[3]}-${m[2].padStart(2,'0')}-${m[1].padStart(2,'0')}`
  return str
}

function getStatus(periodeStart, periodeEnd, statusMockup) {
  const today = new Date()
  today.setHours(12, 0, 0, 0)
  const start = new Date(normalizeDate(periodeStart))
  const end   = new Date(normalizeDate(periodeEnd))
  end.setHours(23, 59, 59)
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

// Returns "YYYY-MM" key from a date string, or null if invalid
function getMonthKey(dateStr) {
  const d = new Date(normalizeDate(dateStr))
  if (isNaN(d)) return null
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

// "2026-06" → "Juni 2026"
function formatMonthLabel(key) {
  const [year, month] = key.split('-').map(Number)
  const d = new Date(year, month - 1, 1)
  return d.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })
}

// True if the row's period overlaps with the given monthKey ("YYYY-MM")
function monthOverlaps(periodeStart, periodeEnd, monthKey) {
  const [year, month] = monthKey.split('-').map(Number)
  const mStart = new Date(year, month - 1, 1)
  const mEnd   = new Date(year, month, 0, 23, 59, 59)
  const s = new Date(normalizeDate(periodeStart))
  const e = new Date(normalizeDate(periodeEnd))
  if (isNaN(s) || isNaN(e)) return false
  return s <= mEnd && e >= mStart
}

// ─── STATUS CONFIG ────────────────────────────────────────────────────────────
const STATUS_CONFIG = {
  missing:      { label: 'Missing',      dot: '⚫', badge: 'bg-slate-200 text-slate-700 ring-1 ring-slate-400' },
  'belum-siap': { label: 'Belum Siap',   dot: '🟠', badge: 'bg-orange-100 text-orange-800 ring-1 ring-orange-300' },
  aktif:        { label: 'Aktif',        dot: '🟢', badge: 'bg-green-100 text-green-800 ring-1 ring-green-300' },
  'akan-datang':{ label: 'Akan Datang',  dot: '🟡', badge: 'bg-yellow-100 text-yellow-800 ring-1 ring-yellow-300' },
  kedaluwarsa:  { label: 'Kedaluwarsa',  dot: '🔴', badge: 'bg-red-100 text-red-800 ring-1 ring-red-300' },
}

const MOCKUP_STATUS_CONFIG = {
  'On GD':    { badge: 'bg-blue-100 text-blue-800 ring-1 ring-blue-300' },
  'On AE':    { badge: 'bg-purple-100 text-purple-800 ring-1 ring-purple-300' },
  'On Strat': { badge: 'bg-orange-100 text-orange-800 ring-1 ring-orange-300' },
  'On Motion':{ badge: 'bg-indigo-100 text-indigo-800 ring-1 ring-indigo-300' },
  'Revision': { badge: 'bg-amber-100 text-amber-800 ring-1 ring-amber-300' },
  'Ready':    { badge: 'bg-green-100 text-green-800 ring-1 ring-green-300' },
}

// ─── COMPONENT ───────────────────────────────────────────────────────────────
export default function CampaignSchedule() {
  const [rawData, setRawData]       = useState(null)   // null = loading
  const [fetchError, setFetchError] = useState(null)
  const [filterPlatform,  setFilterPlatform]  = useState('semua')
  const [filterStatus,    setFilterStatus]    = useState('semua')
  const [filterBrand,     setFilterBrand]     = useState('semua')
  const [filterBulan,     setFilterBulan]     = useState('semua')
  const [filterCampaign,  setFilterCampaign]  = useState('semua')
  const [brandOpen,       setBrandOpen]       = useState(false)
  const [brandSearch,     setBrandSearch]     = useState('')
  const [bulanOpen,       setBulanOpen]       = useState(false)
  const [bulanSearch,     setBulanSearch]     = useState('')
  const brandRef = useRef(null)
  const bulanRef = useRef(null)
  const [sortKey, setSortKey] = useState(null)
  const [sortDir, setSortDir] = useState('asc')

  useEffect(() => {
    let cancelled = false
    fetch(CSV_URL)
      .then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`)
        return r.text()
      })
      .then(text => {
        if (cancelled) return
        const rows = parseCSV(text)
        setRawData(rows.length > 0 ? rows : null)
        if (rows.length === 0) setFetchError('sheet-empty')
      })
      .catch(err => {
        if (cancelled) return
        setFetchError(err.message)
        setRawData(null)
      })
    return () => { cancelled = true }
  }, [])

  useEffect(() => {
    function handleOutside(e) {
      if (brandRef.current && !brandRef.current.contains(e.target)) {
        setBrandOpen(false)
        setBrandSearch('')
      }
      if (bulanRef.current && !bulanRef.current.contains(e.target)) {
        setBulanOpen(false)
        setBulanSearch('')
      }
    }
    document.addEventListener('mousedown', handleOutside)
    return () => document.removeEventListener('mousedown', handleOutside)
  }, [])

  const isLoading  = rawData === null && fetchError === null
  const isLive     = rawData !== null && rawData.length > 0
  const displayData = isLive ? rawData : SEED_DATA

  const enriched = useMemo(
    () => displayData.map(row => ({ ...row, status: getStatus(row.periodeStart, row.periodeEnd, row.statusMockup) })),
    [displayData],
  )

  const allMonths = useMemo(() => {
    const seen = new Set()
    displayData.forEach(r => {
      const sk = getMonthKey(r.periodeStart)
      const ek = getMonthKey(r.periodeEnd)
      if (sk) seen.add(sk)
      if (ek) seen.add(ek)
    })
    return Array.from(seen).sort()
  }, [displayData])

  const filtered = useMemo(
    () => enriched.filter(row => {
      const matchP = filterPlatform === 'semua' || row.platform === filterPlatform
      const matchS = filterStatus   === 'semua' || row.status   === filterStatus
      const matchB = filterBrand    === 'semua' || (row.brand ?? '').toLowerCase() === filterBrand.toLowerCase()
      const matchM = filterBulan    === 'semua' || monthOverlaps(row.periodeStart, row.periodeEnd, filterBulan)
      let matchC = true
      if (filterCampaign !== 'semua') {
        const k = (row.kampanye ?? '').toLowerCase()
        const isPayDay = k.includes('payday')
        const isBaU    = k.includes('bau')
        const isDD     = k.includes('dd')
        if (filterCampaign === 'PayDay') matchC = isPayDay
        else if (filterCampaign === 'BaU') matchC = isBaU
        else if (filterCampaign === 'DD')  matchC = isDD
        else if (filterCampaign === 'Other') matchC = !isPayDay && !isBaU && !isDD
      }
      return matchP && matchS && matchB && matchM && matchC
    }),
    [enriched, filterPlatform, filterStatus, filterBrand, filterBulan, filterCampaign],
  )

  const platforms = ['semua', ...Array.from(new Set(displayData.map(r => r.platform).filter(Boolean)))]

  const filteredBrands = brandSearch.trim()
    ? BRAND_LIST.filter(b => b.toLowerCase().includes(brandSearch.toLowerCase()))
    : BRAND_LIST

  const filteredBulans = bulanSearch.trim()
    ? allMonths.filter(k => formatMonthLabel(k).toLowerCase().includes(bulanSearch.toLowerCase()))
    : allMonths

  function handleSort(key) {
    if (sortKey === key) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
  }

  const STATUS_ORDER = { missing: 0, 'belum-siap': 1, aktif: 2, 'akan-datang': 3, kedaluwarsa: 4 }

  const sorted = useMemo(() => {
    if (!sortKey) return filtered
    return [...filtered].sort((a, b) => {
      let av, bv
      if (sortKey === 'status') {
        av = STATUS_ORDER[a.status] ?? 99
        bv = STATUS_ORDER[b.status] ?? 99
      } else {
        av = (a[sortKey] ?? '').toString()
        bv = (b[sortKey] ?? '').toString()
      }
      const cmp = typeof av === 'number'
        ? av - bv
        : av.localeCompare(bv, 'id', { sensitivity: 'base' })
      return sortDir === 'asc' ? cmp : -cmp
    })
  }, [filtered, sortKey, sortDir])

  const counts = useMemo(() => {
    const c = { missing: 0, 'belum-siap': 0, aktif: 0, 'akan-datang': 0, kedaluwarsa: 0 }
    enriched.forEach(r => c[r.status]++)
    return c
  }, [enriched])

  return (
    <PageLayout>
      {/* Header */}
      <FadeIn>
      <div className="pt-8 pb-6 border-b border-slate-200 mb-8">
        <div className="flex items-center gap-2 font-mono text-2xs text-slate-400 mb-4">
          <Link to="/" className="hover:text-brand-600">Home</Link>
          <span>/</span>
          <span>Jadwal Kampanye</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <p className="eyebrow mb-1">/ Komponen 08 · Campaign Usage Management</p>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900 mb-1">Jadwal Penggunaan Mockup</h1>
            <p className="text-sm text-slate-500 max-w-xl">
              Daftar aset motion graphic yang sedang aktif, akan datang, dan sudah kedaluwarsa.
              Data dikelola Motion Designer Lead via Google Sheets. Operator: cek status dan buka file.
            </p>
          </div>
          <Link
            to="/framework/campaign-usage-management"
            className="shrink-0 text-xs text-brand-600 hover:text-brand-800 font-medium border border-brand-200 bg-brand-50 rounded px-3 py-2 whitespace-nowrap"
          >
            Dokumentasi Campaign Usage Management →
          </Link>
        </div>
      </div>
      </FadeIn>

      {/* Status bar */}
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
      {!isLoading && isLive && (
        <div className="flex items-center gap-2 border border-green-200 bg-green-50 rounded px-4 py-2.5 mb-6 text-xs text-green-800 font-mono">
          🟢 <strong>Data Live</strong> — ditarik dari Google Sheets. Refresh untuk memperbarui.
        </div>
      )}
      {!isLoading && !isLive && (
        <div className="border border-amber-200 bg-amber-50 rounded px-4 py-2.5 mb-6 text-xs text-amber-800 font-mono">
          {fetchError === 'sheet-empty'
            ? <>Sheet masih kosong — tambahkan data di Google Sheets lalu refresh.</>
            : <>SEED — gagal memuat dari Sheets ({fetchError}). Set sheet ke <em>Anyone with the link can view</em> lalu refresh.</>
          }
        </div>
      )}

      {/* Stat cards */}
      <div className="grid grid-cols-5 gap-3 mb-6">
        {[
          { key: 'missing',     label: 'Missing',     dot: '⚫', bg: 'bg-slate-100  border-slate-300',  text: 'text-slate-700'  },
          { key: 'belum-siap',  label: 'Belum Siap',  dot: '🟠', bg: 'bg-orange-50 border-orange-200', text: 'text-orange-800' },
          { key: 'aktif',       label: 'Aktif',       dot: '🟢', bg: 'bg-green-50  border-green-200',  text: 'text-green-800'  },
          { key: 'akan-datang', label: 'Akan Datang', dot: '🟡', bg: 'bg-yellow-50 border-yellow-200', text: 'text-yellow-800' },
          { key: 'kedaluwarsa', label: 'Kedaluwarsa', dot: '🔴', bg: 'bg-red-50    border-red-200',    text: 'text-red-800'    },
        ].map(s => (
          <div key={s.key} className={`border rounded-lg p-4 text-center ${s.bg}`}>
            <div className={`text-2xl font-bold mb-1 ${s.text}`}>{counts[s.key]}</div>
            <div className={`text-xs font-mono ${s.text}`}>{s.dot} {s.label}</div>
          </div>
        ))}
      </div>

      {/* Status filter */}
      <div className="flex flex-wrap gap-2 mb-4">
        {(['semua', 'missing', 'belum-siap', 'aktif', 'akan-datang', 'kedaluwarsa']).map(s => {
          const cfg = s === 'semua'
            ? { label: `Semua (${enriched.length})`, badge: 'border border-slate-300 text-slate-600' }
            : { label: `${STATUS_CONFIG[s].dot} ${STATUS_CONFIG[s].label} (${counts[s]})`, badge: STATUS_CONFIG[s].badge }
          return (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`px-3 py-1.5 rounded text-xs font-mono transition-all ${cfg.badge} ${
                filterStatus === s ? 'opacity-100 ring-1 ring-brand-400' : 'opacity-60 hover:opacity-100'
              }`}
            >
              {cfg.label}
            </button>
          )
        })}
      </div>

      {/* Platform filter */}
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <span className="font-mono text-2xs text-slate-400 tracking-widest uppercase mr-1">Platform:</span>
        {platforms.map(p => (
          <button
            key={p}
            onClick={() => setFilterPlatform(p)}
            className={`px-3 py-1.5 rounded text-xs font-medium border transition-colors ${
              filterPlatform === p
                ? 'bg-brand-600 text-white border-brand-600'
                : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50'
            }`}
          >
            {p === 'semua' ? 'Semua' : p}
          </button>
        ))}
      </div>

      {/* Brand filter */}
      <div className="flex flex-wrap items-center gap-2 mb-3" ref={brandRef}>
        <span className="font-mono text-2xs text-slate-400 tracking-widest uppercase mr-1">Brand:</span>
        <div className="relative">
          <button
            onClick={() => {
              setBrandOpen(o => !o)
              if (brandOpen) setBrandSearch('')
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium border transition-colors ${
              filterBrand !== 'semua'
                ? 'bg-brand-600 text-white border-brand-600'
                : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50'
            }`}
          >
            {filterBrand === 'semua' ? 'Semua Brand' : filterBrand}
            <span className="text-[10px] opacity-70">{brandOpen ? '▲' : '▼'}</span>
          </button>

          {brandOpen && (
            <div className="absolute z-10 top-full left-0 mt-1 w-56 bg-white border border-slate-200 rounded shadow-lg">
              <div className="p-2 border-b border-slate-100">
                <input
                  type="text"
                  value={brandSearch}
                  onChange={e => setBrandSearch(e.target.value)}
                  placeholder="Cari brand..."
                  autoFocus
                  className="w-full text-xs px-2 py-1.5 border border-slate-200 rounded outline-none focus:border-brand-400"
                />
              </div>
              <ul className="max-h-52 overflow-y-auto py-1">
                {filterBrand !== 'semua' && !brandSearch && (
                  <li>
                    <button
                      onClick={() => { setFilterBrand('semua'); setBrandOpen(false); setBrandSearch('') }}
                      className="w-full text-left px-3 py-1.5 text-xs text-slate-500 hover:bg-slate-50"
                    >
                      Semua Brand
                    </button>
                  </li>
                )}
                {filteredBrands.length === 0 ? (
                  <li className="px-3 py-2 text-xs text-slate-400 italic">Tidak ditemukan</li>
                ) : (
                  filteredBrands.map(b => (
                    <li key={b}>
                      <button
                        onClick={() => { setFilterBrand(b); setBrandOpen(false); setBrandSearch('') }}
                        className={`w-full text-left px-3 py-1.5 text-xs transition-colors ${
                          filterBrand === b
                            ? 'bg-brand-50 text-brand-700 font-medium'
                            : 'text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        {b}
                      </button>
                    </li>
                  ))
                )}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Bulan filter */}
      <div className="flex flex-wrap items-center gap-2 mb-3" ref={bulanRef}>
        <span className="font-mono text-2xs text-slate-400 tracking-widest uppercase mr-1">Bulan:</span>
        <div className="relative">
          <button
            onClick={() => {
              setBulanOpen(o => !o)
              if (bulanOpen) setBulanSearch('')
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium border transition-colors ${
              filterBulan !== 'semua'
                ? 'bg-brand-600 text-white border-brand-600'
                : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50'
            }`}
          >
            {filterBulan === 'semua' ? 'Semua Bulan' : formatMonthLabel(filterBulan)}
            <span className="text-[10px] opacity-70">{bulanOpen ? '▲' : '▼'}</span>
          </button>

          {bulanOpen && (
            <div className="absolute z-10 top-full left-0 mt-1 w-48 bg-white border border-slate-200 rounded shadow-lg">
              <div className="p-2 border-b border-slate-100">
                <input
                  type="text"
                  value={bulanSearch}
                  onChange={e => setBulanSearch(e.target.value)}
                  placeholder="Cari bulan..."
                  autoFocus
                  className="w-full text-xs px-2 py-1.5 border border-slate-200 rounded outline-none focus:border-brand-400"
                />
              </div>
              <ul className="max-h-52 overflow-y-auto py-1">
                {filterBulan !== 'semua' && !bulanSearch && (
                  <li>
                    <button
                      onClick={() => { setFilterBulan('semua'); setBulanOpen(false); setBulanSearch('') }}
                      className="w-full text-left px-3 py-1.5 text-xs text-slate-500 hover:bg-slate-50"
                    >
                      Semua Bulan
                    </button>
                  </li>
                )}
                {filteredBulans.length === 0 ? (
                  <li className="px-3 py-2 text-xs text-slate-400 italic">Tidak ditemukan</li>
                ) : (
                  filteredBulans.map(k => (
                    <li key={k}>
                      <button
                        onClick={() => { setFilterBulan(k); setBulanOpen(false); setBulanSearch('') }}
                        className={`w-full text-left px-3 py-1.5 text-xs transition-colors ${
                          filterBulan === k
                            ? 'bg-brand-50 text-brand-700 font-medium'
                            : 'text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        {formatMonthLabel(k)}
                      </button>
                    </li>
                  ))
                )}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Campaign filter */}
      <div className="flex flex-wrap items-center gap-2 mb-6">
        <span className="font-mono text-2xs text-slate-400 tracking-widest uppercase mr-1">Campaign:</span>
        {(['semua', 'PayDay', 'BaU', 'DD', 'Other']).map(c => (
          <button
            key={c}
            onClick={() => setFilterCampaign(c)}
            className={`px-3 py-1.5 rounded text-xs font-medium border transition-colors ${
              filterCampaign === c
                ? 'bg-brand-600 text-white border-brand-600'
                : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50'
            }`}
          >
            {c === 'semua' ? 'Semua' : c}
          </button>
        ))}
      </div>

      {/* Table */}
      {sorted.length === 0 ? (
        <div className="text-center py-12 text-slate-500 text-sm">
          Tidak ada aset yang cocok dengan filter yang dipilih.
        </div>
      ) : (
        <div className="overflow-x-auto border border-slate-200 rounded">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                {[
                  { label: 'Status',        key: 'status'       },
                  { label: 'Nama Aset',     key: 'namaAset'     },
                  { label: 'Mockup Type',   key: 'mockupType'   },
                  { label: 'Platform',      key: 'platform'     },
                  { label: 'Status Mockup', key: 'statusMockup' },
                  { label: 'Kampanye',      key: 'kampanye'     },
                  { label: 'Bulan',         key: null           },
                  { label: 'Periode',       key: 'periodeStart' },
                  { label: 'Jam Tayang',    key: 'jamTayang'    },
                  { label: 'Catatan',       key: null           },
                  { label: 'File',          key: null           },
                ].map(col => (
                  <th
                    key={col.label}
                    onClick={col.key ? () => handleSort(col.key) : undefined}
                    className={`px-3 py-2.5 font-mono text-2xs text-slate-400 tracking-widest uppercase select-none ${
                      col.key ? 'cursor-pointer hover:text-slate-600 hover:bg-slate-100' : ''
                    }`}
                  >
                    <span className="flex items-center gap-1 whitespace-nowrap">
                      {col.label}
                      {col.key && (
                        <span className="text-[10px]">
                          {sortKey === col.key
                            ? sortDir === 'asc' ? '↑' : '↓'
                            : <span className="opacity-30">↕</span>
                          }
                        </span>
                      )}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {sorted.map(row => {
                const cfg = STATUS_CONFIG[row.status]
                return (
                  <tr key={row.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-3 py-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-mono ${cfg.badge}`}>
                        {cfg.dot} {cfg.label}
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      <div className="font-medium text-slate-900 leading-snug text-sm">{row.namaAset}</div>
                    </td>
                    <td className="px-3 py-3 text-slate-600 whitespace-nowrap text-xs font-mono">
                      {row.mockupType || <span className="text-slate-300">—</span>}
                    </td>
                    <td className="px-3 py-3 text-slate-600 whitespace-nowrap text-sm">{row.platform}</td>
                    <td className="px-3 py-3">
                      {row.statusMockup ? (
                        <span className={`inline-flex px-2 py-0.5 rounded text-xs font-mono ${MOCKUP_STATUS_CONFIG[row.statusMockup]?.badge ?? 'bg-slate-100 text-slate-600'}`}>
                          {row.statusMockup}
                        </span>
                      ) : <span className="font-mono text-xs text-slate-300">—</span>}
                    </td>
                    <td className="px-3 py-3 text-slate-600 text-sm">{row.kampanye}</td>
                    <td className="px-3 py-3 text-slate-600 whitespace-nowrap font-mono text-xs">
                      {getMonthKey(row.periodeStart) ? formatMonthLabel(getMonthKey(row.periodeStart)) : <span className="text-slate-300">—</span>}
                    </td>
                    <td className="px-3 py-3 text-slate-600 whitespace-nowrap font-mono text-xs">
                      {formatDate(row.periodeStart)}<br />{formatDate(row.periodeEnd)}
                    </td>
                    <td className="px-3 py-3 text-slate-600 whitespace-nowrap font-mono text-xs">{row.jamTayang}</td>
                    <td className="px-3 py-3 text-slate-500 text-xs max-w-[160px]">
                      {row.catatan || <span className="text-slate-300">—</span>}
                    </td>
                    <td className="px-3 py-3">
                      {row.linkFile ? (
                        <a
                          href={row.linkFile}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2.5 py-1 bg-brand-600 text-white text-xs font-medium rounded hover:bg-brand-700 transition-colors whitespace-nowrap"
                        >
                          Buka →
                        </a>
                      ) : (
                        <span className="font-mono text-xs text-slate-300">—</span>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Architecture note */}
      <div className="mt-8 border border-slate-200 rounded p-4 text-xs text-slate-600 space-y-2">
        <p className="font-mono text-2xs text-slate-400 tracking-widest uppercase mb-2">Catatan Arsitektur & Setup</p>
        <p>
          Halaman ini adalah <strong>Display Layer</strong> — data diambil langsung dari{' '}
          <a
            href={`https://docs.google.com/spreadsheets/d/17wR3rfsiRJjQPev1SHk55CPkvw6xzmLGdmAb2_OWUiQ/edit`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand-600 hover:underline"
          >
            Google Sheets Campaign 2026
          </a>.
          Status dihitung otomatis berdasarkan tanggal hari ini.
        </p>
        <p className="font-medium text-slate-700">Struktur kolom yang diharapkan di Google Sheets:</p>
        <div className="overflow-x-auto">
          <table className="text-xs border-collapse w-full">
            <thead>
              <tr className="bg-slate-100">
                {['Nama Aset','Brand','Platform','Tipe','Kampanye','Periode Mulai','Periode Selesai','Jam Tayang','Status Mockup','Link File','Catatan'].map(h => (
                  <th key={h} className="border border-slate-200 px-2 py-1 text-left font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                {['Preview [Shopee] Brand BaU','SNICKERS','Shopee Live','BaU','Juni BaU','2026-06-01','2026-06-30','09:00–10:00','On AE','https://drive.google.com/...',''].map((v,i) => (
                  <td key={i} className="border border-slate-200 px-2 py-1 text-slate-500 italic">{v}</td>
                ))}
              </tr>
            </tbody>
          </table>
          <p className="mt-2">
            Nilai <strong>Status Mockup</strong>: <code className="bg-slate-200 px-1 rounded">On GD</code>, <code className="bg-slate-200 px-1 rounded">On AE</code>, <code className="bg-slate-200 px-1 rounded">On Strat</code>, <code className="bg-slate-200 px-1 rounded">On Motion</code>, <code className="bg-slate-200 px-1 rounded">Revision</code>, <code className="bg-slate-200 px-1 rounded">Ready</code>
          </p>
        </div>
        <p>
          Format tanggal: <code className="bg-slate-200 px-1 rounded">YYYY-MM-DD</code> atau <code className="bg-slate-200 px-1 rounded">DD/MM/YYYY</code>.
          Agar fetch berjalan, sheet harus di-set <strong>Share → Anyone with the link → Viewer</strong>.
        </p>
        <p className="text-slate-500 bg-slate-50 border border-slate-200 rounded px-3 py-2 font-mono text-2xs leading-relaxed">
          💡 <strong>Kolom Bulan</strong> di tabel dihitung otomatis dari <em>Periode Mulai</em> — tidak perlu kolom baru di sheet.
          Filter Bulan menampilkan aset yang <em>periodenya tumpang tindih</em> dengan bulan tersebut
          (mis. kampanye Juni–Juli akan muncul di filter "Juni" maupun "Juli").
        </p>
        <p className="mt-1">
          <Link to="/framework/campaign-usage-management" className="text-brand-600 hover:underline">
            Baca dokumentasi lengkap Campaign Usage Management →
          </Link>
        </p>
      </div>
    </PageLayout>
  )
}
