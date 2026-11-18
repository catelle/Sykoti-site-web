// Rich-text editor for article bodies. Articles are still stored in the small
// text format the public site renders (## heading, **bold**, - list…), so the
// editor converts that format to HTML for editing and back on save. Pasted
// content (Word, Google Docs, web pages) goes through the same conversion,
// which keeps its headings, lists, bold, italic, links and images while
// dropping everything else (fonts, colours, scripts…).
import { assetUrl } from './api.js'
import { openMediaPicker } from './media.js'
import { escapeHtml, h, icon } from './ui.js'

const SAFE_URL = /^(https?:\/\/|mailto:|\/)/
const safeUrl = (url) => SAFE_URL.test(url) || (url && !url.includes(':'))

/* ---------- text format → HTML (for the editor) ---------- */

function inlineToHtml(text) {
  const pattern = /(\*\*[^*]+\*\*|\*[^*\s][^*]*\*|\[[^\]]+\]\([^)\s]+\))/g
  let out = ''
  let last = 0
  let match
  while ((match = pattern.exec(text))) {
    out += escapeHtml(text.slice(last, match.index))
    const token = match[0]
    if (token.startsWith('**')) out += `<strong>${escapeHtml(token.slice(2, -2))}</strong>`
    else if (token.startsWith('*')) out += `<em>${escapeHtml(token.slice(1, -1))}</em>`
    else {
      const [, label, url] = token.match(/^\[([^\]]+)\]\(([^)\s]+)\)$/)
      out += SAFE_URL.test(url) ? `<a href="${escapeHtml(url)}">${escapeHtml(label)}</a>` : escapeHtml(label)
    }
    last = match.index + token.length
  }
  return out + escapeHtml(text.slice(last))
}

const imageHtml = (alt, ref) => `<figure><img src="${escapeHtml(assetUrl(ref))}" data-ref="${escapeHtml(ref)}" alt="${escapeHtml(alt)}"></figure>`

export function markdownToHtml(source = '') {
  const lines = String(source).replace(/\r/g, '').split('\n')
  let html = ''
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()
    if (!line) continue
    if (/^#{1,2}\s/.test(line)) { html += `<h2>${inlineToHtml(line.replace(/^#{1,2}\s/, ''))}</h2>`; continue }
    if (/^###\s/.test(line)) { html += `<h3>${inlineToHtml(line.slice(4))}</h3>`; continue }
    const image = line.match(/^!\[([^\]]*)\]\(([^)\s]+)\)$/)
    if (image) { if (safeUrl(image[2])) html += imageHtml(image[1], image[2]); continue }
    if (/^>\s?/.test(line)) {
      let quote = ''
      while (i < lines.length && /^>\s?/.test(lines[i].trim())) quote += `<p>${inlineToHtml(lines[i++].trim().replace(/^>\s?/, ''))}</p>`
      i--
      html += `<blockquote>${quote}</blockquote>`
      continue
    }
    const listType = /^[-*]\s/.test(line) ? 'ul' : /^\d+[.)]\s/.test(line) ? 'ol' : null
    if (listType) {
      const test = listType === 'ul' ? /^[-*]\s/ : /^\d+[.)]\s/
      let items = ''
      while (i < lines.length && test.test(lines[i].trim())) items += `<li>${inlineToHtml(lines[i++].trim().replace(test, ''))}</li>`
      i--
      html += `<${listType}>${items}</${listType}>`
      continue
    }
    html += `<p>${inlineToHtml(line)}</p>`
  }
  return html || '<p><br></p>'
}

/* ---------- HTML → text format (on save and on paste) ---------- */

const BLOCK_TAGS = new Set(['P', 'DIV', 'SECTION', 'ARTICLE', 'HEADER', 'FOOTER', 'MAIN', 'ASIDE', 'NAV', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'UL', 'OL', 'LI', 'BLOCKQUOTE', 'FIGURE', 'TABLE', 'TBODY', 'THEAD', 'TR', 'PRE', 'HR', 'DL', 'DT', 'DD'])
const SKIP_TAGS = new Set(['SCRIPT', 'STYLE', 'HEAD', 'TITLE', 'META', 'LINK', 'NOSCRIPT', 'TEMPLATE', 'SVG', 'IFRAME', 'OBJECT', 'BUTTON', 'INPUT', 'SELECT', 'TEXTAREA'])

const styleOf = (el) => (el.getAttribute?.('style') || '').toLowerCase()
const hasBlockChild = (el) => [...el.children].some((child) => BLOCK_TAGS.has(child.tagName) || hasBlockChild(child))
// Word marks list bullets with "mso-list:Ignore"; Google Docs wraps everything in <b style="font-weight:normal">.
const isIgnored = (el) => SKIP_TAGS.has(el.tagName) || /mso-list:\s*ignore/.test(styleOf(el)) || el.getAttribute?.('aria-hidden') === 'true'

function isBold(el) {
  const style = styleOf(el)
  const weight = style.match(/font-weight:\s*(\w+)/)?.[1]
  if (weight) return weight === 'bold' || weight === 'bolder' || Number(weight) >= 600
  return el.tagName === 'B' || el.tagName === 'STRONG'
}
function isItalic(el) {
  const style = styleOf(el)
  const fontStyle = style.match(/font-style:\s*(\w+)/)?.[1]
  if (fontStyle) return fontStyle === 'italic' || fontStyle === 'oblique'
  return el.tagName === 'I' || el.tagName === 'EM'
}

const imageLine = (img) => {
  const ref = img.dataset?.ref || img.getAttribute('src') || ''
  if (!safeUrl(ref) || ref.startsWith('data:')) return ''
  return `![${(img.getAttribute('alt') || '').replace(/[[\]\n]/g, ' ').trim()}](${ref})`
}

// Inline content → one string; "\n" marks line breaks (each becomes its own paragraph).
function inline(node, state = { bold: false, italic: false }) {
  if (node.nodeType === 3) return node.nodeValue.replace(/[\s\u00a0]+/g, ' ')
  if (node.nodeType !== 1 || isIgnored(node)) return ''
  if (node.tagName === 'BR') return '\n'
  if (node.tagName === 'IMG') { const line = imageLine(node); return line ? `\n${line}\n` : '' }
  const bold = !state.bold && !state.italic && isBold(node)
  const italic = !state.bold && !state.italic && !bold && isItalic(node)
  const next = { bold: state.bold || bold, italic: state.italic || italic }
  let text = [...node.childNodes].map((child) => inline(child, next)).join('')
  if (node.tagName === 'A') {
    const href = node.getAttribute('href') || ''
    const label = text.replace(/\*/g, '').replace(/\s+/g, ' ').trim()
    if (label && SAFE_URL.test(href)) return `[${label.replace(/[[\]]/g, '')}](${href.replace(/[()\s]/g, encodeURIComponent)})`
    return text
  }
  const marker = bold ? '**' : italic ? '*' : ''
  // The public renderer cannot nest a link inside bold/italic, so such runs keep the link only.
  if (!marker || !text.trim() || text.includes('\n') || /\]\(/.test(text)) return text
  const [, lead, core, trail] = text.match(/^(\s*)([\s\S]*?)(\s*)$/)
  return `${lead}${marker}${core.replace(/\*/g, '')}${marker}${trail}`
}

const toLines = (text, prefix = '') => text.split('\n').map((line) => line.replace(/\s+/g, ' ').trim()).filter(Boolean)
  .map((line) => (line.startsWith('![') ? line : prefix + line))

function blocks(node, out) {
  let buffer = ''
  const flush = () => { out.push(...toLines(buffer)); buffer = '' }
  for (const child of node.childNodes) {
    if (child.nodeType === 3) { buffer += inline(child); continue }
    if (child.nodeType !== 1 || isIgnored(child)) continue
    const tag = child.tagName
    if (!BLOCK_TAGS.has(tag) && !hasBlockChild(child)) { buffer += inline(child); continue }
    flush()
    if (tag === 'H1' || tag === 'H2') out.push(...toLines(inline(child).replace(/\*/g, ''), '## ').slice(0, 1))
    else if (/^H[3-6]$/.test(tag)) out.push(...toLines(inline(child).replace(/\*/g, ''), '### ').slice(0, 1))
    else if (tag === 'UL' || tag === 'OL') {
      let n = 0
      child.querySelectorAll(':scope > li, :scope > * > li').forEach((li) => {
        const nested = [...li.querySelectorAll('ul, ol')]
        nested.forEach((list) => list.remove())
        const text = inline(li).replace(/\n+/g, ' ').trim()
        if (text) out.push(`${tag === 'OL' ? `${++n}.` : '-'} ${text}`)
        nested.forEach((list) => blocks(h('div', {}, list), out))
      })
    } else if (tag === 'BLOCKQUOTE') {
      const inner = []
      blocks(child, inner)
      out.push(...inner.map((line) => `> ${line.replace(/^(#+|>|-|\d+\.)\s/, '')}`))
    } else if (tag === 'HR') continue
    else if (tag === 'TR') out.push(...toLines([...child.children].map((cell) => inline(cell).replace(/\n/g, ' ').trim()).filter(Boolean).join(' | ')))
    else if (/mso-list:\s*l\d/.test(styleOf(child)) || /MsoList/.test(child.className)) out.push(...toLines(inline(child).replace(/\n/g, ' '), '- '))
    else if (hasBlockChild(child)) blocks(child, out)
    else out.push(...toLines(inline(child)))
  }
  flush()
  return out
}

export function htmlToMarkdown(input) {
  const root = typeof input === 'string' ? new DOMParser().parseFromString(input, 'text/html').body : input.cloneNode(true)
  return blocks(root, []).join('\n')
}

/* ---------- editor ---------- */

const TOOLS = [
  ['p', 'notes', 'Paragraph'], ['h2', 'title', 'Heading'], ['h3', 'format_h3', 'Sub-heading'], '|',
  ['bold', 'format_bold', 'Bold (Ctrl+B)'], ['italic', 'format_italic', 'Italic (Ctrl+I)'], ['link', 'link', 'Link'], ['unlink', 'link_off', 'Remove link'], '|',
  ['ul', 'format_list_bulleted', 'Bullet list'], ['ol', 'format_list_numbered', 'Numbered list'], ['quote', 'format_quote', 'Quote'], ['image', 'image', 'Insert image'], '|',
  ['clear', 'format_clear', 'Clear formatting'],
]

export function richTextEditor({ value = '' } = {}) {
  const area = h('div', { class: 'rte-area', contenteditable: 'true', role: 'textbox', 'aria-multiline': 'true', spellcheck: 'true', html: markdownToHtml(value) })
  const source = h('textarea', { class: 'rte-source long', hidden: true, spellcheck: 'false' })
  const buttons = {}
  let savedRange = null
  let sourceMode = false

  const exec = (command, arg = null) => { area.focus(); document.execCommand(command, false, arg) }
  const block = (tag) => {
    const current = (document.queryCommandValue('formatBlock') || '').toLowerCase()
    exec('formatBlock', current === tag && tag !== 'p' ? 'p' : tag)
  }
  const rememberSelection = () => {
    const selection = window.getSelection()
    if (selection.rangeCount && area.contains(selection.anchorNode)) savedRange = selection.getRangeAt(0).cloneRange()
  }
  const restoreSelection = () => {
    area.focus()
    if (!savedRange) return
    const selection = window.getSelection()
    selection.removeAllRanges()
    selection.addRange(savedRange)
  }

  const actions = {
    p: () => block('p'), h2: () => block('h2'), h3: () => block('h3'), quote: () => block('blockquote'),
    bold: () => exec('bold'), italic: () => exec('italic'),
    ul: () => exec('insertUnorderedList'), ol: () => exec('insertOrderedList'),
    unlink: () => exec('unlink'),
    clear: () => { exec('removeFormat'); exec('unlink'); exec('formatBlock', 'p') },
    link: () => {
      rememberSelection()
      const url = window.prompt('Link address (https://…)', 'https://')
      if (!url || url === 'https://') return
      if (!SAFE_URL.test(url)) { window.alert('Links must start with https://, http://, mailto: or /'); return }
      restoreSelection()
      if (window.getSelection().isCollapsed) exec('insertHTML', `<a href="${escapeHtml(url)}">${escapeHtml(url)}</a>`)
      else exec('createLink', url)
    },
    image: async () => {
      rememberSelection()
      const ref = await openMediaPicker({ folder: 'articles' })
      if (!ref) return
      const alt = window.prompt('Short image description (shown under the image, optional)', '') || ''
      restoreSelection()
      exec('insertHTML', `${imageHtml(alt, ref)}<p><br></p>`)
    },
  }

  const toolbar = h('div', { class: 'rte-toolbar', role: 'toolbar', 'aria-label': 'Text formatting' },
    TOOLS.map((tool) => {
      if (tool === '|') return h('span', { class: 'rte-sep' })
      const [name, glyph, title] = tool
      buttons[name] = h('button', { type: 'button', class: 'rte-btn', title, 'aria-label': title,
        // mousedown keeps the text selection inside the editor
        onmousedown: (event) => event.preventDefault(),
        onclick: () => { if (!sourceMode) { actions[name](); refresh() } } }, icon(glyph))
      return buttons[name]
    }),
    h('span', { class: 'rte-spacer' }),
    h('button', { type: 'button', class: 'rte-btn rte-mode', title: 'Show the raw text format', onclick: () => toggleSource() }, icon('code'), h('span', {}, 'Source')),
  )

  function toggleSource() {
    sourceMode = !sourceMode
    if (sourceMode) source.value = htmlToMarkdown(area)
    else area.innerHTML = markdownToHtml(source.value)
    area.hidden = sourceMode
    source.hidden = !sourceMode
    wrap.classList.toggle('source', sourceMode)
  }

  function refresh() {
    if (sourceMode || !area.contains(window.getSelection().anchorNode)) return
    const blockTag = (document.queryCommandValue('formatBlock') || '').toLowerCase()
    const states = {
      bold: document.queryCommandState('bold'), italic: document.queryCommandState('italic'),
      ul: document.queryCommandState('insertUnorderedList'), ol: document.queryCommandState('insertOrderedList'),
      h2: blockTag === 'h2' || blockTag === 'h1', h3: /^h[3-6]$/.test(blockTag), quote: blockTag === 'blockquote',
    }
    Object.entries(buttons).forEach(([name, button]) => button.classList.toggle('active', Boolean(states[name])))
  }

  area.addEventListener('focus', () => document.execCommand('defaultParagraphSeparator', false, 'p'))
  area.addEventListener('keyup', refresh)
  area.addEventListener('mouseup', refresh)
  area.addEventListener('paste', (event) => {
    const data = event.clipboardData
    if (!data) return
    event.preventDefault()
    const html = data.getData('text/html')
    const markdown = html ? htmlToMarkdown(html) : data.getData('text/plain').replace(/\r/g, '').split(/\n/).map((line) => line.trim()).join('\n')
    exec('insertHTML', markdownToHtml(markdown))
  })
  // Dropped files are not supported; images go through the image button.
  area.addEventListener('drop', (event) => { if (event.dataTransfer?.files?.length) event.preventDefault() })

  const wrap = h('div', { class: 'rte' }, toolbar, area, source)
  Object.defineProperty(wrap, 'value', { get: () => (sourceMode ? source.value : htmlToMarkdown(area)) })
  return wrap
}
