import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import PageLayout from '../../components/layout/PageLayout'
import SeedNote from '../../components/ui/SeedNote'
import { trackEvent } from '../../utils/analytics'
import config from '../../config/complexity-config.json'

const LEVEL_COLORS = {
  green:  { ring: 'border-green-300',  bg: 'bg-green-50',  text: 'text-green-800',  badge: 'bg-green-100 text-green-800' },
  blue:   { ring: 'border-blue-300',   bg: 'bg-blue-50',   text: 'text-blue-800',   badge: 'bg-blue-100 text-blue-800' },
  yellow: { ring: 'border-yellow-300', bg: 'bg-yellow-50', text: 'text-yellow-800', badge: 'bg-amber-100 text-amber-800' },
  red:    { ring: 'border-red-300',    bg: 'bg-red-50',    text: 'text-red-800',    badge: 'bg-red-100 text-red-800' },
}

const DIM_COLORS = {
  MC: 'text-brand-600 bg-brand-50 border-brand-200',
  AC: 'text-blue-700 bg-blue-50 border-blue-200',
  CC: 'text-amber-700 bg-amber-50 border-amber-200',
  RC: 'text-slate-700 bg-slate-50 border-slate-200',
}

// Flatten all questions for progress tracking
const allQuestions = config.dimensions.flatMap(d => d.questions.map(q => ({ ...q, dimId: d.id })))
const totalQ = allQuestions.length

export default function ComplexityClassifier() {
  const [answers,   setAnswers]   = useState({})
  const [submitted, setSubmitted] = useState(false)

  const answeredCount = Object.keys(answers).length
  const allAnswered   = answeredCount === totalQ

  // Per-dimension scores
  const dimScores = useMemo(() => {
    const scores = {}
    config.dimensions.forEach(dim => {
      scores[dim.id] = dim.questions.reduce((sum, q) => sum + (answers[q.id] ?? 0), 0)
    })
    return scores
  }, [answers])

  const totalCI = Object.values(dimScores).reduce((s, v) => s + v, 0)
  const result  = config.levels.find(l => totalCI >= l.minScore && totalCI <= l.maxScore)

  function handleSelect(qId, score) {
    setAnswers(prev => ({ ...prev, [qId]: score }))
  }

  function handleSubmit() {
    setSubmitted(true)
    trackEvent('classifier_completed', { level: result?.level, ci: totalCI })
  }

  function handleReset() {
    setAnswers({})
    setSubmitted(false)
  }

  return (
    <PageLayout sidebar="tools">
      {/* Header */}
      <div className="pb-6 border-b border-slate-200 mb-6">
        <div className="flex items-center gap-2 font-mono text-2xs text-slate-400 mb-3">
          <Link to="/tools" className="hover:text-brand-600">Tools</Link>
          <span>/</span>
          <span>Complexity Classifier</span>
        </div>
        <p className="eyebrow mb-1">/ Tool 02 · Complexity Classifier</p>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900 mb-1">Complexity Classifier</h1>
        <p className="text-sm text-slate-500">
          Jawab {totalQ} pertanyaan di 4 dimensi. Dapatkan Complexity Index (CI) dan Level 1–4.
        </p>
      </div>

      {!submitted ? (
        <>
          {/* Progress bar */}
          <div className="mb-6">
            <div className="flex justify-between font-mono text-2xs text-slate-400 mb-1.5">
              <span>{answeredCount}/{totalQ} pertanyaan</span>
              <span>CI sementara: {totalCI}</span>
            </div>
            <div className="h-1 bg-slate-200 rounded-full">
              <div
                className="h-1 bg-brand-500 rounded-full transition-all"
                style={{ width: `${(answeredCount / totalQ) * 100}%` }}
              />
            </div>
          </div>

          {/* Dimensions */}
          <div className="space-y-6 mb-6">
            {config.dimensions.map((dim, di) => {
              const dimAnswered = dim.questions.filter(q => answers[q.id] !== undefined).length
              const dimScore    = dimScores[dim.id] ?? 0
              return (
                <div key={dim.id} className="border border-slate-200 rounded">
                  {/* Dimension header */}
                  <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-200 bg-slate-50 rounded-t">
                    <div className="flex items-center gap-2">
                      <span className={`font-mono text-2xs px-1.5 py-0.5 rounded border ${DIM_COLORS[dim.id]}`}>
                        {dim.id}
                      </span>
                      <span className="text-sm font-medium text-slate-800">{dim.label}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-2xs text-slate-400">
                        {dimAnswered}/{dim.questions.length}
                      </span>
                      <span className="font-mono text-xs font-semibold text-slate-700">
                        {dimScore} pt
                      </span>
                    </div>
                  </div>

                  {/* Questions in this dimension */}
                  <div className="divide-y divide-slate-100">
                    {dim.questions.map((q, qi) => (
                      <div key={q.id} className="px-4 py-4">
                        <p className="text-sm font-medium text-slate-900 mb-3">
                          <span className="font-mono text-2xs text-slate-400 mr-2">
                            {di + 1}.{qi + 1}
                          </span>
                          {q.text}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {q.options.map(opt => (
                            <button
                              key={opt.score}
                              onClick={() => handleSelect(q.id, opt.score)}
                              className={`px-3 py-1.5 text-sm rounded border transition-colors ${
                                answers[q.id] === opt.score
                                  ? 'bg-brand-600 text-white border-brand-600'
                                  : 'border-slate-300 text-slate-700 hover:border-brand-400 hover:bg-brand-50'
                              }`}
                            >
                              <span className={`font-mono text-2xs mr-1.5 ${answers[q.id] === opt.score ? 'text-brand-200' : 'text-slate-400'}`}>
                                +{opt.score}
                              </span>
                              {opt.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>

          {/* CI Preview before submit */}
          {answeredCount > 0 && (
            <div className="border border-slate-200 rounded px-4 py-3 mb-4 font-mono text-xs text-slate-500">
              <span className="text-slate-400 text-2xs tracking-widest uppercase block mb-1.5">Perhitungan Sementara</span>
              {config.dimensions.map(d => (
                <span key={d.id} className="mr-3">
                  {d.id} = {dimScores[d.id]}
                </span>
              ))}
              <span className="text-slate-800 font-semibold ml-1">
                → CI = {totalCI}
              </span>
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={!allAnswered}
            className={`w-full py-3 text-sm font-medium rounded transition-colors ${
              allAnswered
                ? 'bg-brand-600 text-white hover:bg-brand-700'
                : 'bg-slate-100 text-slate-400 cursor-not-allowed'
            }`}
          >
            {allAnswered ? 'Lihat Hasil Klasifikasi →' : `Jawab semua pertanyaan (${totalQ - answeredCount} tersisa)`}
          </button>

          <SeedNote className="mt-4" />
        </>
      ) : (
        result && (() => {
          const colors = LEVEL_COLORS[result.badgeColor]
          return (
            <div className="space-y-4">
              {/* Result card */}
              <div className={`border-2 rounded p-6 ${colors.ring} ${colors.bg}`}>
                <div className="text-center mb-6">
                  <span className={`inline-block font-mono text-xs px-2.5 py-1 rounded border ${colors.badge} mb-3`}>
                    {result.label} — {result.sublabel}
                  </span>
                  <div className="text-5xl font-semibold tracking-tight text-slate-900 mb-1">
                    CI {totalCI}
                  </div>
                  <p className={`text-xs font-medium ${colors.text}`}>
                    {result.label} ({result.minScore}–{result.maxScore})
                  </p>
                </div>

                {/* Transparent calculation */}
                <div className="bg-white rounded border border-white/50 p-4 mb-4">
                  <p className="font-mono text-2xs text-slate-400 tracking-widest uppercase mb-3">Perhitungan CI</p>
                  <div className="space-y-1.5 mb-3">
                    {config.dimensions.map(dim => (
                      <div key={dim.id} className="flex items-center justify-between">
                        <span className="text-sm text-slate-600">
                          <span className={`font-mono text-2xs px-1.5 py-0.5 rounded border mr-2 ${DIM_COLORS[dim.id]}`}>
                            {dim.id}
                          </span>
                          {dim.label}
                        </span>
                        <span className="font-mono text-sm font-semibold text-slate-800">
                          = {dimScores[dim.id]}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-slate-200 pt-2 flex items-center justify-between">
                    <span className="font-mono text-xs text-slate-500">
                      CI = {config.dimensions.map(d => `${d.id}(${dimScores[d.id]})`).join(' + ')}
                    </span>
                    <span className="font-mono text-base font-bold text-slate-900">= {totalCI}</span>
                  </div>
                </div>

                {/* Estimasi */}
                <div className="bg-white rounded border border-white/50 p-4 mb-4">
                  <p className="font-mono text-2xs text-slate-400 tracking-widest uppercase mb-2">Estimasi Waktu</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-slate-500 mb-0.5">Produksi</p>
                      <p className="text-lg font-semibold text-slate-900">{result.estimasiProduksi}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-0.5">Render</p>
                      <p className="text-lg font-semibold text-slate-900">{result.estimasiRender}</p>
                    </div>
                  </div>
                  <p className="font-mono text-2xs text-amber-600 mt-2">⚠ {result.estimasiNote}</p>
                </div>

                {/* Karakteristik */}
                <div className="bg-white rounded border border-white/50 p-4">
                  <p className="font-mono text-2xs text-slate-400 tracking-widest uppercase mb-2">Karakteristik</p>
                  <ul className="space-y-1">
                    {result.karakteristik.map(k => (
                      <li key={k} className="flex items-center gap-2 text-sm text-slate-700">
                        <span className="w-1 h-1 rounded-full bg-slate-400 shrink-0" />
                        {k}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <SeedNote />

              {/* Actions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Link
                  to="/tools/naming-generator"
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-brand-600 text-white text-sm font-medium rounded hover:bg-brand-700 transition-colors text-center"
                >
                  Generate nama aset →
                </Link>
                <Link
                  to="/framework/complexity"
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-white text-slate-700 text-sm font-medium rounded border border-slate-300 hover:bg-slate-50 transition-colors text-center"
                >
                  Baca dokumentasi Complexity
                </Link>
              </div>

              <button onClick={handleReset} className="w-full py-2.5 text-sm text-slate-500 hover:text-slate-700 border border-slate-200 rounded hover:bg-slate-50 transition-colors">
                ← Ulangi Klasifikasi
              </button>

              <div className="p-4 border border-slate-200 rounded text-center text-sm">
                <span className="text-slate-500">Hasilnya sesuai ekspektasi? </span>
                <Link to="/feedback" className="text-brand-600 font-medium hover:underline" onClick={() => trackEvent('feedback_opened', { source: 'complexity_classifier' })}>
                  Beri feedback →
                </Link>
              </div>
            </div>
          )
        })()
      )}
    </PageLayout>
  )
}
