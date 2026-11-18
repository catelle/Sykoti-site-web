// "Page content" editor: edits the texts, buttons, cards and images of the
// public pages. Saves only what differs from the code defaults.
import { api } from './api.js'
import { defaultPageData, LANGS, mergePage } from '../content/siteContent.js'
import { imageField } from './media.js'
import { badge, confirmAction, h, icon, toast } from './ui.js'

export const CONTENT_PAGES = [
  ['home', 'Home', 'home'],
  ['about', 'About', 'info'],
  ['programs', 'Programmes', 'school'],
  ['impact', 'Impact', 'monitoring'],
  ['resources', 'Blog', 'menu_book'],
  ['get-involved', 'Get involved', 'volunteer_activism'],
  ['reports', 'Reports', 'summarize'],
  ['global', 'Settings, header & footer', 'web'],
]
const PAGE_URLS = { home: '', about: 'about', programs: 'programs', impact: 'impact', resources: 'resources', 'get-involved': 'get-involved', reports: 'reports', global: '' }
const LINK_OPTIONS = ['interest:volunteer', 'interest:donation', 'interest:partnership', '#interest', 'home', 'about', 'programs', 'impact', 'resources', 'get-involved', 'membership', 'reports', 'contact', 'cyberambassador', 'scholarship', 'about-team', 'mailto:contact@sykoticenter.com']
const THEMES = [
  ['', 'Standard'], ['soft', 'Soft background'], ['banner', 'Banner (accent colour)'], ['quote', 'Large quote'],
  ['values', 'Values'], ['people', 'People / portraits'], ['soft initiatives', 'Initiatives (soft)'], ['soft content', 'Articles (soft)'],
  ['soft origin', 'Origin story (soft)'], ['today', 'Programme list'], ['method', 'Method steps'], ['audiences', 'Audiences with photos'],
]
const SOURCE_LABELS = { team: 'Team members', articles: 'published Articles', programs: 'published Programmes', reports: 'published Reports' }
const same = (a, b) => JSON.stringify(a ?? null) === JSON.stringify(b ?? null)
const clone = (value) => JSON.parse(JSON.stringify(value))

function diffObject(current = {}, base = {}) {
  const out = {}
  for (const key of new Set([...Object.keys(current), ...Object.keys(base)])) {
    if (!same(current[key], base[key])) out[key] = current[key] ?? ''
  }
  return out
}

// Builds the minimal override document from the draft.
function diffPage(page, draft) {
  const base = defaultPageData(page)
  if (page === 'global') {
    return {
      shared: { settings: diffObject(draft.shared.settings, base.shared.settings) },
      en: { copy: diffObject(draft.en.copy, base.en.copy) },
      fr: { copy: diffObject(draft.fr.copy, base.fr.copy) },
    }
  }
  const out = { shared: { images: diffObject(draft.shared.images, base.shared.images) } }
  for (const lang of LANGS) {
    out[lang] = { content: diffObject(draft[lang].content, base[lang].content) }
    if (!same(draft[lang].details, base[lang].details)) out[lang].details = draft[lang].details
    if (!same(draft[lang].extras, base[lang].extras)) out[lang].extras = draft[lang].extras
  }
  return out
}

const isEmptyOverride = (doc) => !doc || same(doc, {}) || (
  Object.values(doc.shared || {}).every((v) => same(v, {}))
  && LANGS.every((lang) => Object.entries(doc[lang] || {}).every(([, v]) => same(v, {})))
)

/* ---------- field builders (mutate the draft in place) ---------- */

function field(label, control, hint) {
  return h('label', { class: 'field' }, h('span', { class: 'field-label' }, label), control, hint ? h('small', { class: 'hint' }, hint) : null)
}

function textInput(obj, key, { label, multiline = false, rows, hint, placeholder, onChange }) {
  const value = obj[key] ?? ''
  const isLong = multiline || String(value).length > 90
  const control = isLong
    ? h('textarea', { rows: rows || Math.min(8, Math.max(3, Math.ceil(String(value).length / 90))), value, placeholder })
    : h('input', { type: 'text', value, placeholder })
  control.addEventListener('input', () => { obj[key] = control.value; onChange() })
  return field(label, control, hint)
}

function linkInput(get, set, { label = 'Link', onChange }) {
  const id = `links-${Math.random().toString(36).slice(2)}`
  const control = h('input', { type: 'text', value: get() ?? '', list: id, placeholder: 'page name, https://… or mailto:…' })
  control.addEventListener('input', () => { set(control.value); onChange() })
  return field(label, h('div', {}, control, h('datalist', { id }, LINK_OPTIONS.map((option) => h('option', { value: option })))))
}

// [label, link] pairs such as hero buttons.
function buttonInput(obj, key, { label, onChange }) {
  const ensure = () => { if (!Array.isArray(obj[key])) obj[key] = ['', ''] ; return obj[key] }
  const labelInput = h('input', { type: 'text', value: obj[key]?.[0] ?? '', placeholder: 'Button text (leave empty to hide)' })
  labelInput.addEventListener('input', () => { ensure()[0] = labelInput.value; onChange() })
  return h('fieldset', { class: 'button-field' }, h('legend', {}, label),
    h('div', { class: 'grid-2' }, field('Text', labelInput), linkInput(() => obj[key]?.[1], (value) => { ensure()[1] = value }, { label: 'Goes to', onChange })))
}

// Editable list with add / move / remove. `renderItem(item, index)` returns fields.
function listEditor({ getList, setList, label, addLabel = 'Add item', create, renderItem, onChange, compact = false, summary }) {
  const wrap = h('div', { class: `list-editor${compact ? ' compact' : ''}` })
  const draw = () => {
    const list = getList() || []
    wrap.replaceChildren(
      label ? h('div', { class: 'list-head' }, h('strong', {}, label), h('span', { class: 'muted' }, `${list.length} item${list.length === 1 ? '' : 's'}`)) : null,
      ...list.map((item, index) => h('div', { class: 'list-item' },
        h('div', { class: 'list-item-tools' },
          h('span', { class: 'list-index' }, summary ? summary(item, index) : String(index + 1).padStart(2, '0')),
          h('div', { class: 'row' },
            h('button', { type: 'button', class: 'icon-btn', title: 'Move up', disabled: index === 0, onclick: () => { const next = [...list]; [next[index - 1], next[index]] = [next[index], next[index - 1]]; setList(next); onChange(); draw() } }, icon('arrow_upward')),
            h('button', { type: 'button', class: 'icon-btn', title: 'Move down', disabled: index === list.length - 1, onclick: () => { const next = [...list]; [next[index + 1], next[index]] = [next[index], next[index + 1]]; setList(next); onChange(); draw() } }, icon('arrow_downward')),
            h('button', { type: 'button', class: 'icon-btn danger', title: 'Remove', onclick: () => { setList(list.filter((_, i) => i !== index)); onChange(); draw() } }, icon('delete')),
          ),
        ),
        h('div', { class: 'list-item-body' }, renderItem(item, index, list)),
      )),
      h('button', { type: 'button', class: 'btn small ghost add-btn', onclick: () => { setList([...(getList() || []), create()]); onChange(); draw() } }, icon('add'), addLabel),
    )
  }
  draw()
  return wrap
}

// Positional "tuple" items (cards, stats…) described by a list of field specs.
function tupleFields(tuple, specs, onChange) {
  const textSpecs = specs.filter((spec) => spec.type !== 'image')
  const imageSpec = specs.find((spec) => spec.type === 'image')
  const fields = textSpecs.map((spec) => {
    if (spec.type === 'link') return linkInput(() => tuple[spec.i], (value) => { tuple[spec.i] = value || null }, { label: spec.label, onChange })
    return textInput(tuple, spec.i, { label: spec.label, multiline: spec.multiline, hint: spec.hint, onChange })
  })
  if (!imageSpec) return h('div', { class: textSpecs.length > 2 || textSpecs.some((s) => s.multiline) ? 'stack' : 'grid-2' }, fields)
  return h('div', { class: 'with-image' },
    imageField({ value: tuple[imageSpec.i] || '', label: imageSpec.label, onChange: (value) => { tuple[imageSpec.i] = value || null; onChange() } }),
    h('div', { class: 'stack' }, fields))
}

const newTuple = (specs) => {
  const length = Math.max(...specs.map((spec) => spec.i)) + 1
  return Array.from({ length }, (_, i) => (specs.find((spec) => spec.i === i)?.type === 'link' || specs.find((spec) => spec.i === i)?.type === 'image' ? null : ''))
}

function mainCardSpecs(page) {
  if (page === 'home') return [{ i: 3, label: 'Card image', type: 'image' }, { i: 0, label: 'Icon', hint: 'Material Symbols name, e.g. security, code, lightbulb' }, { i: 1, label: 'Title' }, { i: 2, label: 'Text', multiline: true }]
  if (page === 'programs') return [{ i: 3, label: 'Card image', type: 'image' }, { i: 0, label: 'Title' }, { i: 1, label: 'Text', multiline: true }, { i: 2, label: 'Button goes to', type: 'link' }]
  return [{ i: 0, label: 'Title' }, { i: 1, label: 'Text', multiline: true }]
}
const EXTRA_CARD_SPECS = [
  { i: 3, label: 'Card image', type: 'image' }, { i: 0, label: 'Title' }, { i: 1, label: 'Text', multiline: true },
  { i: 4, label: 'Small label above title (optional)' }, { i: 5, label: 'Meta line (optional)' }, { i: 2, label: '“Explore” button goes to (optional)', type: 'link' },
]

function panel(title, body, { open = true, badges = [], sub } = {}) {
  return h('details', { class: 'panel', open },
    h('summary', {}, h('div', {}, h('h3', {}, title), sub ? h('small', { class: 'muted' }, sub) : null), h('div', { class: 'row' }, badges), icon('expand_more', 'chev')),
    h('div', { class: 'panel-body' }, body))
}

/* ---------- page forms ---------- */

function globalForm(draft, lang, onChange) {
  const copy = draft[lang].copy
  const settings = draft.shared.settings
  return [
    panel('Contact details', [
      h('p', { class: 'muted' }, 'Shared by both languages.'),
      textInput(settings, 'email', { label: 'Public contact email', onChange }),
    ]),
    panel('Membership applications', [
      h('p', { class: 'muted' }, 'Shown on the membership application form. Update the contribution after each General Assembly vote.'),
      h('div', { class: 'grid-3' },
        textInput(settings, 'membershipFeeMin', { label: 'Minimum annual contribution (XAF)', onChange }),
        textInput(settings, 'membershipFeeMax', { label: 'Maximum annual contribution (XAF)', onChange }),
        textInput(settings, 'membershipInstalments', { label: 'Number of instalments allowed', onChange })),
      field('Applications', (() => {
        const select = h('select', {}, h('option', { value: 'yes', selected: settings.membershipOpen !== 'no' }, 'Open — the form accepts applications'), h('option', { value: 'no', selected: settings.membershipOpen === 'no' }, 'Closed — show a “applications closed” message'))
        select.addEventListener('change', () => { settings.membershipOpen = select.value; onChange() })
        return select
      })()),
    ], { open: false }),
    panel('Header', [
      h('div', { class: 'grid-2' }, textInput(copy, 'civic', { label: 'Tagline under the logo', onChange }), textInput(copy, 'involved', { label: '“Get involved” button text', onChange })),
      listEditor({ label: 'Navigation links', getList: () => copy.nav, setList: (list) => { copy.nav = list }, create: () => ['', ''], addLabel: 'Add link', onChange, compact: true,
        renderItem: (item) => h('div', { class: 'grid-2' }, textInput(item, 0, { label: 'Label', onChange }), linkInput(() => item[1], (value) => { item[1] = value }, { label: 'Goes to', onChange })) }),
    ]),
    panel('Footer', [
      textInput(copy, 'footerIntro', { label: 'Introduction', multiline: true, onChange }),
      h('div', { class: 'grid-2' }, textInput(copy, 'location', { label: 'Address / city', onChange }), textInput(copy, 'region', { label: 'Small line under intro', onChange })),
      h('div', { class: 'grid-3' }, textInput(copy, 'focus', { label: 'Column 1 heading', onChange }), textInput(copy, 'explore', { label: 'Column 2 heading', onChange }), textInput(copy, 'contact', { label: 'Column 3 heading', onChange })),
      listEditor({ label: 'Focus links (column 1)', getList: () => copy.focusLinks.map((text) => [text]), setList: (list) => { copy.focusLinks = list.map((item) => item[0]) }, create: () => [''], onChange, compact: true,
        renderItem: (item, index) => { const input = h('input', { type: 'text', value: item[0] }); input.addEventListener('input', () => { copy.focusLinks[index] = input.value; onChange() }); return input } }),
      h('div', { class: 'grid-3' }, textInput(copy, 'reports', { label: '“Reports” link text', onChange }), textInput(copy, 'rights', { label: 'Copyright text', onChange }), textInput(copy, 'motto', { label: 'Motto', onChange })),
    ], { open: false }),
  ]
}

function pageForm(page, draft, lang, onChange) {
  const d = draft[lang].content
  const images = draft.shared.images
  const hasMainCards = Array.isArray(d.cards)
  const out = []

  out.push(panel('Top of page (hero)', [
    h('div', { class: 'with-image hero' },
      imageField({ value: images.hero, label: 'Hero image', hint: 'Shared by EN and FR. Landscape photos work best.', onChange: (value) => { images.hero = value; onChange() } }),
      h('div', { class: 'stack' },
        textInput(d, 'pill', { label: 'Small label above the title', onChange }),
        textInput(d, 'title', { label: 'Title', hint: 'Wrap words in *asterisks* to show them in the accent colour.', onChange }),
        textInput(d, 'lead', { label: 'Introduction', multiline: true, onChange }),
        textInput(d, 'heroAlt', { label: 'Image description (for screen readers)', onChange }),
      )),
    h('div', { class: 'grid-2' }, buttonInput(d, 'primary', { label: 'Main button', onChange }), buttonInput(d, 'secondary', { label: 'Second button', onChange })),
    page === 'get-involved' ? textInput(d, 'jumpLabel', { label: 'Label before the quick links (e.g. “I want to…”)', onChange }) : null,
    page === 'home' ? h('div', { class: 'grid-2' }, textInput(d, 'trust', { label: 'Small line under the buttons', onChange }),
      h('fieldset', { class: 'button-field' }, h('legend', {}, 'Badge on the photo'), h('div', { class: 'grid-2' }, textInput(d.badge ||= ['', ''], 0, { label: 'Title', onChange }), textInput(d.badge, 1, { label: 'Subtitle', onChange })))) : null,
    page === 'home' ? textInput(d, 'ticker', { label: 'Scrolling topics band', hint: 'Topics separated by “·”. Leave empty to hide the band.', onChange }) : null,
  ], { sub: 'Title, introduction, buttons and main photo' }))

  if (Array.isArray(d.stats) || page === 'home' || page === 'impact') {
    out.push(panel('Key figures', listEditor({ getList: () => d.stats, setList: (list) => { d.stats = list }, create: () => ['', ''], addLabel: 'Add figure', onChange, compact: true,
      renderItem: (item) => tupleFields(item, [{ i: 0, label: 'Number' }, { i: 1, label: 'Label' }], onChange) }), { sub: 'The row of numbers under the hero', open: false }))
  }

  if (page === 'resources') {
    out.push(panel('Blog labels', [
      h('p', { class: 'notice' }, icon('info'), 'Articles themselves are managed in Publications → Articles. Tick “Feature at the top of the blog” on one article to choose the large featured post.'),
      h('div', { class: 'grid-2' }, ...[['searchPlaceholder', 'Search box placeholder'], ['allLabel', '“All” filter'], ['featuredLabel', '“Featured” badge'], ['latestLabel', 'Article list heading'], ['readMore', '“Read the article” link'], ['loadMore', '“Load more” button'], ['minRead', '“min read” text'], ['noResults', 'No search results message'], ['reportsTitle', 'Reports heading'], ['webinarsTitle', 'Webinars heading']]
        .map(([key, label]) => textInput(d, key, { label, onChange }))),
    ], { open: false }))
    out.push(panel('Before the first article', [
      h('div', { class: 'grid-2' }, textInput(d, 'emptyTitle', { label: 'Heading', onChange }), textInput(d, 'emptyText', { label: 'Text', onChange })),
      listEditor({ label: 'Topics we write about', getList: () => d.cards, setList: (list) => { d.cards = list }, create: () => ['', ''], addLabel: 'Add topic', onChange,
        renderItem: (item) => tupleFields(item, [{ i: 0, label: 'Title' }, { i: 1, label: 'Text', multiline: true }], onChange) }),
    ], { open: false, sub: 'Shown only while no article is published' }))
    out.push(sectionsEditor(draft, lang, onChange))
    return out
  }

  if (page === 'get-involved') {
    out.push(...getInvolvedPanels(d, draft[lang], onChange))
    out.push(sectionsEditor(draft, lang, onChange))
    return out
  }

  out.push(panel(page === 'home' ? 'Strategic pillars' : 'Main section', [
    page === 'home' ? textInput(d, 'pillarsKicker', { label: 'Small label', onChange }) : null,
    textInput(d, 'section', { label: 'Heading', onChange }),
    textInput(d, 'sectionLead', { label: 'Sub-heading', onChange }),
    textInput(draft[lang], 'details', { label: 'Paragraph', multiline: true, rows: 5, onChange }),
    page === 'about' ? h('div', { class: 'grid-2' }, textInput(d, 'feature', { label: 'Highlight box title', onChange }), textInput(d, 'featureText', { label: 'Highlight box text', multiline: true, onChange })) : null,
    hasMainCards ? listEditor({ label: 'Cards', getList: () => d.cards, setList: (list) => { d.cards = list }, create: () => newTuple(mainCardSpecs(page)), addLabel: 'Add card', onChange,
      renderItem: (item) => tupleFields(item, mainCardSpecs(page), onChange) }) : null,
    page === 'home' ? textInput(d, 'cardButton', { label: 'Card link text', onChange }) : null,
    Array.isArray(d.steps) ? listEditor({ label: 'Steps', getList: () => d.steps, setList: (list) => { d.steps = list }, create: () => ['', '', ''], addLabel: 'Add step', onChange, compact: true,
      renderItem: (item) => tupleFields(item, [{ i: 0, label: 'Number' }, { i: 1, label: 'Title' }, { i: 2, label: 'Text' }], onChange) }) : null,
  ], { open: false }))

  if (page === 'home') {
    out.push(panel('Flagship programme', h('div', { class: 'with-image' },
      imageField({ value: images.feature, label: 'Image', onChange: (value) => { images.feature = value; onChange() } }),
      h('div', { class: 'stack' },
        textInput(d, 'featureKicker', { label: 'Small label', onChange }),
        textInput(d, 'featureTitle', { label: 'Title', onChange }),
        textInput(d, 'featureText', { label: 'Text', multiline: true, onChange }),
        buttonInput(d, 'featureButton', { label: 'Button', onChange }),
        textInput(d, 'featureAlt', { label: 'Image description', onChange }),
      )), { open: false }))
  }

  if (page !== 'programs') out.push(sectionsEditor(draft, lang, onChange))
  return out
}

const PATH_SPECS = [
  { i: 0, label: 'Icon', hint: 'Material Symbols name, e.g. volunteer_activism, handshake, savings' },
  { i: 1, label: 'Title' }, { i: 2, label: 'Short description (in the list)' },
  { i: 3, label: 'Full description', multiline: true },
  { i: 4, label: 'Time commitment' },
  { i: 5, label: 'Steps (one per line)', multiline: true },
  { i: 6, label: 'Button text' },
  { i: 7, label: 'Button goes to', type: 'link' },
]
const LEVEL_SPECS = [
  { i: 0, label: 'Icon', hint: 'e.g. wifi, groups, devices' }, { i: 1, label: 'Title' },
  { i: 2, label: 'Text', multiline: true }, { i: 3, label: 'Suggested amount (optional)', hint: 'e.g. 25 000 XAF — leave empty to hide' },
]

function getInvolvedPanels(d, langData, onChange) {
  return [
    panel('Ways to get involved', [
      h('p', { class: 'notice' }, icon('info'), 'Interactive selector: visitors pick a path to see its details. Use “interest:volunteer”, “interest:donation” or “interest:partnership” as a button link to open the form with that option preselected.'),
      textInput(d, 'section', { label: 'Heading', onChange }),
      textInput(d, 'sectionLead', { label: 'Sub-heading', onChange }),
      textInput(langData, 'details', { label: 'Paragraph', multiline: true, rows: 4, onChange }),
      h('div', { class: 'grid-2' }, textInput(d, 'pathCommitment', { label: '“Time commitment” label', onChange }), textInput(d, 'pathSteps', { label: '“How it works” label', onChange })),
      listEditor({ label: 'Paths', getList: () => d.paths, setList: (list) => { d.paths = list }, create: () => newTuple(PATH_SPECS), addLabel: 'Add path', onChange,
        renderItem: (item) => tupleFields(item, PATH_SPECS, onChange) }),
    ], { open: false, sub: 'Member · Volunteer · Donate · Partner' }),
    panel('Support areas (donations)', [
      h('div', { class: 'grid-2' }, textInput(d, 'levelsKicker', { label: 'Small label', onChange }), textInput(d, 'levelsButton', { label: 'Card button text', onChange })),
      textInput(d, 'levelsTitle', { label: 'Heading', onChange }),
      textInput(d, 'levelsLead', { label: 'Sub-heading', multiline: true, onChange }),
      listEditor({ label: 'Support areas', getList: () => d.levels, setList: (list) => { d.levels = list }, create: () => ['favorite', '', '', ''], addLabel: 'Add support area', onChange,
        renderItem: (item) => tupleFields(item, LEVEL_SPECS, onChange) }),
    ], { open: false, sub: 'Clicking a card opens the form with “Donate” preselected' }),
    panel('Interest form', [
      h('p', { class: 'notice' }, icon('inbox'), 'Requests sent with this form appear in the dashboard under Community → Get involved.'),
      h('div', { class: 'grid-2' }, textInput(d, 'formKicker', { label: 'Small label', onChange }), textInput(d, 'formTitle', { label: 'Heading', onChange })),
      textInput(d, 'formLead', { label: 'Introduction', multiline: true, onChange }),
      textInput(d, 'formSuccess', { label: 'Thank-you message', multiline: true, onChange }),
    ], { open: false }),
    panel('Frequently asked questions', [
      textInput(d, 'faqTitle', { label: 'Heading', onChange }),
      listEditor({ label: 'Questions', getList: () => d.faq, setList: (list) => { d.faq = list }, create: () => ['', ''], addLabel: 'Add question', onChange,
        renderItem: (item) => tupleFields(item, [{ i: 0, label: 'Question' }, { i: 1, label: 'Answer', multiline: true }], onChange) }),
    ], { open: false }),
  ]
}

function sectionsEditor(draft, lang, onChange) {
  const container = h('div', { class: 'sections' })
  const openSections = new WeakSet()
  const draw = () => {
    const list = draft[lang].extras
    const setList = (next) => { draft[lang].extras = next; onChange(); draw() }
    container.replaceChildren(
      h('div', { class: 'sections-head' }, h('div', {}, h('h2', {}, 'Page sections'), h('p', { class: 'muted' }, 'The blocks shown below the main section, in order. Hide a section to keep its content without showing it.'))),
      ...list.map((section, index) => {
        const tools = h('div', { class: 'row', onclick: (e) => e.preventDefault() },
          h('button', { type: 'button', class: 'icon-btn', title: section.hidden ? 'Show on site' : 'Hide from site', onclick: () => { section.hidden = !section.hidden; onChange(); draw() } }, icon(section.hidden ? 'visibility_off' : 'visibility')),
          h('button', { type: 'button', class: 'icon-btn', title: 'Move up', disabled: index === 0, onclick: () => { const next = [...list]; [next[index - 1], next[index]] = [next[index], next[index - 1]]; setList(next) } }, icon('arrow_upward')),
          h('button', { type: 'button', class: 'icon-btn', title: 'Move down', disabled: index === list.length - 1, onclick: () => { const next = [...list]; [next[index + 1], next[index]] = [next[index], next[index + 1]]; setList(next) } }, icon('arrow_downward')),
          h('button', { type: 'button', class: 'icon-btn', title: 'Duplicate', onclick: () => { const next = [...list]; const copy = clone(section); openSections.add(copy); next.splice(index + 1, 0, copy); setList(next) } }, icon('content_copy')),
          h('button', { type: 'button', class: 'icon-btn danger', title: 'Delete section', onclick: async () => { if (await confirmAction(`Delete the section “${section.k || 'Untitled'}” in ${lang.toUpperCase()}?`)) setList(list.filter((_, i) => i !== index)) } }, icon('delete')),
        )
        const theme = h('select', {}, THEMES.map(([value, label]) => h('option', { value, selected: (section.theme || '') === value }, label)))
        if (!THEMES.some(([value]) => value === (section.theme || ''))) theme.append(h('option', { value: section.theme, selected: true }, section.theme))
        theme.addEventListener('change', () => { section.theme = theme.value; onChange() })
        const body = [
          section.source ? h('p', { class: 'notice' }, icon('sync'), `The cards of this section are filled automatically from ${SOURCE_LABELS[section.source] || section.source} when some are published. The cards below are shown otherwise.`) : null,
          h('div', { class: 'grid-2' }, textInput(section, 'k', { label: 'Heading', onChange }), field('Style', theme)),
          textInput(section, 't', { label: 'Sub-heading', onChange }),
          textInput(section, 'detail', { label: 'Paragraph', multiline: true, onChange }),
          listEditor({ label: 'Cards', getList: () => section.cards, setList: (next) => { section.cards = next }, create: () => newTuple(EXTRA_CARD_SPECS), addLabel: 'Add card', onChange,
            renderItem: (item) => tupleFields(item, EXTRA_CARD_SPECS, onChange) }),
          listEditor({ label: 'Photo strip', getList: () => section.media, setList: (next) => { section.media = next }, create: () => '', addLabel: 'Add photo', onChange, compact: true,
            renderItem: (item, i) => imageField({ value: item, label: `Photo ${i + 1}`, onChange: (value) => { section.media[i] = value; onChange() } }) }),
          buttonInput(section, 'action', { label: 'Button at the end of the section', onChange }),
        ]
        return h('details', { class: `panel section-panel${section.hidden ? ' is-hidden' : ''}`, open: openSections.has(section), ontoggle: (event) => { if (event.currentTarget.open) openSections.add(section); else openSections.delete(section) } },
          h('summary', {}, h('div', {}, h('h3', {}, h('span', { class: 'list-index' }, String(index + 1).padStart(2, '0')), section.k || 'Untitled section'), h('small', { class: 'muted' }, section.t || '')),
            h('div', { class: 'row' }, section.hidden ? badge('draft', 'Hidden') : null, section.source ? badge('new', 'Auto') : null, tools), icon('expand_more', 'chev')),
          h('div', { class: 'panel-body' }, body))
      }),
      h('button', { type: 'button', class: 'btn ghost add-section', onclick: () => { const created = { k: 'New section', t: '', detail: '', theme: '', cards: [] }; openSections.add(created); setList([...list, created]) } }, icon('add'), 'Add a section'),
    )
  }
  draw()
  return container
}

/* ---------- view ---------- */

export async function renderContentEditor(root, page = 'home', navigate) {
  if (!CONTENT_PAGES.some(([key]) => key === page)) page = 'home'
  let lang = 'en'
  let overrides = {}
  let draft
  let dirty = false
  const pageLabel = CONTENT_PAGES.find(([key]) => key === page)[1]

  const saveBtn = h('button', { class: 'btn primary', type: 'button', disabled: true, onclick: () => save() }, icon('save'), 'Save changes')
  const status = h('span', { class: 'save-status muted' }, 'No changes')
  const form = h('div', { class: 'editor-form' })
  const langSwitch = h('div', { class: 'segmented', role: 'tablist' })
  const resetBtn = h('button', { class: 'btn ghost', type: 'button', onclick: () => reset() }, icon('restart_alt'), 'Restore defaults')
  const customBadge = h('span')

  const onChange = () => { dirty = true; saveBtn.disabled = false; status.textContent = 'Unsaved changes'; status.className = 'save-status warn' }
  const confirmLeave = (event) => { if (dirty) { event.preventDefault(); event.returnValue = '' } }
  window.addEventListener('beforeunload', confirmLeave)
  root.cleanup = () => window.removeEventListener('beforeunload', confirmLeave)
  root.isDirty = () => dirty

  function drawLang() {
    langSwitch.replaceChildren(...LANGS.map((code) => h('button', { type: 'button', role: 'tab', class: lang === code ? 'active' : '', 'aria-selected': String(lang === code), onclick: () => { lang = code; drawLang(); drawForm() } }, code === 'en' ? 'English' : 'Français')))
  }
  function drawForm() {
    form.replaceChildren(...(page === 'global' ? globalForm(draft, lang, onChange) : pageForm(page, draft, lang, onChange)))
    const custom = overrides[page] && !isEmptyOverride(overrides[page])
    customBadge.replaceChildren(custom ? badge('published', 'Customised') : badge('draft', 'Default content'))
    resetBtn.disabled = !custom
  }
  function loadDraft() {
    const merged = mergePage(page, overrides[page])
    delete merged.custom
    draft = clone(merged)
  }

  async function save() {
    saveBtn.disabled = true
    status.textContent = 'Saving…'
    try {
      const doc = diffPage(page, draft)
      const saved = await api(`/admin/site-content/${page}`, { method: 'PUT', body: doc })
      overrides[page] = saved
      dirty = false
      status.textContent = 'All changes saved'
      status.className = 'save-status ok'
      try { localStorage.removeItem('sykotiSiteContent') } catch { /* ignore */ }
      toast(`${pageLabel} saved — changes are live`)
      drawForm()
    } catch (error) {
      saveBtn.disabled = false
      status.textContent = 'Save failed'
      status.className = 'save-status warn'
      toast(error.message, 'error')
    }
  }
  async function reset() {
    if (!(await confirmAction(`Restore the original content of “${pageLabel}” in both languages? Your edits on this page will be lost.`, { confirmLabel: 'Restore defaults' }))) return
    try {
      await api(`/admin/site-content/${page}`, { method: 'DELETE' })
      delete overrides[page]
      loadDraft()
      dirty = false
      saveBtn.disabled = true
      status.textContent = 'Default content restored'
      status.className = 'save-status ok'
      toast('Defaults restored')
      drawForm()
    } catch (error) { toast(error.message, 'error') }
  }

  const tabs = h('nav', { class: 'page-tabs', 'aria-label': 'Pages' }, CONTENT_PAGES.map(([key, label, iconName]) => h('a', { href: `#/content/${key}`, class: key === page ? 'active' : '', onclick: (event) => { event.preventDefault(); navigate(`#/content/${key}`) } }, icon(iconName), label)))

  root.replaceChildren(
    h('div', { class: 'page-head' }, h('div', {}, h('h1', {}, 'Page content'), h('p', { class: 'muted' }, 'Edit the texts, buttons, cards and images of the public website. Changes go live as soon as you save.'))),
    tabs,
    h('div', { class: 'editor-bar' },
      h('div', { class: 'row' }, h('h2', {}, pageLabel), customBadge),
      h('div', { class: 'row' }, langSwitch,
        h('a', { class: 'btn ghost', href: `${import.meta.env.BASE_URL}${PAGE_URLS[page]}`, target: '_blank', rel: 'noreferrer' }, icon('open_in_new'), 'View page'),
        resetBtn)),
    form,
    h('div', { class: 'save-bar' }, status, saveBtn),
  )
  form.replaceChildren(h('p', { class: 'muted' }, 'Loading…'))
  drawLang()
  try {
    overrides = (await api('/admin/site-content')).pages || {}
  } catch (error) {
    toast(`Could not load saved content: ${error.message}`, 'error')
  }
  loadDraft()
  drawForm()
}
