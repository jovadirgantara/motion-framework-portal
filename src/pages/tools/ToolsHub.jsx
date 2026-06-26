import { Link } from 'react-router-dom'
import PageLayout from '../../components/layout/PageLayout'
import FadeIn from '../../components/ui/FadeIn'

const tools = [
  {
    to: '/tools/naming-generator',
    icon: '🏷️',
    badge: 'Tool 1',
    title: 'Naming Convention Generator',
    desc: 'Generate nama file standar dari input terkontrol. Hilangkan inkonsistensi penamaan selamanya.',
    relatedFramework: '/framework/naming-convention',
    relatedLabel: 'Baca: Naming Convention',
  },
  {
    to: '/tools/complexity-classifier',
    icon: '📊',
    badge: 'Tool 2',
    title: 'Complexity Classifier',
    desc: 'Jawab 6 pertanyaan, dapatkan Level 1–4 + estimasi waktu produksi yang realistis.',
    relatedFramework: '/framework/complexity',
    relatedLabel: 'Baca: Klasifikasi Kompleksitas',
  },
  {
    to: '/tools/visual-hierarchy-checklist',
    icon: '✅',
    badge: 'Tool 3',
    title: 'Visual Hierarchy Checklist',
    desc: 'Review aset Anda terhadap 6 prinsip visual hierarchy. Dapatkan skor adherence % + daftar isu.',
    relatedFramework: '/framework/quality-control',
    relatedLabel: 'Baca: Quality Control',
  },
  {
    to: '/tools/render-calculator',
    icon: '🎬',
    badge: 'Tool 4',
    title: 'Render Settings Calculator',
    desc: 'Pilih platform + jenis output + software, dapatkan rekomendasi codec/resolusi/fps/bitrate yang tepat.',
    relatedFramework: '/framework/render-standard',
    relatedLabel: 'Baca: Render Standard',
  },
]

export default function ToolsHub() {
  return (
    <PageLayout sidebar="tools">
      {/* Header band */}
      <FadeIn>
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 mb-6">
          <p className="eyebrow mb-1">/ Interactive Tools</p>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 mb-1">4 Interactive Tools</h1>
          <p className="text-sm text-slate-500">
            Semua tool berjalan sepenuhnya di browser — tidak ada data yang dikirim ke server.
          </p>
        </div>
      </FadeIn>

      <FadeIn delay={80}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {tools.map((tool) => (
            <div key={tool.to} className="card card-hover group flex overflow-hidden">
              {/* Icon zone */}
              <div className="w-16 shrink-0 bg-brand-50 flex items-center justify-center text-2xl group-hover:bg-brand-100 transition-colors">
                {tool.icon}
              </div>
              {/* Content */}
              <div className="flex-1 p-5 flex flex-col">
                <span className="font-mono text-2xs text-brand-600 mb-1">{tool.badge}</span>
                <h2 className="text-sm font-semibold text-slate-900 mb-1 group-hover:text-brand-700 transition-colors">
                  {tool.title}
                </h2>
                <p className="text-xs text-slate-500 mb-3 flex-1 leading-relaxed">{tool.desc}</p>
                <div className="flex items-center justify-between">
                  <Link
                    to={tool.to}
                    className="px-3 py-1.5 bg-brand-600 text-white text-xs font-medium rounded hover:bg-brand-700 transition-colors"
                  >
                    buka →
                  </Link>
                  <Link
                    to={tool.relatedFramework}
                    className="font-mono text-2xs text-slate-400 hover:text-brand-600 transition-colors"
                  >
                    {tool.relatedLabel}
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </FadeIn>
    </PageLayout>
  )
}
