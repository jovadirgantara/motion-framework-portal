export default function Button({ children, onClick, variant = 'primary', size = 'md', className = '', type = 'button', disabled = false }) {
  const base = 'inline-flex items-center justify-center gap-2 font-semibold rounded-lg transition-colors cursor-pointer disabled:cursor-not-allowed disabled:opacity-50'

  // Accent fills carry `text-on-accent`, never a literal white: in dark mode
  // the accent lightens, and white on it would drop below 4.5:1.
  const variants = {
    primary:   'bg-brand-600 text-on-accent hover:bg-brand-700',
    secondary: 'bg-elevated text-ink border border-line-strong hover:bg-slate-100',
    ghost:     'text-brand-600 hover:bg-brand-100',
    danger:    'bg-red-600 text-on-accent hover:bg-red-700',
  }

  const sizes = {
    sm: 'text-sm px-3 py-1.5',
    md: 'text-sm px-4 py-2',
    lg: 'text-base px-5 py-2.5',
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </button>
  )
}
