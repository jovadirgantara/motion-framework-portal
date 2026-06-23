import { useState } from 'react'
import PageLayout from '../components/layout/PageLayout'
import glossary from '../content/glossary.json'

export default function About() {
  const [search, setSearch] = useState('')
  const filtered = glossary.filter(
    g => g.term.toLowerCase().includes(search.toLowerCase()) ||
         g.definition.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <PageLayout>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold text-slate-900 mb-6">Tentang</h1>

        <div className="bg-white border border-slate-200 rounded-xl p-6 mb-6">
          <h2 className="text-base font-semibold text-slate-900 mb-3">Konteks Penelitian</h2>
          <div className="space-y-3 text-sm text-slate-700">
            <p>
              Portal ini adalah <strong>Produk 2</strong> dari penelitian Design and Development Research (DDR)
              berjudul <em>"Pengembangan Framework Produksi Motion Graphic Live Commerce Berbasis Visual Hierarchy"</em>.
            </p>
            <p>
              Produk 1 (framework konseptual) terdiri dari 7 komponen konstitutif yang dikembangkan melalui
              studi lapangan dan tinjauan pustaka. Produk 2 (portal ini) mengoperasionalisasi framework tersebut
              agar dapat diakses, dipraktikkan, dan diukur efektivitasnya oleh praktisi.
            </p>
            <p>
              Data dikumpulkan melalui validasi ahli (3 validator: materi, desain, media) dan pilot testing
              dengan 2–6 motion designer aktif di industri live commerce Indonesia.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          {[
            ['Peneliti', 'Jova Dirgantara Putra'],
            ['NIM', '2201632'],
            ['Program Studi', 'S1 Pendidikan Multimedia'],
            ['Institusi', 'UPI Cibiru'],
            ['Metode', 'Design and Development Research (DDR)'],
            ['Tahun', '2026'],
          ].map(([label, value]) => (
            <div key={label} className="bg-slate-50 rounded-lg px-4 py-3">
              <p className="text-xs text-slate-500">{label}</p>
              <p className="text-sm font-medium text-slate-900">{value}</p>
            </div>
          ))}
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8 text-sm text-amber-800">
          <strong>Catatan integritas data:</strong> Semua angka estimasi waktu, bobot skor, dan threshold
          yang ditampilkan dalam tools adalah nilai <em>default awal (SEED)</em> untuk diuji —
          bukan temuan final penelitian. Nilai ini akan dikalibrasi dari data pilot testing dan
          dilaporkan sebagai bagian dari Bab IV skripsi.
        </div>

        {/* Glossary */}
        <h2 className="text-base font-semibold text-slate-900 mb-3">Glosarium</h2>
        <input
          type="text"
          placeholder="Cari istilah..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full mb-4 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
        />
        <div className="space-y-2">
          {filtered.map(g => (
            <div key={g.term} className="bg-white border border-slate-200 rounded-lg px-4 py-3">
              <p className="text-sm font-semibold text-slate-900 mb-1">{g.term}</p>
              <p className="text-sm text-slate-600">{g.definition}</p>
            </div>
          ))}
          {filtered.length === 0 && (
            <p className="text-sm text-slate-400 text-center py-4">Tidak ada istilah yang cocok.</p>
          )}
        </div>
      </div>
    </PageLayout>
  )
}
