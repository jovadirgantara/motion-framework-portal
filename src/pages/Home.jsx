import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import PageLayout from '../components/layout/PageLayout'
import ProductMockup from '../components/ui/ProductMockup'
import IndexRow from '../components/ui/IndexRow'
import IconBlob from '../components/ui/IconBlob'
import { revealUp, stagger, viewportOnce, bentoEntrance, buttonHover, buttonTap } from '../utils/motion'
import { TOOLS, FRAMEWORK_ACCENTS } from '../content/tools-meta'
import frameworkComponents from '../content/framework-components.json'

const problems = [
  { code: 'P01', text: 'Tidak ada standar visual hierarchy — informasi penting tidak diprioritaskan secara konsisten' },
  { code: 'P02', text: 'Estimasi waktu meleset — tidak ada klasifikasi kompleksitas aset yang terstandarisasi' },
  { code: 'P03', text: 'Manajemen file kacau — naming convention beda-beda antar designer, arsip tidak teratur' },
  { code: 'P04', text: 'Workflow tidak terdokumentasi — onboarding designer baru memakan waktu lama' },
  { code: 'P05', text: 'Usage date aset tidak jelas — operator tidak tahu aset mana yang berlaku untuk sesi live' },
  { code: 'P06', text: 'Ownership tidak jelas — proses revisi, approval, dan maintenance tidak terkontrol' },
]

const mainComponents = frameworkComponents
  .filter(c => c.id !== 'framework-overview')
  .sort((a, b) => a.order - b.order)

const STATS = [
  { value: '8', label: 'Komponen Framework' },
  { value: '4', label: 'Tools Interaktif' },
  { value: 'S1', label: 'Pendidikan Multimedia' },
  { value: 'UPI', label: 'Cibiru' },
]

function SectionHeader({ eyebrow, title, accentClass = 'text-brand-600' }) {
  return (
    <motion.div variants={revealUp} className="mb-6">
      <p className={`font-mono text-2xs tracking-widest uppercase mb-1.5 ${accentClass}`}>{eyebrow}</p>
      <h2 className="font-display text-2xl md:text-3xl font-bold tracking-tight text-slate-900">{title}</h2>
    </motion.div>
  )
}

function HeroBackground() {
  return (
    <div aria-hidden="true" className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
      <div className="absolute -top-24 -left-20 w-[28rem] h-[28rem] rounded-full bg-brand-100/70 blur-3xl" />
      <div className="absolute -bottom-32 -right-10 w-[24rem] h-[24rem] rounded-full bg-sun-100/50 blur-3xl" />
    </div>
  )
}

export default function Home() {
  return (
    <PageLayout>

      {/* Hero */}
      <section className="relative py-16 md:py-24 overflow-hidden">
        <HeroBackground />
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_420px] gap-10 lg:gap-16 items-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="flex flex-col justify-center space-y-6"
          >
            <motion.h1
              variants={revealUp}
              className="font-display text-6xl md:text-7xl font-bold tracking-tight text-slate-900 leading-[0.95]"
            >
              Framework Produksi Motion Graphic{' '}
              <span className="text-brand-500">Live Commerce</span>
            </motion.h1>
            <motion.p variants={revealUp} className="text-lg text-slate-500 leading-relaxed max-w-lg">
              Sebuah framework yang membantu tim live commerce menentukan prioritas informasi visual,
              mempercepat produksi aset, serta menjaga konsistensi kualitas motion graphic pada berbagai campaign marketplace.
            </motion.p>
            <motion.div variants={revealUp} className="flex items-center gap-6 pt-1">
              <motion.div whileHover={buttonHover} whileTap={buttonTap}>
                <Link
                  to="/framework"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-brand-600 text-white text-sm font-semibold rounded-full hover:bg-brand-700 transition-colors group"
                >
                  Baca Framework
                  <span className="transition-transform group-hover:translate-x-1">→</span>
                </Link>
              </motion.div>
              <Link
                to="/tools"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-700 hover:text-brand-600 transition-colors group"
              >
                Langsung ke Tools
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </Link>
            </motion.div>
          </motion.div>

          <motion.div initial="hidden" animate="visible" variants={revealUp} className="hidden lg:block">
            <ProductMockup />
          </motion.div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="py-6 border-y border-slate-100">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={stagger}
          className="flex flex-wrap items-center gap-x-8 gap-y-3"
        >
          {STATS.map(s => (
            <motion.div key={s.label} variants={revealUp} className="flex items-baseline gap-2">
              <span className="font-mono text-lg font-bold text-brand-600">{s.value}</span>
              <span className="text-sm text-slate-500">{s.label}</span>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Problem Statement */}
      <section className="py-14">
        <motion.div initial="hidden" whileInView="visible" viewport={viewportOnce} variants={stagger}>
          <SectionHeader eyebrow="/ Problem Statement" title="6 Masalah yang Diselesaikan" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {problems.map(p => (
              <motion.div
                key={p.code}
                variants={bentoEntrance}
                className="card card-hover flex items-start gap-4 p-5"
              >
                <span className="font-mono text-sm text-slate-400 shrink-0 pt-0.5 w-10">{p.code}</span>
                <p className="text-sm text-slate-700 leading-relaxed">{p.text}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Framework Index */}
      <section className="py-14">
        <motion.div initial="hidden" whileInView="visible" viewport={viewportOnce} variants={stagger}>
          <SectionHeader eyebrow="/ Framework" title="8 Komponen Konstitutif" />
          <div className="space-y-3">
            {mainComponents.map(comp => {
              const accent = FRAMEWORK_ACCENTS[(comp.order - 1) % 4]
              return (
                <motion.div key={comp.id} variants={bentoEntrance}>
                  <IndexRow
                    number={String(comp.order).padStart(2, '0')}
                    title={comp.title}
                    summary={comp.summary}
                    to={comp.route}
                    accent={accent}
                  />
                </motion.div>
              )
            })}
          </div>
          <motion.div variants={revealUp} className="mt-6">
            <Link
              to="/framework"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 hover:text-brand-800 transition-colors group"
            >
              Lihat semua komponen
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Tools */}
      <section className="py-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={stagger}
          className="rounded-[2rem] bg-slate-50 px-6 md:px-12 py-14"
        >
          <SectionHeader eyebrow="/ Interactive Tools" title="4 Tools Interaktif" accentClass="text-teal-600" />
          <p className="text-sm text-slate-500 -mt-4 mb-8 max-w-md">
            Berjalan sepenuhnya di browser — tidak ada data yang dikirim ke server.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {TOOLS.map(tool => (
              <motion.div key={tool.to} variants={bentoEntrance}>
                <Link
                  to={tool.to}
                  className="card card-hover group flex gap-5 p-5 h-full"
                >
                  <IconBlob icon={tool.icon} accent={tool.accent} size="lg" />
                  <div className="flex-1 flex flex-col">
                    <span className="font-mono text-2xs text-slate-400 mb-1">{tool.id}</span>
                    <h3 className="font-display text-base font-bold tracking-tight text-slate-900 mb-1.5 group-hover:text-brand-600 transition-colors">
                      {tool.title}
                    </h3>
                    <p className="text-sm text-slate-500 leading-relaxed mb-3 flex-1">{tool.desc}</p>
                    <span className="text-sm font-semibold text-brand-600 group-hover:underline underline-offset-4 self-start">
                      buka →
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Campaign Schedule */}
      <section className="py-14">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={stagger}
          className="flex flex-col sm:flex-row sm:items-center gap-8"
        >
          <motion.div variants={revealUp} className="shrink-0">
            <IconBlob icon="/icons/framework/campaign-usage-management.png" accent="teal" size="lg" />
          </motion.div>
          <motion.div variants={revealUp} className="flex-1">
            <p className="font-mono text-2xs text-teal-600 tracking-widest uppercase mb-2">
              / Komponen 08 · Campaign Usage Management
            </p>
            <h2 className="font-display text-2xl font-bold tracking-tight text-slate-900 mb-2">
              Jadwal Penggunaan Mockup
            </h2>
            <p className="text-base text-slate-500 leading-relaxed max-w-lg">
              Cek aset mana yang sedang aktif, akan datang, atau sudah kedaluwarsa.
              Data dikelola Motion Designer Lead via Google Sheets — operator tidak perlu koordinasi manual.
            </p>
          </motion.div>
          <motion.div variants={revealUp} whileHover={buttonHover} whileTap={buttonTap} className="shrink-0">
            <Link
              to="/campaign"
              className="inline-flex items-center gap-2 px-6 py-3 border border-brand-600 text-brand-700 text-sm font-semibold rounded-full hover:bg-brand-50 transition-colors"
            >
              Buka Jadwal →
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* CTA Feedback */}
      <section className="py-8 pb-16">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={revealUp}
          className="relative overflow-hidden rounded-[2.5rem] bg-brand-600 px-6 md:px-12 py-14 text-center"
        >
          <div
            aria-hidden="true"
            className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-brand-500/40 blur-2xl pointer-events-none"
          />
          <div
            aria-hidden="true"
            className="absolute -bottom-20 -left-10 w-72 h-72 rounded-full bg-pink-400/20 blur-3xl pointer-events-none"
          />
          <div className="relative">
            <p className="font-mono text-2xs text-brand-200 tracking-widest uppercase mb-3">/ Feedback</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight text-white mb-3">
              Sudah mencoba tools-nya?
            </h2>
            <p className="text-base text-brand-100 leading-relaxed max-w-xl mx-auto mb-8">
              Feedback Anda membantu mengkalibrasi framework dan menyempurnakan portal ini sebagai bahan penelitian.
            </p>
            <motion.div whileHover={buttonHover} whileTap={buttonTap} className="inline-block">
              <Link
                to="/feedback"
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-white text-brand-700 text-sm font-bold rounded-full hover:bg-brand-50 transition-colors"
              >
                Beri Feedback →
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </section>

    </PageLayout>
  )
}
