import { useState } from 'react'

const COLORS = {
  brand: 'bg-brand-100 text-brand-700',
  sun:   'bg-sun-100 text-sun-700',
  teal:  'bg-teal-100 text-teal-700',
  pink:  'bg-pink-100 text-pink-700',
}

const SIZES = {
  sm: 'w-10 h-10 text-lg',
  md: 'w-14 h-14 text-2xl',
  lg: 'w-16 h-16 text-3xl',
}

// Blob ikon berwarna. `icon` adalah path gambar placeholder (mis. /icons/framework/xxx.png)
// yang bisa ditimpa nanti — sebelum file tersedia, tampil placeholder bergaris putus-putus.
export default function IconBlob({ icon, accent = 'brand', size = 'md', className = '' }) {
  const [failed, setFailed] = useState(false)

  return (
    <div
      className={`${SIZES[size]} ${COLORS[accent]} relative flex items-center justify-center shrink-0 overflow-hidden rounded-[40%_60%_55%_45%/50%_45%_55%_50%] ${className}`}
    >
      {icon && !failed ? (
        <img
          src={icon}
          alt=""
          aria-hidden="true"
          className="w-full h-full object-cover"
          onError={() => setFailed(true)}
        />
      ) : (
        <span aria-hidden="true" className="opacity-50 text-[0.85em]">🖼️</span>
      )}
    </div>
  )
}
