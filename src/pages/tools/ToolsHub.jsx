import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import PageLayout from '../../components/layout/PageLayout'
import PageHeader from '../../components/ui/PageHeader'
import IconBlob from '../../components/ui/IconBlob'
import { revealUp, stagger, viewportOnce, cardHover } from '../../utils/motion'
import { TOOLS } from '../../content/tools-meta'

export default function ToolsHub() {
  return (
    <PageLayout sidebar="tools">
      <PageHeader
        eyebrow="/ Interactive Tools"
        title="4 Interactive Tools"
        description="Semua tool berjalan sepenuhnya di browser — tidak ada data yang dikirim ke server."
        accent="teal"
      />

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        variants={stagger}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        {TOOLS.map(tool => (
          <motion.div key={tool.to} variants={revealUp} whileHover={cardHover}>
            <div className="card card-hover group flex gap-5 p-5 h-full">
              <IconBlob icon={tool.icon} accent={tool.accent} size="lg" />
              <div className="flex-1 flex flex-col">
                <span className="font-mono text-2xs text-slate-400 mb-1">{tool.id}</span>
                <h2 className="font-display text-base font-bold tracking-tight text-slate-900 mb-1.5 group-hover:text-brand-600 transition-colors">
                  {tool.title}
                </h2>
                <p className="text-sm text-slate-500 mb-4 flex-1 leading-relaxed">{tool.desc}</p>
                <div className="flex items-center justify-between gap-2">
                  <Link
                    to={tool.to}
                    className="px-4 py-2 bg-brand-600 text-white text-sm font-semibold rounded-full hover:bg-brand-700 transition-colors"
                  >
                    buka →
                  </Link>
                  <Link
                    to={tool.relatedFramework}
                    className="font-mono text-2xs text-slate-400 hover:text-brand-600 transition-colors"
                  >
                    {tool.relatedLabel}
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </PageLayout>
  )
}
