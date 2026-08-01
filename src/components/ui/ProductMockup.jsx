const PRINCIPLES = [
  { label: 'Size', pass: true },
  { label: 'Contrast', pass: true },
  { label: 'Color', pass: true },
  { label: 'Proximity', pass: false },
  { label: 'Alignment', pass: true },
  { label: 'Motion', pass: true },
]

export default function ProductMockup({ className = '' }) {
  const passCount = PRINCIPLES.filter(p => p.pass).length
  const score = Math.round((passCount / PRINCIPLES.length) * 100)

  return (
    <div className={`rounded-2xl border border-slate-200 bg-white shadow-lift overflow-hidden ${className}`}>
      <div className="flex items-center gap-2 px-4 py-3 bg-slate-50 border-b border-slate-200">
        <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
        <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
        <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
        <span className="ml-3 flex-1 truncate rounded-md bg-white border border-slate-200 px-3 py-1 font-mono text-2xs text-slate-400">
          portal.motion-framework.id/tools/visual-hierarchy-checklist
        </span>
      </div>

      <div className="p-6">
        <div className="flex items-center justify-between mb-5">
          <span className="font-mono text-2xs text-slate-400 tracking-widest uppercase">VH Checklist</span>
          <span className="font-mono text-2xs px-2 py-1 rounded-full bg-teal-100 text-teal-700 font-semibold">
            {score}% — Sesuai Standar
          </span>
        </div>
        <ul className="space-y-2.5">
          {PRINCIPLES.map(p => (
            <li key={p.label} className="flex items-center justify-between text-sm">
              <span className="text-slate-700">{p.label}</span>
              <span
                className={`w-5 h-5 rounded-full flex items-center justify-center text-2xs font-bold ${
                  p.pass ? 'bg-teal-100 text-teal-700' : 'bg-pink-100 text-pink-700'
                }`}
              >
                {p.pass ? '✓' : '✕'}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
