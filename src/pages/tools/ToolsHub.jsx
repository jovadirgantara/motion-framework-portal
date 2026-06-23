import { Link } from 'react-router-dom'
import PageLayout from '../../components/layout/PageLayout'
import Sidebar from '../../components/layout/Sidebar'

const tools = [
  {
    to: '/tools/naming-generator',
    icon: '🏷️',
    badge: 'Tool 1',
    title: 'Naming Convention Generator',
    desc: 'Generate nama file standar dari input terkontrol. Hilangkan inkonsistensi penamaan selamanya.',
    usedFor: 'Setiap mulai proyek baru',
    relatedFramework: '/framework/naming-convention',
    relatedLabel: 'Baca: Naming Convention',
  },
  {
    to: '/tools/complexity-classifier',
    icon: '📊',
    badge: 'Tool 2',
    title: 'Complexity Classifier',
    desc: 'Jawab 6 pertanyaan, dapatkan Level 1–4 + estimasi waktu produksi yang realistis.',
    usedFor: 'Saat planning / estimasi timeline',
    relatedFramework: '/framework/complexity',
    relatedLabel: 'Baca: Klasifikasi Kompleksitas',
  },
  {
    to: '/tools/visual-hierarchy-checklist',
    icon: '✅',
    badge: 'Tool 3',
    title: 'Visual Hierarchy Checklist',
    desc: 'Review aset Anda terhadap 6 prinsip visual hierarchy. Dapatkan skor adherence % + daftar isu.',
    usedFor: 'QC sebelum export',
    relatedFramework: '/framework/quality-control',
    relatedLabel: 'Baca: Quality Control',
  },
  {
    to: '/tools/render-calculator',
    icon: '🎬',
    badge: 'Tool 4',
    title: 'Render Settings Calculator',
    desc: 'Pilih platform + jenis output + software, dapatkan rekomendasi codec/resolusi/fps/bitrate yang tepat.',
    usedFor: 'Saat setup render di After Effects',
    relatedFramework: '/framework/render-standard',
    relatedLabel: 'Baca: Render Standard',
  },
]

export default function ToolsHub() {
  return (
    <PageLayout sidebar="tools">
      <div className="pb-6 border-b border-slate-200 mb-6">
        <p className="eyebrow mb-1">/ Interactive Tools</p>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900 mb-1">4 Interactive Tools</h1>
        <p className="text-sm text-slate-500">
          Semua tool berjalan sepenuhnya di browser — tidak ada data yang dikirim ke server.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {tools.map((tool, i) => (
          <div key={tool.to} className="card card-hover p-5 flex flex-col">
            <span className="font-mono text-2xs text-slate-400 mb-3">{String(i + 1).padStart(2, '0')}</span>
            <h2 className="text-sm font-semibold text-slate-900 mb-1">{tool.title}</h2>
            <p className="text-xs text-slate-500 mb-2 flex-1 leading-relaxed">{tool.desc}</p>
            <div className="border-t border-slate-100 pt-3 mt-2 flex items-center justify-between">
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
        ))}
      </div>
    </PageLayout>
  )
}
