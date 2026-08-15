import { motion } from 'framer-motion'
import PageLayout from '../components/layout/PageLayout'
import PageHeader from '../components/ui/PageHeader'
import Badge from '../components/ui/Badge'
import { stagger, revealUp, viewportOnce } from '../utils/motion'
import downloads from '../content/downloads.json'

const FILE_TYPE_BADGE_COLOR = {
  pdf: 'pink',
  zip: 'sun',
  txt: 'teal',
  png: 'brand',
}

export default function Downloads() {
  return (
    <PageLayout sidebar="all">
      <PageHeader
        eyebrow="/ Unduhan"
        title="Unduhan"
        description="Template, checklist, dan panduan dalam format yang bisa langsung dipakai."
        accent="sun"
      />

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        variants={stagger}
        className="grid grid-cols-1 gap-3"
      >
        {downloads.map(item => (
          <motion.div key={item.id} variants={revealUp}>
            <div className="card flex flex-col gap-4 p-5 sm:flex-row sm:items-start">
              <div className="shrink-0 sm:mt-0.5">
                <Badge color={FILE_TYPE_BADGE_COLOR[item.fileType]} size="sm">
                  {item.fileType}
                </Badge>
              </div>
              <div className="flex-1">
                <h2 className="mb-1 font-display text-base font-bold text-ink">{item.title}</h2>
                <p className="mb-3 text-sm leading-relaxed text-ink-muted">{item.description}</p>
                {item.available ? (
                  <a
                    href={item.fileUrl}
                    download
                    className="inline-flex items-center gap-1.5 rounded-full border border-brand-300 px-4 py-1.5 text-sm font-semibold text-brand-700 transition-colors hover:bg-brand-100"
                  >
                    Unduh file →
                  </a>
                ) : (
                  <p className="inline-block rounded-lg border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs text-amber-800">
                    {item.availableNote}
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </PageLayout>
  )
}
