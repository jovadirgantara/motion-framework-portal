import { Link } from 'react-router-dom'
import PageLayout from './PageLayout'

export default function FrameworkPageLayout({ component, children }) {
  return (
    <PageLayout sidebar="framework">
      {/* Breadcrumb */}
      <nav className="text-xs text-slate-500 mb-6 flex items-center gap-1">
        <Link to="/framework" className="hover:text-slate-700">Framework</Link>
        {component && (
          <>
            <span>/</span>
            <span className="text-slate-700">{component.title}</span>
          </>
        )}
      </nav>

      {children}

      {/* Cross-link ke tool terkait */}
      {component?.relatedToolId && (
        <div className="mt-10 p-4 bg-brand-50 border border-brand-200 rounded-xl">
          <p className="text-sm font-medium text-brand-800 mb-2">🛠️ Praktikkan standar ini langsung</p>
          <p className="text-sm text-brand-700 mb-3">
            Gunakan tool interaktif untuk menerapkan standar{' '}
            <strong>{component.title}</strong> pada aset Anda.
          </p>
          <Link
            to={`/tools/${component.relatedToolId}`}
            className="inline-flex items-center gap-1 text-sm font-medium text-brand-600 hover:text-brand-800 underline"
          >
            {component.relatedToolLabel ?? 'Buka Tool'} →
          </Link>
        </div>
      )}
    </PageLayout>
  )
}
