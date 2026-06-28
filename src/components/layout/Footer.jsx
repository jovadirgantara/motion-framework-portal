import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white mt-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

          {/* Brand */}
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-3 group">
              <div className="w-9 h-9 rounded-2xl bg-brand-600 flex items-center justify-center shrink-0">
                <span className="text-white font-mono font-bold text-xs leading-none">MG</span>
              </div>
              <span className="text-sm font-semibold tracking-tight text-slate-900 group-hover:text-brand-700 transition-colors">
                MGLC Framework
              </span>
            </Link>
            <p className="text-xs text-slate-500 leading-relaxed max-w-xs mb-3">
              Portal dokumentasi interaktif framework produksi motion graphic live commerce berbasis visual hierarchy.
              Dikembangkan sebagai bagian dari penelitian S1 Pendidikan Multimedia, UPI Cibiru.
            </p>
            <span className="font-mono text-2xs text-slate-400 border border-slate-200 rounded-full px-2 py-0.5">
              v0.1-seed · Data belum dikalibrasi
            </span>
          </div>

          {/* Nav */}
          <div>
            <p className="font-mono text-2xs text-slate-400 tracking-widest uppercase mb-4">Navigasi</p>
            <ul className="space-y-2 text-sm">
              {[
                ['/framework', 'Framework'],
                ['/tools', 'Tools'],
                ['/campaign', 'Jadwal'],
                ['/downloads', 'Unduhan'],
                ['/about', 'Tentang'],
              ].map(([to, label]) => (
                <li key={to}>
                  <Link to={to} className="text-slate-500 hover:text-brand-700 transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Research */}
          <div>
            <p className="font-mono text-2xs text-slate-400 tracking-widest uppercase mb-4">Penelitian</p>
            <ul className="space-y-2 text-sm text-slate-500">
              <li className="font-semibold text-slate-700">Jova Dirgantara Putra</li>
              <li className="font-mono text-xs text-slate-400">NIM 2201632</li>
              <li>S1 Pendidikan Multimedia</li>
              <li>UPI Cibiru</li>
              <li className="pt-2">
                <Link
                  to="/feedback"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-brand-700 border border-brand-300 rounded-full hover:bg-brand-50 transition-colors"
                >
                  Beri Feedback →
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <p className="font-mono text-2xs text-slate-400">
            © 2026 Jova Dirgantara Putra · UPI Cibiru
          </p>
          <p className="font-mono text-2xs text-amber-600">
            ⚠ Data estimasi adalah SEED default — bukan temuan final penelitian
          </p>
        </div>
      </div>
    </footer>
  )
}
