import { Link } from 'react-router-dom'
import PageLayout from '../components/layout/PageLayout'

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
    <PageLayout>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Mulai dari Sini</h1>
        <p className="text-slate-600 mb-8">
          Urutan baca yang disarankan untuk designer baru atau validator yang mau memahami framework secara menyeluruh.
          Total waktu estimasi: <strong>~45 menit</strong>.
        </p>

        <div className="space-y-3">
          {steps.map(s => (
            <div
              key={s.step}
              className={`flex gap-4 bg-white border rounded-xl p-5 ${
                s.isTool ? 'border-brand-200 bg-brand-50' :
                s.isFeedback ? 'border-green-200 bg-green-50' :
                'border-slate-200'
              }`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 mt-0.5 ${
                s.isTool ? 'bg-brand-600 text-white' :
                s.isFeedback ? 'bg-green-600 text-white' :
                'bg-slate-200 text-slate-600'
              }`}>
                {s.step}
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    {s.isTool && <span className="text-xs font-medium text-brand-600 mr-2">🛠️ Tool</span>}
                    {s.isFeedback && <span className="text-xs font-medium text-green-600 mr-2">💬 Feedback</span>}
                    <span className="text-sm font-semibold text-slate-900">{s.title}</span>
                  </div>
                  <span className="text-xs text-slate-400 shrink-0">{s.time}</span>
                </div>
                <p className="text-sm text-slate-600 mt-1 mb-2">{s.desc}</p>
                <Link
                  to={s.to}
                  className={`text-sm font-medium hover:underline ${
                    s.isTool ? 'text-brand-600' :
                    s.isFeedback ? 'text-green-600' :
                    'text-brand-600'
                  }`}
                >
                  {s.cta}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PageLayout>
  )
}
