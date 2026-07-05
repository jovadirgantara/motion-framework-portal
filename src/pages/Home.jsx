import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import PageLayout from '../components/layout/PageLayout'
import PlaceholderImage from '../components/ui/PlaceholderImage'
import IconBlob from '../components/ui/IconBlob'
import { revealUp, revealScale, stagger, viewportOnce, cardHover, buttonHover, buttonTap } from '../utils/motion'
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

const PROBLEM_CODE_COLORS = [
  'bg-brand-100 text-brand-700',
  'bg-sun-100 text-sun-700',
  'bg-teal-100 text-teal-700',
  'bg-pink-100 text-pink-700',
]

function SectionHeading({ eyebrow, title, subtitle, accentClass = 'text-brand-600' }) {
  return (
    <motion.div variants={revealUp} className="mb-10 text-center">
      <p className={`font-mono text-2xs tracking-widest uppercase mb-3 ${accentClass}`}>{eyebrow}</p>
      <h2 className="font-display text-3xl font-bold tracking-tight text-slate-900 mb-2">{title}</h2>
      <p className="text-base text-slate-500">{subtitle}</p>
    </motion.div>
  )
}

function HeroBlobs() {
  const reduce = useReducedMotion()
  const float = reduce
    ? {}
    : { animate: { y: [0, -16, 0], x: [0, 10, 0] }, transition: { duration: 9, repeat: Infinity, ease: 'easeInOut' } }
  const floatAlt = reduce
    ? {}
    : { animate: { y: [0, 14, 0], x: [0, -12, 0] }, transition: { duration: 11, repeat: Infinity, ease: 'easeInOut' } }
  return (
    <>
      <motion.div
        aria-hidden="true"
        {...float}
        className="absolute -top-10 -left-16 w-72 h-72 rounded-full bg-gradient-to-br from-brand-200/60 to-pink-200/40 blur-3xl pointer-events-none"
      />
      <motion.div
        aria-hidden="true"
        {...floatAlt}
        className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-gradient-to-tr from-sun-200/50 to-teal-200/40 blur-3xl pointer-events-none"
      />
    </>
  )
}

export default function Home() {
  return (
    <PageLayout>

      {/* Hero — terbuka, tanpa kotak, blob dekoratif di belakang */}
      <section className="relative py-14 md:py-20">
        <HeroBlobs />
        <div className="relative grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8 lg:gap-12 items-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="flex flex-col justify-center space-y-6"
          >
            <motion.div
              variants={revealScale}
              className="inline-flex self-start items-center rounded-full bg-brand-100 px-3 py-1 font-mono text-2xs text-brand-700 tracking-widest uppercase"
            >
              DDR Research · S1 Pendidikan Multimedia · UPI Cibiru
            </motion.div>
            <motion.h1
              variants={revealUp}
              className="font-display text-5xl md:text-6xl font-bold tracking-tight text-slate-900 leading-[1.05]"
            >
              Framework Produksi Motion Graphic{' '}
              <span className="text-brand-500">Live Commerce</span>{' '}
              Berbasis Visual Hierarchy
            </motion.h1>
            <motion.p variants={revealUp} className="text-lg text-slate-500 leading-relaxed max-w-xl">
              Sebuah framework yang membantu tim live commerce menentukan prioritas informasi visual,
              mempercepat produksi aset, serta menjaga konsistensi kualitas motion graphic pada berbagai campaign marketplace.
            </motion.p>
            <motion.div variants={revealUp} className="flex flex-col gap-3 sm:flex-row">
              <motion.div whileHover={buttonHover} whileTap={buttonTap}>
                <Link
                  to="/framework"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-brand-600 text-white text-sm font-semibold rounded-full hover:bg-brand-700 transition-colors group"
                >
                  Baca Framework
                  <span className="transition-transform group-hover:translate-x-1">→</span>
                </Link>
              </motion.div>
              <motion.div whileHover={buttonHover} whileTap={buttonTap}>
                <Link
                  to="/tools"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-slate-700 border border-slate-300 rounded-full hover:bg-slate-50 transition-colors"
                >
                  Langsung ke Tools
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={revealScale}
            className="hidden lg:flex items-center justify-center"
          >
            <PlaceholderImage
              label="Foto: Suasana produksi live streaming e-commerce"
              aspect="4/3"
              className="w-full rounded-2xl"
            />
          </motion.div>
        </div>
      </section>

      {/* Problem Statement — pita lembut tanpa border */}
      <section className="py-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={stagger}
          className="rounded-[2.5rem] bg-brand-50/40 px-6 md:px-12 py-14"
        >
          <SectionHeading
            eyebrow="/ Problem Statement"
            title="6 Masalah yang Diselesaikan"
            subtitle="Kondisi aktual produksi motion graphic live commerce di Indonesia"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {problems.map((p, i) => (
              <motion.div
                key={p.code}
                variants={revealUp}
                whileHover={cardHover}
                className="flex items-start gap-4 p-5 bg-white rounded-2xl shadow-sm hover:shadow-lift-sm transition-shadow"
              >
                <span className={`font-mono text-2xs px-2 py-0.5 rounded-lg font-semibold shrink-0 mt-0.5 ${PROBLEM_CODE_COLORS[i % 4]}`}>
                  {p.code}
                </span>
                <p className="text-sm text-slate-700 leading-relaxed">{p.text}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Framework Components — terbuka, tanpa pita */}
      <section className="py-14">
        <motion.div initial="hidden" whileInView="visible" viewport={viewportOnce} variants={stagger}>
          <SectionHeading
            eyebrow="/ Framework"
            title="8 Komponen Konstitutif"
            subtitle="Klik komponen untuk baca dokumentasi lengkap"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {mainComponents.map(comp => {
              const accent = FRAMEWORK_ACCENTS[(comp.order - 1) % 4]
              return (
                <motion.div key={comp.id} variants={revealUp} whileHover={cardHover}>
                  <Link
                    to={comp.route}
                    className="group rounded-2xl border border-slate-200 bg-white hover:border-brand-300 hover:shadow-lift-sm transition-all block h-full p-5"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <IconBlob icon={comp.icon} accent={accent} size="md" />
                      <span className="font-mono text-2xs text-slate-400">
                        {String(comp.order).padStart(2, '0')}
                      </span>
                    </div>
                    <h3 className="font-display text-base font-bold tracking-tight text-slate-900 mb-1.5 group-hover:text-brand-600 transition-colors leading-snug">
                      {comp.title}
                    </h3>
                    <p className="text-sm text-slate-500 leading-relaxed line-clamp-3">{comp.summary}</p>
                    <div className="mt-4">
                      <span className="text-sm font-semibold text-brand-600 group-hover:underline underline-offset-4">
                        Baca lebih →
                      </span>
                    </div>
                  </Link>
                </motion.div>
              )
            })}
          </div>
          <motion.div variants={revealUp} className="mt-8 flex justify-center">
            <motion.div whileHover={buttonHover} whileTap={buttonTap}>
              <Link
                to="/framework"
                className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-brand-700 border border-brand-200 rounded-full hover:bg-brand-50 transition-colors"
              >
                Lihat semua komponen →
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* Tools — pita lembut */}
      <section className="py-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={stagger}
          className="rounded-[2.5rem] bg-slate-50 px-6 md:px-12 py-14"
        >
          <SectionHeading
            eyebrow="/ Interactive Tools"
            title="4 Tools Interaktif"
            subtitle="Berjalan sepenuhnya di browser — tidak ada data yang dikirim ke server"
            accentClass="text-teal-600"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {TOOLS.map(tool => (
              <motion.div key={tool.to} variants={revealUp} whileHover={cardHover}>
                <Link
                  to={tool.to}
                  className="group flex gap-5 rounded-2xl bg-white p-5 shadow-sm hover:shadow-lift-sm transition-shadow h-full"
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

      {/* Campaign Schedule — bagian ringan, bukan band CTA */}
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

      {/* CTA Feedback — satu-satunya blok ungu solid, penutup kuat */}
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
