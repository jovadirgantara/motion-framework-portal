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
    <div
      aria-hidden="true"
      className={`overflow-hidden rounded-2xl border border-line bg-elevated shadow-lift ${className}`}
    >
      <div className="flex items-center gap-2 border-b border-line bg-surface-sunken px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-line-strong" />
        <span className="h-2.5 w-2.5 rounded-full bg-line-strong" />
        <span className="h-2.5 w-2.5 rounded-full bg-line-strong" />
        <span className="ml-3 flex-1 truncate rounded-md border border-line bg-elevated px-3 py-1 font-mono text-2xs text-ink-subtle">
          portal.motion-framework.id/tools/visual-hierarchy-checklist
        </span>
      </div>

      <div className="p-6">
        <div className="mb-5 flex items-center justify-between">
          <span className="font-mono text-2xs uppercase tracking-widest text-ink-subtle">VH Checklist</span>
          <span className="rounded-full bg-teal-100 px-2 py-1 font-mono text-2xs font-semibold text-teal-800">
            {score}% — Sesuai Standar
          </span>
        </div>
        <ul className="space-y-2.5">
          {PRINCIPLES.map(p => (
            <li key={p.label} className="flex items-center justify-between text-sm">
              <span className="text-ink-muted">{p.label}</span>
              <span
                className={`flex h-5 w-5 items-center justify-center rounded-full text-2xs font-bold ${
                  p.pass ? 'bg-teal-100 text-teal-800' : 'bg-pink-100 text-pink-800'
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
