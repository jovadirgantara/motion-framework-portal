import { Link } from 'react-router-dom'
import PageLayout from './PageLayout'
import frameworkComponents from '../../content/framework-components.json'

const ORDERED = frameworkComponents
  .filter(c => c.id !== 'framework-overview')
  .sort((a, b) => a.order - b.order)

function siblings(component) {
  if (!component) return { prev: null, next: null }
  const i = ORDERED.findIndex(c => c.id === component.id)
  if (i === -1) return { prev: null, next: null }
  return { prev: ORDERED[i - 1] ?? null, next: ORDERED[i + 1] ?? null }
}

function SiblingLink({ component, direction }) {
  const isPrev = direction === 'prev'
  if (!component) return <span aria-hidden="true" />

  return (
    <Link
      to={component.route}
      rel={isPrev ? 'prev' : 'next'}
      className={`card card-hover group flex flex-col gap-1 p-4 ${isPrev ? '' : 'sm:text-right'}`}
    >
      <span className="font-mono text-2xs uppercase tracking-widest text-ink-subtle">
        {isPrev ? '← Sebelumnya' : 'Selanjutnya →'}
      </span>
      <span className="font-display text-sm font-bold tracking-tight text-ink transition-colors group-hover:text-brand-600">
        {String(component.order).padStart(2, '0')} · {component.title}
      </span>
    </Link>
  )
}

export default function FrameworkPageLayout({ component, children }) {
  const { prev, next } = siblings(component)

  return (
    <PageLayout sidebar="framework">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-1.5 text-xs text-ink-subtle">
        <Link to="/framework" className="transition-colors hover:text-brand-600">Framework</Link>
        {component && (
          <>
            <span aria-hidden="true">/</span>
            <span className="text-ink-muted">{component.title}</span>
          </>
        )}
      </nav>

      {children}

      {/* Cross-link ke tool terkait */}
      {component?.relatedToolId && (
        <div className="mt-12 rounded-2xl border border-brand-200 bg-brand-50 p-5">
          <p className="mb-1 font-mono text-2xs uppercase tracking-widest text-brand-600">
            / Praktikkan
          </p>
          <p className="mb-3 text-sm text-brand-800">
            Gunakan tool interaktif untuk menerapkan standar <strong className="font-semibold">{component.title}</strong> pada aset Anda.
          </p>
          <Link
            to={`/tools/${component.relatedToolId}`}
            className="group inline-flex items-center gap-1.5 rounded-full bg-brand-600 px-4 py-2 text-sm font-semibold text-on-accent transition-colors hover:bg-brand-700"
          >
            {component.relatedToolLabel ?? 'Buka Tool'}
            <span className="transition-transform group-hover:translate-x-0.5">→</span>
          </Link>
        </div>
      )}

      {/* Prev / next — the sidebar shows where you are, this moves you along it */}
      {(prev || next) && (
        <nav aria-label="Navigasi komponen" className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <SiblingLink component={prev} direction="prev" />
          <SiblingLink component={next} direction="next" />
        </nav>
      )}
    </PageLayout>
  )
}
