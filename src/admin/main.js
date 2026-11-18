// Sykoti Center admin dashboard: authentication gate, navigation and routing.
import './admin.css'
import { api, auth, BASE } from './api.js'
import { CONTENT_PAGES, renderContentEditor } from './contentEditor.js'
import { renderMediaLibrary } from './media.js'
import { renderCyberContent, renderResource, RESOURCES } from './resources.js'
import { badge, confirmAction, emptyState, formatDate, h, icon, toast } from './ui.js'

const NAV = [
  ['Dashboard', [['#/overview', 'Overview', 'space_dashboard']]],
  ['Website', [['#/content/home', 'Page content', 'edit_document'], ['#/media', 'Media library', 'photo_library']]],
  ['Publications', [['#/r/articles', 'Articles', 'article'], ['#/r/reports', 'Reports', 'summarize'], ['#/r/webinars', 'Webinars', 'videocam']]],
  ['Programmes', [['#/r/programs', 'Programmes', 'school'], ['#/r/cohorts', 'Cohorts', 'groups'], ['#/r/activities', 'Activities', 'event'], ['#/cyber-content', 'CyberA gallery', 'collections']]],
  ['Organisation', [['#/r/team', 'Team', 'badge']]],
  ['Applications', [['#/r/membership-applications', 'Membership', 'card_membership'], ['#/r/inscriptions', 'CyberAmbassador', 'shield_person'], ['#/r/scholarships', 'Scholarships', 'workspace_premium'], ['#/r/guardians-voice-applications', 'Guardians Voice', 'campaign']]],
  ['Community', [['#/r/engagements', 'Engagements', 'handshake'], ['#/r/messages', 'Messages', 'mail'], ['#/r/supports', 'Get involved', 'volunteer_activism']]],
]

const app = document.getElementById('app')
let admin = null
let counters = {}
let view = h('div', { class: 'view' })

/* ---------- login ---------- */

function renderLogin(message = '') {
  document.title = 'Sign in · Sykoti Center Admin'
  const error = h('p', { class: 'error-text', role: 'alert' }, message)
  const email = h('input', { type: 'email', name: 'email', autocomplete: 'username', required: true })
  const password = h('input', { type: 'password', name: 'password', autocomplete: 'current-password', required: true })
  const submit = h('button', { class: 'btn primary block', type: 'submit' }, 'Sign in')
  const form = h('form', { class: 'login-card', onsubmit: async (event) => {
    event.preventDefault()
    submit.disabled = true
    submit.textContent = 'Signing in…'
    error.textContent = ''
    try {
      const data = await api('/admin/login', { method: 'POST', body: { email: email.value, password: password.value } })
      auth.set(data.token)
      admin = data.admin
      renderShell()
    } catch (err) {
      error.textContent = err.message === 'Invalid credentials' ? 'Incorrect email or password.' : err.message
      submit.disabled = false
      submit.textContent = 'Sign in'
    }
  } },
  h('img', { src: `${BASE}img/logo.png`, alt: '', class: 'login-logo' }),
  h('h1', {}, 'Sykoti Center'),
  h('p', { class: 'muted' }, 'Sign in to manage the website.'),
  h('label', { class: 'field' }, h('span', { class: 'field-label' }, 'Email'), email),
  h('label', { class: 'field' }, h('span', { class: 'field-label' }, 'Password'), password),
  error,
  submit,
  h('a', { href: BASE, class: 'muted small-link' }, '← Back to the website'))
  app.replaceChildren(h('main', { class: 'login' }, form))
  email.focus()
}

auth.onUnauthorized(() => {
  auth.set('')
  admin = null
  renderLogin('Your session has expired. Please sign in again.')
})

/* ---------- shell ---------- */

const sidebar = h('aside', { class: 'sidebar' })
const topbar = h('header', { class: 'topbar' })

function navLinks() {
  const route = location.hash || '#/overview'
  return NAV.map(([group, links]) => h('div', { class: 'nav-group' },
    h('span', { class: 'nav-label' }, group),
    links.map(([href, label, iconName]) => {
      const key = href.split('/').pop()
      const activeHref = href.startsWith('#/content') ? route.startsWith('#/content') : route === href
      const count = counters[key]
      return h('a', { href, class: activeHref ? 'active' : '', onclick: () => document.body.classList.remove('nav-open') }, icon(iconName), h('span', {}, label), count ? h('span', { class: 'nav-count' }, count) : null)
    })))
}

function renderSidebar() {
  sidebar.replaceChildren(
    h('a', { class: 'brand', href: '#/overview' }, h('img', { src: `${BASE}img/logo.png`, alt: '' }), h('span', {}, h('strong', {}, 'Sykoti Center'), h('small', {}, 'Admin dashboard'))),
    h('nav', { 'aria-label': 'Admin sections' }, navLinks()),
    h('div', { class: 'sidebar-foot' }, h('a', { href: BASE, target: '_blank', rel: 'noreferrer', class: 'btn ghost block' }, icon('open_in_new'), 'View website')),
  )
}

function renderTopbar() {
  topbar.replaceChildren(
    h('button', { class: 'icon-btn menu-btn', type: 'button', 'aria-label': 'Open menu', onclick: () => document.body.classList.toggle('nav-open') }, icon('menu')),
    h('div', { class: 'grow' }),
    h('div', { class: 'admin-chip' }, h('span', { class: 'avatar' }, (admin?.name || admin?.email || 'A').trim()[0].toUpperCase()), h('span', { class: 'admin-name' }, admin?.name || admin?.email || 'Admin')),
    h('button', { class: 'btn ghost small', type: 'button', onclick: async () => {
      if (view.isDirty?.() && !(await confirmAction('You have unsaved changes. Sign out anyway?', { confirmLabel: 'Sign out' }))) return
      auth.set(''); admin = null; renderLogin()
    } }, icon('logout'), 'Sign out'),
  )
}

async function refreshCounters() {
  try {
    const data = await api('/admin/overview')
    const c = data.counts
    counters = {
      messages: c.messages?.byStatus?.new || 0,
      inscriptions: c.inscriptions?.byStatus?.new || 0,
      scholarships: c.scholarships?.byStatus?.new || 0,
      'guardians-voice-applications': c['guardians-voice-applications']?.byStatus?.new || 0,
      engagements: c.engagements?.byStatus?.pending || 0,
      supports: c.supports?.byStatus?.pledged || 0,
      'membership-applications': c['membership-applications']?.byStatus?.new || 0,
    }
    renderSidebar()
    return data
  } catch { return null }
}

function renderShell() {
  document.body.classList.add('dashboard')
  app.replaceChildren(h('div', { class: 'layout' }, sidebar, h('div', { class: 'content' }, topbar, view)), h('div', { class: 'scrim', onclick: () => document.body.classList.remove('nav-open') }))
  renderSidebar()
  renderTopbar()
  route()
  refreshCounters()
}

/* ---------- overview ---------- */

async function renderOverview(root) {
  root.replaceChildren(h('div', { class: 'page-head' }, h('div', {}, h('h1', {}, `Welcome${admin?.name ? `, ${admin.name.split(' ')[0]}` : ''}`), h('p', { class: 'muted' }, 'Here is what is happening on the Sykoti Center website.'))), h('p', { class: 'muted' }, 'Loading…'))
  const data = await refreshCounters()
  if (!data) { root.lastChild.replaceWith(h('p', { class: 'error-text' }, 'Could not load the overview. Check that the API is running.')); return }
  const c = data.counts
  const n = (name, status) => (status ? c[name]?.byStatus?.[status] || 0 : c[name]?.total || 0)
  const pending = ['membership-applications', 'inscriptions', 'scholarships', 'guardians-voice-applications'].reduce((sum, key) => sum + n(key, 'new') + n(key, 'reviewing'), 0)
  const tiles = [
    ['mail', 'New messages', n('messages', 'new'), '#/r/messages', `${n('messages')} in total`],
    ['assignment_ind', 'Applications to review', pending, '#/r/scholarships', 'New or under review'],
    ['volunteer_activism', 'New get-involved requests', n('supports', 'pledged'), '#/r/supports', 'Volunteers, donors, partners'],
    ['handshake', 'Engagements to moderate', n('engagements', 'pending'), '#/r/engagements', `${n('engagements', 'approved')} on the wall`],
    ['article', 'Published articles', n('articles', 'published'), '#/r/articles', `${n('articles', 'draft')} drafts`],
    ['badge', 'Team profiles live', n('team', 'published'), '#/r/team', `${n('team')} in total`],
    ['photo_library', 'Media files', data.mediaCount, '#/media', 'Stored in the database'],
  ]
  const quick = [
    ['edit_document', 'Edit the home page', '#/content/home'],
    ['post_add', 'Write an article', '#/r/articles'],
    ['add_photo_alternate', 'Upload images', '#/media'],
    ['person_add', 'Add a team member', '#/r/team'],
  ]
  const pageNames = Object.fromEntries(CONTENT_PAGES.map(([key, label]) => [key, label]))
  root.replaceChildren(
    root.firstChild,
    h('section', { class: 'tiles' }, tiles.map(([iconName, label, value, href, sub]) => h('a', { class: 'tile', href }, h('span', { class: 'tile-icon' }, icon(iconName)), h('div', {}, h('strong', {}, String(value)), h('span', {}, label), h('small', { class: 'muted' }, sub))))),
    h('div', { class: 'overview-grid' },
      h('section', { class: 'panel-static' }, h('h2', {}, 'Quick actions'), h('div', { class: 'quick-actions' }, quick.map(([iconName, label, href]) => h('a', { class: 'quick', href }, icon(iconName), label)))),
      h('section', { class: 'panel-static' }, h('div', { class: 'row spread' }, h('h2', {}, 'Latest messages'), h('a', { href: '#/r/messages' }, 'Open inbox →')),
        data.recentMessages.length ? h('ul', { class: 'mini-list' }, data.recentMessages.map((m) => h('li', {}, h('div', {}, h('strong', {}, m.subject), h('small', { class: 'muted' }, `${m.name} · ${formatDate(m.createdAt, true)}`)), badge(m.status)))) : emptyState('No messages yet', '')),
      h('section', { class: 'panel-static' }, h('div', { class: 'row spread' }, h('h2', {}, 'Customised pages'), h('a', { href: '#/content/home' }, 'Edit content →')),
        data.customPages.length ? h('ul', { class: 'mini-list' }, data.customPages.map((p) => h('li', {}, h('div', {}, h('a', { href: `#/content/${p.page}` }, h('strong', {}, pageNames[p.page] || p.page)), h('small', { class: 'muted' }, `Updated ${formatDate(p.updatedAt, true)}${p.updatedBy ? ` by ${p.updatedBy}` : ''}`)), badge('published', 'Custom'))))
          : h('p', { class: 'muted' }, 'All pages currently show their default content. Open “Page content” to edit texts and images.')),
    ),
  )
}

/* ---------- routing ---------- */

async function route() {
  if (!admin) return
  const hash = location.hash || '#/overview'
  const [, section, param] = hash.split('/')
  view.cleanup?.()
  const next = h('div', { class: 'view' })
  view.replaceWith(next)
  view = next
  renderSidebar()
  window.scrollTo(0, 0)
  const titles = { overview: 'Overview', content: 'Page content', media: 'Media library', 'cyber-content': 'CyberAmbassador gallery' }
  document.title = `${titles[section] || RESOURCES[param]?.label || 'Admin'} · Sykoti Center Admin`
  try {
    if (section === 'content') await renderContentEditor(view, param, (href) => { location.hash = href })
    else if (section === 'media') await renderMediaLibrary(view)
    else if (section === 'cyber-content') await renderCyberContent(view)
    else if (section === 'r') await renderResource(view, param)
    else await renderOverview(view)
  } catch (error) {
    view.replaceChildren(emptyState('Something went wrong', error.message))
  }
}

let lastHash = location.hash
window.addEventListener('hashchange', async () => {
  if (view.isDirty?.()) {
    const leave = await confirmAction('You have unsaved changes on this page. Leave without saving?', { confirmLabel: 'Leave page' })
    if (!leave) { history.replaceState(null, '', lastHash || '#/overview'); return }
  }
  lastHash = location.hash
  route()
})

async function boot() {
  if (!auth.token) { renderLogin(); return }
  try {
    const data = await api('/admin/me')
    admin = data.admin
    renderShell()
  } catch (error) {
    if (auth.token) { auth.set(''); renderLogin(error.message.includes('unreachable') ? error.message : '') }
  }
}

window.addEventListener('error', (event) => toast(event.message, 'error'))
boot()
