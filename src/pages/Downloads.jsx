import PageLayout from '../components/layout/PageLayout'
import PageHeader from '../components/ui/PageHeader'
import Reveal from '../components/ui/Reveal'
import downloads from '../content/downloads.json'

const FILE_TYPE_STYLES = {
  pdf: 'bg-pink-100 text-pink-700',
  zip: 'bg-sun-100 text-sun-700',
  txt: 'bg-teal-100 text-teal-700',
  png: 'bg-brand-100 text-brand-700',
}

export default function Downloads() {
  return (
    <PageLayout>
      <Reveal>
        <PageHeader
          eyebrow="/ Unduhan"
          title="Unduhan"
          description="Template, checklist, dan panduan dalam format yang bisa langsung dipakai."
          accent="sun"
        />
        <div className="border-t border-b border-slate-100 divide-y divide-slate-100">
          {downloads.map(item => (
            <div key={item.id} className="flex items-start gap-4 py-5">
              <span
                className={`font-mono text-2xs font-semibold uppercase tracking-wide px-2 py-1 rounded shrink-0 mt-0.5 ${FILE_TYPE_STYLES[item.fileType]}`}
              >
                {item.fileType}
              </span>
              <div className="flex-1">
                <h3 className="font-display text-base font-bold text-slate-900 mb-1">{item.title}</h3>
                <p className="text-sm text-slate-600 mb-3">{item.description}</p>
                {item.available ? (
                  <a
                    href={item.fileUrl}
                    download
                    className="inline-flex items-center gap-1 text-sm font-semibold text-brand-600 hover:text-brand-800 hover:underline"
                  >
                    Unduh file →
                  </a>
                ) : (
                  <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded px-2 py-1 inline-block">
                    {item.availableNote}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </Reveal>
    </PageLayout>
  )
}
