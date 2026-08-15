import { useEffect, useState } from 'react'
import { applyTheme, getStoredTheme, getSystemTheme, resolveTheme, storeTheme } from '../../utils/theme'

function SunIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}
         strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  )
}

function MoonIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}
         strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  )
}

export default function ThemeToggle({ className = '' }) {
  const [theme, setTheme] = useState(() =>
    typeof document === 'undefined' ? 'light' : resolveTheme(),
  )

  // Follow the OS only while the user has not made an explicit choice.
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = () => {
      if (getStoredTheme()) return
      const next = getSystemTheme()
      setTheme(next)
      applyTheme(next)
    }
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  const toggle = () => {
    const next = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    applyTheme(next)
    storeTheme(next)
  }

  const isDark = theme === 'dark'

  return (
    <button
      type="button"
      onClick={toggle}
      role="switch"
      aria-checked={isDark}
      aria-label={isDark ? 'Ganti ke mode terang' : 'Ganti ke mode gelap'}
      title={isDark ? 'Mode terang' : 'Mode gelap'}
      className={`relative inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full
                  border border-line text-ink-muted transition-colors
                  hover:bg-slate-100 hover:text-ink cursor-pointer ${className}`}
    >
      {/* Both icons are mounted so the swap is a cross-fade rather than a
          remount — no layout shift, and the transition is cheap. */}
      <SunIcon
        aria-hidden="true"
        className={`absolute h-[18px] w-[18px] transition-all duration-200 ${
          isDark ? 'scale-75 opacity-0' : 'scale-100 opacity-100'
        }`}
      />
      <MoonIcon
        aria-hidden="true"
        className={`absolute h-[18px] w-[18px] transition-all duration-200 ${
          isDark ? 'scale-100 opacity-100' : 'scale-75 opacity-0'
        }`}
      />
    </button>
  )
}
