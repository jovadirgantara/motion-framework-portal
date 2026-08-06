import PageLayout from '../components/layout/PageLayout'
import PageHeader from '../components/ui/PageHeader'
import Reveal from '../components/ui/Reveal'
import Badge from '../components/ui/Badge'
import downloads from '../content/downloads.json'

const FILE_TYPE_BADGE_COLOR = {
  pdf: 'pink',
  zip: 'sun',
  txt: 'teal',
  png: 'brand',
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
              <div className="mt-0.5 shrink-0">
                <Badge color={FILE_TYPE_BADGE_COLOR[item.fileType]} size="sm">
                  {item.fileType}
                </Badge>
              </div>
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
