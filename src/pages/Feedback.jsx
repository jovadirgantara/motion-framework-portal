import { useEffect } from 'react'
import PageLayout from '../components/layout/PageLayout'
import PageHeader from '../components/ui/PageHeader'
import Reveal from '../components/ui/Reveal'
import { trackEvent } from '../utils/analytics'

const FEEDBACK_EMAIL = 'jovadirgaputra@gmail.com'
const MAIL_SUBJECT = 'Feedback — Portal Framework Motion Graphic Live Commerce'
const MAIL_BODY = `Halo Jova,

Berikut feedback saya setelah mencoba portal & tools:

1. Usability (1-5):
2. Kejelasan konten (1-5):
3. Kegunaan tool (1-5):
4. Efektivitas keseluruhan (1-5):

Catatan tambahan:
`

const MAILTO_HREF = `mailto:${FEEDBACK_EMAIL}?subject=${encodeURIComponent(MAIL_SUBJECT)}&body=${encodeURIComponent(MAIL_BODY)}`

export default function Feedback() {
  useEffect(() => {
    trackEvent('feedback_opened', { source: 'direct' })
  }, [])

  return (
    <PageLayout>
      <Reveal>
        <div className="max-w-2xl mx-auto">
          <PageHeader
            eyebrow="/ Feedback"
            title="Feedback Penelitian"
            description="Feedback Anda membantu mengkalibrasi framework dan menyempurnakan portal ini sebagai bagian dari penelitian Design and Development Research."
          />

          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-6 text-sm text-amber-800">
            <strong>Untuk Pilot Testing:</strong> Isi feedback setelah Anda selesai mencoba semua 4 tool.
            Sertakan penilaian usability, kejelasan konten, kegunaan tool, dan efektivitas keseluruhan (skala 1–5)
            beserta catatan terbuka.
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6">
            <p className="text-sm text-slate-600 leading-relaxed mb-5">
              Kirim feedback langsung lewat email — draf pesan sudah disiapkan dengan poin penilaian
              di bawah, tinggal isi angka dan catatannya.
            </p>
            <a
              href={MAILTO_HREF}
              onClick={() => trackEvent('feedback_submitted', { method: 'email' })}
              className="inline-flex items-center gap-2 px-6 py-3 bg-brand-600 text-white text-sm font-semibold rounded-full hover:bg-brand-700 transition-colors"
            >
              Kirim Feedback via Email →
            </a>
            <p className="text-xs text-slate-400 mt-4">
              Email tidak terbuka otomatis? Kirim manual ke{' '}
              <a href={`mailto:${FEEDBACK_EMAIL}`} className="text-brand-600 hover:underline">
                {FEEDBACK_EMAIL}
              </a>
              .
            </p>
          </div>
        </div>
      </Reveal>
    </PageLayout>
  )
}
