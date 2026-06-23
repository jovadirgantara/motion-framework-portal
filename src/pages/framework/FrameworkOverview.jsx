import { Link } from 'react-router-dom'
import FrameworkPageLayout from '../../components/layout/FrameworkPageLayout'
import frameworkComponents from '../../content/framework-components.json'

const overview = frameworkComponents.find(c => c.id === 'framework-overview')
const components = frameworkComponents.filter(c => c.id !== 'framework-overview').sort((a, b) => a.order - b.order)

export default function FrameworkOverview() {
  return (
    <FrameworkPageLayout component={overview}>
      <p className="eyebrow mb-1">/ MGLC Framework</p>
      <h1 className="text-2xl font-semibold tracking-tight text-slate-900 mb-1">{overview.title}</h1>
      <p className="text-sm text-slate-500 mb-8">{overview.summary}</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
        {components.map(comp => (
          <Link
            key={comp.id}
            to={comp.route}
            className="group card card-hover p-4 flex gap-3"
          >
            <div className="shrink-0 pt-0.5">
              <span className="font-mono text-2xs text-slate-400">{String(comp.order).padStart(2, '0')}</span>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-900 group-hover:text-brand-700 transition-colors mb-1">
                {comp.title}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">{comp.summary}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="border border-slate-200 rounded p-5 text-sm text-slate-700">
        <p className="font-mono text-2xs text-slate-400 tracking-widest uppercase mb-2">Panduan Membaca</p>
        <p className="mb-2">
          Komponen 1 (Visual Hierarchy) adalah <strong>inti filosofis</strong> — baca ini terlebih dahulu.
          Komponen 2–7 adalah sistem pendukung yang memastikan prinsip visual hierarchy diterapkan secara konsisten.
        </p>
        <p>
          Untuk praktisi baru, ikuti{' '}
          <Link to="/get-started" className="text-brand-600 hover:underline font-medium">
            panduan urutan baca →
          </Link>
        </p>
      </div>
    </FrameworkPageLayout>
  )
}
