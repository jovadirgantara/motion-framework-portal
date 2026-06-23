import { useState } from 'react'
import { Link } from 'react-router-dom'
import PageLayout from '../../components/layout/PageLayout'
import SeedNote from '../../components/ui/SeedNote'
import { trackEvent } from '../../utils/analytics'
import config from '../../config/render-config.json'

function ChoiceButton({ active, onClick, children, sub }) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-4 py-3 text-sm rounded border transition-colors ${
        active
          ? 'bg-brand-600 text-white border-brand-600'
          : 'border-slate-300 text-slate-700 hover:border-brand-400 hover:bg-brand-50'
      }`}
    >
      <span className="font-medium">{children}</span>
      {sub && (
        <span className={`block text-xs mt-0.5 ${active ? 'text-brand-200' : 'text-slate-400'}`}>
          {sub}
        </span>
      )}
    </button>
  )
}

function SectionLabel({ children }) {
  return (
    <p className="eyebrow mb-2">{children}</p>
  )
}

export default function RenderCalculator() {
  const [platform,      setPlatform]      = useState('')
  const [device,        setDevice]        = useState('')
  const [outputType,    setOutputType]    = useState('')
  const [overlayFormat, setOverlayFormat] = useState('')
  const [loopDuration,  setLoopDuration]  = useState('')
  const [software,      setSoftware]      = useState('')
  const [downloaded,    setDownloaded]    = useState(false)

  const isOverlay = outputType === 'overlay_alpha'

  const preset = config.presets.find(p =>
    p.platform    === platform    &&
    p.device      === device      &&
    p.outputType  === outputType  &&
    p.software    === software    &&
    (isOverlay ? p.overlayFormat === overlayFormat : true)
  )

  const platformInfo = config.platforms.find(p => p.value === platform)
  const allSelected  = platform && device && outputType && software &&
                       (!isOverlay || overlayFormat)

  function handleDownload() {
    if (!preset) return
    const lines = [
      '=== RENDER SETTINGS — Motion Graphic Live Commerce Framework ===',
      '',
      `Platform     : ${config.platforms.find(p => p.value === platform)?.label}`,
      `Device       : ${config.devices.find(d => d.value === device)?.label}`,
      `Output Type  : ${config.outputTypes.find(o => o.value === outputType)?.label}`,
      isOverlay ? `Format Overlay: ${config.overlayFormats.find(f => f.value === overlayFormat)?.label}` : null,
      isOverlay && loopDuration ? `Durasi Loop  : ${loopDuration}` : null,
      `Software     : ${config.softwares.find(s => s.value === software)?.label}`,
      '',
      '--- REKOMENDASI SETTING (SEED — belum dikalibrasi final) ---',
      `Codec        : ${preset.codec}`,
      `Format       : ${preset.outputFormat}`,
      `Resolusi     : ${preset.resolution}`,
      `FPS          : ${typeof preset.fps === 'number' ? preset.fps + ' fps' : preset.fps}`,
      `Preset       : ${preset.preset}`,
      preset.alphaChannel ? `Alpha Channel: ${preset.alphaChannel}` : null,
      `Durasi       : ${loopDuration || preset.duration}`,
      '',
      '--- CATATAN ---',
      preset.note,
      '',
      'PERINGATAN: Nilai ini adalah default SEED. Validasi dengan ahli teknis sebelum dianggap final.',
      `Dihasilkan   : ${new Date().toLocaleString('id-ID')}`,
      'Motion Graphic Live Commerce Framework Portal',
    ].filter(Boolean).join('\n')

    const blob = new Blob([lines], { type: 'text/plain;charset=utf-8' })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href     = url
    a.download = `render-setting_${platform}_${device}_${outputType}${overlayFormat ? '_' + overlayFormat : ''}.txt`
    a.click()
    URL.revokeObjectURL(url)
    setDownloaded(true)
    setTimeout(() => setDownloaded(false), 3000)
    trackEvent('render_lookup', { platform, device, outputType, overlayFormat, software })
  }

  // Reset dependent fields when parent changes
  function handlePlatformChange(v) {
    setPlatform(v)
    setDevice('')
    setOutputType('')
    setOverlayFormat('')
    setLoopDuration('')
    setSoftware('')
  }
  function handleDeviceChange(v) {
    setDevice(v)
    setOutputType('')
    setOverlayFormat('')
    setLoopDuration('')
    setSoftware('')
  }
  function handleOutputTypeChange(v) {
    setOutputType(v)
    setOverlayFormat('')
    setLoopDuration('')
    setSoftware('')
  }

  const rows = preset ? [
    ['Codec',         preset.codec],
    ['Format',        preset.outputFormat],
    ['Resolusi',      preset.resolution],
    ['Frame Rate',    typeof preset.fps === 'number' ? `${preset.fps} fps` : preset.fps],
    ['Preset',        preset.preset],
    preset.alphaChannel ? ['Alpha Channel', preset.alphaChannel, 'text-green-400'] : null,
    ['Durasi',        loopDuration || preset.duration],
  ].filter(Boolean) : []

  return (
    <PageLayout sidebar="tools">
      {/* Header */}
      <div className="pb-6 border-b border-slate-200 mb-6">
        <div className="flex items-center gap-2 font-mono text-2xs text-slate-400 mb-3">
          <Link to="/tools" className="hover:text-brand-600">Tools</Link>
          <span>/</span>
          <span>Render Settings Calculator</span>
        </div>
        <p className="eyebrow mb-1">/ Tool 04 · Render Settings Calculator</p>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900 mb-1">Render Settings Calculator</h1>
        <p className="text-sm text-slate-500 max-w-xl">
          Pilih platform, device, jenis output, dan software — dapatkan rekomendasi render setting yang tepat.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form */}
        <div className="border border-slate-200 rounded p-5 space-y-6">

          {/* Platform */}
          <div>
            <SectionLabel>/ Platform</SectionLabel>
            <div className="grid grid-cols-2 gap-2">
              {config.platforms.map(p => (
                <ChoiceButton
                  key={p.value}
                  active={platform === p.value}
                  onClick={() => handlePlatformChange(p.value)}
                  sub={p.resolution + ' · ' + p.aspect}
                >
                  {p.label}
                </ChoiceButton>
              ))}
            </div>
          </div>

          {/* Device */}
          {platform && (
            <div>
              <SectionLabel>/ Device</SectionLabel>
              <div className="grid grid-cols-2 gap-2">
                {config.devices.map(d => (
                  <ChoiceButton
                    key={d.value}
                    active={device === d.value}
                    onClick={() => handleDeviceChange(d.value)}
                  >
                    {d.label}
                  </ChoiceButton>
                ))}
              </div>
            </div>
          )}

          {/* Output Type */}
          {device && (
            <div>
              <SectionLabel>/ Jenis Output</SectionLabel>
              <div className="space-y-2">
                {config.outputTypes.map(o => (
                  <ChoiceButton
                    key={o.value}
                    active={outputType === o.value}
                    onClick={() => handleOutputTypeChange(o.value)}
                  >
                    {o.label}
                  </ChoiceButton>
                ))}
              </div>
            </div>
          )}

          {/* Overlay Format — hanya muncul jika overlay */}
          {isOverlay && outputType && (
            <div>
              <SectionLabel>/ Format Overlay</SectionLabel>
              <div className="space-y-2">
                {config.overlayFormats.filter(f => f.devices.includes(device)).map(f => (
                  <ChoiceButton
                    key={f.value}
                    active={overlayFormat === f.value}
                    onClick={() => setOverlayFormat(f.value)}
                    sub={f.hint}
                  >
                    {f.label}
                  </ChoiceButton>
                ))}
              </div>
            </div>
          )}

          {/* Loop Duration — hanya muncul jika overlay */}
          {isOverlay && overlayFormat && (
            <div>
              <label className="block font-mono text-2xs text-slate-500 tracking-widest uppercase mb-2">
                / Durasi Loop <span className="text-slate-400 normal-case tracking-normal">(opsional)</span>
              </label>
              <input
                type="text"
                value={loopDuration}
                onChange={e => setLoopDuration(e.target.value)}
                placeholder="mis. 10 detik, 00:15, 30 frame"
                className="w-full rounded border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              <p className="text-xs text-slate-400 mt-1">
                Durasi ini akan tercatat di preset card yang didownload.
              </p>
            </div>
          )}

          {/* Software */}
          {outputType && (!isOverlay || overlayFormat) && (
            <div>
              <SectionLabel>/ Software</SectionLabel>
              <div className="space-y-2">
                {config.softwares.map(s => (
                  <ChoiceButton
                    key={s.value}
                    active={software === s.value}
                    onClick={() => setSoftware(s.value)}
                  >
                    {s.label}
                  </ChoiceButton>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Output */}
        <div className="space-y-4">
          {preset ? (
            <>
              <div className="bg-slate-900 rounded p-5">
                <p className="font-mono text-2xs text-slate-500 mb-4 tracking-widest uppercase">Rekomendasi Setting</p>
                <div className="space-y-3">
                  {rows.map(([label, value, textClass]) => (
                    <div key={label} className="flex justify-between items-start border-b border-slate-800 pb-2 last:border-0 last:pb-0 gap-4">
                      <span className="font-mono text-2xs text-slate-400 shrink-0">{label}</span>
                      <span className={`font-mono text-xs font-medium text-right ${textClass ?? 'text-white'}`}>
                        {value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border border-blue-200 bg-blue-50 rounded p-4">
                <p className="font-mono text-2xs text-blue-600 tracking-widest uppercase mb-2">Kenapa Setting Ini?</p>
                <p className="text-xs text-blue-800 leading-relaxed">{preset.note}</p>
              </div>

              <button
                onClick={handleDownload}
                className="w-full py-2.5 text-sm font-medium rounded border border-brand-200 bg-brand-50 text-brand-700 hover:bg-brand-100 transition-colors"
              >
                {downloaded ? '✓ Terunduh!' : 'Download Preset Card (.txt)'}
              </button>
            </>
          ) : (
            <div className="border border-slate-200 rounded p-8 text-center min-h-[200px] flex flex-col justify-center">
              <p className="font-mono text-2xs text-slate-400 tracking-widest uppercase mb-2">Output</p>
              <p className="text-sm text-slate-500">
                {allSelected && !preset
                  ? 'Kombinasi ini belum tersedia di preset. Coba kombinasi lain atau lihat dokumentasi render standard.'
                  : 'Lengkapi semua pilihan di kiri untuk melihat rekomendasi.'}
              </p>
            </div>
          )}

          <SeedNote text="Spesifikasi render ini adalah rekomendasi default berdasarkan praktik umum. Validasi dengan ahli teknis sebelum dianggap final." />

          <div className="border border-brand-200 bg-brand-50 rounded p-4">
            <p className="font-mono text-2xs text-brand-600 tracking-widest uppercase mb-1">Referensi</p>
            <Link to="/framework/render-standard" className="text-brand-700 hover:underline text-sm font-medium">
              Baca dokumentasi Render Standard →
            </Link>
          </div>
        </div>
      </div>

      <div className="mt-8 p-4 border border-slate-200 rounded text-center text-sm">
        <span className="text-slate-500">Tool ini berguna? </span>
        <Link
          to="/feedback"
          className="text-brand-600 font-medium hover:underline"
          onClick={() => trackEvent('feedback_opened', { source: 'render_calculator' })}
        >
          Beri feedback untuk penelitian →
        </Link>
      </div>
    </PageLayout>
  )
}
