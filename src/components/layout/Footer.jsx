import { Link } from 'react-router-dom'
import Logo from './Logo'

const NAV = [
  ['/framework', 'Framework'],
  ['/tools', 'Tools'],
  ['/campaign', 'Jadwal'],
  ['/downloads', 'Unduhan'],
  ['/get-started', 'Mulai'],
  ['/about', 'Tentang'],
]

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-line bg-surface-sunken">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4">

          {/* Brand */}
          <div className="md:col-span-2">
            <Link to="/" className="group mb-3 flex items-center gap-3">
              <Logo className="h-9 w-9" />
              <span className="text-sm font-semibold tracking-tight text-ink transition-colors group-hover:text-brand-600">
                Mockup &amp; Motion Framework
              </span>
            </Link>
            <p className="mb-4 max-w-xs text-xs leading-relaxed text-ink-muted">
              Portal dokumentasi interaktif framework produksi motion graphic live commerce berbasis
              visual hierarchy. Dikembangkan sebagai bagian dari penelitian S1 Pendidikan Multimedia,
              UPI Cibiru.
            </p>
            <span className="rounded-full border border-line px-2 py-0.5 font-mono text-2xs text-ink-subtle">
              © 2026 Jova Dirgantara Putra
            </span>
          </div>

          {/* Nav */}
          <div>
            <p className="mb-4 font-mono text-2xs uppercase tracking-widest text-ink-subtle">Navigasi</p>
            <ul className="space-y-2 text-sm">
              {NAV.map(([to, label]) => (
                <li key={to}>
                  <Link to={to} className="text-ink-muted transition-colors hover:text-brand-600">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Research */}
          <div>
            <p className="mb-4 font-mono text-2xs uppercase tracking-widest text-ink-subtle">Penelitian</p>
            <ul className="space-y-2 text-sm text-ink-muted">
              <li className="font-semibold text-ink">Jova Dirgantara Putra</li>
              <li className="font-mono text-xs text-ink-subtle">NIM 2201632</li>
              <li>S1 Pendidikan Multimedia</li>
              <li>UPI Cibiru</li>
              <li className="pt-2">
                <Link
                  to="/feedback"
                  className="inline-flex items-center gap-1.5 rounded-full border border-brand-300 px-3 py-1.5 text-xs font-medium text-brand-700 transition-colors hover:bg-brand-100"
                >
                  Beri Feedback →
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 flex flex-col items-start justify-between gap-2 border-t border-line pt-6 sm:flex-row sm:items-center">
          <p className="font-mono text-2xs text-ink-subtle">
            © 2026 Jova Dirgantara Putra · UPI Cibiru
          </p>
          <p className="font-mono text-2xs text-amber-600">
            Data estimasi adalah SEED default — bukan temuan final penelitian
          </p>
        </div>
      </div>
    </footer>
  )
}
