import { useParams, Navigate } from 'react-router-dom'
import FrameworkPageLayout from '../../components/layout/FrameworkPageLayout'
import FadeIn from '../../components/ui/FadeIn'
import { renderMarkdown } from '../../utils/markdown'
import frameworkComponents from '../../content/framework-components.json'

export default function FrameworkComponentPage() {
  const { slug } = useParams()
  const component = frameworkComponents.find(c => c.id === slug)

  if (!component) return <Navigate to="/framework" replace />

  return (
    <FrameworkPageLayout component={component}>
      <FadeIn>
        <div className="relative overflow-hidden bg-brand-50 border border-brand-100 rounded-xl p-6 mb-8">
          {/* Decorative background number */}
          <span className="absolute right-4 top-0 text-8xl font-bold text-brand-100 select-none pointer-events-none leading-none">
            {String(component.order).padStart(2, '0')}
          </span>
          {/* Content */}
          <div className="relative">
            <p className="eyebrow mb-2">Komponen {component.order}</p>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl">{component.icon}</span>
              <h1 className="text-2xl font-bold text-slate-900">{component.title}</h1>
            </div>
            <p className="text-slate-600 max-w-xl">{component.summary}</p>
          </div>
        </div>
      </FadeIn>

      <FadeIn delay={100}>
        <div className="space-y-2">
          {component.sections.map((section, i) => (
            <details key={i} className="group bg-white border border-slate-200 rounded-xl" open={i === 0}>
              <summary className="flex items-center justify-between px-5 py-4 cursor-pointer list-none">
                <h2 className="text-sm font-semibold text-slate-900">{section.heading}</h2>
                <svg
                  className="w-4 h-4 text-slate-400 group-open:rotate-180 transition-transform"
                  fill="none" viewBox="0 0 24 24" stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div
                className="px-5 pb-5 prose-framework"
                dangerouslySetInnerHTML={{ __html: renderMarkdown(section.body) }}
              />
            </details>
          ))}
        </div>
      </FadeIn>
    </FrameworkPageLayout>
  )
}
