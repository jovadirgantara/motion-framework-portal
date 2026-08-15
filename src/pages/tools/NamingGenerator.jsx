import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import PageLayout from '../../components/layout/PageLayout'
import Reveal from '../../components/ui/Reveal'
import SeedNote from '../../components/ui/SeedNote'
import Button from '../../components/ui/Button'
import { buildDisplayName } from '../../utils/sanitize'
import { trackEvent } from '../../utils/analytics'
import config from '../../config/naming-config.json'

function SelectField({ label, value, onChange, options, required }) {
  return (
    <div>
      <label className="block text-xs font-medium text-ink-muted mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full rounded border border-line-strong px-3 py-2 text-sm bg-elevated focus:outline-none focus:ring-2 focus:ring-brand-500"
      >
        <option value="">Pilih...</option>
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  )
}

function TextField({ label, value, onChange, placeholder, hint, required, optional }) {
  return (
    <div>
      <label className="block text-xs font-medium text-ink-muted mb-1">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
        {optional && <span className="text-ink-subtle font-normal ml-1">(opsional)</span>}
      </label>
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded border border-line-strong px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
      />
      {hint && <p className="text-xs text-ink-subtle mt-1">{hint}</p>}
    </div>
  )
}

export default function NamingGenerator() {
  const [platform,         setPlatform]         = useState('')
  const [assetType,        setAssetType]         = useState('')
  const [assetTypeCustom,  setAssetTypeCustom]   = useState('')
  const [brand,            setBrand]             = useState('')
  const [mockupType,       setMockupType]        = useState('')
  const [campaignType,     setCampaignType]      = useState('')
  const [campaignCustom,   setCampaignCustom]    = useState('')
  const [periodDate,       setPeriodDate]        = useState('')
  const [periodTime,       setPeriodTime]        = useState('')
  const [copied,           setCopied]            = useState(false)
  const [generated,        setGenerated]         = useState(false)

  const platformLabel   = config.platforms.find(p => p.value === platform)?.label ?? platform
  const resolvedAsset   = assetType === 'Other' ? assetTypeCustom.trim() : assetType
  const resolvedCampaign = campaignType === 'Other' ? campaignCustom.trim() : campaignType

  const isReady = platform && resolvedAsset && brand.trim() && mockupType.trim() && resolvedCampaign

  const displayName = isReady
    ? buildDisplayName({
        fileType: resolvedAsset,
        platformLabel: platform,
        brand: brand.trim(),
        mockupType: mockupType.trim(),
        campaign: resolvedCampaign,
        periodDate: periodDate.trim(),
        periodTime: periodTime.trim(),
      })
    : null

  useEffect(() => {
    setGenerated(false)
  }, [platform, assetType, assetTypeCustom, brand, mockupType, campaignType, campaignCustom, periodDate, periodTime])

  function handleGenerate() {
    if (!isReady) return
    setGenerated(true)
    trackEvent('naming_generated', { platform, assetType, campaignType })
  }

  function handleCopy() {
    if (!displayName) return
    if (navigator.clipboard) {
      navigator.clipboard.writeText(displayName)
        .then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000) })
        .catch(() => fallbackCopy(displayName))
    } else {
      fallbackCopy(displayName)
    }
  }

  function fallbackCopy(text) {
    const el = document.createElement('textarea')
    el.value = text
    el.style.cssText = 'position:fixed;opacity:0;pointer-events:none'
    document.body.appendChild(el)
    el.focus()
    el.select()
    try {
      document.execCommand('copy')
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (_) {}
    document.body.removeChild(el)
  }

  return (
    <PageLayout sidebar="tools">
      {/* Header */}
      <Reveal>
        <div className="pb-6 border-b border-line mb-6">
          <div className="flex items-center gap-2 font-mono text-2xs text-ink-subtle mb-3">
            <Link to="/tools" className="hover:text-brand-600">Tools</Link>
            <span>/</span>
            <span>Naming Generator</span>
          </div>
          <p className="eyebrow text-sun-600 mb-1">/ Tool 01 · Naming Convention Generator</p>
          <h1 className="font-display text-3xl font-bold tracking-tight text-ink mb-2">Naming Convention Generator</h1>
          <p className="text-sm text-ink-muted">
            Generate nama aset standar sesuai konvensi framework. Format:{' '}
            <span className="font-mono text-brand-600">FileType [Platform] Brand MockupType Campaign (Periode) (Jam)</span>
          </p>
        </div>
      </Reveal>

      <Reveal delay={80}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form */}
        <div className="border border-line rounded p-5 space-y-4">

          <SelectField
            label="Platform"
            value={platform}
            onChange={setPlatform}
            options={config.platforms}
            required
          />

          {/* File Type */}
          <SelectField
            label="File Type (Jenis Aset)"
            value={assetType}
            onChange={v => { setAssetType(v); setAssetTypeCustom('') }}
            options={config.assetTypes}
            required
          />
          {assetType === 'Other' && (
            <TextField
              label="Nama File Type Kustom"
              value={assetTypeCustom}
              onChange={setAssetTypeCustom}
              placeholder="mis. Preview, Thumbnail, Sticker"
              required
            />
          )}

          <SelectField
            label="Brand"
            value={brand}
            onChange={setBrand}
            options={config.brands}
            required
          />

          <TextField
            label="Mockup Type"
            value={mockupType}
            onChange={setMockupType}
            placeholder="mis. Mingyu, Di Stroller, Couple"
            required
          />

          {/* Campaign */}
          <SelectField
            label="Campaign"
            value={campaignType}
            onChange={v => { setCampaignType(v); setCampaignCustom('') }}
            options={config.campaignTypes}
            required
          />
          {campaignType === 'Other' && (
            <TextField
              label="Nama Campaign Kustom"
              value={campaignCustom}
              onChange={setCampaignCustom}
              placeholder="mis. Harbolnas, Anniversary"
              required
            />
          )}

          {/* Period */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <TextField
              label="Period Tanggal"
              value={periodDate}
              onChange={setPeriodDate}
              placeholder="07 - 24 Juni"
              optional
            />
            <TextField
              label="Period Jam"
              value={periodTime}
              onChange={setPeriodTime}
              placeholder="09:00 - 10:00"
              optional
            />
          </div>

          {/* Generate button */}
          <div className="pt-1">
            <Button
              onClick={handleGenerate}
              disabled={!isReady}
              variant="primary"
              className="w-full"
            >
              {isReady ? 'Generate Nama →' : 'Lengkapi semua field (*)'}
            </Button>
          </div>
        </div>

        {/* Output */}
        <div className="space-y-4">
          <div className="bg-code-bg rounded-xl p-5 min-h-[120px] flex flex-col justify-center">
            <p className="font-mono text-2xs text-code-muted mb-3 tracking-widest uppercase">Output — Display Name</p>
            {generated && displayName ? (
              <>
                <p className="font-mono text-sm text-code-accent break-all mb-4 leading-relaxed">{displayName}</p>
                <button
                  onClick={handleCopy}
                  className="w-full py-2 text-sm font-medium rounded-lg bg-white/10 text-code-ink hover:bg-white/20 transition-colors cursor-pointer"
                >
                  {copied ? 'Tersalin ke clipboard' : 'Copy ke Clipboard'}
                </button>
              </>
            ) : (
              <p className="text-code-muted text-sm italic">
                {isReady && !generated
                  ? 'Klik "Generate Nama" untuk melihat hasil.'
                  : 'Isi semua field wajib (*) lalu klik Generate.'}
              </p>
            )}
          </div>

          {/* Preview live */}
          {isReady && (
            <div className="border border-line rounded p-4">
              <p className="font-mono text-2xs text-ink-subtle tracking-widest uppercase mb-2">Preview Format</p>
              <p className="font-mono text-xs text-ink-muted break-all leading-relaxed">
                {buildDisplayName({
                  fileType: resolvedAsset,
                  platformLabel: platform,
                  brand: brand.trim(),
                  mockupType: mockupType.trim(),
                  campaign: resolvedCampaign,
                  periodDate: periodDate.trim(),
                  periodTime: periodTime.trim(),
                })}
              </p>
            </div>
          )}

          <SeedNote text="Format nama ini adalah konvensi default. Dapat disesuaikan dengan kebutuhan tim setelah validasi ahli." />

          <div className="border border-brand-200 bg-brand-50 rounded p-4">
            <p className="font-mono text-2xs text-brand-600 tracking-widest uppercase mb-1">Referensi</p>
            <Link to="/framework/naming-convention" className="text-brand-700 hover:underline text-sm font-medium">
              Baca dokumentasi Naming Convention →
            </Link>
          </div>
        </div>
      </div>

      {/* Feedback CTA */}
      <div className="mt-8 p-4 border border-line rounded text-center text-sm">
        <span className="text-ink-muted">Tool ini berguna? </span>
        <Link
          to="/feedback"
          className="text-brand-600 font-medium hover:underline"
          onClick={() => trackEvent('feedback_opened', { source: 'naming_generator' })}
        >
          Beri feedback untuk penelitian →
        </Link>
      </div>
      </Reveal>
    </PageLayout>
  )
}
