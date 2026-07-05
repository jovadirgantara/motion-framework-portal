import PageLayout from '../components/layout/PageLayout'
import PageHeader from '../components/ui/PageHeader'
import Reveal from '../components/ui/Reveal'
import IconBlob from '../components/ui/IconBlob'
import downloads from '../content/downloads.json'

export default function Downloads() {
  const icons = { pdf: '📄', zip: '📦', txt: '📝', png: '🖼️' }
  const iconAccents = { pdf: 'pink', zip: 'sun', txt: 'teal', png: 'brand' }
  return (
    <PageLayout>
      <Reveal>
        <PageHeader
          eyebrow="/ Unduhan"
          title="Unduhan"
          description="Template, checklist, dan panduan dalam format yang bisa langsung dipakai."
          accent="sun"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {downloads.map(item => (
            <div key={item.id} className="bg-white border border-slate-200 rounded-2xl p-5 flex gap-4">
              <IconBlob icon={icons[item.fileType]} accent={iconAccents[item.fileType]} size="md" />
              <div className="flex-1">
                <h3 className="font-display text-base font-bold text-slate-900 mb-1">{item.title}</h3>
                <p className="text-sm text-slate-600 mb-3">{item.description}</p>
                {item.available ? (
                  <a
                    href={item.fileUrl}
                    download
                    className="inline-flex items-center gap-1 text-sm font-semibold text-brand-600 hover:text-brand-800 hover:underline"
                  >
                    ⬇ Download
                  </a>
                ) : (
                  <p className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded px-2 py-1 inline-block">
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
