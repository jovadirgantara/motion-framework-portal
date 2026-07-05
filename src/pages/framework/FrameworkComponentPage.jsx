import { useParams, Navigate } from 'react-router-dom'
import FrameworkPageLayout from '../../components/layout/FrameworkPageLayout'
import Reveal from '../../components/ui/Reveal'
import IconBlob from '../../components/ui/IconBlob'
import { FRAMEWORK_ACCENTS } from '../../content/tools-meta'
import { renderMarkdown } from '../../utils/markdown'
import frameworkComponents from '../../content/framework-components.json'

const BAND = {
  brand: 'bg-brand-50 border-brand-100',
  sun:   'bg-sun-50 border-sun-100',
  teal:  'bg-teal-50 border-teal-100',
  pink:  'bg-pink-50 border-pink-100',
}
const BIG_NUM = {
  brand: 'text-brand-100',
  sun:   'text-sun-200',
  teal:  'text-teal-200',
  pink:  'text-pink-200',
}

export default function FrameworkComponentPage() {
  const { slug } = useParams()
  const component = frameworkComponents.find(c => c.id === slug)

  if (!component) return <Navigate to="/framework" replace />

  const accent = FRAMEWORK_ACCENTS[(component.order - 1) % 4]

  return (
    <FrameworkPageLayout component={component}>
      <Reveal>
        <div className={`relative overflow-hidden border rounded-2xl p-6 md:p-8 mb-8 ${BAND[accent]}`}>
          {/* Decorative background number */}
          <span className={`absolute right-4 top-0 font-display text-8xl font-bold select-none pointer-events-none leading-none ${BIG_NUM[accent]}`}>
            {String(component.order).padStart(2, '0')}
          </span>
          {/* Content */}
          <div className="relative">
            <p className="eyebrow mb-2">Komponen {component.order}</p>
            <div className="flex items-center gap-4 mb-3">
              <IconBlob icon={component.icon} accent={accent} size="md" />
              <h1 className="font-display text-3xl font-bold tracking-tight text-slate-900">{component.title}</h1>
            </div>
            <p className="text-base text-slate-600 max-w-xl">{component.summary}</p>
          </div>
        </div>
      </Reveal>

      <Reveal delay={100}>
        <div className="space-y-2">
          {component.sections.map((section, i) => (
            <details key={i} className="group bg-white border border-slate-200 rounded-2xl" open={i === 0}>
              <summary className="flex items-center justify-between px-5 py-4 cursor-pointer list-none">
                <h2 className="font-display text-base font-bold text-slate-900">{section.heading}</h2>
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
      </Reveal>
    </FrameworkPageLayout>
  )
}
