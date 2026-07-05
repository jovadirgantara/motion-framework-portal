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

// Ikon dalam "blob" organik berwarna — pengganti emoji telanjang.
export default function IconBlob({ icon, accent = 'brand', size = 'md', className = '' }) {
  return (
    <div
      className={`${SIZES[size]} ${COLORS[accent]} flex items-center justify-center shrink-0 rounded-[40%_60%_55%_45%/50%_45%_55%_50%] ${className}`}
    >
      <span aria-hidden="true">{icon}</span>
    </div>
  )
}
