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
    <motion.div variants={revealUp} className="mb-8">
      <p className={`mb-2 font-mono text-2xs uppercase tracking-widest ${accentClass}`}>{eyebrow}</p>
      <h2 className="font-display text-2xl font-bold tracking-tight text-ink md:text-3xl">{title}</h2>
    </motion.div>
  )
}

function HeroBackground() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div className="absolute -left-24 -top-28 h-[30rem] w-[30rem] rounded-full bg-brand-200/50 blur-3xl" />
      <div className="absolute -bottom-32 -right-16 h-[26rem] w-[26rem] rounded-full bg-teal-200/35 blur-3xl" />
      {/* Faint grid — gives the hero structure without introducing another colour. */}
      <div
        className="absolute inset-0 opacity-[0.35] [mask-image:radial-gradient(70%_60%_at_50%_35%,#000,transparent)]"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgb(var(--t-line)) 1px, transparent 1px), linear-gradient(to bottom, rgb(var(--t-line)) 1px, transparent 1px)',
          backgroundSize: '56px 56px',
        }}
      />
    </div>
  )
}

export default function Home() {
  return (
    <PageLayout>

      {/* Hero */}
      <section className="relative overflow-hidden py-16 md:py-24">
        <HeroBackground />
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[1.1fr_420px] lg:gap-16">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="flex flex-col justify-center space-y-7"
          >
            <motion.p
              variants={revealUp}
              className="inline-flex w-fit items-center gap-2 rounded-full border border-line bg-elevated px-3 py-1 font-mono text-2xs uppercase tracking-widest text-ink-muted"
            >
              <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-teal-500" />
              Penelitian S1 · UPI Cibiru 2026
            </motion.p>

            <motion.h1
              variants={revealUp}
              className="font-display text-5xl font-bold tracking-tight text-ink sm:text-display-md lg:text-display-lg"
            >
              Framework Produksi Motion Graphic{' '}
              <span className="text-brand-600">Live Commerce</span>
            </motion.h1>

            <motion.p variants={revealUp} className="max-w-lg text-lg leading-relaxed text-ink-muted">
              Sebuah framework yang membantu tim live commerce menentukan prioritas informasi visual,
              mempercepat produksi aset, serta menjaga konsistensi kualitas motion graphic pada berbagai campaign marketplace.
            </motion.p>

            <motion.div variants={revealUp} className="flex flex-wrap items-center gap-x-6 gap-y-3 pt-1">
              <motion.div whileHover={buttonHover} whileTap={buttonTap}>
                <Link
                  to="/framework"
                  className="group inline-flex items-center justify-center gap-2 rounded-full bg-brand-600 px-6 py-3 text-sm font-semibold text-on-accent transition-colors hover:bg-brand-700"
                >
                  Baca Framework
                  <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">→</span>
                </Link>
              </motion.div>
              <Link
                to="/tools"
                className="group inline-flex items-center gap-1.5 text-sm font-semibold text-ink transition-colors hover:text-brand-600"
              >
                Langsung ke Tools
                <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">→</span>
              </Link>
            </motion.div>
          </motion.div>

          <motion.div initial="hidden" animate="visible" variants={revealUp} className="hidden lg:block">
            <ProductMockup />
          </motion.div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="border-y border-line py-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={stagger}
          className="flex flex-wrap items-center gap-x-10 gap-y-3"
        >
          {STATS.map(s => (
            <motion.div key={s.label} variants={revealUp} className="flex items-baseline gap-2">
              <span className="font-mono text-lg font-bold text-brand-600">{s.value}</span>
              <span className="text-sm text-ink-muted">{s.label}</span>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Problem Statement */}
      <section className="py-16">
        <motion.div initial="hidden" whileInView="visible" viewport={viewportOnce} variants={stagger}>
          <SectionHeader eyebrow="/ Problem Statement" title="6 Masalah yang Diselesaikan" />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {problems.map(p => (
              <motion.div
                key={p.code}
                variants={bentoEntrance}
                className="card card-hover flex items-start gap-4 p-5"
              >
                <span className="w-10 shrink-0 pt-0.5 font-mono text-sm tabular-nums text-ink-subtle">{p.code}</span>
                <p className="text-sm leading-relaxed text-ink-muted">{p.text}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Framework Index */}
      <section className="py-16">
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
              className="group inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 transition-colors hover:text-brand-700"
            >
              Lihat semua komponen
              <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">→</span>
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
          className="rounded-[2rem] border border-line bg-surface-sunken px-6 py-14 md:px-12"
        >
          <SectionHeader eyebrow="/ Interactive Tools" title="4 Tools Interaktif" accentClass="text-teal-600" />
          <p className="-mt-6 mb-8 max-w-md text-sm text-ink-muted">
            Berjalan sepenuhnya di browser — tidak ada data yang dikirim ke server.
          </p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {TOOLS.map(tool => (
              <motion.div key={tool.to} variants={bentoEntrance}>
                <Link to={tool.to} className="card card-hover group flex h-full gap-5 p-5">
                  <IconBlob icon={tool.icon} accent={tool.accent} size="lg" />
                  <div className="flex flex-1 flex-col">
                    <span className="mb-1 font-mono text-2xs text-ink-subtle">{tool.id}</span>
                    <h3 className="mb-1.5 font-display text-base font-bold tracking-tight text-ink transition-colors group-hover:text-brand-600">
                      {tool.title}
                    </h3>
                    <p className="mb-3 flex-1 text-sm leading-relaxed text-ink-muted">{tool.desc}</p>
                    <span className="self-start text-sm font-semibold text-brand-600 underline-offset-4 group-hover:underline">
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
      <section className="py-16">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={stagger}
          className="flex flex-col gap-8 sm:flex-row sm:items-center"
        >
          <motion.div variants={revealUp} className="shrink-0">
            <IconBlob icon="/icons/framework/campaign-usage-management.png" accent="teal" size="lg" />
          </motion.div>
          <motion.div variants={revealUp} className="flex-1">
            <p className="mb-2 font-mono text-2xs uppercase tracking-widest text-teal-600">
              / Komponen 08 · Campaign Usage Management
            </p>
            <h2 className="mb-2 font-display text-2xl font-bold tracking-tight text-ink">
              Jadwal Penggunaan Mockup
            </h2>
            <p className="max-w-lg text-base leading-relaxed text-ink-muted">
              Cek aset mana yang sedang aktif, akan datang, atau sudah kedaluwarsa.
              Data dikelola Motion Designer Lead via Google Sheets — operator tidak perlu koordinasi manual.
            </p>
          </motion.div>
          <motion.div variants={revealUp} whileHover={buttonHover} whileTap={buttonTap} className="shrink-0">
            <Link
              to="/campaign"
              className="inline-flex items-center gap-2 rounded-full border border-brand-600 px-6 py-3 text-sm font-semibold text-brand-700 transition-colors hover:bg-brand-100"
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
          className="relative overflow-hidden rounded-[2.5rem] bg-brand-600 px-6 py-16 text-center md:px-12"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-brand-500/40 blur-2xl"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-20 -left-10 h-72 w-72 rounded-full bg-pink-400/20 blur-3xl"
          />
          {/* Text on an accent fill uses on-accent at reduced opacity rather than
              a light brand shade: brand-100/200 darken in dark mode and would
              land well under 4.5:1 against the fill. */}
          <div className="relative">
            <p className="mb-3 font-mono text-2xs uppercase tracking-widest text-on-accent/70">/ Feedback</p>
            <h2 className="mb-3 font-display text-3xl font-bold tracking-tight text-on-accent md:text-4xl">
              Sudah mencoba tools-nya?
            </h2>
            <p className="mx-auto mb-8 max-w-xl text-base leading-relaxed text-on-accent/85">
              Feedback Anda membantu mengkalibrasi framework dan menyempurnakan portal ini sebagai bahan penelitian.
            </p>
            <motion.div whileHover={buttonHover} whileTap={buttonTap} className="inline-block">
              <Link
                to="/feedback"
                className="inline-flex items-center gap-2 rounded-full bg-on-accent px-7 py-3.5 text-sm font-bold text-brand-700 transition-opacity hover:opacity-90"
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
