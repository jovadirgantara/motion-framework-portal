import { Link } from 'react-router-dom'
import PageLayout from '../components/layout/PageLayout'
import FadeIn from '../components/ui/FadeIn'
import PlaceholderImage from '../components/ui/PlaceholderImage'
import frameworkComponents from '../content/framework-components.json'

const problems = [
  { code: 'P01', text: 'Tidak ada standar visual hierarchy — informasi penting tidak diprioritaskan secara konsisten' },
  { code: 'P02', text: 'Estimasi waktu meleset — tidak ada klasifikasi kompleksitas aset yang terstandarisasi' },
  { code: 'P03', text: 'Manajemen file kacau — naming convention beda-beda antar designer, arsip tidak teratur' },
  { code: 'P04', text: 'Workflow tidak terdokumentasi — onboarding designer baru memakan waktu lama' },
  { code: 'P05', text: 'Usage date aset tidak jelas — operator tidak tahu aset mana yang berlaku untuk sesi live' },
  { code: 'P06', text: 'Ownership tidak jelas — proses revisi, approval, dan maintenance tidak terkontrol' },
]

const tools = [
  {
    to: '/tools/naming-generator',
    code: 'T01',
    icon: '🏷️',
    title: 'Naming Generator',
    desc: 'Generate nama file standar dari input terkontrol. Hilangkan inkonsistensi penamaan selamanya.',
  },
  {
    to: '/tools/complexity-classifier',
    code: 'T02',
    icon: '📊',
    title: 'Complexity Classifier',
    desc: 'Klasifikasikan level kompleksitas aset. Dapatkan estimasi waktu pengerjaan yang realistis.',
  },
  {
    to: '/tools/visual-hierarchy-checklist',
    code: 'T03',
    icon: '✅',
    title: 'VH Checklist',
    desc: 'Review aset terhadap 6 prinsip visual hierarchy. Output: skor adherence terukur + daftar isu.',
  },
  {
    to: '/tools/render-calculator',
    code: 'T04',
    icon: '🎬',
    title: 'Render Calculator',
    desc: 'Rekomendasi render setting per platform — codec, resolusi, fps, alpha channel.',
  },
]

const mainComponents = frameworkComponents
  .filter(c => c.id !== 'framework-overview')
  .sort((a, b) => a.order - b.order)

export default function Home() {
  return (
    <PageLayout>

      {/* Hero */}
      <section className="pt-12 pb-16 border-b border-slate-200">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 md:gap-12 items-center">
          {/* Text — 3/5 */}
          <div className="md:col-span-3">
            <div className="font-mono text-2xs text-brand-600 tracking-widest uppercase mb-4 animate-hero-1">
              DDR Research · S1 Pendidikan Multimedia · UPI Cibiru
            </div>
            <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-slate-900 leading-tight mb-4 animate-hero-2">
              Framework Produksi Motion Graphic{' '}
              <span className="text-brand-600">Live Commerce</span>{' '}
              Berbasis Visual Hierarchy
            </h1>
            <div className="animate-hero-3">
              <p className="text-slate-500 text-base leading-relaxed mb-8 max-w-xl">
                Sebuah framework yang membantu tim live commerce menentukan prioritas informasi visual,
                mempercepat produksi aset, serta menjaga konsistensi kualitas motion graphic pada berbagai campaign marketplace.
              </p>
              <div className="flex items-center gap-3">
                <Link
                  to="/framework"
                  className="px-4 py-2 bg-brand-600 text-white text-sm font-medium rounded hover:bg-brand-700 transition-colors"
                >
                  Baca Framework
                </Link>
                <Link
                  to="/tools"
                  className="px-4 py-2 text-sm font-medium text-slate-700 border border-slate-300 rounded hover:bg-slate-50 transition-colors"
                >
                  Langsung ke Tools
                </Link>
              </div>
            </div>
          </div>
          {/* Photo — 2/5, hidden on mobile */}
          <div className="hidden md:block md:col-span-2 animate-hero-4">
            <PlaceholderImage
              label="Foto: Suasana produksi live streaming e-commerce"
              aspect="4/3"
              className="w-full shadow-lg"
            />
          </div>
        </div>
      </section>

      {/* Problem Statement */}
      <section className="py-16 border-b border-slate-200 section-alt">
        <FadeIn>
          <div className="mb-6">
            <p className="eyebrow mb-1">/ Problem Statement</p>
            <h2 className="section-heading">6 Masalah yang Diselesaikan</h2>
            <p className="text-sm text-slate-500 mt-1">Kondisi aktual produksi motion graphic live commerce di Indonesia</p>
          </div>
          <div className="divide-y divide-slate-200 border border-slate-200 rounded-lg overflow-hidden bg-white">
            {problems.map(p => (
              <div key={p.code} className="flex items-start gap-4 px-4 py-3.5 hover:bg-brand-50 transition-colors">
                <span className="font-mono text-xs text-brand-700 bg-brand-100 px-1.5 py-0.5 rounded font-semibold shrink-0 mt-0.5">
                  {p.code}
                </span>
                <p className="text-sm text-slate-700">{p.text}</p>
              </div>
            ))}
          </div>
        </FadeIn>
      </section>

      {/* Framework Components */}
      <section className="py-16 border-b border-slate-200">
        <FadeIn>
          <div className="mb-6">
            <p className="eyebrow mb-1">/ Framework</p>
            <h2 className="section-heading">8 Komponen Konstitutif</h2>
            <p className="text-sm text-slate-500 mt-1">Klik komponen untuk baca dokumentasi lengkap</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {mainComponents.map(comp => (
              <Link
                key={comp.id}
                to={comp.route}
                className="card card-hover group block overflow-hidden"
              >
                {/* Icon zone */}
                <div className="h-20 bg-brand-50 flex items-center justify-center group-hover:bg-brand-100 transition-colors">
                  <span className="text-3xl">{comp.icon}</span>
                </div>
                {/* Content */}
                <div className="p-4">
                  <span className="font-mono text-2xs text-brand-600 block mb-2">
                    {String(comp.order).padStart(2, '0')}
                  </span>
                  <h3 className="text-sm font-semibold tracking-tight text-slate-900 mb-1.5 group-hover:text-brand-700 transition-colors leading-snug">
                    {comp.title}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">{comp.summary}</p>
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-4">
            <Link to="/framework" className="text-sm text-brand-600 hover:text-brand-800 font-medium">
              Lihat semua komponen →
            </Link>
          </div>
        </FadeIn>
      </section>

      {/* Tools */}
      <section className="py-16 border-b border-slate-200 section-alt">
        <FadeIn>
          <div className="mb-6">
            <p className="eyebrow mb-1">/ Interactive Tools</p>
            <h2 className="section-heading">4 Tools Interaktif</h2>
            <p className="text-sm text-slate-500 mt-1">Berjalan sepenuhnya di browser — tidak ada data yang dikirim ke server</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {tools.map(tool => (
              <Link
                key={tool.to}
                to={tool.to}
                className="card card-hover group flex overflow-hidden"
              >
                {/* Icon zone */}
                <div className="w-16 shrink-0 bg-brand-50 flex items-center justify-center text-2xl group-hover:bg-brand-100 transition-colors">
                  {tool.icon}
                </div>
                {/* Content */}
                <div className="flex-1 p-4 flex flex-col">
                  <span className="font-mono text-2xs text-brand-600 mb-1">{tool.code}</span>
                  <h3 className="text-sm font-semibold tracking-tight text-slate-900 mb-1.5 group-hover:text-brand-700 transition-colors">
                    {tool.title}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed mb-3 flex-1">{tool.desc}</p>
                  <span className="text-xs text-brand-600 font-medium font-mono group-hover:underline self-start">
                    buka →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </FadeIn>
      </section>

      {/* Campaign Schedule */}
      <section className="py-16 border-b border-slate-200">
        <FadeIn>
          <div className="flex flex-col sm:flex-row sm:items-center gap-6">
            <div className="flex-1">
              <p className="eyebrow mb-1">/ Komponen 08 · Campaign Usage Management</p>
              <h2 className="section-heading mb-1.5">Jadwal Penggunaan Mockup</h2>
              <p className="text-sm text-slate-500 leading-relaxed max-w-lg">
                Cek aset mana yang sedang aktif, akan datang, atau sudah kedaluwarsa.
                Data dikelola Motion Designer Lead via Google Sheets — operator tidak perlu koordinasi manual.
              </p>
            </div>
            <div className="shrink-0">
              <Link
                to="/campaign"
                className="inline-flex items-center gap-2 px-4 py-2 border border-brand-600 text-brand-700 text-sm font-medium rounded hover:bg-brand-50 transition-colors"
              >
                Buka Jadwal →
              </Link>
            </div>
          </div>
        </FadeIn>
      </section>

      {/* CTA Feedback */}
      <section className="py-16">
        <FadeIn>
          <div className="border border-slate-200 rounded p-8 flex flex-col sm:flex-row sm:items-center gap-6">
            <div className="flex-1">
              <p className="eyebrow mb-1">/ Feedback</p>
              <h2 className="section-heading mb-1.5">Sudah mencoba tools-nya?</h2>
              <p className="text-sm text-slate-500">
                Feedback Anda membantu mengkalibrasi framework dan menyempurnakan portal ini sebagai bahan penelitian.
              </p>
            </div>
            <Link
              to="/feedback"
              className="shrink-0 px-4 py-2 bg-brand-600 text-white text-sm font-medium rounded hover:bg-brand-700 transition-colors"
            >
              Beri Feedback →
            </Link>
          </div>
        </FadeIn>
      </section>

    </PageLayout>
  )
}
