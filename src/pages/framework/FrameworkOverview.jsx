import { Link } from 'react-router-dom'
import FrameworkPageLayout from '../../components/layout/FrameworkPageLayout'
import FadeIn from '../../components/ui/FadeIn'
import frameworkComponents from '../../content/framework-components.json'

const overview = frameworkComponents.find(c => c.id === 'framework-overview')
const components = frameworkComponents.filter(c => c.id !== 'framework-overview').sort((a, b) => a.order - b.order)

export default function FrameworkOverview() {
  return (
    <FrameworkPageLayout component={overview}>
      {/* Header band */}
      <FadeIn>
        <div className="bg-brand-50 border border-brand-100 rounded-xl p-6 mb-8">
          <p className="eyebrow mb-1">/ MGLC Framework</p>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 mb-1">{overview.title}</h1>
          <p className="text-sm text-slate-600 mb-4">{overview.summary}</p>
          <div className="border-t border-brand-100 pt-4">
            <p className="font-mono text-2xs text-slate-400 tracking-widest uppercase mb-2">Panduan Membaca</p>
            <p className="text-sm text-slate-700">
              Komponen 1 (Visual Hierarchy) adalah <strong>inti filosofis</strong> — baca ini terlebih dahulu.
              Komponen 2–7 adalah sistem pendukung. Komponen 8 adalah lapisan operasional.
            </p>
          </div>
        </div>
      </FadeIn>

      {/* Component grid */}
      <FadeIn delay={80}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {components.map(comp => (
            <Link
              key={comp.id}
              to={comp.route}
              className="group card card-hover p-4 flex gap-4 items-start"
            >
              <div className="w-10 h-10 shrink-0 bg-brand-50 rounded-lg flex items-center justify-center text-xl group-hover:bg-brand-100 transition-colors">
                {comp.icon}
              </div>
              <div>
                <span className="font-mono text-2xs text-brand-600 block mb-0.5">
                  {String(comp.order).padStart(2, '0')}
                </span>
                <h3 className="text-sm font-semibold text-slate-900 group-hover:text-brand-700 transition-colors mb-1">
                  {comp.title}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">{comp.summary}</p>
              </div>
            </Link>
          ))}
        </div>
      </FadeIn>
    </FrameworkPageLayout>
  )
}
