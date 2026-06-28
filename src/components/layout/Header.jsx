import { useState, useEffect } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

const navItems = [
  { label: 'Framework', to: '/framework' },
  { label: 'Tools', to: '/tools' },
  { label: 'Jadwal', to: '/campaign' },
  { label: 'Unduhan', to: '/downloads' },
]

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrollY, setScrollY] = useState(0)
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`sticky top-0 z-40 w-full border-b border-slate-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 ${
        scrollY > 50 ? 'shadow-md' : ''
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <motion.div
              whileHover={{ rotate: 5, scale: 1.1 }}
              transition={{ type: 'spring', stiffness: 400, damping: 10 }}
              className="w-9 h-9 rounded-2xl bg-brand-600 flex items-center justify-center shrink-0"
            >
              <span className="text-white text-xs font-mono font-bold leading-none">MG</span>
            </motion.div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold tracking-tight text-slate-900 group-hover:text-brand-700 transition-colors">
                MGLC Framework
              </span>
              <span className="hidden sm:inline font-mono text-2xs text-slate-400 border border-slate-200 rounded-full px-1.5 py-0.5">
                v0.1-seed
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `px-3 py-1.5 text-sm rounded-2xl transition-colors font-medium ${
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
              className="px-4 py-1.5 text-sm font-medium text-white bg-brand-600 rounded-full hover:bg-brand-700 transition-colors"
            >
              Feedback
            </Link>
          </nav>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-xl text-slate-500 hover:bg-slate-100 transition-colors"
            onClick={() => setMenuOpen(true)}
            aria-label="Buka menu"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile full-screen overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-white md:hidden"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between h-14">
                <Link to="/" className="flex items-center gap-3" onClick={() => setMenuOpen(false)}>
                  <div className="w-9 h-9 rounded-2xl bg-brand-600 flex items-center justify-center shrink-0">
                    <span className="text-white text-xs font-mono font-bold leading-none">MG</span>
                  </div>
                  <span className="text-sm font-semibold tracking-tight text-slate-900">MGLC Framework</span>
                </Link>
                <button
                  onClick={() => setMenuOpen(false)}
                  className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <motion.nav
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: { opacity: 1, transition: { staggerChildren: 0.07 } },
              }}
              className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-8 grid gap-2"
            >
              {[...navItems, { label: 'Tentang', to: '/about' }].map((item, i) => (
                <motion.div
                  key={i}
                  variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } }}
                >
                  <Link
                    to={item.to}
                    className="flex items-center justify-between rounded-2xl px-4 py-3 text-base font-medium text-slate-700 hover:bg-brand-50 hover:text-brand-700 transition-colors"
                    onClick={() => setMenuOpen(false)}
                  >
                    {item.label}
                    <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </motion.div>
              ))}
              <motion.div
                variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } }}
                className="pt-3"
              >
                <Link
                  to="/feedback"
                  className="block w-full text-center px-4 py-2.5 text-sm font-medium text-white bg-brand-600 rounded-full hover:bg-brand-700 transition-colors"
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
