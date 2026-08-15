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
        <p className={`mb-2 font-mono text-2xs uppercase tracking-widest ${EYEBROW[accent]}`}>
          {eyebrow}
        </p>
      )}
      <h1 className="mb-3 font-display text-3xl font-bold tracking-tight text-ink md:text-display-sm">
        {title}
      </h1>
      {description && (
        <p className="max-w-2xl text-base leading-relaxed text-ink-muted">{description}</p>
      )}
      {children}
    </Reveal>
  )
}
