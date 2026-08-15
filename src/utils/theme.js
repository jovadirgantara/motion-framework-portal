// Theme state lives on <html class="dark"> — the same class the inline script
// in index.html sets before first paint, so React adopting it here never
// causes a flash. `localStorage` holds an explicit user choice only; absent
// that, we follow the OS and keep following it as it changes.

export const STORAGE_KEY = 'mfp-theme'

export function getStoredTheme() {
  try {
    const v = localStorage.getItem(STORAGE_KEY)
    return v === 'light' || v === 'dark' ? v : null
  } catch {
    return null
  }
}

export function getSystemTheme() {
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function resolveTheme() {
  return getStoredTheme() ?? getSystemTheme()
}

export function applyTheme(theme) {
  document.documentElement.classList.toggle('dark', theme === 'dark')
  document.documentElement.style.colorScheme = theme
}

export function storeTheme(theme) {
  try {
    localStorage.setItem(STORAGE_KEY, theme)
  } catch {
    /* private mode — the in-memory choice still applies for this session */
  }
}
