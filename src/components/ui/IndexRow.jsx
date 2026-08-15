import { Link } from 'react-router-dom'

const ACCENT_TEXT = {
  brand: 'group-hover:text-brand-600',
  sun:   'group-hover:text-sun-600',
  teal:  'group-hover:text-teal-600',
  pink:  'group-hover:text-pink-600',
}

// Shade 400 rather than 300 for the numeral: 300 collapses toward the page
// ground in dark mode and the number all but disappears on the card.
const ACCENT_NUM = {
  brand: 'text-brand-400',
  sun:   'text-sun-400',
  teal:  'text-teal-400',
  pink:  'text-pink-400',
}

export default function IndexRow({ number, title, summary, to, accent = 'brand' }) {
  return (
    <Link to={to} className="card card-hover group flex items-start gap-4 p-5">
      <span className={`shrink-0 font-display text-2xl font-bold tabular-nums ${ACCENT_NUM[accent]}`}>
        {number}
      </span>
      <div className="min-w-0 flex-1">
        <h3 className={`font-display text-base font-bold tracking-tight text-ink transition-colors ${ACCENT_TEXT[accent]}`}>
          {title}
        </h3>
        <p className="mt-0.5 text-sm leading-relaxed text-ink-muted">{summary}</p>
      </div>
      <span
        aria-hidden="true"
        className="shrink-0 pt-0.5 font-semibold text-brand-600 opacity-0 transition-opacity group-hover:opacity-100"
      >
        →
      </span>
    </Link>
  )
}
