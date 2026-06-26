import PageLayout from '../components/layout/PageLayout'
import FadeIn from '../components/ui/FadeIn'
import downloads from '../content/downloads.json'

export default function Downloads() {
  const icons = { pdf: '📄', zip: '📦', txt: '📝', png: '🖼️' }
  return (
    <PageLayout>
      <FadeIn>
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 mb-8">
          <p className="eyebrow mb-1">/ Unduhan</p>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 mb-1">Unduhan</h1>
          <p className="text-sm text-slate-500">Template, checklist, dan panduan dalam format yang bisa langsung dipakai.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {downloads.map(item => (
            <div key={item.id} className="bg-white border border-slate-200 rounded-xl p-5 flex gap-4">
              <div className="text-3xl shrink-0">{icons[item.fileType]}</div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-slate-900 mb-1">{item.title}</h3>
                <p className="text-xs text-slate-600 mb-3">{item.description}</p>
                {item.available ? (
                  <a
                    href={item.fileUrl}
                    download
                    className="inline-flex items-center gap-1 text-xs font-medium text-brand-600 hover:text-brand-800 hover:underline"
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
      </FadeIn>
    </PageLayout>
  )
}
