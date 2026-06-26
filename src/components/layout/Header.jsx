import { useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'

const navItems = [
  { label: 'Framework', to: '/framework' },
  { label: 'Tools', to: '/tools' },
  { label: 'Jadwal', to: '/campaign' },
  { label: 'Unduhan', to: '/downloads' },
]

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-12">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-6 h-6 bg-brand-600 rounded-sm flex items-center justify-center shrink-0 transition-transform group-hover:scale-105">
              <span className="text-white text-xs font-mono font-bold leading-none">MG</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold tracking-tight text-slate-900 group-hover:text-brand-700 transition-colors">
                MGLC Framework
              </span>
              <span className="hidden sm:inline font-mono text-2xs text-slate-400 border border-slate-200 rounded px-1.5 py-0.5">
                v0.1-seed
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-0.5">
            {navItems.map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `px-3 py-1.5 text-sm rounded transition-colors font-medium ${
                    isActive || location.pathname.startsWith(item.to)
                      ? 'text-brand-700 bg-brand-50 font-semibold'
                      : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
            <div className="w-px h-4 bg-slate-200 mx-2" />
            <Link
              to="/feedback"
              className="px-3 py-1.5 text-sm font-medium text-white bg-brand-600 rounded hover:bg-brand-700 transition-colors"
            >
              Feedback
            </Link>
          </nav>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-1.5 rounded text-slate-500 hover:bg-slate-100 transition-colors"
            onClick={() => setMenuOpen(prev => !prev)}
            aria-label="Toggle menu"
          >
            {menuOpen ? (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden bg-white px-4 overflow-hidden transition-all duration-200 ease-out ${
          menuOpen ? 'max-h-96 border-t border-slate-100 py-3' : 'max-h-0 py-0'
        }`}
      >
        <div className="space-y-0.5">
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                `block px-3 py-2 text-sm rounded font-medium ${
                  isActive ? 'bg-brand-50 text-brand-700 font-semibold' : 'text-slate-600 hover:bg-slate-50'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
          <div className="pt-2">
            <Link
              to="/feedback"
              onClick={() => setMenuOpen(false)}
              className="block px-3 py-2 text-sm font-medium text-white bg-brand-600 rounded text-center hover:bg-brand-700 transition-colors"
            >
              Feedback
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
