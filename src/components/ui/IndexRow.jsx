import { Link } from 'react-router-dom'

const ACCENT_TEXT = {
  brand: 'group-hover:text-brand-600',
  sun:   'group-hover:text-sun-600',
  teal:  'group-hover:text-teal-600',
  pink:  'group-hover:text-pink-600',
}

const ACCENT_NUM = {
  brand: 'text-brand-300',
  sun:   'text-sun-300',
  teal:  'text-teal-300',
  pink:  'text-pink-300',
}

export default function IndexRow({ number, title, summary, to, accent = 'brand' }) {
  return (
    <Link to={to} className="card card-hover group flex items-start gap-4 p-5">
      <span className={`font-display text-2xl font-bold shrink-0 ${ACCENT_NUM[accent]}`}>{number}</span>
      <div className="flex-1 min-w-0">
        <h3 className={`font-display text-base font-bold tracking-tight text-slate-900 transition-colors ${ACCENT_TEXT[accent]}`}>
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
