// Identitas 4 tools — satu sumber untuk Home, ToolsHub, dan halaman tool.
export const TOOLS = [
  {
    id: 'T01',
    to: '/tools/naming-generator',
    icon: '🏷️',
    accent: 'sun',
    title: 'Naming Generator',
    desc: 'Generate nama file standar dari input terkontrol. Hilangkan inkonsistensi penamaan selamanya.',
    relatedFramework: '/framework/naming-convention',
    relatedLabel: 'Baca: Naming Convention',
  },
  {
    id: 'T02',
    to: '/tools/complexity-classifier',
    icon: '📊',
    accent: 'teal',
    title: 'Complexity Classifier',
    desc: 'Klasifikasikan level kompleksitas aset. Dapatkan estimasi waktu pengerjaan yang realistis.',
    relatedFramework: '/framework/complexity',
    relatedLabel: 'Baca: Klasifikasi Kompleksitas',
  },
  {
    id: 'T03',
    to: '/tools/visual-hierarchy-checklist',
    icon: '✅',
    accent: 'pink',
    title: 'VH Checklist',
    desc: 'Review aset terhadap 6 prinsip visual hierarchy. Output: skor adherence terukur + daftar isu.',
    relatedFramework: '/framework/quality-control',
    relatedLabel: 'Baca: Quality Control',
  },
  {
    id: 'T04',
    to: '/tools/render-calculator',
    icon: '🎬',
    accent: 'brand',
    title: 'Render Calculator',
    desc: 'Rekomendasi render setting per platform — codec, resolusi, fps, alpha channel.',
    relatedFramework: '/framework/render-standard',
    relatedLabel: 'Baca: Render Standard',
  },
]

// Rotasi aksen untuk 8 komponen framework: aksen = FRAMEWORK_ACCENTS[(order - 1) % 4]
export const FRAMEWORK_ACCENTS = ['brand', 'sun', 'teal', 'pink']
