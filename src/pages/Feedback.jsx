import { useEffect } from 'react'
import PageLayout from '../components/layout/PageLayout'
import FadeIn from '../components/ui/FadeIn'
import { trackEvent } from '../utils/analytics'

// Ganti URL ini dengan Google Form atau Typeform yang sesungguhnya
const FEEDBACK_FORM_URL = 'https://docs.google.com/forms/d/e/YOUR_FORM_ID/viewform?embedded=true'

export default function Feedback() {
  useEffect(() => {
    trackEvent('feedback_opened', { source: 'direct' })
  }, [])

  return (
    <PageLayout>
      <FadeIn>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Feedback Penelitian</h1>
        <p className="text-slate-600 mb-6">
          Feedback Anda membantu mengkalibrasi framework dan menyempurnakan portal ini
          sebagai bagian dari penelitian Design and Development Research.
        </p>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 text-sm text-amber-800">
          <strong>Untuk Pilot Testing:</strong> Isi form setelah Anda selesai mencoba semua 4 tool.
          Form mencakup Likert 1–5 (usability, kejelasan konten, kegunaan tool, efektivitas keseluruhan)
          dan pertanyaan terbuka.
        </div>

        {/* Embedded Google Form placeholder */}
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <div className="bg-slate-50 border-b border-slate-200 px-5 py-3 text-sm text-slate-600">
            Form Feedback — Pilot Testing Portal
          </div>
          <div className="p-8 text-center text-slate-500">
            <p className="text-4xl mb-4">📋</p>
            <p className="font-medium mb-2">Form feedback belum dikonfigurasi</p>
            <p className="text-sm mb-4">
              Setelah Google Form atau Typeform dibuat, replace{' '}
              <code className="text-xs bg-slate-100 px-1 py-0.5 rounded">FEEDBACK_FORM_URL</code>{' '}
              di <code className="text-xs bg-slate-100 px-1 py-0.5 rounded">src/pages/Feedback.jsx</code>{' '}
              dengan URL embed form Anda.
            </p>
            <p className="text-xs text-slate-400">
              Untuk embed Google Form: Buka Form → Kirim → Tab Embed → Salin URL iframe.
            </p>
          </div>
          {/* Uncomment ini setelah URL form tersedia:
          <iframe
            src={FEEDBACK_FORM_URL}
            width="100%"
            height="800"
            frameBorder="0"
            marginHeight="0"
            marginWidth="0"
            title="Form Feedback Penelitian"
          >
            Loading…
          </iframe>
          */}
        </div>
      </div>
      </FadeIn>
    </PageLayout>
  )
}
