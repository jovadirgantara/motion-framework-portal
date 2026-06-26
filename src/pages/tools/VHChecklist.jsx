import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import PageLayout from '../../components/layout/PageLayout'
import FadeIn from '../../components/ui/FadeIn'
import SeedNote from '../../components/ui/SeedNote'
import { trackEvent } from '../../utils/analytics'
import config from '../../config/checklist-config.json'

// Flatten all indicators for global tracking
const allIndicators = config.categories.flatMap(cat =>
  cat.indicators.map(ind => ({ ...ind, catId: cat.id, catLabel: cat.label }))
)
const TOTAL = allIndicators.length

const INTERP_COLORS = {
  green:  { ring: 'border-green-300',  bg: 'bg-green-50',  text: 'text-green-800',  badge: 'bg-green-100 text-green-800 border-green-300' },
  blue:   { ring: 'border-blue-300',   bg: 'bg-blue-50',   text: 'text-blue-800',   badge: 'bg-blue-100 text-blue-800 border-blue-300' },
  yellow: { ring: 'border-yellow-300', bg: 'bg-amber-50',  text: 'text-amber-800',  badge: 'bg-amber-100 text-amber-800 border-amber-300' },
  red:    { ring: 'border-red-300',    bg: 'bg-red-50',    text: 'text-red-800',    badge: 'bg-red-100 text-red-800 border-red-300' },
}

function TriButton({ status, current, onSelect }) {
  const isActive = current === status
  const styles = {
    pass: isActive ? 'bg-green-600 text-white border-green-600' : 'border-slate-300 text-slate-500 hover:border-green-400 hover:text-green-700',
    fail: isActive ? 'bg-red-600 text-white border-red-600'     : 'border-slate-300 text-slate-500 hover:border-red-400 hover:text-red-700',
    na:   isActive ? 'bg-slate-500 text-white border-slate-500' : 'border-slate-300 text-slate-500 hover:bg-slate-100',
  }
  const labels = { pass: 'PASS', fail: 'FAIL', na: 'N/A' }
  return (
    <button
      onClick={onSelect}
      className={`px-2.5 py-1 font-mono text-2xs rounded border transition-colors ${styles[status]}`}
    >
      {labels[status]}
    </button>
  )
}

export default function VHChecklist() {
  const [answers,  setAnswers]  = useState({})
  const [open,     setOpen]     = useState({ cat1: true })
  const [showResult, setShowResult] = useState(false)

  const passIds  = Object.keys(answers).filter(id => answers[id] === 'pass')
  const failIds  = Object.keys(answers).filter(id => answers[id] === 'fail')
  const naIds    = Object.keys(answers).filter(id => answers[id] === 'na')
  const ratedIds = [...passIds, ...failIds]
  const answered = Object.keys(answers).length

  const passRate = ratedIds.length > 0
    ? Math.round((passIds.length / ratedIds.length) * 100)
    : 0

  const interp = config.interpretation.find(i => passRate >= i.min && passRate <= i.max)
    ?? config.interpretation[config.interpretation.length - 1]
  const colors = INTERP_COLORS[interp.color]

  // Per-category stats
  const catStats = useMemo(() => {
    return config.categories.map(cat => {
      const ids     = cat.indicators.map(i => i.id)
      const passed  = ids.filter(id => answers[id] === 'pass').length
      const failed  = ids.filter(id => answers[id] === 'fail').length
      const na      = ids.filter(id => answers[id] === 'na').length
      const rated   = passed + failed
      const answeredInCat = passed + failed + na
      return { id: cat.id, passed, failed, rated, answeredInCat, total: ids.length,
               pct: rated > 0 ? Math.round((passed / rated) * 100) : null }
    })
  }, [answers])

  const failIndicators = allIndicators.filter(i => answers[i.id] === 'fail')

  function setAnswer(id, val) {
    setAnswers(prev => ({ ...prev, [id]: val }))
  }

  function toggleAccordion(catId) {
    setOpen(prev => ({ ...prev, [catId]: !prev[catId] }))
  }

  function handleReset() {
    setAnswers({})
    setOpen({ cat1: true })
    setShowResult(false)
  }

  function handleExport() {
    const date = new Date().toLocaleString('id-ID')
    const lines = [
      '=== VISUAL HIERARCHY CHECKLIST REPORT ===',
      `Tanggal    : ${date}`,
      `PASS Rate  : ${passRate}% — ${interp.label}`,
      `Dinilai    : ${ratedIds.length} dari ${TOTAL} indikator`,
      `PASS       : ${passIds.length}`,
      `FAIL       : ${failIds.length}`,
      `N/A        : ${naIds.length}`,
      '',
      '--- HASIL PER KATEGORI ---',
      ...catStats.map(cs => {
        const cat = config.categories.find(c => c.id === cs.id)
        return `${cat.label}: ${cs.pct !== null ? cs.pct + '%' : '-'} (${cs.passed} PASS / ${cs.failed} FAIL dari ${cs.rated} dinilai)`
      }),
      '',
      '--- INDIKATOR FAIL ---',
      ...(failIndicators.length > 0
        ? failIndicators.map(i => `[${i.catLabel}] ${i.text}`)
        : ['Tidak ada FAIL.']),
      '',
      `Interpretasi: ${interp.label}`,
      `Keterangan : ${interp.desc}`,
      '',
      'CATATAN: Tools ini adalah instrumen QC visual hierarchy berbasis framework penelitian.',
      'Hasil bukan penilaian final tanpa konteks visual aset yang diulas.',
      'MGLC Framework Portal — Motion Graphic Live Commerce',
    ]
    const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href     = url
    a.download = `vh-checklist-${new Date().toISOString().split('T')[0]}.txt`
    a.click()
    URL.revokeObjectURL(url)
    trackEvent('checklist_exported', { passRate, failCount: failIds.length })
  }

  return (
    <PageLayout sidebar="tools">
      {/* Header */}
      <FadeIn>
        <div className="pb-6 border-b border-slate-200 mb-6">
          <div className="flex items-center gap-2 font-mono text-2xs text-slate-400 mb-3">
            <Link to="/tools" className="hover:text-brand-600">Tools</Link>
            <span>/</span>
            <span>Visual Hierarchy Checklist</span>
          </div>
          <p className="eyebrow mb-1">/ Tool 03 · Visual Hierarchy Checklist</p>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 mb-1">Visual Hierarchy Checklist</h1>
          <p className="text-sm text-slate-500 max-w-xl">
            Quality control visual sebelum motion graphic digunakan pada live commerce.
            Nilai setiap indikator: <span className="font-mono text-green-700">PASS</span> ·{' '}
            <span className="font-mono text-red-700">FAIL</span> ·{' '}
            <span className="font-mono text-slate-500">N/A</span>
          </p>
        </div>
      </FadeIn>

      {/* Progress + live score */}
      <div className="border border-slate-200 rounded p-4 mb-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-4">
            <div>
              <span className={`text-2xl font-semibold ${
                ratedIds.length === 0 ? 'text-slate-300' :
                interp.color === 'green' ? 'text-green-600' :
                interp.color === 'blue' ? 'text-blue-600' :
                interp.color === 'yellow' ? 'text-amber-600' : 'text-red-600'
              }`}>
                {ratedIds.length > 0 ? passRate + '%' : '—'}
              </span>
              <span className="font-mono text-2xs text-slate-400 ml-1">PASS Rate</span>
            </div>
            {ratedIds.length > 0 && (
              <span className={`font-mono text-2xs px-2 py-0.5 rounded border ${colors.badge}`}>
                {interp.label}
              </span>
            )}
          </div>
          <div className="font-mono text-2xs text-slate-400">
            {answered}/{TOTAL} diisi · {passIds.length} PASS · {failIds.length} FAIL · {naIds.length} N/A
          </div>
        </div>
        {/* Progress bar */}
        <div className="h-1 bg-slate-100 rounded-full">
          <div
            className="h-1 bg-brand-500 rounded-full transition-all"
            style={{ width: `${(answered / TOTAL) * 100}%` }}
          />
        </div>
      </div>

      {/* Accordion categories */}
      <div className="space-y-2 mb-6">
        {config.categories.map((cat, ci) => {
          const stat   = catStats.find(s => s.id === cat.id)
          const isOpen = open[cat.id] ?? false
          return (
            <div key={cat.id} className="border border-slate-200 rounded overflow-hidden">
              {/* Accordion header */}
              <button
                onClick={() => toggleAccordion(cat.id)}
                className="w-full flex items-center justify-between px-4 py-3 bg-slate-50 hover:bg-slate-100 transition-colors text-left"
              >
                <div className="flex items-center gap-2">
                  <span className="font-mono text-2xs text-slate-400">{String(ci + 1).padStart(2, '0')}</span>
                  <span className="text-sm font-medium text-slate-800">{cat.label}</span>
                  <span className="font-mono text-2xs text-slate-400">
                    ({cat.indicators.length} indikator)
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  {stat.pct !== null && (
                    <span className={`font-mono text-xs font-semibold ${
                      stat.pct >= 75 ? 'text-green-700' : stat.pct >= 60 ? 'text-amber-700' : 'text-red-700'
                    }`}>
                      {stat.pct}%
                    </span>
                  )}
                  {stat.failed > 0 && (
                    <span className="font-mono text-2xs bg-red-100 text-red-700 border border-red-200 px-1.5 py-0.5 rounded">
                      {stat.failed} FAIL
                    </span>
                  )}
                  <span className="text-slate-400 text-sm">{isOpen ? '▲' : '▼'}</span>
                </div>
              </button>

              {/* Indicators */}
              {isOpen && (
                <div className="divide-y divide-slate-100">
                  {cat.indicators.map((ind, ii) => {
                    const val = answers[ind.id]
                    return (
                      <div key={ind.id} className={`px-4 py-4 transition-colors ${
                        val === 'fail' ? 'bg-red-50/50' : val === 'pass' ? 'bg-green-50/30' : ''
                      }`}>
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <p className="text-sm text-slate-900 mb-1">
                              <span className="font-mono text-2xs text-slate-400 mr-2">
                                {ci + 1}.{ii + 1}
                              </span>
                              {ind.text}
                            </p>
                            <p className="font-mono text-2xs text-slate-400 leading-relaxed">
                              {ind.hint}
                            </p>
                          </div>
                          <div className="flex gap-1 shrink-0 pt-0.5">
                            {['pass', 'fail', 'na'].map(s => (
                              <TriButton
                                key={s}
                                status={s}
                                current={val}
                                onSelect={() => setAnswer(ind.id, val === s ? undefined : s)}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Result card — show when at least half answered */}
      {ratedIds.length >= 5 && (
        <div className={`border-2 ${colors.ring} ${colors.bg} rounded p-5 mb-4`}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-mono text-2xs text-slate-400 tracking-widest uppercase mb-1">Hasil PASS Rate</p>
              <p className={`text-3xl font-semibold ${colors.text}`}>{passRate}%</p>
              <p className={`text-sm font-medium ${colors.text} mt-0.5`}>{interp.label}</p>
              <p className="text-sm text-slate-600 mt-1">{interp.desc}</p>
            </div>
            <div className="text-right shrink-0">
              <p className="font-mono text-xs text-slate-500">
                {passIds.length} / {ratedIds.length} dinilai
              </p>
              <p className="font-mono text-2xs text-slate-400 mt-0.5">
                PASS ÷ Total Dinilai × 100
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Fail summary */}
      {failIndicators.length > 0 && (
        <div className="border border-red-200 bg-red-50 rounded p-4 mb-4">
          <p className="font-mono text-2xs text-red-600 tracking-widest uppercase mb-3">
            Indikator FAIL ({failIndicators.length})
          </p>
          <ul className="space-y-2">
            {failIndicators.map(ind => (
              <li key={ind.id} className="flex items-start gap-2">
                <span className="font-mono text-2xs bg-red-100 text-red-700 border border-red-200 px-1.5 py-0.5 rounded shrink-0 mt-0.5">
                  {ind.catLabel}
                </span>
                <span className="text-sm text-red-800">{ind.text}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-wrap gap-3 mb-4">
        {answered > 0 && (
          <>
            <button
              onClick={handleExport}
              className="px-4 py-2 text-sm font-medium rounded border border-brand-200 bg-brand-50 text-brand-700 hover:bg-brand-100 transition-colors"
            >
              Export Report .txt
            </button>
            <button
              onClick={handleReset}
              className="px-4 py-2 text-sm text-slate-500 rounded border border-slate-200 hover:bg-slate-50 transition-colors"
            >
              Reset Checklist
            </button>
          </>
        )}
      </div>

      <div className="space-y-3">
        <SeedNote text="Tools ini adalah instrumen QC visual hierarchy berbasis framework penelitian. Hasil bukan penilaian final tanpa konteks visual aset yang diulas." />

        <div className="border border-brand-200 bg-brand-50 rounded p-4">
          <p className="font-mono text-2xs text-brand-600 tracking-widest uppercase mb-1">Referensi</p>
          <Link to="/framework/quality-control" className="text-brand-700 hover:underline text-sm font-medium">
            Baca dokumentasi Quality Control →
          </Link>
        </div>

        <div className="p-4 border border-slate-200 rounded text-center text-sm">
          <span className="text-slate-500">Selesai review? </span>
          <Link
            to="/feedback"
            className="text-brand-600 font-medium hover:underline"
            onClick={() => trackEvent('feedback_opened', { source: 'vh_checklist' })}
          >
            Beri feedback untuk penelitian →
          </Link>
        </div>
      </div>
    </PageLayout>
  )
}
