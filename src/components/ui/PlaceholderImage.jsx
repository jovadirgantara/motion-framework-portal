export default function PlaceholderImage({ label, aspect = '4/3', className = '' }) {
  return (
    <div
      className={`placeholder-img ${className}`}
      style={{ aspectRatio: aspect }}
    >
      <span className="text-3xl">📷</span>
      <span className="max-w-[80%] text-center leading-relaxed px-4">{label}</span>
    </div>
  )
}
