// Builds the editable website content: code defaults (siteDefaults.js) merged
// with the overrides saved from the admin dashboard (MongoDB `SiteContent`).
// Shared by the public site and by the admin editor so both see the same data.
import { baseDetails, content, copy, extras, pageImages, sectionDetails, settings } from './siteDefaults.js'

export const LANGS = ['en', 'fr']
export const PAGES = ['home', 'about', 'programs', 'impact', 'resources', 'get-involved', 'reports']

const clone = (value) => (value === undefined ? undefined : JSON.parse(JSON.stringify(value)))

export function defaultPageData(page) {
  if (page === 'global') {
    return {
      shared: { settings: clone(settings) },
      en: { copy: clone(copy.en) },
      fr: { copy: clone(copy.fr) },
    }
  }
  const lang = (code) => ({
    content: clone(content[page][code]),
    details: baseDetails[page]?.[code] || '',
    extras: (extras[page]?.[code] || []).map((section, index) => ({
      ...clone(section),
      detail: sectionDetails[page]?.[code]?.[index] || '',
    })),
  })
  return { shared: { images: clone(pageImages[page] || {}) }, en: lang('en'), fr: lang('fr') }
}

// Overrides replace whole fields: content keys one by one, and the extras list
// as a block (so sections can be reordered, hidden, added or removed).
export function mergePage(page, override) {
  const base = defaultPageData(page)
  if (!override) return { ...base, custom: {} }
  if (page === 'global') {
    return {
      shared: { settings: { ...base.shared.settings, ...(override.shared?.settings || {}) } },
      en: { copy: { ...base.en.copy, ...(override.en?.copy || {}) } },
      fr: { copy: { ...base.fr.copy, ...(override.fr?.copy || {}) } },
      custom: override.shared?.settings || {},
    }
  }
  const lang = (code) => ({
    content: { ...base[code].content, ...(override[code]?.content || {}) },
    details: override[code]?.details ?? base[code].details,
    extras: Array.isArray(override[code]?.extras) ? override[code].extras : base[code].extras,
  })
  return {
    shared: { images: { ...base.shared.images, ...(override.shared?.images || {}) } },
    en: lang('en'),
    fr: lang('fr'),
    // Images explicitly chosen in the admin (they win over automatic CMS images).
    custom: override.shared?.images || {},
  }
}

export function buildSite(overrides = {}) {
  const pages = Object.fromEntries(PAGES.map((page) => [page, mergePage(page, overrides[page])]))
  return { global: mergePage('global', overrides.global), pages }
}
