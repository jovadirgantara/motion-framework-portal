import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import PageLayout from '../components/layout/PageLayout'
import PlaceholderImage from '../components/ui/PlaceholderImage'
import frameworkComponents from '../content/framework-components.json'

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
}

const itemFadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

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
      <section className="py-6 overflow-hidden">
        <div className="border border-slate-200 rounded-3xl bg-gradient-to-br from-white to-brand-50/30 px-6 md:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8 lg:gap-12 items-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
              className="flex flex-col justify-center space-y-5 py-10"
            >
              <div className="space-y-4">
                <motion.div
                  initial={{ opacity: 0, scale: 0.85 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="inline-flex items-center rounded-full bg-brand-100 px-3 py-1 font-mono text-2xs text-brand-700 tracking-widest uppercase"
                >
                  DDR Research · S1 Pendidikan Multimedia · UPI Cibiru
                </motion.div>
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.15 }}
                  className="text-3xl md:text-4xl font-semibold tracking-tight text-slate-900 leading-tight"
                >
                  Framework Produksi Motion Graphic{' '}
                  <span className="text-brand-600">Live Commerce</span>{' '}
                  Berbasis Visual Hierarchy
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.3 }}
                  className="text-slate-500 text-base leading-relaxed max-w-xl"
                >
                  Sebuah framework yang membantu tim live commerce menentukan prioritas informasi visual,
                  mempercepat produksi aset, serta menjaga konsistensi kualitas motion graphic pada berbagai campaign marketplace.
                </motion.p>
              </div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.45 }}
                className="flex flex-col gap-3 sm:flex-row"
              >
                <Link
                  to="/framework"
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-brand-600 text-white text-sm font-medium rounded-full hover:bg-brand-700 transition-colors group"
                >
                  Baca Framework
                  <span className="transition-transform group-hover:translate-x-1">→</span>
                </Link>
                <Link
                  to="/tools"
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-medium text-slate-700 border border-slate-300 rounded-full hover:bg-slate-50 transition-colors"
                >
                  Langsung ke Tools
                </Link>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 60 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="hidden lg:flex items-center justify-center py-8"
            >
              <PlaceholderImage
                label="Foto: Suasana produksi live streaming e-commerce"
                aspect="4/3"
                className="w-full rounded-2xl"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Problem Statement */}
      <section className="py-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
          className="border border-slate-200 rounded-3xl bg-brand-50/20 px-6 md:px-10 py-10"
        >
          <div className="mb-8 text-center">
            <div className="inline-block rounded-full bg-brand-100 px-3 py-1 font-mono text-2xs text-brand-700 tracking-widest uppercase mb-3">
              / Problem Statement
            </div>
            <h2 className="text-2xl font-semibold tracking-tight text-slate-900 mb-2">6 Masalah yang Diselesaikan</h2>
            <p className="text-sm text-slate-500">Kondisi aktual produksi motion graphic live commerce di Indonesia</p>
          </div>
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 gap-3"
          >
            {problems.map(p => (
              <motion.div
                key={p.code}
                variants={itemFadeIn}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="flex items-start gap-4 p-4 bg-white border border-slate-200 rounded-2xl hover:border-brand-300 hover:shadow-sm transition-all"
              >
                <span className="font-mono text-2xs text-brand-700 bg-brand-100 px-2 py-0.5 rounded-lg font-semibold shrink-0 mt-0.5">
                  {p.code}
                </span>
                <p className="text-sm text-slate-700 leading-relaxed">{p.text}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* Framework Components */}
      <section className="py-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
          className="border border-slate-200 rounded-3xl px-6 md:px-10 py-10"
        >
          <div className="mb-8 text-center">
            <div className="inline-block rounded-full bg-brand-100 px-3 py-1 font-mono text-2xs text-brand-700 tracking-widest uppercase mb-3">
              / Framework
            </div>
            <h2 className="text-2xl font-semibold tracking-tight text-slate-900 mb-2">8 Komponen Konstitutif</h2>
            <p className="text-sm text-slate-500">Klik komponen untuk baca dokumentasi lengkap</p>
          </div>
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3"
          >
            {mainComponents.map(comp => (
              <motion.div
                key={comp.id}
                variants={itemFadeIn}
                whileHover={{ y: -8, transition: { duration: 0.25 } }}
              >
                <Link
                  to={comp.route}
                  className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white hover:border-brand-300 hover:shadow-md transition-all block h-full"
                >
                  <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-brand-50 group-hover:bg-brand-100 transition-all duration-300" />
                  <div className="h-20 flex items-center justify-center relative">
                    <span className="text-3xl">{comp.icon}</span>
                  </div>
                  <div className="px-4 pb-5">
                    <span className="font-mono text-2xs text-brand-600 block mb-2">
                      {String(comp.order).padStart(2, '0')}
                    </span>
                    <h3 className="text-sm font-semibold tracking-tight text-slate-900 mb-1.5 group-hover:text-brand-700 transition-colors leading-snug">
                      {comp.title}
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">{comp.summary}</p>
                    <div className="mt-3">
                      <span className="text-xs font-medium text-brand-600 group-hover:underline underline-offset-4">
                        Baca lebih →
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
          <div className="mt-6 flex justify-center">
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
              <Link
                to="/framework"
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-brand-700 border border-brand-200 rounded-full hover:bg-brand-50 transition-colors"
              >
                Lihat semua komponen →
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Tools */}
      <section className="py-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
          className="border border-slate-200 rounded-3xl bg-brand-50/20 px-6 md:px-10 py-10"
        >
          <div className="mb-8 text-center">
            <div className="inline-block rounded-full bg-brand-100 px-3 py-1 font-mono text-2xs text-brand-700 tracking-widest uppercase mb-3">
              / Interactive Tools
            </div>
            <h2 className="text-2xl font-semibold tracking-tight text-slate-900 mb-2">4 Tools Interaktif</h2>
            <p className="text-sm text-slate-500">Berjalan sepenuhnya di browser — tidak ada data yang dikirim ke server</p>
          </div>
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-3"
          >
            {tools.map(tool => (
              <motion.div
                key={tool.to}
                variants={itemFadeIn}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
              >
                <Link
                  to={tool.to}
                  className="group relative overflow-hidden flex rounded-2xl border border-slate-200 bg-white hover:border-brand-300 hover:shadow-md transition-all"
                >
                  <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-brand-50 group-hover:bg-brand-100 transition-all duration-300" />
                  <div className="w-16 shrink-0 flex items-center justify-center text-2xl relative">
                    {tool.icon}
                  </div>
                  <div className="flex-1 p-4 flex flex-col">
                    <span className="font-mono text-2xs text-brand-600 mb-1">{tool.code}</span>
                    <h3 className="text-sm font-semibold tracking-tight text-slate-900 mb-1.5 group-hover:text-brand-700 transition-colors">
                      {tool.title}
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed mb-3 flex-1">{tool.desc}</p>
                    <span className="text-xs text-brand-600 font-medium font-mono group-hover:underline underline-offset-4 self-start">
                      buka →
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* Campaign Schedule */}
      <section className="py-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
          className="border border-slate-200 rounded-3xl px-6 md:px-10 py-10"
        >
          <div className="flex flex-col sm:flex-row sm:items-center gap-6">
            <div className="flex-1 border-l-4 border-brand-600 pl-6">
              <div className="inline-block rounded-full bg-brand-100 px-3 py-1 font-mono text-2xs text-brand-700 tracking-widest uppercase mb-3">
                / Komponen 08 · Campaign Usage Management
              </div>
              <h2 className="text-xl font-semibold tracking-tight text-slate-900 mb-2">Jadwal Penggunaan Mockup</h2>
              <p className="text-sm text-slate-500 leading-relaxed max-w-lg">
                Cek aset mana yang sedang aktif, akan datang, atau sudah kedaluwarsa.
                Data dikelola Motion Designer Lead via Google Sheets — operator tidak perlu koordinasi manual.
              </p>
            </div>
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} className="shrink-0">
              <Link
                to="/campaign"
                className="inline-flex items-center gap-2 px-5 py-2.5 border border-brand-600 text-brand-700 text-sm font-medium rounded-full hover:bg-brand-50 transition-colors"
              >
                Buka Jadwal →
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* CTA Feedback */}
      <section className="py-6 pb-12">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
          className="rounded-3xl bg-brand-600 px-6 md:px-10 py-10"
        >
          <div className="flex flex-col sm:flex-row sm:items-center gap-6">
            <div className="flex-1">
              <p className="font-mono text-2xs text-brand-300 tracking-widest uppercase mb-2">/ Feedback</p>
              <h2 className="text-xl font-semibold tracking-tight text-white mb-1.5">Sudah mencoba tools-nya?</h2>
              <p className="text-sm text-brand-100 leading-relaxed">
                Feedback Anda membantu mengkalibrasi framework dan menyempurnakan portal ini sebagai bahan penelitian.
              </p>
            </div>
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} className="shrink-0">
              <Link
                to="/feedback"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-brand-700 text-sm font-semibold rounded-full hover:bg-brand-50 transition-colors"
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
