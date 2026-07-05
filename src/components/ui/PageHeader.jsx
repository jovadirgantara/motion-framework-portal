import Reveal from './Reveal'

const EYEBROW = {
  brand: 'text-brand-600',
  sun:   'text-sun-600',
  teal:  'text-teal-600',
  pink:  'text-pink-600',
}

// Header halaman terbuka — pengganti kotak abu-abu berulang di tiap page.
export default function PageHeader({ eyebrow, title, description, accent = 'brand', children }) {
  return (
    <Reveal className="mb-10">
      {eyebrow && (
        <p className={`font-mono text-2xs tracking-widest uppercase mb-2 ${EYEBROW[accent]}`}>
          {eyebrow}
        </p>
      )}
      <h1 className="font-display text-3xl md:text-4xl font-bold tracking-tight text-slate-900 mb-3">
        {title}
      </h1>
      {description && (
        <p className="text-base text-slate-500 leading-relaxed max-w-2xl">{description}</p>
      )}
      {children}
    </Reveal>
  )
}
