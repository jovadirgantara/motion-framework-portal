const colorMap = {
  green:  'bg-green-100 text-green-800 ring-green-200',
  blue:   'bg-blue-100 text-blue-800 ring-blue-200',
  yellow: 'bg-yellow-100 text-yellow-800 ring-yellow-200',
  red:    'bg-red-100 text-red-800 ring-red-200',
  indigo: 'bg-brand-100 text-brand-800 ring-brand-200',
  gray:   'bg-slate-100 text-slate-700 ring-slate-200',
}

export default function Badge({ children, color = 'gray', size = 'sm' }) {
  const sizeClass = size === 'lg'
    ? 'text-base px-3 py-1'
    : 'text-xs px-2 py-0.5'
  return (
    <span className={`inline-flex items-center font-medium rounded-full ring-1 ring-inset ${sizeClass} ${colorMap[color] ?? colorMap.gray}`}>
      {children}
    </span>
  )
}
