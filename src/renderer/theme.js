const STORAGE_KEY = 'laceria_theme'

let currentTheme = localStorage.getItem(STORAGE_KEY) || 'light'
const subscribers = new Set()

// Apply initial theme before first render
if (currentTheme === 'dark') {
  document.documentElement.classList.add('theme-dark')
}

export function getTheme() {
  return currentTheme
}

export function setTheme(theme) {
  currentTheme = theme
  localStorage.setItem(STORAGE_KEY, theme)
  if (theme === 'dark') {
    document.documentElement.classList.add('theme-dark')
  } else {
    document.documentElement.classList.remove('theme-dark')
  }
  subscribers.forEach(cb => cb(theme))
}

export function subscribeTheme(cb) {
  subscribers.add(cb)
  return () => subscribers.delete(cb)
}
