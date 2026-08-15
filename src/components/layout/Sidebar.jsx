import { useMemo, useState } from 'react'
import { NavLink, useNavigate, useLocation } from 'react-router-dom'
import frameworkComponents from '../../content/framework-components.json'
import { TOOLS } from '../../content/tools-meta'

// Both groups are derived from the same content files the pages render from.
// The previous hardcoded list had drifted — it was missing component 08
// (Campaign Usage Management) entirely, so that page was unreachable from the
// sidebar. Deriving removes the class of bug.
const frameworkLinks = [
  { to: '/framework', label: 'Overview', exact: true },
  ...frameworkComponents
    .filter(c => c.id !== 'framework-overview')
    .sort((a, b) => a.order - b.order)
    .map(c => ({
      to: c.route,
      label: c.title,
      number: String(c.order).padStart(2, '0'),
    })),
]

const toolLinks = [
  { to: '/tools', label: 'Semua Tools', exact: true },
  ...TOOLS.map((t, i) => ({
    to: t.to,
    label: t.title,
    number: String(i + 1).padStart(2, '0'),
  })),
]

const otherLinks = [
  { to: '/campaign', label: 'Jadwal Campaign', exact: true },
  { to: '/downloads', label: 'Unduhan', exact: true },
  { to: '/get-started', label: 'Mulai', exact: true },
  { to: '/about', label: 'Tentang', exact: true },
]

const ALL_GROUPS = [
  { title: 'Framework', links: frameworkLinks },
  { title: 'Tools', links: toolLinks },
  { title: 'Lainnya', links: otherLinks },
]

function itemClass({ isActive }) {
  return `group flex items-start gap-2.5 rounded-lg px-3 py-1.5 text-sm transition-colors ${
    isActive
      ? 'bg-brand-100 font-semibold text-brand-800'
      : 'text-ink-muted hover:bg-slate-100 hover:text-ink'
  }`
}

function SidebarGroup({ title, links }) {
  if (!links.length) return null
  return (
    <div>
      <p className="mb-1.5 px-3 font-mono text-2xs uppercase tracking-widest text-ink-subtle">
        {title}
      </p>
      <ul className="space-y-0.5">
        {links.map(link => (
          <li key={link.to}>
            <NavLink to={link.to} end={link.exact} className={itemClass}>
              {link.number && (
                <span className="mt-px shrink-0 font-mono text-2xs tabular-nums text-ink-subtle">
                  {link.number}
                </span>
              )}
              <span className="min-w-0 leading-snug">{link.label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  )
}

// Below lg the rail is hidden, so a sub-page would otherwise have no way to
// reach a sibling without going back to the overview first.
function MobileJumpSelect({ groups }) {
  const navigate = useNavigate()
  const location = useLocation()
  const known = groups.some(g => g.links.some(l => l.to === location.pathname))

  return (
    <select
      value={known ? location.pathname : ''}
      onChange={e => e.target.value && navigate(e.target.value)}
      aria-label="Lompat ke halaman"
      className="mb-6 w-full rounded-xl border border-line bg-elevated px-3 py-2.5 text-sm font-medium text-ink lg:hidden"
    >
      {!known && <option value="">Lompat ke…</option>}
      {groups.map(g => (
        <optgroup key={g.title} label={g.title}>
          {g.links.map(link => (
            <option key={link.to} value={link.to}>
              {link.number ? `${link.number} — ${link.label}` : link.label}
            </option>
          ))}
        </optgroup>
      ))}
    </select>
  )
}

/**
 * Persistent documentation rail.
 *
 * `section` narrows which groups show ('framework' | 'tools'); omit it to show
 * the full index. Passing an unknown section shows everything rather than
 * rendering an empty rail.
 */
export default function Sidebar({ section }) {
  const [query, setQuery] = useState('')

  const groups = useMemo(() => {
    const scoped =
      section === 'framework' || section === 'tools'
        ? ALL_GROUPS.filter(g => g.title.toLowerCase() === section)
        : ALL_GROUPS

    const q = query.trim().toLowerCase()
    if (!q) return scoped

    return scoped
      .map(g => ({ ...g, links: g.links.filter(l => l.label.toLowerCase().includes(q)) }))
      .filter(g => g.links.length)
  }, [section, query])

  const allGroups = useMemo(
    () =>
      section === 'framework' || section === 'tools'
        ? ALL_GROUPS.filter(g => g.title.toLowerCase() === section)
        : ALL_GROUPS,
    [section],
  )

  return (
    <>
      <MobileJumpSelect groups={allGroups} />

      <aside className="hidden w-60 shrink-0 lg:block">
        <nav aria-label="Navigasi dokumentasi" className="sticky top-20 max-h-[calc(100vh-6rem)] space-y-6 overflow-y-auto py-2 pr-1">
          <div className="relative">
            <input
              type="search"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Cari halaman…"
              aria-label="Cari halaman"
              className="w-full rounded-lg border border-line bg-surface-sunken py-1.5 pl-8 pr-3 text-sm text-ink placeholder:text-ink-subtle"
            />
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-subtle"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" strokeLinecap="round" />
            </svg>
          </div>

          {groups.length === 0 ? (
            <p className="px-3 text-sm text-ink-subtle">Tidak ada halaman yang cocok.</p>
          ) : (
            groups.map(g => <SidebarGroup key={g.title} {...g} />)
          )}
        </nav>
      </aside>
    </>
  )
}
