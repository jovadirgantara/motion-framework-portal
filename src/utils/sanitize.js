// Sanitasi string untuk naming convention generator

export function toPascalCase(str) {
  return str
    .replace(/[^a-zA-Z0-9\s]/g, '')     // buang karakter ilegal
    .split(/\s+/)
    .filter(Boolean)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('')
}

export function toUpperInitials(str) {
  return str.replace(/[^a-zA-Z]/g, '').toUpperCase().slice(0, 4)
}

export function toDateString(date = new Date()) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}${m}${d}`
}

export function toVersionString(n) {
  return `v${String(n).padStart(2, '0')}`
}

export function buildFilename({ platform, project, assetType, level, version, initials, date, extension }) {
  const parts = [platform, project, assetType, level, toVersionString(version), initials, date]
  return `${parts.join('_')}.${extension}`
}

export function buildFolderPath({ platform, project }) {
  return `/Projects/${platform}/${project}/03_WorkingFiles/`
}

/**
 * Builds a Display Name used for campaign schedules.
 * Format: {FileType} [{Platform}] {Brand} {MockupType} {Campaign} ({PeriodDate}) ({PeriodTime})
 * Example: Preview [TikTok] Snickers Mingyu BaU (07 - 24 Juni) (09:00 - 10:00)
 */
export function buildDisplayName({ fileType, platformLabel, brand, mockupType, campaign, periodDate, periodTime }) {
  let name = `${fileType} [${platformLabel}] ${brand} ${mockupType} ${campaign}`
  if (periodDate) name += ` (${periodDate})`
  if (periodTime) name += ` (${periodTime})`
  return name
}
