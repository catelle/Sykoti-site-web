// Tiny DOM helpers shared by the admin views.
export function h(tag, props = {}, ...children) {
  const el = document.createElement(tag)
  let initialValue
  for (const [key, value] of Object.entries(props || {})) {
    if (value === undefined || value === null || value === false) continue
    if (key === 'value') initialValue = value
    else if (key === 'class') el.className = value
    else if (key === 'html') el.innerHTML = value
    else if (key === 'dataset') Object.assign(el.dataset, value)
    else if (key === 'style' && typeof value === 'object') Object.assign(el.style, value)
    else if (key.startsWith('on') && typeof value === 'function') el.addEventListener(key.slice(2).toLowerCase(), value)
    else if (key in el && typeof value !== 'string') el[key] = value
    else el.setAttribute(key, value === true ? '' : value)
  }
  for (const child of children.flat(Infinity)) {
    if (child === undefined || child === null || child === false) continue
    el.append(child instanceof Node ? child : document.createTextNode(String(child)))
  }
  if (initialValue !== undefined) el.value = initialValue
  return el
}

export const icon = (name, cls = '') => h('span', { class: `material-symbols-outlined ${cls}`.trim(), 'aria-hidden': 'true' }, name)

export function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>'"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[c])
}

export function formatDate(value, withTime = false) {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return new Intl.DateTimeFormat('en-GB', withTime ? { dateStyle: 'medium', timeStyle: 'short' } : { dateStyle: 'medium' }).format(date)
}

export function slugify(value) {
  return String(value || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 90)
}

const STATUS_TONES = {
  published: 'success', accepted: 'success', approved: 'success', received: 'success', replied: 'success', open: 'success',
  draft: 'neutral', archived: 'neutral', closed: 'neutral', cancelled: 'neutral', private: 'neutral', read: 'neutral',
  pending: 'warning', reviewing: 'warning', shortlisted: 'info', pledged: 'warning', new: 'info',
  declined: 'danger', rejected: 'danger',
}
export const badge = (status, label) => h('span', { class: `badge tone-${STATUS_TONES[status] || 'neutral'}` }, label || status || '—')

let toastRoot
export function toast(message, tone = 'success') {
  toastRoot ||= document.body.appendChild(h('div', { class: 'toasts', role: 'status', 'aria-live': 'polite' }))
  const item = h('div', { class: `toast tone-${tone}` }, icon(tone === 'error' ? 'error' : 'check_circle'), h('span', {}, message))
  toastRoot.append(item)
  setTimeout(() => { item.classList.add('leaving'); setTimeout(() => item.remove(), 300) }, tone === 'error' ? 6000 : 3200)
}

// Modal dialog; returns { dialog, close }. `onClose` runs once when it closes.
export function modal({ title, body, footer, wide = false, onClose }) {
  const dialog = h('dialog', { class: `modal${wide ? ' wide' : ''}` },
    h('header', { class: 'modal-head' }, h('h2', {}, title), h('button', { class: 'icon-btn', type: 'button', 'aria-label': 'Close', onclick: () => close() }, icon('close'))),
    h('div', { class: 'modal-body' }, body),
    footer ? h('footer', { class: 'modal-foot' }, footer) : null,
  )
  const close = () => { if (dialog.open) dialog.close() }
  dialog.addEventListener('close', () => { dialog.remove(); onClose?.() })
  dialog.addEventListener('click', (event) => { if (event.target === dialog) close() })
  document.body.append(dialog)
  dialog.showModal()
  return { dialog, close }
}

export function confirmAction(message, { confirmLabel = 'Delete', danger = true } = {}) {
  return new Promise((resolve) => {
    let answered = false
    const { close } = modal({
      title: 'Please confirm',
      body: h('p', {}, message),
      footer: [
        h('button', { class: 'btn ghost', type: 'button', onclick: () => close() }, 'Cancel'),
        h('button', { class: `btn ${danger ? 'danger' : 'primary'}`, type: 'button', onclick: () => { answered = true; close() } }, confirmLabel),
      ],
      onClose: () => resolve(answered),
    })
  })
}

export const emptyState = (title, text, action) => h('div', { class: 'empty' }, icon('inbox'), h('h3', {}, title), text ? h('p', {}, text) : null, action || null)
