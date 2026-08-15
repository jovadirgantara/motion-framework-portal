// Reminder label bahwa angka/data adalah SEED default, bukan temuan final
export default function SeedNote({ text }) {
  return (
    <div className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
      <span aria-hidden="true" className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
      <span>{text ?? 'Nilai ini adalah estimasi default (SEED) yang akan dikalibrasi dari data pilot testing. Bukan temuan final penelitian.'}</span>
    </div>
  )
}
