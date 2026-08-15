import { useState, useEffect } from 'react'
import Logo from './Logo'
import ThemeToggle from '../ui/ThemeToggle'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'

// Three zones, matching the three sidebar groups. Secondary destinations
// (Unduhan, Mulai, Tentang) moved into the sidebar's "Lainnya" group and the
// footer — a flat six-item bar was the reason nothing read as primary.
const navItems = [
  { label: 'Framework', to: '/framework' },
  { label: 'Tools', to: '/tools' },
  { label: 'Jadwal', to: '/campaign' },
]

const mobileExtras = [
  { label: 'Unduhan', to: '/downloads' },
  { label: 'Mulai', to: '/get-started' },
  { label: 'Tentang', to: '/about' },
]

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()
  const reduce = useReducedMotion()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close the overlay on navigation, and stop the page scrolling behind it.
  useEffect(() => setMenuOpen(false), [location.pathname])

  useEffect(() => {
    if (!menuOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = e => e.key === 'Escape' && setMenuOpen(false)
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [menuOpen])

  return (
    <motion.header
      initial={reduce ? false : { y: -64 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className={`sticky top-0 z-40 w-full border-b bg-surface/80 backdrop-blur-md transition-[border-color,box-shadow] ${
        scrolled ? 'border-line shadow-lift-sm' : 'border-transparent'
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/" className="group flex items-center gap-3">
            <motion.div
              whileHover={reduce ? undefined : { rotate: 5, scale: 1.08 }}
              transition={{ type: 'spring', stiffness: 400, damping: 12 }}
            >
              <Logo className="h-9 w-9" />
            </motion.div>
            <span className="hidden text-sm font-semibold tracking-tight text-ink transition-colors group-hover:text-brand-600 sm:block">
              Mockup &amp; Motion Framework
            </span>
          </Link>

          {/* Desktop nav */}
          <nav aria-label="Navigasi utama" className="hidden items-center gap-1 md:flex">
            {navItems.map(item => {
              const active = location.pathname === item.to || location.pathname.startsWith(`${item.to}/`)
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  aria-current={active ? 'page' : undefined}
                  className={`relative rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
                    active ? 'text-brand-700' : 'text-ink-muted hover:text-ink'
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="nav-pill"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      className="absolute inset-0 -z-10 rounded-full bg-brand-100"
                    />
                  )}
                  {item.label}
                </NavLink>
              )
            })}

            <span aria-hidden="true" className="mx-2 h-4 w-px bg-line" />
            <ThemeToggle />
            <Link
              to="/feedback"
              className="ml-1 rounded-full bg-brand-600 px-4 py-1.5 text-sm font-semibold text-on-accent transition-colors hover:bg-brand-700"
            >
              Feedback
            </Link>
          </nav>

          {/* Mobile controls */}
          <div className="flex items-center gap-1.5 md:hidden">
            <ThemeToggle />
            <button
              type="button"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-line text-ink-muted transition-colors hover:bg-slate-100 hover:text-ink"
              onClick={() => setMenuOpen(true)}
              aria-label="Buka menu"
              aria-expanded={menuOpen}
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 z-50 bg-surface md:hidden"
          >
            <div className="mx-auto max-w-7xl px-4 sm:px-6">
              <div className="flex h-16 items-center justify-between">
                <Link to="/" className="flex items-center gap-3" onClick={() => setMenuOpen(false)}>
                  <Logo className="h-9 w-9" />
                  <span className="text-sm font-semibold tracking-tight text-ink">
                    Mockup &amp; Motion Framework
                  </span>
                </Link>
                <button
                  type="button"
                  onClick={() => setMenuOpen(false)}
                  aria-label="Tutup menu"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-line text-ink-muted hover:bg-slate-100 hover:text-ink"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <motion.nav
              aria-label="Navigasi utama"
              initial="hidden"
              animate="visible"
              variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.05 } } }}
              className="mx-auto grid max-w-7xl gap-1.5 px-4 pb-8 pt-4 sm:px-6"
            >
              {[...navItems, ...mobileExtras].map(item => (
                <motion.div
                  key={item.to}
                  variants={{ hidden: { opacity: 0, y: 14 }, visible: { opacity: 1, y: 0 } }}
                >
                  <Link
                    to={item.to}
                    className="flex items-center justify-between rounded-2xl px-4 py-3.5 text-base font-medium text-ink transition-colors hover:bg-brand-100 hover:text-brand-800"
                    onClick={() => setMenuOpen(false)}
                  >
                    {item.label}
                    <svg className="h-4 w-4 text-ink-subtle" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="m9 5 7 7-7 7" />
                    </svg>
                  </Link>
                </motion.div>
              ))}
              <motion.div
                variants={{ hidden: { opacity: 0, y: 14 }, visible: { opacity: 1, y: 0 } }}
                className="pt-3"
              >
                <Link
                  to="/feedback"
                  className="block w-full rounded-full bg-brand-600 px-4 py-3 text-center text-sm font-semibold text-on-accent hover:bg-brand-700"
                  onClick={() => setMenuOpen(false)}
                >
                  Beri Feedback
                </Link>
              </motion.div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
