// API access, authentication token and uploads for the admin dashboard.
export const BASE = import.meta.env.BASE_URL
export const API = import.meta.env.VITE_API_URL
  || (['localhost', '127.0.0.1'].includes(window.location.hostname) ? 'http://localhost:4001/api' : `${window.location.origin}/api`)
export const API_ORIGIN = API.replace(/\/api$/, '')

const TOKEN_KEY = 'sykotiAdminToken'
let token = ''
try { token = localStorage.getItem(TOKEN_KEY) || '' } catch { token = '' }
let onUnauthorized = () => {}

export const auth = {
  get token() { return token },
  set(value) {
    token = value || ''
    try { if (token) localStorage.setItem(TOKEN_KEY, token); else localStorage.removeItem(TOKEN_KEY) } catch { /* ignore */ }
  },
  onUnauthorized(handler) { onUnauthorized = handler },
}

export async function api(path, { method = 'GET', body, form } = {}) {
  const headers = {}
  if (token) headers.Authorization = `Bearer ${token}`
  if (body !== undefined) headers['Content-Type'] = 'application/json'
  let response
  try {
    response = await fetch(`${API}${path}`, { method, headers, body: form || (body !== undefined ? JSON.stringify(body) : undefined) })
  } catch {
    throw new Error(`API unreachable at ${API}. Start "npm run server" and check MongoDB network access.`)
  }
  const isJson = (response.headers.get('content-type') || '').includes('application/json')
  const data = isJson ? await response.json() : null
  if (response.status === 401 && !path.startsWith('/admin/login')) {
    onUnauthorized()
    throw new Error('Your session has expired. Please sign in again.')
  }
  if (!response.ok) throw new Error(data?.message || `Request failed (${response.status})`)
  return data
}

// Resolves any stored image/file reference to a URL the browser can load.
export function assetUrl(value) {
  if (!value) return ''
  if (/^(https?:|data:|blob:)/.test(value)) return value
  if (value.startsWith('/uploads/')) return `${API_ORIGIN}${value}`
  if (value.startsWith(BASE)) return value
  if (value.startsWith('/')) return `${BASE}${value.slice(1)}`
  if (!value.includes('/')) return `${BASE}cyberambassador/media/${value.endsWith('.jpeg') ? '' : 'gallery/'}${value}`
  return `${BASE}${value}`
}

const RESIZABLE = ['image/jpeg', 'image/png', 'image/webp']
const MAX_EDGE = 2000
const MAX_BYTES = 4.4 * 1024 * 1024

// Downscales large photos in the browser before upload (keeps transparency via WebP).
async function prepareImage(file) {
  if (!RESIZABLE.includes(file.type)) return { blob: file, name: file.name }
  let bitmap
  try { bitmap = await createImageBitmap(file) } catch { return { blob: file, name: file.name } }
  const { width, height } = bitmap
  const scale = Math.min(1, MAX_EDGE / Math.max(width, height))
  if (scale === 1 && file.size <= 1.5 * 1024 * 1024) { bitmap.close?.(); return { blob: file, name: file.name, width, height } }
  const canvas = document.createElement('canvas')
  canvas.width = Math.round(width * scale)
  canvas.height = Math.round(height * scale)
  canvas.getContext('2d').drawImage(bitmap, 0, 0, canvas.width, canvas.height)
  bitmap.close?.()
  const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/webp', 0.85))
  if (!blob) return { blob: file, name: file.name, width, height }
  return { blob, name: file.name.replace(/\.[^.]+$/, '') + '.webp', width: canvas.width, height: canvas.height }
}

export async function uploadFile(file, { folder = 'library', alt = '' } = {}) {
  const prepared = file.type.startsWith('image/') ? await prepareImage(file) : { blob: file, name: file.name }
  if (prepared.blob.size > MAX_BYTES) throw new Error(`"${file.name}" is too large (max 4.4 MB after compression).`)
  const form = new FormData()
  form.append('file', prepared.blob, prepared.name)
  form.append('folder', folder)
  form.append('name', file.name)
  if (alt) form.append('alt', alt)
  if (prepared.width) { form.append('width', prepared.width); form.append('height', prepared.height) }
  return api('/admin/media', { method: 'POST', form })
}
