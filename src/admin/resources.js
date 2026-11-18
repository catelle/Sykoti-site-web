// Records managed from the dashboard: create, edit, publish and delete, plus
// review views for applications and community submissions.
import { api, assetUrl } from './api.js'
import { cardRenderers, setActionButtons, showCybercompResultFor } from './applicants.js'
import { downloadCv, MEMBERSHIP_ACTIONS, MEMBERSHIP_FILTERS, membershipCard } from './membership.js'
import { fileField, imageField } from './media.js'
import { richTextEditor } from './richText.js'
import { badge, confirmAction, emptyState, escapeHtml, formatDate, h, icon, modal, slugify, toast } from './ui.js'

const PUBLISH = ['draft', 'published', 'archived']
const imageHint = 'Upload or choose an image from the library.'

export const RESOURCES = {
  articles: {
    label: 'Articles', singular: 'article', icon: 'article', statuses: PUBLISH,
    description: 'Blog posts shown on the Blog & resources page and the home page.',
    fields: [
      { name: 'coverUrl', label: 'Cover image', type: 'image', hint: imageHint },
      { name: 'title', label: 'Title', required: true },
      { name: 'slug', label: 'Web address (slug)', type: 'slug', from: 'title', required: true, hint: 'Used in the link: /articles/your-slug' },
      { name: 'excerpt', label: 'Summary', type: 'textarea', required: true, hint: 'One or two sentences shown on article cards.' },
      { name: 'content', label: 'Article text', type: 'richtext', required: true, hint: 'Use the toolbar to format, or paste from Word / Google Docs: headings, bold, italic, lists, quotes, links and images are kept. Fonts and colours follow the website style.' },
      { name: 'category', label: 'Category', half: true, placeholder: 'Digital safety' },
      { name: 'author', label: 'Author', half: true, placeholder: 'Sykoti Center' },
      { name: 'featured', label: 'Feature at the top of the blog', type: 'bool', half: true },
      { name: 'status', label: 'Status', type: 'status', half: true },
    ],
    title: (item) => item.title, sub: (item) => [item.featured ? '★ Featured' : '', item.category, item.author].filter(Boolean).join(' · '), image: 'coverUrl', date: (item) => item.publishedAt || item.createdAt,
    quick: [['published', 'Publish', 'publish'], ['draft', 'Unpublish', 'unpublished']],
    viewUrl: (item) => item.status === 'published' && `articles/${item.slug}`,
  },
  reports: {
    label: 'Reports', singular: 'report', icon: 'summarize', statuses: ['draft', 'pending', 'published', 'archived'],
    description: 'Downloadable reports and publications.',
    fields: [
      { name: 'coverUrl', label: 'Cover image', type: 'image', hint: imageHint },
      { name: 'title', label: 'Title', required: true },
      { name: 'description', label: 'Description', type: 'textarea', required: true },
      { name: 'fileUrl', label: 'Report file (PDF)', type: 'file' },
      { name: 'period', label: 'Period', half: true }, { name: 'category', label: 'Category', half: true },
      { name: 'source', label: 'Source', half: true }, { name: 'status', label: 'Status', type: 'status', half: true },
    ],
    title: (item) => item.title, sub: (item) => [item.category, item.period, item.source].filter(Boolean).join(' · '), image: 'coverUrl', date: (item) => item.publishedAt || item.createdAt,
    quick: [['published', 'Publish', 'publish'], ['archived', 'Archive', 'inventory_2']],
  },
  webinars: {
    label: 'Webinars', singular: 'webinar', icon: 'videocam', statuses: ['draft', 'open', 'closed', 'archived'],
    description: 'Conversations and webinars (open and closed ones are public).',
    fields: [
      { name: 'coverUrl', label: 'Cover image', type: 'image', hint: imageHint },
      { name: 'title', label: 'Title', required: true },
      { name: 'description', label: 'Description', type: 'textarea', required: true },
      { name: 'scheduledAt', label: 'Date & time', type: 'datetime', half: true },
      { name: 'speakers', label: 'Speakers', type: 'tags', half: true, hint: 'Separate names with commas.' },
      { name: 'registrationUrl', label: 'Registration link', half: true }, { name: 'replayUrl', label: 'Replay link', half: true },
      { name: 'status', label: 'Status', type: 'status' },
    ],
    title: (item) => item.title, sub: (item) => (item.speakers || []).join(', '), image: 'coverUrl', date: (item) => item.scheduledAt,
    quick: [['open', 'Open', 'lock_open'], ['closed', 'Close', 'lock']],
  },
  programs: {
    label: 'Programmes', singular: 'programme', icon: 'school', statuses: PUBLISH,
    description: 'Programmes listed on the Programmes page.',
    fields: [
      { name: 'coverUrl', label: 'Cover image', type: 'image', hint: imageHint },
      { name: 'title', label: 'Title', required: true },
      { name: 'slug', label: 'Identifier (slug)', type: 'slug', from: 'title', required: true },
      { name: 'summary', label: 'Summary', type: 'textarea', required: true },
      { name: 'description', label: 'Full description', type: 'longtext' },
      { name: 'audience', label: 'Audience', half: true }, { name: 'statusLabel', label: 'Label on the card', half: true, placeholder: '2026 edition' },
      { name: 'featured', label: 'Featured', type: 'bool', half: true }, { name: 'sortOrder', label: 'Display order', type: 'number', half: true },
      { name: 'status', label: 'Status', type: 'status' },
    ],
    title: (item) => item.title, sub: (item) => [item.statusLabel, item.audience].filter(Boolean).join(' · '), image: 'coverUrl', date: (item) => item.updatedAt,
    quick: [['published', 'Publish', 'publish'], ['archived', 'Archive', 'inventory_2']],
  },
  cohorts: {
    label: 'Cohorts', singular: 'cohort', icon: 'groups', statuses: PUBLISH,
    description: 'Cohorts attached to a programme.',
    fields: [
      { name: 'coverUrl', label: 'Cover image', type: 'image', hint: imageHint },
      { name: 'programSlug', label: 'Programme', type: 'program', required: true, half: true },
      { name: 'year', label: 'Year', type: 'number', half: true },
      { name: 'name', label: 'Name', required: true },
      { name: 'slug', label: 'Identifier (slug)', type: 'slug', from: 'name', required: true },
      { name: 'introduction', label: 'Introduction', type: 'textarea' },
      { name: 'statusLabel', label: 'Label', half: true }, { name: 'sortOrder', label: 'Display order', type: 'number', half: true },
      { name: 'status', label: 'Status', type: 'status' },
    ],
    title: (item) => item.name, sub: (item) => [item.programSlug, item.year, item.statusLabel].filter(Boolean).join(' · '), image: 'coverUrl', date: (item) => item.updatedAt,
    quick: [['published', 'Publish', 'publish'], ['archived', 'Archive', 'inventory_2']],
  },
  activities: {
    label: 'Activities', singular: 'activity', icon: 'event', statuses: PUBLISH,
    description: 'Workshops, sessions and community actions shown under each programme.',
    fields: [
      { name: 'coverUrl', label: 'Photo', type: 'image', hint: imageHint },
      { name: 'programSlug', label: 'Programme', type: 'program', required: true, half: true },
      { name: 'cohortSlug', label: 'Cohort (optional)', half: true },
      { name: 'title', label: 'Title', required: true },
      { name: 'description', label: 'Description', type: 'textarea', required: true },
      { name: 'category', label: 'Category', half: true, placeholder: 'Workshop' }, { name: 'activityDate', label: 'Date', type: 'date', half: true },
      { name: 'location', label: 'Location', half: true }, { name: 'sortOrder', label: 'Display order', type: 'number', half: true },
      { name: 'status', label: 'Status', type: 'status' },
    ],
    title: (item) => item.title, sub: (item) => [item.category, item.location, item.programSlug].filter(Boolean).join(' · '), image: 'coverUrl', date: (item) => item.activityDate || item.createdAt,
    quick: [['published', 'Publish', 'publish'], ['archived', 'Archive', 'inventory_2']],
  },
  team: {
    label: 'Team', singular: 'team member', icon: 'badge', statuses: PUBLISH,
    description: 'People shown in the home page “People behind the work” section (up to 8, by display order). Members without a portrait get a placeholder illustration. While no member is published, the section shows the cards from Page content → Home.',
    fields: [
      { name: 'photoUrl', label: 'Portrait', type: 'image', hint: 'Square or portrait photos work best.' },
      { name: 'name', label: 'Full name', required: true, half: true },
      { name: 'role', label: 'Role', required: true, half: true },
      { name: 'slug', label: 'Identifier (slug)', type: 'slug', from: 'name', required: true },
      { name: 'biography', label: 'Biography', type: 'textarea', required: true },
      { name: 'linkedinUrl', label: 'LinkedIn link' },
      { name: 'founder', label: 'Founder', type: 'bool', half: true }, { name: 'sortOrder', label: 'Display order', type: 'number', half: true },
      { name: 'status', label: 'Status', type: 'status' },
    ],
    title: (item) => item.name, sub: (item) => item.role, image: 'photoUrl', date: (item) => item.updatedAt,
    quick: [['published', 'Publish', 'publish'], ['archived', 'Archive', 'inventory_2']],
  },
  'membership-applications': { label: 'Membership', icon: 'card_membership', applicants: true, description: 'Applications to become a member of the association. Evaluate them, then invite the strongest candidates to an interview.' },
  inscriptions: { label: 'CyberAmbassador', icon: 'shield_person', applicants: true, description: 'Applications to the CyberAmbassador programme.' },
  scholarships: { label: 'Scholarships', icon: 'workspace_premium', applicants: true, description: 'Applications to the 100 Training Scholarships.' },
  'guardians-voice-applications': { label: 'Guardians Voice', icon: 'campaign', applicants: true, description: 'Applications to Guardians Voice.' },
  engagements: { label: 'Engagements', icon: 'handshake', description: 'Public commitments. Approve them to show them on the wall.' },
  messages: { label: 'Messages', icon: 'mail', statuses: ['new', 'read', 'replied', 'archived'], description: 'Messages sent from the contact form.' },
  supports: { label: 'Get involved requests', icon: 'volunteer_activism', statuses: ['pledged', 'contacted', 'received', 'cancelled'], description: 'Volunteer, donation and partnership requests sent from the Get Involved page.' },
}

const SUPPORT_TYPE_LABELS = { volunteer: 'Volunteer', donation: 'Donation', partnership: 'Partnership', 'in-kind': 'In-kind', other: 'Other' }

const APPLICANT_ACTIONS = {
  'membership-applications': MEMBERSHIP_ACTIONS,
  inscriptions: [['Examiner', 'reviewing'], ['Présélectionner', 'shortlisted'], ['Refuser', 'declined']],
  scholarships: [['Passer en examen', 'reviewing'], ['Présélectionner', 'shortlisted'], ['Accepter', 'accepted'], ['Refuser', 'declined']],
  'guardians-voice-applications': [['Passer en examen', 'reviewing'], ['Présélectionner', 'shortlisted'], ['Accepter', 'accepted'], ['Refuser', 'declined']],
  engagements: [['Approuver', 'approved'], ['Rejeter', 'rejected']],
}

/* ---------- shared helpers ---------- */

function legacyActions(resource) {
  return (id) => [
    ...(APPLICANT_ACTIONS[resource] || []).map(([label, status]) => `<button class="btn small" type="button" onclick="updateStatus('${id}', '${status}')">${escapeHtml(label)}</button>`),
    `<button class="btn small danger-ghost" type="button" onclick="removeItem('${id}')">Supprimer</button>`,
  ].join('')
}

async function setStatus(resource, id, status) {
  await api(`/admin/${resource}/${id}`, { method: 'PATCH', body: { status } })
}

async function deleteItem(resource, id, label = 'this item') {
  if (!(await confirmAction(`Delete ${label}? This cannot be undone.`))) return false
  await api(`/admin/${resource}/${id}`, { method: 'DELETE' })
  toast('Deleted')
  return true
}

function head(def, extra) {
  return h('div', { class: 'page-head' }, h('div', {}, h('h1', {}, def.label), h('p', { class: 'muted' }, def.description)), extra || null)
}

const toLocalInput = (value, withTime) => {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString()
  return withTime ? local.slice(0, 16) : local.slice(0, 10)
}

/* ---------- editor form ---------- */

let programsCache
async function programOptions() {
  programsCache ||= api('/admin/programs').catch(() => [])
  return programsCache
}

function buildForm(def, item) {
  const values = { ...item }
  const controls = {}
  const slugTouched = {}
  const rows = def.fields.map((spec) => {
    const value = values[spec.name]
    const set = (v) => { values[spec.name] = v }
    let control
    switch (spec.type) {
      case 'image':
        return h('div', { class: 'field wide' }, imageField({ value, label: spec.label, hint: spec.hint, folder: def.label.toLowerCase(), onChange: set }))
      case 'file':
        return h('div', { class: 'field wide' }, fileField({ value, label: spec.label, onChange: (url, name) => { set(url); if (name !== undefined) values.fileName = name } }))
      case 'textarea': control = h('textarea', { rows: 4, value: value || '' }); break
      case 'longtext': control = h('textarea', { rows: 16, class: 'long', value: value || '' }); break
      case 'richtext':
        // A <div>, not a <label>: a label would forward clicks in the editor to the first toolbar button.
        control = controls[spec.name] = richTextEditor({ value: value || '' })
        return h('div', { class: 'field wide' }, h('span', { class: 'field-label' }, spec.label, spec.required ? ' *' : ''), control, spec.hint ? h('small', { class: 'hint' }, spec.hint) : null)
      case 'status': control = h('select', {}, def.statuses.map((s) => h('option', { value: s, selected: (value || def.statuses[0]) === s }, s))); break
      case 'bool': control = h('select', {}, h('option', { value: 'false', selected: !value }, 'No'), h('option', { value: 'true', selected: !!value }, 'Yes')); break
      case 'number': control = h('input', { type: 'number', value: value ?? 0 }); break
      case 'date': control = h('input', { type: 'date', value: toLocalInput(value, false) }); break
      case 'datetime': control = h('input', { type: 'datetime-local', value: toLocalInput(value, true) }); break
      case 'tags': control = h('input', { type: 'text', value: (value || []).join(', ') }); break
      case 'program': {
        const listId = `programs-${Math.random().toString(36).slice(2)}`
        const datalist = h('datalist', { id: listId })
        programOptions().then((programs) => datalist.replaceChildren(...programs.map((p) => h('option', { value: p.slug }, p.title))))
        control = h('input', { type: 'text', value: value || '', list: listId, placeholder: 'cyberambassador' })
        controls[spec.name] = control
        return h('label', { class: `field${spec.half ? '' : ' wide'}` }, h('span', { class: 'field-label' }, spec.label, spec.required ? ' *' : ''), control, datalist)
      }
      default: control = h('input', { type: 'text', value: value || '', placeholder: spec.placeholder || '' })
    }
    controls[spec.name] = control
    if (spec.type === 'slug') {
      slugTouched[spec.name] = Boolean(value)
      control.addEventListener('input', () => { slugTouched[spec.name] = true })
    }
    return h('label', { class: `field${spec.half ? '' : ' wide'}` }, h('span', { class: 'field-label' }, spec.label, spec.required ? ' *' : ''), control, spec.hint ? h('small', { class: 'hint' }, spec.hint) : null)
  })
  // Auto-fill slugs from their source field until edited by hand.
  def.fields.filter((spec) => spec.type === 'slug').forEach((spec) => {
    controls[spec.from]?.addEventListener('input', () => { if (!slugTouched[spec.name]) controls[spec.name].value = slugify(controls[spec.from].value) })
  })

  const collect = () => {
    const body = {}
    for (const spec of def.fields) {
      if (spec.type === 'image' || spec.type === 'file') { body[spec.name] = values[spec.name] || ''; continue }
      const raw = controls[spec.name].value
      if (spec.type === 'bool') body[spec.name] = raw === 'true'
      else if (spec.type === 'number') body[spec.name] = raw === '' ? 0 : Number(raw)
      else if (spec.type === 'tags') body[spec.name] = raw.split(',').map((s) => s.trim()).filter(Boolean)
      else if (spec.type === 'date' || spec.type === 'datetime') body[spec.name] = raw ? new Date(raw).toISOString() : null
      else if (spec.type === 'slug') body[spec.name] = slugify(raw)
      else body[spec.name] = raw.trim()
      if (spec.required && (body[spec.name] === '' || body[spec.name] === null)) throw new Error(`“${spec.label}” is required.`)
    }
    if (values.fileName !== undefined) body.fileName = values.fileName
    return body
  }
  return { element: h('div', { class: 'form-grid' }, rows), collect }
}

function openEditor(resource, def, item, onSaved) {
  const isNew = !item?._id
  const form = buildForm(def, item || { status: def.statuses[0] })
  const saveBtn = h('button', { class: 'btn primary', type: 'button' }, icon('save'), isNew ? `Create ${def.singular}` : 'Save changes')
  let saved = false
  const { close } = modal({
    title: isNew ? `New ${def.singular}` : `Edit ${def.singular}`,
    wide: true,
    body: form.element,
    footer: [h('button', { class: 'btn ghost', type: 'button', onclick: () => close() }, 'Cancel'), saveBtn],
    onClose: () => { if (saved) onSaved() },
  })
  saveBtn.addEventListener('click', async () => {
    saveBtn.disabled = true
    try {
      const body = form.collect()
      await api(isNew ? `/admin/${resource}` : `/admin/${resource}/${item._id}`, { method: isNew ? 'POST' : 'PATCH', body })
      if (resource === 'programs') programsCache = undefined
      saved = true
      toast(isNew ? `${def.singular[0].toUpperCase()}${def.singular.slice(1)} created` : 'Changes saved')
      close()
    } catch (error) {
      toast(error.message.includes('duplicate key') ? 'This slug is already used — choose another one.' : error.message, 'error')
      saveBtn.disabled = false
    }
  })
}

/* ---------- views ---------- */

async function renderCollection(root, resource, def) {
  let items = []
  let filter = 'all'
  let query = ''
  const list = h('div', { class: 'record-list' })
  const filters = h('div', { class: 'segmented scroll' })
  const search = h('input', { type: 'search', placeholder: `Search ${def.label.toLowerCase()}…`, oninput: () => { query = search.value.toLowerCase(); draw() } })
  const reload = async () => { items = await api(`/admin/${resource}`); draw() }

  function draw() {
    filters.replaceChildren(...['all', ...def.statuses].map((status) => {
      const count = status === 'all' ? items.length : items.filter((item) => item.status === status).length
      return h('button', { type: 'button', class: filter === status ? 'active' : '', onclick: () => { filter = status; draw() } }, status === 'all' ? 'All' : status, h('span', { class: 'count' }, count))
    }))
    const visible = items.filter((item) => (filter === 'all' || item.status === filter) && (!query || JSON.stringify([def.title(item), def.sub(item)]).toLowerCase().includes(query)))
    if (!visible.length) {
      list.replaceChildren(emptyState(items.length ? 'Nothing matches' : `No ${def.label.toLowerCase()} yet`, items.length ? 'Try another filter.' : `Create your first ${def.singular}.`,
        items.length ? null : h('button', { class: 'btn primary', type: 'button', onclick: () => openEditor(resource, def, null, reload) }, icon('add'), `New ${def.singular}`)))
      return
    }
    list.replaceChildren(...visible.map((item) => {
      const image = item[def.image]
      const viewUrl = def.viewUrl?.(item)
      return h('article', { class: 'record' },
        h('button', { class: 'record-thumb', type: 'button', onclick: () => openEditor(resource, def, item, reload), 'aria-label': 'Edit' }, image ? h('img', { src: assetUrl(image), alt: '', loading: 'lazy' }) : icon(def.icon)),
        h('div', { class: 'record-main' },
          h('button', { class: 'record-title', type: 'button', onclick: () => openEditor(resource, def, item, reload) }, def.title(item) || 'Untitled'),
          h('small', { class: 'muted' }, [def.sub(item), formatDate(def.date(item))].filter(Boolean).join(' · ')),
        ),
        badge(item.status),
        h('div', { class: 'record-actions' },
          ...def.quick.filter(([status]) => status !== item.status).map(([status, label, iconName]) => h('button', { class: 'btn small ghost', type: 'button', onclick: async () => {
            try { await setStatus(resource, item._id, status); toast(`${label} — done`); await reload() } catch (error) { toast(error.message, 'error') }
          } }, icon(iconName), label)),
          viewUrl ? h('a', { class: 'icon-btn', href: `${import.meta.env.BASE_URL}${viewUrl}`, target: '_blank', rel: 'noreferrer', title: 'View on site' }, icon('open_in_new')) : null,
          h('button', { class: 'icon-btn', type: 'button', title: 'Edit', onclick: () => openEditor(resource, def, item, reload) }, icon('edit')),
          h('button', { class: 'icon-btn danger', type: 'button', title: 'Delete', onclick: async () => {
            try { if (await deleteItem(resource, item._id, `“${def.title(item)}”`)) await reload() } catch (error) { toast(error.message, 'error') }
          } }, icon('delete')),
        ),
      )
    }))
  }

  root.replaceChildren(
    head(def, h('button', { class: 'btn primary', type: 'button', onclick: () => openEditor(resource, def, null, reload) }, icon('add'), `New ${def.singular}`)),
    h('div', { class: 'toolbar' }, filters, search),
    list,
  )
  list.replaceChildren(h('p', { class: 'muted' }, 'Loading…'))
  try { await reload() } catch (error) { list.replaceChildren(h('p', { class: 'error-text' }, error.message)) }
}

const normalize = (value) => String(value ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim()
const hasCybercomp = (item) => { const c = item.cybercomp || {}; return Boolean(c.taken || c.initialTaken || c.finalTaken || c.takenAt || c.phase || c.total != null || c.answers?.length || c.results?.length) }

async function renderApplicants(root, resource, def) {
  let data = []
  let filter = 'all'
  let query = ''
  const stats = h('div', { class: 'applicant-stats' })
  const list = h('div', { class: 'items' })
  const matches = (item, f) => {
    const status = item.status || 'new'
    if (f === 'all') return true
    if (f === 'cybercomp-completed') return hasCybercomp(item)
    if (f === 'declined') return status === 'declined' || status === 'rejected'
    return status === f
  }
  const search = h('input', { type: 'search', placeholder: 'Rechercher un candidat par nom', oninput: () => { query = normalize(search.value); draw() } })
  const reload = async () => { data = await api(`/admin/${resource}`); draw() }

  setActionButtons(legacyActions(resource))
  window.updateStatus = async (id, status) => { try { await setStatus(resource, id, status); toast('Statut mis à jour'); await reload() } catch (error) { toast(error.message, 'error') } }
  window.removeItem = async (id) => { try { if (await deleteItem(resource, id, 'cette candidature')) await reload() } catch (error) { toast(error.message, 'error') } }
  window.showCybercompResult = (id) => showCybercompResultFor(data, id)
  window.downloadCv = async (id) => { try { await downloadCv(id) } catch (error) { toast(error.message, 'error') } }
  window.saveReview = async (id, formEl) => {
    const values = Object.fromEntries(new FormData(formEl))
    try {
      await api(`/admin/${resource}/${id}`, { method: 'PATCH', body: { review: { score: Number(values.score) || 0, notes: values.notes || '', interviewAt: values.interviewAt ? new Date(values.interviewAt).toISOString() : null } } })
      const item = data.find((x) => x._id === id)
      if (item) item.review = { score: Number(values.score) || 0, notes: values.notes, interviewAt: values.interviewAt || null }
      toast('Évaluation enregistrée')
    } catch (error) { toast(error.message, 'error') }
  }

  function draw() {
    const filters = resource === 'membership-applications' ? [...MEMBERSHIP_FILTERS] : [['all', 'Toutes'], ['new', 'Nouvelles'], ['reviewing', 'En examen'], ['shortlisted', 'Présélectionnées'], ['accepted', 'Acceptées'], ['declined', 'Refusées']]
    if (resource === 'scholarships') filters.push(['cybercomp-completed', 'CyberComp effectué'])
    stats.replaceChildren(...filters.map(([key, label]) => h('button', { type: 'button', class: `stat-filter${filter === key ? ' active' : ''}`, 'aria-pressed': String(filter === key), onclick: () => { filter = key; draw() } },
      h('span', {}, label), h('strong', {}, data.filter((item) => matches(item, key)).length))))
    const visible = data.filter((item) => matches(item, filter) && (!query || normalize(item.fullName).includes(query)))
    const render = resource === 'membership-applications' ? (item) => membershipCard(item, legacyActions(resource)) : cardRenderers[resource]
    list.innerHTML = visible.length ? visible.map(render).join('') : ''
    if (!visible.length) list.replaceChildren(emptyState(data.length ? 'Aucune candidature ne correspond' : 'Aucune candidature', data.length ? 'Modifiez le filtre ou la recherche.' : ''))
  }

  root.replaceChildren(head(def, search), stats, list)
  list.replaceChildren(h('p', { class: 'muted' }, 'Chargement…'))
  try { await reload() } catch (error) { list.replaceChildren(h('p', { class: 'error-text' }, error.message)) }
}

async function renderEngagements(root, def) {
  const resource = 'engagements'
  let data = []
  const filters = { search: '', location: '', theme: '', date: '' }
  const stats = h('div', { class: 'applicant-stats' })
  const list = h('div', { class: 'items' })
  const controls = h('div', { class: 'engagement-filters' })
  const reload = async () => {
    const [items, summary] = await Promise.all([api(`/admin/${resource}`), api('/admin/engagements-dashboard/stats')])
    data = items
    stats.innerHTML = [['Total', summary.total], ['Aujourd’hui', summary.today], ['Publication acceptée', summary.consented], ['Publiés', summary.approved], ['En attente', summary.pending]]
      .map(([label, count]) => `<div class="stat-filter"><span>${label}</span><strong>${count}</strong></div>`).join('')
      + `<div class="dashboard-breakdown" style="grid-column:1/-1"><article><h3>Par lieu</h3>${summary.byLocation.map((x) => `<p>${escapeHtml(x._id || 'Non précisé')} · <b>${x.count}</b></p>`).join('')}</article><article><h3>Par thématique</h3>${summary.byTheme.map((x) => `<p>${escapeHtml(x._id)} · <b>${x.count}</b></p>`).join('')}</article><article><h3>Par tranche d’âge</h3>${summary.byAge.map((x) => `<p>${escapeHtml(x._id)} · <b>${x.count}</b></p>`).join('')}</article></div>`
    drawControls()
    draw()
  }
  setActionButtons(legacyActions(resource))
  window.updateStatus = async (id, status) => { try { await setStatus(resource, id, status); toast('Statut mis à jour'); await reload() } catch (error) { toast(error.message, 'error') } }
  window.removeItem = async (id) => { try { if (await deleteItem(resource, id, 'cet engagement')) await reload() } catch (error) { toast(error.message, 'error') } }

  function drawControls() {
    const unique = (key) => [...new Set(data.map((x) => x[key]).filter(Boolean))].sort()
    const select = (key, all) => {
      const el = h('select', {}, h('option', { value: '' }, all), unique(key).map((x) => h('option', { value: x, selected: filters[key] === x }, x)))
      el.addEventListener('change', () => { filters[key] = el.value; draw() })
      return el
    }
    const searchInput = h('input', { type: 'search', placeholder: 'Rechercher un nom ou un texte', value: filters.search, oninput: () => { filters.search = searchInput.value; draw() } })
    const dateInput = h('input', { type: 'date', value: filters.date, onchange: () => { filters.date = dateInput.value; draw() } })
    controls.replaceChildren(searchInput, select('location', 'Tous les lieux'), select('theme', 'Toutes les thématiques'), dateInput)
  }
  function draw() {
    const visible = data.filter((item) => {
      const haystack = `${item.displayName || ''} ${item.commitment || ''}`.toLowerCase()
      const itemDate = item.createdAt ? new Date(item.createdAt).toISOString().slice(0, 10) : ''
      return (!filters.search || haystack.includes(filters.search.toLowerCase())) && (!filters.location || item.location === filters.location) && (!filters.theme || item.theme === filters.theme) && (!filters.date || itemDate === filters.date)
    })
    const actions = legacyActions(resource)
    list.innerHTML = visible.map((item) => {
      const contact = item.contactConsent && item.phone ? `Contact communauté : ${item.phone}` : 'Pas de contact communautaire demandé'
      return `<article class="card"><h3>${escapeHtml(item.displayName || 'Citoyen·ne numérique')}</h3><p><strong>${escapeHtml(item.theme)}</strong></p><p>« ${escapeHtml(item.commitment)} »</p><small class="muted">${escapeHtml(item.location)} · ${item.createdAt ? escapeHtml(new Date(item.createdAt).toLocaleString('fr-FR')) : ''}<br>Âge : ${escapeHtml(item.ageRange || 'non renseigné')} · Consentement publication : ${item.consentToPublish ? 'oui' : 'non'} · ${escapeHtml(contact)} · Statut : ${escapeHtml(item.status)}</small><div class="row">${item.consentToPublish ? actions(item._id) : '<span class="muted">Engagement privé — hors publication</span>'}</div></article>`
    }).join('')
    if (!visible.length) list.replaceChildren(emptyState('Aucun engagement', ''))
  }
  root.replaceChildren(head(def), h('p', { class: 'notice' }, icon('info'), 'Les engagements publiables doivent être approuvés avant d’apparaître sur le mur.'), stats, controls, list)
  try { await reload() } catch (error) { list.replaceChildren(h('p', { class: 'error-text' }, error.message)) }
}

async function renderInbox(root, resource, def) {
  let items = []
  let filter = resource === 'messages' ? 'new' : 'pledged'
  const filters = h('div', { class: 'segmented scroll' })
  const list = h('div', { class: 'record-list' })
  const reload = async () => { items = await api(`/admin/${resource}`); draw() }
  const actions = resource === 'messages'
    ? [['read', 'Mark read', 'drafts'], ['replied', 'Mark replied', 'reply'], ['archived', 'Archive', 'inventory_2']]
    : [['contacted', 'Mark contacted', 'call'], ['received', 'Support received', 'check'], ['cancelled', 'Close', 'close']]

  function draw() {
    filters.replaceChildren(...['all', ...def.statuses].map((status) => h('button', { type: 'button', class: filter === status ? 'active' : '', onclick: () => { filter = status; draw() } },
      status === 'all' ? 'All' : status === 'pledged' ? 'New' : status, h('span', { class: 'count' }, status === 'all' ? items.length : items.filter((x) => x.status === status).length))))
    const visible = items.filter((item) => filter === 'all' || item.status === filter)
    if (!visible.length) { list.replaceChildren(emptyState(['new', 'pledged'].includes(filter) ? 'Inbox zero' : 'Nothing here', ['new', 'pledged'].includes(filter) ? 'Nothing new to handle.' : '')); return }
    list.replaceChildren(...visible.map((item) => h('article', { class: 'card message' },
      h('header', { class: 'row spread' },
        h('div', {}, h('h3', {}, resource === 'messages' ? item.subject : item.name), h('small', { class: 'muted' }, resource === 'messages' ? `${item.name} · ${item.email}` : [item.email, item.phone, item.organization].filter(Boolean).join(' · '), ' · ', formatDate(item.createdAt, true))),
        h('div', { class: 'row' }, resource === 'supports' && item.contributionType ? badge('new', SUPPORT_TYPE_LABELS[item.contributionType] || item.contributionType) : null, badge(item.status === 'pledged' ? 'new' : item.status, item.status === 'pledged' ? 'new' : item.status))),
      resource === 'supports' && item.level ? h('p', {}, h('strong', {}, 'Level: '), item.level) : null,
      resource === 'supports' && item.amount ? h('p', {}, h('strong', {}, `${item.amount.toLocaleString('fr-FR')} ${item.currency || 'XAF'}`), item.paymentMethod && item.paymentMethod !== 'manual' ? ` · ${item.paymentMethod}` : '', item.paymentReference ? ` · réf. ${item.paymentReference}` : '') : null,
      item.message ? h('p', { class: 'message-body' }, item.message) : null,
      h('div', { class: 'row' },
        item.email ? h('a', { class: 'btn small primary', href: `mailto:${item.email}?subject=${encodeURIComponent(`Re: ${item.subject || 'Sykoti Center'}`)}` }, icon('reply'), 'Reply by email') : null,
        ...actions.filter(([status]) => status !== item.status).map(([status, label, iconName]) => h('button', { class: 'btn small ghost', type: 'button', onclick: async () => {
          try { await setStatus(resource, item._id, status); await reload() } catch (error) { toast(error.message, 'error') }
        } }, icon(iconName), label)),
        h('button', { class: 'btn small danger-ghost', type: 'button', onclick: async () => { try { if (await deleteItem(resource, item._id)) await reload() } catch (error) { toast(error.message, 'error') } } }, icon('delete'), 'Delete'),
      ),
    )))
  }
  root.replaceChildren(head(def), h('div', { class: 'toolbar' }, filters), list)
  list.replaceChildren(h('p', { class: 'muted' }, 'Loading…'))
  try { await reload() } catch (error) { list.replaceChildren(h('p', { class: 'error-text' }, error.message)) }
}

/* ---------- CyberAmbassador gallery & testimonials ---------- */

const GALLERY_CATEGORIES = [['formation', 'Formation'], ['graduation', 'Graduation'], ['community-action', 'Action communautaire'], ['proof', 'Preuve / capstone'], ['portrait', 'Portrait']]

export async function renderCyberContent(root) {
  let doc
  const body = h('div', { class: 'stack' })
  const saveBtn = h('button', { class: 'btn primary', type: 'button', onclick: () => save() }, icon('save'), 'Save gallery & testimonials')
  const text = (obj, key, label, multiline) => {
    const control = multiline ? h('textarea', { rows: 3, value: obj[key] || '' }) : h('input', { type: 'text', value: obj[key] || '' })
    control.addEventListener('input', () => { obj[key] = control.value })
    return h('label', { class: 'field' }, h('span', { class: 'field-label' }, label), control)
  }
  const select = (obj, key, label, options) => {
    const control = h('select', {}, options.map(([value, text]) => h('option', { value, selected: String(obj[key]) === value }, text)))
    control.addEventListener('change', () => { obj[key] = control.value })
    return h('label', { class: 'field' }, h('span', { class: 'field-label' }, label), control)
  }
  const number = (obj, key, label) => {
    const control = h('input', { type: 'number', value: obj[key] ?? 0 })
    control.addEventListener('input', () => { obj[key] = Number(control.value) || 0 })
    return h('label', { class: 'field' }, h('span', { class: 'field-label' }, label), control)
  }
  const remove = (list, index) => async () => { if (await confirmAction('Remove this entry?', { confirmLabel: 'Remove' })) { list.splice(index, 1); draw() } }

  function draw() {
    body.replaceChildren(
      h('section', { class: 'panel-static' },
        h('div', { class: 'row spread' }, h('div', {}, h('h2', {}, 'Visibility'), h('p', { class: 'muted' }, 'The gallery and testimonials appear on the CyberAmbassador page only when published.')), select(doc, 'status', 'Status', [['draft', 'Draft'], ['published', 'Published']]))),
      h('section', { class: 'panel-static' },
        h('div', { class: 'row spread' }, h('h2', {}, `Gallery (${doc.media.length})`), h('button', { class: 'btn small', type: 'button', onclick: () => { doc.media.push({ title: '', category: 'formation', url: '', alt: '', caption: '', credit: '', sortOrder: doc.media.length + 1 }); draw() } }, icon('add'), 'Add photo')),
        h('div', { class: 'gallery-editor' }, doc.media.map((item, index) => h('article', { class: 'card' },
          imageField({ value: item.url, label: `Photo ${index + 1}`, folder: 'cyberambassador', onChange: (value) => { item.url = value } }),
          h('div', { class: 'grid-2' }, text(item, 'title', 'Title'), select(item, 'category', 'Category', GALLERY_CATEGORIES)),
          text(item, 'alt', 'Image description (required)'),
          text(item, 'caption', 'Caption', true),
          h('div', { class: 'grid-2' }, text(item, 'credit', 'Credit'), number(item, 'sortOrder', 'Order')),
          h('button', { class: 'btn small danger-ghost', type: 'button', onclick: remove(doc.media, index) }, icon('delete'), 'Remove'),
        )))),
      h('section', { class: 'panel-static' },
        h('div', { class: 'row spread' }, h('h2', {}, `Testimonials (${doc.testimonials.length})`), h('button', { class: 'btn small', type: 'button', onclick: () => { doc.testimonials.push({ quote: '', author: '', context: '', publicationConsent: false, status: 'draft', sortOrder: doc.testimonials.length + 1 }); draw() } }, icon('add'), 'Add testimonial')),
        h('div', { class: 'stack' }, doc.testimonials.map((item, index) => h('article', { class: 'card' },
          text(item, 'quote', 'Quote', true),
          h('div', { class: 'grid-2' }, text(item, 'author', 'Author'), text(item, 'context', 'Context (e.g. CyberA-Rise fellow)')),
          h('div', { class: 'grid-3' }, select(item, 'publicationConsent', 'Consent to publish', [['false', 'No'], ['true', 'Yes']]), select(item, 'status', 'Status', [['draft', 'Draft'], ['published', 'Published']]), number(item, 'sortOrder', 'Order')),
          h('button', { class: 'btn small danger-ghost', type: 'button', onclick: remove(doc.testimonials, index) }, icon('delete'), 'Remove'),
        )))),
      h('div', { class: 'save-bar' }, h('span', { class: 'muted' }, 'Testimonials are public only when published and with consent.'), saveBtn),
    )
  }

  async function save() {
    const missing = doc.media.find((item) => !item.url || !item.alt)
    if (missing) { toast('Every photo needs an image and a description.', 'error'); return }
    if (doc.testimonials.some((item) => !item.quote)) { toast('Every testimonial needs a quote.', 'error'); return }
    saveBtn.disabled = true
    try {
      const payload = {
        slug: 'public', status: doc.status,
        media: doc.media,
        testimonials: doc.testimonials.map((item) => ({ ...item, publicationConsent: String(item.publicationConsent) === 'true' })),
      }
      doc = doc._id ? await api(`/admin/cyberambassador-content/${doc._id}`, { method: 'PATCH', body: payload }) : await api('/admin/cyberambassador-content', { method: 'POST', body: payload })
      toast('Gallery & testimonials saved')
      draw()
    } catch (error) { toast(error.message, 'error') } finally { saveBtn.disabled = false }
  }

  root.replaceChildren(h('div', { class: 'page-head' }, h('div', {}, h('h1', {}, 'CyberAmbassador gallery'), h('p', { class: 'muted' }, 'Photos and participant testimonials for the CyberAmbassador page and the home page “Community voices”.'))), body)
  body.replaceChildren(h('p', { class: 'muted' }, 'Loading…'))
  try {
    const docs = await api('/admin/cyberambassador-content')
    doc = docs.find((item) => item.slug === 'public') || { slug: 'public', status: 'draft', media: [], testimonials: [] }
    doc.media ||= []
    doc.testimonials ||= []
    draw()
  } catch (error) { body.replaceChildren(h('p', { class: 'error-text' }, error.message)) }
}

export async function renderResource(root, resource) {
  const def = RESOURCES[resource]
  if (!def) { root.replaceChildren(emptyState('Unknown section', '')); return }
  if (def.applicants) return renderApplicants(root, resource, def)
  if (resource === 'engagements') return renderEngagements(root, def)
  if (resource === 'messages' || resource === 'supports') return renderInbox(root, resource, def)
  return renderCollection(root, resource, def)
}
