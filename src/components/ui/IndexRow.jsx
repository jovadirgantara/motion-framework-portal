import { Link } from 'react-router-dom'

const ACCENT_BORDERS = {
  brand: 'hover:border-l-brand-400',
  sun:   'hover:border-l-sun-400',
  teal:  'hover:border-l-teal-400',
  pink:  'hover:border-l-pink-400',
}

export default function IndexRow({ number, title, summary, to, accent = 'brand' }) {
  return (
    <Link
      to={to}
      className={`group flex items-start gap-4 py-4 pl-4 -ml-4 border-b border-slate-100 border-l-2 border-l-transparent transition-colors ${ACCENT_BORDERS[accent]}`}
    >
      <span className="font-mono text-sm text-slate-400 shrink-0 pt-0.5 w-6">{number}</span>
      <div className="flex-1 min-w-0">
        <h3 className="font-display text-base font-bold tracking-tight text-slate-900 group-hover:text-brand-600 transition-colors">
          {title}
        </h3>
        <p className="text-sm text-slate-500 leading-relaxed mt-0.5">{summary}</p>
      </div>
      <span className="font-semibold text-brand-600 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 pt-0.5">
        →
      </span>
    </Link>
  )
}
