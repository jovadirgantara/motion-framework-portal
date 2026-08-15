import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import PageLayout from '../components/layout/PageLayout'
import PageHeader from '../components/ui/PageHeader'
import { revealUp, stagger, viewportOnce } from '../utils/motion'

const steps = [
  {
    step: 1,
    title: 'Baca Visual Hierarchy Standard',
    desc: 'Mulai dengan inti filosofis framework — 6 prinsip yang menjadi dasar semua komponen lain.',
    to: '/framework/visual-hierarchy',
    cta: 'Baca Komponen 1 →',
    time: '~10 menit',
  },
  {
    step: 2,
    title: 'Pelajari Klasifikasi Kompleksitas',
    desc: 'Pahami Level 1–4 agar bisa merencanakan waktu produksi dengan akurat.',
    to: '/framework/complexity',
    cta: 'Baca Komponen 2 →',
    time: '~8 menit',
  },
  {
    step: 3,
    title: 'Coba Complexity Classifier',
    desc: 'Langsung praktikkan: klasifikasikan aset yang sedang atau akan Anda kerjakan.',
    to: '/tools/complexity-classifier',
    cta: 'Buka Tool →',
    time: '~3 menit',
    isTool: true,
  },
  {
    step: 4,
    title: 'Baca Naming Convention',
    desc: 'Pelajari standar penamaan file agar setiap aset bisa diidentifikasi tanpa dibuka.',
    to: '/framework/naming-convention',
    cta: 'Baca Komponen 5 →',
    time: '~5 menit',
  },
  {
    step: 5,
    title: 'Coba Naming Generator',
    desc: 'Generate nama file standar untuk project Anda saat ini.',
    to: '/tools/naming-generator',
    cta: 'Buka Tool →',
    time: '~2 menit',
    isTool: true,
  },
  {
    step: 6,
    title: 'Baca Render Standard',
    desc: 'Pahami codec dan format yang tepat per platform agar output selalu kompatibel.',
    to: '/framework/render-standard',
    cta: 'Baca Komponen 6 →',
    time: '~7 menit',
  },
  {
    step: 7,
    title: 'Lakukan QC dengan VH Checklist',
    desc: 'Jalankan review visual hierarchy pada aset Anda dan dapatkan skor adherence %.',
    to: '/tools/visual-hierarchy-checklist',
    cta: 'Buka Tool →',
    time: '~5 menit',
    isTool: true,
  },
  {
    step: 8,
    title: 'Beri Feedback',
    desc: 'Pengalaman Anda membantu penelitian. Isi form feedback singkat (Likert 1–5 + open-ended).',
    to: '/feedback',
    cta: 'Beri Feedback →',
    time: '~5 menit',
    isFeedback: true,
  },
]

export default function GetStarted() {
  return (
    <PageLayout sidebar="all">
      <div className="max-w-2xl mx-auto">
        <PageHeader
          eyebrow="/ Mulai dari Sini"
          title="Mulai dari Sini"
          description={
            <>
              Urutan baca yang disarankan untuk designer baru atau validator yang mau memahami framework
              secara menyeluruh. Total waktu estimasi: <strong className="text-ink-muted">~45 menit</strong>.
            </>
          }
        />

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={stagger}
          className="space-y-4"
        >
          {steps.map(s => (
            <motion.div
              key={s.step}
              variants={revealUp}
              className={`flex gap-4 rounded-2xl p-5 ${
                s.isTool ? 'bg-brand-50' :
                s.isFeedback ? 'bg-teal-50' :
                'bg-elevated border border-line'
              }`}
            >
              <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold shrink-0 mt-0.5 font-display ${
                s.isTool ? 'bg-brand-600 text-on-accent' :
                s.isFeedback ? 'bg-teal-600 text-on-accent' :
                'bg-slate-200 text-ink-muted'
              }`}>
                {s.step}
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    {s.isTool && (
                      <span className="text-2xs font-mono uppercase tracking-widest text-brand-600 mr-2">Tool</span>
                    )}
                    {s.isFeedback && (
                      <span className="text-2xs font-mono uppercase tracking-widest text-teal-600 mr-2">Feedback</span>
                    )}
                    <span className="font-display text-base font-bold text-ink">{s.title}</span>
                  </div>
                  <span className="text-xs text-ink-subtle shrink-0">{s.time}</span>
                </div>
                <p className="text-sm text-ink-muted mt-1 mb-2 leading-relaxed">{s.desc}</p>
                <Link
                  to={s.to}
                  className={`text-sm font-semibold hover:underline underline-offset-4 ${
                    s.isFeedback ? 'text-teal-600' : 'text-brand-600'
                  }`}
                >
                  {s.cta}
                </Link>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </PageLayout>
  )
}
