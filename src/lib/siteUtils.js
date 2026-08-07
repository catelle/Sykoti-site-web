export const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4001/api'
const API_ORIGIN = API_BASE.replace(/\/api$/, '')

export function apiAssetUrl(url) {
  if (!url || /^https?:\/\//.test(url)) return url
  return `${API_ORIGIN}${url}`
}

export function visibleWindow(items, start, size = 3) {
  if (items.length <= size) return items
  return Array.from({ length: size }, (_, index) => items[(start + index) % items.length])
}
