// Media library view, image picker modal and the image form field.
import { api, assetUrl, uploadFile } from './api.js'
import { builtInImages } from '../content/siteDefaults.js'
import { confirmAction, emptyState, formatDate, h, icon, modal, toast } from './ui.js'

const builtInPath = (file) => (file.startsWith('/') ? file : `/cyberambassador/media/${file.endsWith('.jpeg') ? '' : 'gallery/'}${file}`)
const formatSize = (bytes) => (bytes > 1024 * 1024 ? `${(bytes / 1024 / 1024).toFixed(1)} MB` : `${Math.max(1, Math.round(bytes / 1024))} KB`)

let libraryCache
async function loadLibrary(force = false) {
  if (!libraryCache || force) libraryCache = await api('/admin/media')
  return libraryCache
}

async function uploadMany(files, folder) {
  const uploaded = []
  for (const file of files) {
    try {
      uploaded.push(await uploadFile(file, { folder }))
    } catch (error) {
      toast(error.message, 'error')
    }
  }
  if (uploaded.length) {
    libraryCache = undefined
    toast(`${uploaded.length} file${uploaded.length > 1 ? 's' : ''} uploaded`)
  }
  return uploaded
}

function fileButton(label, { accept = 'image/*', multiple = false, onFiles, cls = 'btn' }) {
  const input = h('input', { type: 'file', accept, multiple, hidden: true, onchange: () => { if (input.files.length) onFiles([...input.files]); input.value = '' } })
  return h('label', { class: cls }, icon('upload'), label, input)
}

// Picker modal. Resolves the chosen reference (upload URL or built-in path).
export function openMediaPicker({ title = 'Choose an image', folder = 'library', accept = 'image/*' } = {}) {
  return new Promise((resolve) => {
    let chosen = null
    let tab = 'uploads'
    const grid = h('div', { class: 'media-grid picker' })
    const tabs = h('div', { class: 'segmented' })
    const urlInput = h('input', { type: 'url', placeholder: 'https://…', class: 'grow' })
    const pick = (value) => { chosen = value; close() }

    const renderTabs = () => {
      tabs.replaceChildren(
        h('button', { type: 'button', class: tab === 'uploads' ? 'active' : '', onclick: () => { tab = 'uploads'; render() } }, 'Uploaded files'),
        h('button', { type: 'button', class: tab === 'builtin' ? 'active' : '', onclick: () => { tab = 'builtin'; render() } }, 'Site images'),
      )
    }
    const render = async () => {
      renderTabs()
      if (tab === 'builtin') {
        grid.replaceChildren(...builtInImages.map((file) => h('button', { type: 'button', class: 'media-tile', onclick: () => pick(builtInPath(file)) },
          h('img', { src: assetUrl(builtInPath(file)), alt: '', loading: 'lazy' }), h('span', {}, file.split('/').pop()))))
        return
      }
      grid.replaceChildren(h('p', { class: 'muted' }, 'Loading…'))
      try {
        const items = (await loadLibrary()).filter((item) => accept === '*' || item.contentType.startsWith('image/'))
        grid.replaceChildren(...(items.length ? items.map((item) => h('button', { type: 'button', class: 'media-tile', onclick: () => pick(item.url) },
          item.contentType.startsWith('image/') ? h('img', { src: assetUrl(item.url), alt: item.alt || '', loading: 'lazy' }) : h('div', { class: 'file-icon' }, icon('description')),
          h('span', {}, item.name || 'Untitled'))) : [emptyState('No uploads yet', 'Upload an image to start your library.')]))
      } catch (error) {
        grid.replaceChildren(h('p', { class: 'error-text' }, error.message))
      }
    }

    const { close } = modal({
      title,
      wide: true,
      body: h('div', { class: 'picker-body' },
        h('div', { class: 'picker-toolbar' }, tabs, fileButton('Upload new', { accept, onFiles: async (files) => {
          const [asset] = await uploadMany(files, folder)
          if (asset) pick(asset.url)
        }, cls: 'btn primary' })),
        grid,
        h('div', { class: 'picker-url' }, h('span', { class: 'muted' }, 'Or use an image link:'), urlInput, h('button', { class: 'btn', type: 'button', onclick: () => urlInput.value.trim() && pick(urlInput.value.trim()) }, 'Use link')),
      ),
      onClose: () => resolve(chosen),
    })
    render()
  })
}

// Form field showing a preview with Choose / Remove actions.
export function imageField({ value = '', onChange, folder = 'library', label = 'Image', hint }) {
  let current = value || ''
  const wrap = h('div', { class: 'image-field' })
  const render = () => {
    wrap.replaceChildren(
      h('div', { class: `image-preview${current ? '' : ' empty'}` }, current ? h('img', { src: assetUrl(current), alt: '' }) : icon('image')),
      h('div', { class: 'image-actions' },
        h('strong', {}, label),
        hint ? h('small', { class: 'muted' }, hint) : null,
        h('div', { class: 'row' },
          h('button', { type: 'button', class: 'btn small', onclick: async () => {
            const picked = await openMediaPicker({ folder })
            if (picked) { current = picked; onChange(current); render() }
          } }, icon('photo_library'), current ? 'Change' : 'Choose image'),
          current ? h('button', { type: 'button', class: 'btn small ghost', onclick: () => { current = ''; onChange(''); render() } }, 'Remove') : null,
        ),
        current ? h('code', { class: 'muted ref' }, current.length > 60 ? `…${current.slice(-56)}` : current) : null,
      ),
    )
  }
  render()
  return wrap
}

// File field for documents (PDF reports).
export function fileField({ value = '', onChange, label = 'File', accept = 'application/pdf' }) {
  let current = value || ''
  const wrap = h('div', { class: 'image-field' })
  const render = () => {
    wrap.replaceChildren(
      h('div', { class: 'image-preview empty' }, icon('description')),
      h('div', { class: 'image-actions' },
        h('strong', {}, label),
        current ? h('a', { href: assetUrl(current), target: '_blank', rel: 'noreferrer' }, 'Open current file ↗') : h('small', { class: 'muted' }, 'No file yet'),
        h('div', { class: 'row' }, fileButton(current ? 'Replace file' : 'Upload file', { accept, cls: 'btn small', onFiles: async ([file]) => {
          const [asset] = await uploadMany([file], 'documents')
          if (asset) { current = asset.url; onChange(current, file.name); render() }
        } }), current ? h('button', { type: 'button', class: 'btn small ghost', onclick: () => { current = ''; onChange('', ''); render() } }, 'Remove') : null),
      ),
    )
  }
  render()
  return wrap
}

export async function renderMediaLibrary(root) {
  let filter = ''
  const grid = h('div', { class: 'media-grid' })
  const search = h('input', { type: 'search', placeholder: 'Search by name…', oninput: () => { filter = search.value.toLowerCase(); draw() } })
  let items = []

  const drop = h('div', { class: 'dropzone' }, icon('cloud_upload'), h('div', {}, h('strong', {}, 'Drop images or PDFs here'), h('p', { class: 'muted' }, 'Large photos are resized automatically (max 2000px) before upload.')),
    fileButton('Browse files', { accept: 'image/*,application/pdf', multiple: true, cls: 'btn primary', onFiles: (files) => upload(files) }))
  drop.addEventListener('dragover', (e) => { e.preventDefault(); drop.classList.add('over') })
  drop.addEventListener('dragleave', () => drop.classList.remove('over'))
  drop.addEventListener('drop', (e) => { e.preventDefault(); drop.classList.remove('over'); upload([...e.dataTransfer.files]) })

  async function upload(files) {
    drop.classList.add('busy')
    await uploadMany(files, 'library')
    drop.classList.remove('busy')
    await load(true)
  }

  function draw() {
    const visible = items.filter((item) => !filter || `${item.name} ${item.alt} ${item.folder}`.toLowerCase().includes(filter))
    if (!visible.length) { grid.replaceChildren(emptyState(items.length ? 'No match' : 'Your library is empty', items.length ? 'Try another search.' : 'Upload photos to use them anywhere on the site.')); return }
    grid.replaceChildren(...visible.map((item) => {
      const isImage = item.contentType.startsWith('image/')
      const alt = h('input', { value: item.alt || '', placeholder: 'Describe the image (alt text)', onchange: async () => {
        try { await api(`/admin/media/${item._id}`, { method: 'PATCH', body: { alt: alt.value } }); item.alt = alt.value; toast('Alt text saved') } catch (error) { toast(error.message, 'error') }
      } })
      return h('article', { class: 'media-card' },
        h('a', { href: assetUrl(item.url), target: '_blank', rel: 'noreferrer', class: 'media-thumb' }, isImage ? h('img', { src: assetUrl(item.url), alt: item.alt || '', loading: 'lazy' }) : h('div', { class: 'file-icon' }, icon('description'))),
        h('div', { class: 'media-meta' },
          h('strong', { title: item.name }, item.name || 'Untitled'),
          h('small', { class: 'muted' }, [formatSize(item.size), item.width ? `${item.width}×${item.height}` : '', item.folder, formatDate(item.createdAt)].filter(Boolean).join(' · ')),
          isImage ? alt : null,
          h('div', { class: 'row' },
            h('button', { class: 'btn small ghost', type: 'button', onclick: async () => {
              try { await navigator.clipboard.writeText(item.url); toast('Reference copied') } catch { toast(item.url) }
            } }, icon('content_copy'), 'Copy ref'),
            h('button', { class: 'btn small danger-ghost', type: 'button', onclick: async () => {
              if (!(await confirmAction('Delete this file? Pages or records still using it will show a broken image.'))) return
              try { await api(`/admin/media/${item._id}`, { method: 'DELETE' }); libraryCache = undefined; toast('File deleted'); await load(true) } catch (error) { toast(error.message, 'error') }
            } }, icon('delete'), 'Delete'),
          ),
        ),
      )
    }))
  }

  async function load(force) {
    try { items = await loadLibrary(force); draw() } catch (error) { grid.replaceChildren(h('p', { class: 'error-text' }, error.message)) }
  }

  root.replaceChildren(
    h('div', { class: 'page-head' }, h('div', {}, h('h1', {}, 'Media library'), h('p', { class: 'muted' }, 'Images and documents stored in the database. Use them in pages, articles, team profiles and programmes.')), search),
    drop,
    grid,
  )
  grid.replaceChildren(h('p', { class: 'muted' }, 'Loading…'))
  await load(false)
}
