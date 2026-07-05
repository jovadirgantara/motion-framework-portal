import { useState } from 'react'

// Logo ORBIZ. Taruh file logo di public/logo-orbiz.png (atau .svg, sesuaikan src di bawah).
// Selama file belum ada, fallback ke badge teks "ORBIZ".
export default function Logo({ className = 'w-9 h-9' }) {
  const [failed, setFailed] = useState(false)

  if (failed) {
    return (
      <div className={`${className} rounded-2xl bg-brand-600 flex items-center justify-center shrink-0`}>
        <span className="text-white text-2xs font-mono font-bold leading-none">ORBIZ</span>
      </div>
    )
  }

  return (
    <img
      src="/logo-orbiz.png"
      alt="ORBIZ"
      className={`${className} rounded-2xl object-contain shrink-0`}
      onError={() => setFailed(true)}
    />
  )
}
