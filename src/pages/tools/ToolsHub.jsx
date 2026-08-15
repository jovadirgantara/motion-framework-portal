import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import PageLayout from '../../components/layout/PageLayout'
import PageHeader from '../../components/ui/PageHeader'
import IconBlob from '../../components/ui/IconBlob'
import { revealUp, stagger, viewportOnce } from '../../utils/motion'
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
        className="grid grid-cols-1 gap-4 md:grid-cols-2"
      >
        {TOOLS.map(tool => (
          <motion.div key={tool.to} variants={revealUp} className="h-full">
            <div className="card card-hover group flex h-full gap-5 p-5">
              <IconBlob icon={tool.icon} accent={tool.accent} size="lg" />
              <div className="flex flex-1 flex-col">
                <span className="mb-1 font-mono text-2xs text-ink-subtle">{tool.id}</span>
                <h2 className="mb-1.5 font-display text-base font-bold tracking-tight text-ink transition-colors group-hover:text-brand-600">
                  {tool.title}
                </h2>
                <p className="mb-4 flex-1 text-sm leading-relaxed text-ink-muted">{tool.desc}</p>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <Link
                    to={tool.to}
                    className="rounded-full bg-brand-600 px-4 py-2 text-sm font-semibold text-on-accent transition-colors hover:bg-brand-700"
                  >
                    buka →
                  </Link>
                  <Link
                    to={tool.relatedFramework}
                    className="font-mono text-2xs text-ink-subtle underline-offset-4 transition-colors hover:text-brand-600 hover:underline"
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
