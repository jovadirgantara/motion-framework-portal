import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import PageLayout from '../../components/layout/PageLayout'
import Reveal from '../../components/ui/Reveal'
import SeedNote from '../../components/ui/SeedNote'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
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
  RC: 'text-ink-muted bg-surface-sunken border-line',
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
      <Reveal>
        <div className="pb-6 border-b border-line mb-6">
          <div className="flex items-center gap-2 font-mono text-2xs text-ink-subtle mb-3">
            <Link to="/tools" className="hover:text-brand-600">Tools</Link>
            <span>/</span>
            <span>Complexity Classifier</span>
          </div>
          <p className="eyebrow text-teal-600 mb-1">/ Tool 02 · Complexity Classifier</p>
          <h1 className="font-display text-3xl font-bold tracking-tight text-ink mb-2">Complexity Classifier</h1>
          <p className="text-sm text-ink-muted">
            Jawab {totalQ} pertanyaan di 4 dimensi. Dapatkan Complexity Index (CI) dan Level 1–4.
          </p>
        </div>
      </Reveal>

      {!submitted ? (
        <>
          {/* Progress bar */}
          <div className="mb-6">
            <div className="flex justify-between font-mono text-2xs text-ink-subtle mb-1.5">
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
                <div key={dim.id} className="border border-line rounded">
                  {/* Dimension header */}
                  <div className="flex items-center justify-between px-4 py-2.5 border-b border-line bg-surface-sunken rounded-t">
                    <div className="flex items-center gap-2">
                      <span className={`font-mono text-2xs px-1.5 py-0.5 rounded border ${DIM_COLORS[dim.id]}`}>
                        {dim.id}
                      </span>
                      <span className="text-sm font-medium text-ink">{dim.label}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-2xs text-ink-subtle">
                        {dimAnswered}/{dim.questions.length}
                      </span>
                      <span className="font-mono text-xs font-semibold text-ink-muted">
                        {dimScore} pt
                      </span>
                    </div>
                  </div>

                  {/* Questions in this dimension */}
                  <div className="divide-y divide-line">
                    {dim.questions.map((q, qi) => (
                      <div key={q.id} className="px-4 py-4">
                        <p className="text-sm font-medium text-ink mb-3">
                          <span className="font-mono text-2xs text-ink-subtle mr-2">
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
                                  ? 'bg-brand-600 text-on-accent border-brand-600'
                                  : 'border-line-strong text-ink-muted hover:border-brand-400 hover:bg-brand-50'
                              }`}
                            >
                              <span className={`font-mono text-2xs mr-1.5 ${answers[q.id] === opt.score ? 'text-on-accent/75' : 'text-ink-subtle'}`}>
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
            <div className="border border-line rounded px-4 py-3 mb-4 font-mono text-xs text-ink-muted">
              <span className="text-ink-subtle text-2xs tracking-widest uppercase block mb-1.5">Perhitungan Sementara</span>
              {config.dimensions.map(d => (
                <span key={d.id} className="mr-3">
                  {d.id} = {dimScores[d.id]}
                </span>
              ))}
              <span className="text-ink font-semibold ml-1">
                → CI = {totalCI}
              </span>
            </div>
          )}

          <Button
            onClick={handleSubmit}
            disabled={!allAnswered}
            variant="primary"
            size="lg"
            className="w-full"
          >
            {allAnswered ? 'Lihat Hasil Klasifikasi →' : `Jawab semua pertanyaan (${totalQ - answeredCount} tersisa)`}
          </Button>

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
                  <div className="mb-3">
                    <Badge color={result.badgeColor} size="lg">
                      {result.label} — {result.sublabel}
                    </Badge>
                  </div>
                  <div className="text-5xl font-semibold tracking-tight text-ink mb-1">
                    CI {totalCI}
                  </div>
                  <p className={`text-xs font-medium ${colors.text}`}>
                    {result.label} ({result.minScore}–{result.maxScore})
                  </p>
                </div>

                {/* Transparent calculation */}
                <div className="bg-elevated rounded border border-line p-4 mb-4">
                  <p className="font-mono text-2xs text-ink-subtle tracking-widest uppercase mb-3">Perhitungan CI</p>
                  <div className="space-y-1.5 mb-3">
                    {config.dimensions.map(dim => (
                      <div key={dim.id} className="flex items-center justify-between">
                        <span className="text-sm text-ink-muted">
                          <span className={`font-mono text-2xs px-1.5 py-0.5 rounded border mr-2 ${DIM_COLORS[dim.id]}`}>
                            {dim.id}
                          </span>
                          {dim.label}
                        </span>
                        <span className="font-mono text-sm font-semibold text-ink">
                          = {dimScores[dim.id]}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-line pt-2 flex items-center justify-between">
                    <span className="font-mono text-xs text-ink-muted">
                      CI = {config.dimensions.map(d => `${d.id}(${dimScores[d.id]})`).join(' + ')}
                    </span>
                    <span className="font-mono text-base font-bold text-ink">= {totalCI}</span>
                  </div>
                </div>

                {/* Estimasi */}
                <div className="bg-elevated rounded border border-line p-4 mb-4">
                  <p className="font-mono text-2xs text-ink-subtle tracking-widest uppercase mb-2">Estimasi Waktu</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-ink-muted mb-0.5">Produksi</p>
                      <p className="text-lg font-semibold text-ink">{result.estimasiProduksi}</p>
                    </div>
                    <div>
                      <p className="text-xs text-ink-muted mb-0.5">Render</p>
                      <p className="text-lg font-semibold text-ink">{result.estimasiRender}</p>
                    </div>
                  </div>
                  <p className="font-mono text-2xs text-amber-600 mt-2">⚠ {result.estimasiNote}</p>
                </div>

                {/* Karakteristik */}
                <div className="bg-elevated rounded border border-line p-4">
                  <p className="font-mono text-2xs text-ink-subtle tracking-widest uppercase mb-2">Karakteristik</p>
                  <ul className="space-y-1">
                    {result.karakteristik.map(k => (
                      <li key={k} className="flex items-center gap-2 text-sm text-ink-muted">
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
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-brand-600 text-on-accent text-sm font-medium rounded hover:bg-brand-700 transition-colors text-center"
                >
                  Generate nama aset →
                </Link>
                <Link
                  to="/framework/complexity"
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-elevated text-ink-muted text-sm font-medium rounded border border-line-strong hover:bg-elevated-hover transition-colors text-center"
                >
                  Baca dokumentasi Complexity
                </Link>
              </div>

              <Button onClick={handleReset} variant="secondary" className="w-full">
                ← Ulangi Klasifikasi
              </Button>

              <div className="p-4 border border-line rounded text-center text-sm">
                <span className="text-ink-muted">Hasilnya sesuai ekspektasi? </span>
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
