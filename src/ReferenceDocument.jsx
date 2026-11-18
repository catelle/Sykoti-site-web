/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from 'react'
import { Agentation } from 'agentation'
import './reference-document.css'
import MembershipPage from './MembershipPage'
import { buildSite } from './content/siteContent'
import GetInvolvedPage from './GetInvolvedPage'
import { ArticlePage, BlogPage } from './BlogPage'
import { WallPage } from './EngagementPages'
import './site-enhancements.css'
import './site-impress.css'
import { API, BASE, Button, CountUp, go, mediaPath, pagePaths, prefersReducedMotion, publicAsset, rich, useScrollProgress, useScrollReveal } from './siteShared'

const CACHE_KEY = 'sykotiSiteContent'

function readCache() {
  try { return JSON.parse(localStorage.getItem(CACHE_KEY) || 'null') || {} } catch { return {} }
}

let sitePromise
function useSiteContent() {
  const [site, setSite] = useState(() => buildSite(readCache()))
  useEffect(() => {
    let active = true
    sitePromise ||= fetch(`${API}/site-content`).then((r) => (r.ok ? r.json() : null)).catch(() => null)
    sitePromise.then((data) => {
      if (!active || !data?.pages) return
      try { localStorage.setItem(CACHE_KEY, JSON.stringify(data.pages)) } catch { /* storage unavailable */ }
      setSite(buildSite(data.pages))
    })
    return () => { active = false }
  }, [])
  return site
}

function useCmsData() {
  const [data, setData] = useState({ team: [], articles: [], programs: [], reports: [], media: [] })
  useEffect(() => {
    let active = true
    const get = (path, fallback) => fetch(`${API}${path}`).then((r) => (r.ok ? r.json() : fallback)).catch(() => fallback)
    Promise.all([get('/team', []), get('/articles', []), get('/programs', []), get('/reports', []), get('/cyberambassador/content', {})])
      .then(([team, articles, programs, reports, cyber]) => { if (active) setData({ team, articles, programs, reports, media: cyber.media || [] }) })
    return () => { active = false }
  }, [])
  return data
}

// Sections tagged with a `source` are filled from published admin records when available.
function cmsCards(section, cms) {
  if (section.source === 'team' && cms.team.length) return cms.team.slice(0, 8).map((m, i) => [m.name, m.biography || m.role, null, m.photoUrl || `/img/placeholders/person-${(i % 8) + 1}.svg`, m.role])
  if (section.source === 'articles' && cms.articles.length) return cms.articles.slice(0, 4).map((a) => [a.title, a.excerpt, `article:${a.slug}`, a.coverUrl])
  if (section.source === 'programs' && cms.programs.length) return cms.programs.slice(0, 3).map((p) => [p.title, p.description || p.summary, p.slug === 'cyberambassador' ? 'cyberambassador' : null, p.coverUrl])
  if (section.source === 'reports' && cms.reports.length) return cms.reports.slice(0, 4).map((r) => [r.title, r.description, r.fileUrl ? publicAsset(r.fileUrl) : null, r.coverUrl])
  return section.cards
}

function cmsImage(page, cms, fallback) {
  const founder = cms.team.find((member) => member.founder && member.photoUrl)
  const media = cms.media.find((item) => item.url)
  const candidate = page === 'about' ? founder?.photoUrl : page === 'resources' ? cms.articles[0]?.coverUrl : page === 'reports' ? cms.reports[0]?.coverUrl : page === 'programs' ? cms.programs[0]?.coverUrl : media?.url
  return publicAsset(candidate) || fallback
}

function heroImage(page, data, cms) {
  if (data.custom.hero) return mediaPath(data.custom.hero)
  return cmsImage(page, cms, mediaPath(data.shared.images.hero))
}

function Header({ t, lang, setLang, page }) {
  const [open, setOpen] = useState(false)
  const bar = useRef(null)
  const scrolled = useScrollProgress(bar)
  const current = page === 'membership' ? 'get-involved' : page === 'article' ? 'resources' : page
  return <header className={`rd-header${scrolled ? ' scrolled' : ''}`}><div className="rd-progress" ref={bar} aria-hidden="true"/><div className="rd-wide rd-nav">
    <button className="rd-brand" onClick={() => go('home')}><img src={`${BASE}img/logo.png`} alt="Sykoti Center"/><span><strong>Sykoti Center</strong><small>{t.civic}</small></span></button>
    <nav className={open ? 'open' : ''}>{t.nav.map(([label, target]) => <button key={target} className={target === current ? 'active' : ''} aria-current={target === current ? 'page' : undefined} onClick={() => { go(target); setOpen(false) }}>{label}</button>)}<button className="rd-mobile-cta" onClick={() => { go('get-involved'); setOpen(false) }}>{t.involved}</button></nav>
    <div className="rd-tools">
      <div className="rd-lang"><button className={lang === 'en' ? 'active' : ''} onClick={() => setLang('en')}>EN</button><button className={lang === 'fr' ? 'active' : ''} onClick={() => setLang('fr')}>FR</button></div>
      <button className={`rd-header-cta${current === 'get-involved' ? ' active' : ''}`} onClick={() => go('get-involved')}>{t.involved}</button>
      <button className="rd-menu" aria-label="Menu" aria-expanded={open} onClick={() => setOpen(!open)}><span className="material-symbols-outlined">{open ? 'close' : 'menu'}</span></button>
    </div>
  </div></header>
}

function Footer({ t, settings }) {
  return <footer className="rd-footer">
    <div className="rd-wide rd-footer-grid">
      <div className="rd-footer-about"><div className="rd-footer-brand"><img src={`${BASE}img/logo.png`} alt=""/><strong>Sykoti Center</strong></div><p>{t.footerIntro}</p><span>{t.region}</span></div>
      <div><h3>{t.focus}</h3>{t.focusLinks.map((label) => <a key={label} href={`${BASE}programs`} onClick={(e) => { e.preventDefault(); go('programs') }}>{label}</a>)}</div>
      <div><h3>{t.explore}</h3>{t.nav.slice(1).map(([label, page]) => <a key={page} href={`${BASE}${pagePaths[page] ?? ''}`} onClick={(e) => { e.preventDefault(); go(page) }}>{label}</a>)}<a href={`${BASE}reports`} onClick={(e) => { e.preventDefault(); go('reports') }}>{t.reports}</a></div>
      <div><h3>{t.contact}</h3><p>{t.location}</p><a href={`mailto:${settings.email}`}>{settings.email}</a><a href={`${BASE}get-involved`} onClick={(e) => { e.preventDefault(); go('get-involved') }}>{t.involved}</a></div>
    </div>
    <div className="rd-wide rd-footer-bottom"><span>© {new Date().getFullYear()} Sykoti Center. {t.rights}</span><span>{t.motto}</span></div>
  </footer>
}

function Stats({ items }) {
  if (!items?.length) return null
  return <section className="rd-stats"><div className="rd-wide">{items.map(([value, label], i) => <article key={`${label}-${i}`} style={{ '--i': i }}>
    <span className="rd-stat-index" aria-hidden="true">{String(i + 1).padStart(2, '0')} —</span><strong><CountUp value={value}/></strong><span className="rd-stat-label">{label}</span><i className="rd-stat-bar" aria-hidden="true"/>
  </article>)}</div></section>
}

// Endless band of topics ("Cybersecurity · Coding · …"), edited in the admin as one line.
function Ticker({ text }) {
  const items = String(text || '').split('·').map((item) => item.trim()).filter(Boolean)
  if (!items.length) return null
  const row = items.map((item, i) => <span key={`${item}-${i}`}>{item}<i>✦</i></span>)
  return <div className="rd-ticker"><p className="rd-sr">{items.join(', ')}</p><div className="rd-ticker-track" aria-hidden="true"><div>{row}</div><div>{row}</div></div></div>
}

// Blueprint grid behind hero sections.
function HeroDeco() {
  return <div className="rd-hero-deco" aria-hidden="true"><span className="rd-grid-bg"/></div>
}

const HERO_CHIPS = [['code', 'c1'], ['shield_lock', 'c2'], ['smart_toy', 'c3'], ['wifi', 'c4']]

function BackToTop({ lang }) {
  const [show, setShow] = useState(false)
  useEffect(() => {
    const update = () => setShow(window.scrollY > 900)
    update()
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [])
  return <button type="button" className={`rd-top${show ? ' show' : ''}`} tabIndex={show ? 0 : -1} aria-label={lang === 'fr' ? 'Revenir en haut' : 'Back to top'} onClick={() => window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? 'auto' : 'smooth' })}><span className="material-symbols-outlined">arrow_upward</span></button>
}

function ExtraSections({ sections, lang, cms }) {
  const visible = (sections || []).filter((section) => !section.hidden)
  return <>{visible.map((section, index) => {
    const cards = cmsCards(section, cms)
    return <section className={`rd-extra ${section.theme || ''}`} key={`${section.k}-${index}`}><div className="rd-wide">
      <div className="rd-extra-head"><span>{String(index + 1).padStart(2, '0')}</span><h2>{rich(section.k)}</h2><p>{section.t}</p></div>
      {section.detail && <p className="rd-extra-detail">{section.detail}</p>}
      {cards?.length > 0 && <div className={`rd-extra-grid count-${Math.min(cards.length, 4)}`}>{cards.map(([title, text, action, image, role, meta], i) => <article key={`${title}-${i}`}>
        {image && <img src={mediaPath(image)} alt={title || ''} loading="lazy"/>}
        <div>{role && <span className="rd-person-role">{role}</span>}<h3>{title}</h3><p>{text}</p>{meta && <span className="rd-card-meta">{meta}</span>}{action && <button onClick={() => go(action)}>{lang === 'fr' ? 'Découvrir' : 'Explore'} →</button>}</div>
      </article>)}</div>}
      {section.media?.length > 0 && <div className="rd-media-grid">{section.media.map((file) => <img key={file} src={mediaPath(file)} alt="Sykoti Center programme" loading="lazy"/>)}</div>}
      {section.action?.[0] && <Button action={section.action[1]} secondary={section.theme === 'banner'}>{section.action[0]}</Button>}
    </div></section>
  })}</>
}

function StandardPage({ page, lang, cms, data, settings }) {
  const d = data[lang].content
  const fr = lang === 'fr'
  return <>
    <section className={`rd-page-hero ${page === 'get-involved' ? 'accent' : ''}`}><HeroDeco/><div className="rd-wide rd-page-hero-grid">
      <div><span className="rd-pill">{d.pill}</span><h1>{rich(d.title)}</h1><p>{d.lead}</p><div className="rd-actions">{d.primary?.[0] && <Button action={d.primary[1]}>{d.primary[0]}</Button>}{d.secondary?.[0] && <Button action={d.secondary[1]} secondary>{d.secondary[0]}</Button>}</div></div>
      <img src={heroImage(page, data, cms)} alt={d.heroAlt || (fr ? 'Programme jeunesse de Sykoti Center' : 'Sykoti Center youth programme')}/>
    </div></section>
    <Stats items={d.stats}/>
    <section className="rd-section"><div className="rd-wide">
      <div className="rd-section-head"><span>{page === 'resources' ? (fr ? 'Connaissances' : 'Knowledge') : 'Sykoti Center'}</span><h2>{rich(d.section || d.feature || d.title)}</h2>{d.sectionLead && <p>{d.sectionLead}</p>}{data[lang].details && <p className="rd-section-detail">{data[lang].details}</p>}</div>
      {d.cards?.length > 0 && <div className="rd-simple-grid">{d.cards.map((card, i) => <article key={`${card[0]}-${i}`} className={card[3] ? 'has-image' : undefined}>{card[3] && <img className="rd-card-img" src={mediaPath(card[3])} alt="" loading="lazy"/>}<b>{String(i + 1).padStart(2, '0')}</b><h3>{card[0]}</h3><p>{card[1]}</p>
        {page === 'programs' && card[2] && <Button action={card[2]}>{fr ? 'Découvrir' : 'Explore'}</Button>}
        {page === 'reports' && <a className="rd-text-link" href={`mailto:${settings.email}?subject=${encodeURIComponent(`Report request: ${card[0]}`)}`}>{fr ? 'Demander le rapport' : 'Request report'} →</a>}
      </article>)}</div>}
      {d.steps?.length > 0 && <div className="rd-steps">{d.steps.map((step, i) => <article key={`${step[0]}-${i}`}><b>{step[0]}</b><h3>{step[1]}</h3><p>{step[2]}</p></article>)}</div>}
      {d.featureText && <div className="rd-feature-note"><h3>{d.feature}</h3><p>{d.featureText}</p></div>}
    </div></section>
    {page !== 'programs' && <ExtraSections sections={data[lang].extras} lang={lang} cms={cms}/>}
  </>
}

function Home({ lang, cms, data }) {
  const d = data[lang].content
  const fr = lang === 'fr'
  const feature = data.custom.feature || data.shared.images.feature
  return <>
    <section className="rd-home-hero"><HeroDeco/><div className="rd-wide rd-home-grid">
      <div><span className="rd-pill">{d.pill}</span><h1>{rich(d.title)}</h1><p>{d.lead}</p>
        <div className="rd-actions">{d.primary?.[0] && <Button action={d.primary[1]}>{d.primary[0]}</Button>}{d.secondary?.[0] && <Button action={d.secondary[1]} secondary>{d.secondary[0]}</Button>}</div>
        {d.trust && <small>{d.trust}</small>}
      </div>
      <figure><img src={heroImage('home', data, cms)} alt={d.heroAlt || 'Sykoti Center youth community'}/>
        {HERO_CHIPS.map(([icon, cls]) => <span key={icon} className={`rd-chip ${cls}`} aria-hidden="true"><span className="material-symbols-outlined">{icon}</span></span>)}
        {d.badge?.[0] && <figcaption><span className="material-symbols-outlined">shield_person</span><div><strong>{d.badge[0]}</strong><small>{d.badge[1]}</small></div></figcaption>}
      </figure>
    </div></section>
    <Ticker text={d.ticker}/>
    <Stats items={d.stats}/>
    <section className="rd-section"><div className="rd-wide">
      <div className="rd-section-head centered"><span>{d.pillarsKicker}</span><h2>{rich(d.section)}</h2><p>{d.sectionLead}</p>{data[lang].details && <p className="rd-section-detail">{data[lang].details}</p>}</div>
      <div className="rd-card-grid">{(d.cards || []).map(([icon, title, text, image], i) => <article key={`${title}-${i}`} className={image ? 'has-image' : undefined}>{image && <img className="rd-card-img" src={mediaPath(image)} alt="" loading="lazy"/>}<span className="material-symbols-outlined">{icon}</span><h3>{title}</h3><p>{text}</p><button onClick={() => go('programs')}>{d.cardButton || (fr ? 'En savoir plus' : 'Learn more')} →</button></article>)}</div>
    </div></section>
    <section className="rd-feature"><div className="rd-wide rd-feature-grid">
      <figure className="rd-feature-media"><img src={mediaPath(feature)} alt={d.featureAlt || ''} loading="lazy"/>{(d.stats?.[1] || d.stats?.[0]) && <figcaption><strong><CountUp value={(d.stats[1] || d.stats[0])[0]}/></strong><span>{(d.stats[1] || d.stats[0])[1]}</span></figcaption>}</figure>
      <div><span>{d.featureKicker}</span><h2>{rich(d.featureTitle)}</h2><p>{d.featureText}</p>{d.featureButton?.[0] && <Button action={d.featureButton[1]}>{d.featureButton[0]}</Button>}</div>
    </div></section>
    <ExtraSections sections={data[lang].extras} lang={lang} cms={cms}/>
  </>
}

export default function ReferenceDocument({ page, slug: initialSlug = '' }) {
  const cms = useCmsData()
  const site = useSiteContent()
  const [lang, setLangState] = useState(() => { try { return localStorage.getItem('sykotiLanguage') || 'en' } catch { return 'en' } })
  const setLang = (value) => { setLangState(value); try { localStorage.setItem('sykotiLanguage', value) } catch { /* ignore */ } document.documentElement.lang = value }
  // Track the URL hash ourselves: "#membership" switches the Get Involved page to the
  // membership form without changing the page, so App would not re-render on its own.
  // The same applies to /articles/<slug>: moving between articles keeps page === 'article'.
  const [hash, setHash] = useState(() => location.hash)
  const [path, setPath] = useState(() => location.pathname)
  useEffect(() => {
    const sync = () => { setHash(location.hash); setPath(location.pathname) }
    window.addEventListener('popstate', sync)
    window.addEventListener('hashchange', sync)
    return () => { window.removeEventListener('popstate', sync); window.removeEventListener('hashchange', sync) }
  }, [])
  const membership = page === 'membership' || (page === 'get-involved' && hash === '#membership')
  const slug = page === 'article' ? (decodeURIComponent(path.split('/articles/')[1]?.split('/')[0] || '') || initialSlug) : ''
  useEffect(() => { document.documentElement.lang = lang; window.scrollTo(0, 0) }, [lang, page, slug, membership])
  const t = site.global[lang].copy
  const settings = site.global.shared.settings
  const data = site.pages[page === 'article' ? 'resources' : page === 'membership' ? 'get-involved' : page]
  const root = useRef(null)
  useScrollReveal(root)
  // The membership application is a focused page: no site header, footer or other sections.
  if (membership) {
    return <div className="reference-document reference-page-membership">
      <MembershipPage lang={lang} setLang={setLang} settings={settings}/>
    </div>
  }
  // The pledge form still lives in the older App layout: switch to it through the router.
  const openPledge = (target) => { if (target !== 'engagement') { go(target); return } history.pushState({}, '', `${BASE}engagement`); dispatchEvent(new PopStateEvent('popstate')) }
  const content = page === 'wall' ? <WallPage navigate={openPledge}/>
    : page === 'home' ? <Home lang={lang} cms={cms} data={data}/>
    : page === 'resources' ? <BlogPage lang={lang} data={data} cms={cms} extras={<ExtraSections sections={data[lang].extras} lang={lang} cms={cms}/>}/>
    : page === 'article' ? <ArticlePage slug={slug} lang={lang} data={data}/>
    : page === 'get-involved' ? <GetInvolvedPage lang={lang} data={data} settings={settings} heroSrc={heroImage(page, data, cms)} extras={<ExtraSections sections={data[lang].extras} lang={lang} cms={cms}/>}/>
    : <StandardPage page={page} lang={lang} cms={cms} data={data} settings={settings}/>
  return <>
    <div ref={root} className={`reference-document reference-page-${membership ? 'membership' : page}`}>
      <a className="rd-skip" href="#main">{lang === 'fr' ? 'Aller au contenu' : 'Skip to content'}</a>
      <Header t={t} lang={lang} setLang={setLang} page={membership ? 'membership' : page}/>
      <main id="main" key={`${page}-${slug}-${membership}`} className="rd-main">{content}</main>
      <Footer t={t} settings={settings}/>
      <BackToTop lang={lang}/>
    </div>
    {import.meta.env.DEV && <Agentation appName="Sykoti Center" useHashLocation/>}
  </>
}
