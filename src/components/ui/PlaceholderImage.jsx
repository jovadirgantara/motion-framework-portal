function CameraIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-7 w-7"
    >
      <path d="M3 8.5A1.5 1.5 0 0 1 4.5 7h2.7a1.5 1.5 0 0 0 1.24-.66l.62-.93A1.5 1.5 0 0 1 10.3 4.8h3.4a1.5 1.5 0 0 1 1.24.66l.62.93A1.5 1.5 0 0 0 16.8 7h2.7A1.5 1.5 0 0 1 21 8.5v9a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 17.5z" />
      <circle cx="12" cy="12.75" r="3.25" />
    </svg>
  )
}

export default function PlaceholderImage({ label, aspect = '4/3', className = '' }) {
  return (
    <div className={`placeholder-img ${className}`} style={{ aspectRatio: aspect }}>
      <CameraIcon />
      <span className="max-w-[80%] px-4 text-center leading-relaxed">{label}</span>
    </div>
  )
}
