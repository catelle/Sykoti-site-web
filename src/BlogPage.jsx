/* eslint-disable react/prop-types, react-refresh/only-export-components */
// Blog index and article pages. Articles come from the admin (Publications → Articles);
// page labels come from the editable site content (Page content → Blog & resources).
import { useEffect, useMemo, useState } from 'react'
import './blog.css'
import { API, BASE, Button, go, mediaPath, publicAsset, rich } from './siteShared'

const PAGE_SIZE = 9
const Icon = ({ name }) => <span className="material-symbols-outlined" aria-hidden="true">{name}</span>
const fallbackCover = mediaPath('platform-module.png')

export const readingMinutes = (text = '') => Math.max(1, Math.round(String(text).trim().split(/\s+/).filter(Boolean).length / 200))
const formatDate = (value, lang, style = 'medium') => {
  if (!value) return ''
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? '' : new Intl.DateTimeFormat(lang === 'fr' ? 'fr-FR' : 'en-GB', { dateStyle: style }).format(date)
}
const initials = (name = '') => name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join('').toUpperCase() || 'S'
const articleHref = (slug) => `${BASE}articles/${slug}`
const openArticle = (event, slug) => {
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.button === 1) return
  event.preventDefault()
  go(`article:${slug}`)
}

/* ---------- article text formatting (safe: builds React elements, never HTML) ---------- */

const SAFE_URL = /^(https?:\/\/|mailto:|\/)/
function inline(text, keyPrefix = '') {
  const out = []
  const pattern = /(\*\*[^*]+\*\*|\*[^*\s][^*]*\*|\[[^\]]+\]\([^)\s]+\))/g
  let last = 0
  let match
  let i = 0
  while ((match = pattern.exec(text))) {
    if (match.index > last) out.push(text.slice(last, match.index))
    const token = match[0]
    const key = `${keyPrefix}-${i++}`
    if (token.startsWith('**')) out.push(<strong key={key}>{token.slice(2, -2)}</strong>)
    else if (token.startsWith('*')) out.push(<em key={key}>{token.slice(1, -1)}</em>)
    else {
      const [, label, url] = token.match(/^\[([^\]]+)\]\(([^)\s]+)\)$/)
      out.push(SAFE_URL.test(url) ? <a key={key} href={url} target={url.startsWith('/') ? undefined : '_blank'} rel="noreferrer">{label}</a> : label)
    }
    last = match.index + token.length
  }
  if (last < text.length) out.push(text.slice(last))
  return out
}

export function Prose({ source = '' }) {
  const lines = String(source).replace(/\r/g, '').split('\n')
  const blocks = []
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()
    if (!line) continue
    const key = `b${i}`
    if (/^#{1,2}\s/.test(line)) { blocks.push(<h2 key={key} id={`s-${i}`}>{inline(line.replace(/^#{1,2}\s/, ''), key)}</h2>); continue }
    if (/^###\s/.test(line)) { blocks.push(<h3 key={key}>{inline(line.slice(4), key)}</h3>); continue }
    const image = line.match(/^!\[([^\]]*)\]\(([^)\s]+)\)$/)
    if (image) { if (SAFE_URL.test(image[2]) || !image[2].includes(':')) blocks.push(<figure key={key}><img src={mediaPath(image[2])} alt={image[1]} loading="lazy"/>{image[1] && <figcaption>{image[1]}</figcaption>}</figure>); continue }
    if (/^>\s?/.test(line)) {
      const quote = []
      while (i < lines.length && /^>\s?/.test(lines[i].trim())) quote.push(lines[i++].trim().replace(/^>\s?/, ''))
      i--
      blocks.push(<blockquote key={key}>{quote.map((q, j) => <p key={j}>{inline(q, `${key}${j}`)}</p>)}</blockquote>)
      continue
    }
    const listType = /^[-*]\s/.test(line) ? 'ul' : /^\d+[.)]\s/.test(line) ? 'ol' : null
    if (listType) {
      const items = []
      const test = listType === 'ul' ? /^[-*]\s/ : /^\d+[.)]\s/
      while (i < lines.length && test.test(lines[i].trim())) items.push(lines[i++].trim().replace(test, ''))
      i--
      const List = listType
      blocks.push(<List key={key}>{items.map((item, j) => <li key={j}>{inline(item, `${key}${j}`)}</li>)}</List>)
      continue
    }
    blocks.push(<p key={key}>{inline(line, key)}</p>)
  }
  return <div className="bl-prose">{blocks}</div>
}

/* ---------- cards ---------- */

function Meta({ article, lang, d }) {
  return <div className="bl-meta">
    <span className="bl-avatar" aria-hidden="true">{initials(article.author || 'Sykoti Center')}</span>
    <span><strong>{article.author || 'Sykoti Center'}</strong><small>{formatDate(article.publishedAt || article.createdAt, lang)} · {readingMinutes(article.content)} {d.minRead || 'min read'}</small></span>
  </div>
}

function ArticleCard({ article, lang, d }) {
  return <article className="bl-card">
    <a href={articleHref(article.slug)} onClick={(e) => openArticle(e, article.slug)} className="bl-card-link">
      <div className="bl-cover"><img src={publicAsset(article.coverUrl) || fallbackCover} alt="" loading="lazy"/></div>
      <div className="bl-card-body">
        <div className="bl-kicker">{article.category && <span>{article.category}</span>}<span>{readingMinutes(article.content)} {d.minRead || 'min read'}</span></div>
        <h3>{article.title}</h3>
        <p>{article.excerpt}</p>
        <Meta article={article} lang={lang} d={d}/>
      </div>
    </a>
  </article>
}

function Featured({ article, lang, d }) {
  return <article className="bl-featured">
    <a href={articleHref(article.slug)} onClick={(e) => openArticle(e, article.slug)} className="bl-featured-link">
      <div className="bl-featured-cover"><img src={publicAsset(article.coverUrl) || fallbackCover} alt=""/></div>
      <div className="bl-featured-body">
        <div className="bl-kicker"><span className="bl-flag">{d.featuredLabel}</span>{article.category && <span>{article.category}</span>}</div>
        <h2>{article.title}</h2>
        <p>{article.excerpt}</p>
        <Meta article={article} lang={lang} d={d}/>
        <span className="bl-read">{d.readMore} <Icon name="arrow_forward"/></span>
      </div>
    </a>
  </article>
}

function usePublic(path, initial) {
  const [state, setState] = useState({ data: initial, loading: true, error: false })
  useEffect(() => {
    let active = true
    setState((s) => ({ ...s, loading: true }))
    fetch(`${API}${path}`).then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((data) => { if (active) setState({ data, loading: false, error: false }) })
      .catch(() => { if (active) setState({ data: initial, loading: false, error: true }) })
    return () => { active = false }
  }, [path]) // eslint-disable-line react-hooks/exhaustive-deps
  return state
}

/* ---------- blog index ---------- */

export function BlogPage({ lang, data, cms, extras }) {
  const d = data[lang].content
  const fr = lang === 'fr'
  const { data: articles, loading } = usePublic('/articles', [])
  const { data: webinars } = usePublic('/webinars', [])
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('')
  const [limit, setLimit] = useState(PAGE_SIZE)

  const categories = useMemo(() => [...new Set(articles.map((a) => a.category).filter(Boolean))], [articles])
  const featured = articles.find((a) => a.featured) || articles[0]
  const filtering = Boolean(query.trim() || category)
  const visible = useMemo(() => {
    const q = query.trim().toLowerCase()
    return articles.filter((a) => (!category || a.category === category)
      && (!q || `${a.title} ${a.excerpt} ${a.category} ${a.author}`.toLowerCase().includes(q))
      && (filtering || a !== featured))
  }, [articles, query, category, filtering, featured])
  useEffect(() => { setLimit(PAGE_SIZE) }, [query, category])
  const reports = cms.reports || []

  return <>
    <section className="bl-head"><div className="rd-wide">
      <div className="bl-head-copy"><span className="rd-pill">{d.pill}</span><h1>{rich(d.title)}</h1>{d.lead && <p>{d.lead}</p>}</div>
      {articles.length > 0 && <div className="bl-tools">
        <label className="bl-search"><Icon name="search"/><span className="bl-sr">{d.searchPlaceholder}</span><input type="search" value={query} placeholder={d.searchPlaceholder} onChange={(e) => setQuery(e.target.value)}/></label>
        {categories.length > 1 && <div className="bl-chips" role="group" aria-label={fr ? 'Catégories' : 'Categories'}>
          {['', ...categories].map((c) => <button key={c || 'all'} type="button" aria-pressed={category === c} className={category === c ? 'active' : ''} onClick={() => setCategory(c)}>{c || d.allLabel}{c && <small>{articles.filter((a) => a.category === c).length}</small>}</button>)}
        </div>}
      </div>}
    </div></section>

    <section className="bl-body"><div className="rd-wide">
      {loading ? <div className="bl-grid">{[0, 1, 2].map((i) => <div className="bl-card bl-skeleton" key={i}><div className="bl-cover"/><div className="bl-card-body"><i/><i/><i/></div></div>)}</div>
        : !articles.length ? <div className="bl-empty">
          <Icon name="edit_note"/><h2>{d.emptyTitle}</h2><p>{d.emptyText}</p>
          {d.cards?.length > 0 && <div className="bl-topics">{d.cards.map(([title, text], i) => <article key={`${title}-${i}`}><b>{String(i + 1).padStart(2, '0')}</b><h3>{title}</h3><p>{text}</p></article>)}</div>}
        </div>
        : <>
          {!filtering && featured && <Featured article={featured} lang={lang} d={d}/>}
          <div className="bl-section-title"><h2>{filtering ? `${visible.length} ${fr ? 'résultat(s)' : 'result(s)'}` : d.latestLabel}</h2></div>
          {visible.length ? <div className="bl-grid">{visible.slice(0, limit).map((a) => <ArticleCard key={a._id} article={a} lang={lang} d={d}/>)}</div>
            : <p className="bl-none">{filtering ? d.noResults : ''}</p>}
          {visible.length > limit && <div className="bl-more"><button type="button" className="rd-button secondary" onClick={() => setLimit((n) => n + PAGE_SIZE)}>{d.loadMore}</button></div>}
        </>}

      {(reports.length > 0 || webinars.length > 0) && <div className="bl-resources">
        {reports.length > 0 && <div><h2>{d.reportsTitle}</h2><div className="bl-downloads">{reports.map((r) => <a key={r._id} href={publicAsset(r.fileUrl) || undefined} target="_blank" rel="noreferrer" className={r.fileUrl ? '' : 'disabled'}>
          <span className="bl-file"><Icon name="description"/></span><span><small>{r.category}</small><strong>{r.title}</strong>{r.description && <em>{r.description}</em>}</span>{r.fileUrl && <Icon name="download"/>}</a>)}</div></div>}
        {webinars.length > 0 && <div><h2>{d.webinarsTitle}</h2><div className="bl-webinars">{webinars.map((w) => <article key={w._id}>
          <img src={publicAsset(w.coverUrl) || mediaPath('cyber-attacks-webinar.png')} alt="" loading="lazy"/>
          <div><small>{formatDate(w.scheduledAt, lang, 'long')}</small><h3>{w.title}</h3>{w.replayUrl ? <a href={w.replayUrl} target="_blank" rel="noreferrer">{fr ? 'Voir le replay' : 'Watch replay'} ↗</a> : w.registrationUrl && w.status === 'open' ? <a href={w.registrationUrl} target="_blank" rel="noreferrer">{fr ? 'S’inscrire' : 'Register'} ↗</a> : null}</div>
        </article>)}</div></div>}
      </div>}
    </div></section>
    {extras}
  </>
}

/* ---------- article page ---------- */

function Share({ article, lang }) {
  const [copied, setCopied] = useState(false)
  const url = typeof window !== 'undefined' ? `${window.location.origin}${articleHref(article.slug)}` : ''
  const text = encodeURIComponent(article.title)
  const u = encodeURIComponent(url)
  const links = [
    ['WhatsApp', `https://wa.me/?text=${text}%20${u}`],
    ['LinkedIn', `https://www.linkedin.com/sharing/share-offsite/?url=${u}`],
    ['Facebook', `https://www.facebook.com/sharer/sharer.php?u=${u}`],
    ['X', `https://twitter.com/intent/tweet?text=${text}&url=${u}`],
  ]
  const copy = async () => {
    try {
      if (navigator.share && /Mobi|Android/i.test(navigator.userAgent)) { await navigator.share({ title: article.title, url }); return }
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch { /* cancelled */ }
  }
  return <div className="bl-share">
    <span>{lang === 'fr' ? 'Partager' : 'Share'}</span>
    {links.map(([name, href]) => <a key={name} href={href} target="_blank" rel="noreferrer">{name}</a>)}
    <button type="button" onClick={copy}><Icon name={copied ? 'check' : 'link'}/>{copied ? (lang === 'fr' ? 'Lien copié' : 'Link copied') : (lang === 'fr' ? 'Copier le lien' : 'Copy link')}</button>
  </div>
}

export function ArticlePage({ slug, lang, data, extras }) {
  const d = data[lang].content
  const fr = lang === 'fr'
  const { data: article, loading, error } = usePublic(`/articles/${encodeURIComponent(slug)}`, null)
  const { data: all } = usePublic('/articles', [])
  useEffect(() => { if (article?.title) document.title = `${article.title} | Sykoti Center` }, [article])

  const back = <a className="bl-back" href={`${BASE}resources`} onClick={(e) => { e.preventDefault(); go('resources') }}><Icon name="arrow_back"/>{fr ? 'Tous les articles' : 'All articles'}</a>
  if (loading) return <section className="bl-article bl-article-loading"><div className="bl-narrow">{back}<i/><i/><i/></div></section>
  if (error || !article) return <section className="bl-article"><div className="bl-narrow bl-missing">{back}<h1>{fr ? 'Article introuvable' : 'Article not found'}</h1><p>{fr ? 'Cet article n’existe pas ou n’est plus publié.' : 'This article does not exist or is no longer published.'}</p><Button action="resources">{fr ? 'Retour au blog' : 'Back to the blog'}</Button></div></section>

  const related = all.filter((a) => a.slug !== article.slug)
    .sort((a, b) => Number(b.category === article.category) - Number(a.category === article.category))
    .slice(0, 3)
  return <>
    <article className="bl-article">
      <div className="bl-narrow bl-article-head">
        {back}
        {article.category && <span className="bl-kicker"><span>{article.category}</span></span>}
        <h1>{article.title}</h1>
        {article.excerpt && <p className="bl-lead">{article.excerpt}</p>}
        <div className="bl-article-meta"><Meta article={article} lang={lang} d={d}/><Share article={article} lang={lang}/></div>
      </div>
      {article.coverUrl && <figure className="bl-article-cover"><img src={publicAsset(article.coverUrl)} alt=""/></figure>}
      <div className="bl-narrow">
        <Prose source={article.content}/>
        {/* Not a <footer>: the legacy stylesheet styles every footer as the site footer. */}
        <div className="bl-article-foot">
          <div className="bl-author"><span className="bl-avatar big">{initials(article.author || 'Sykoti Center')}</span><div><small>{fr ? 'Publié par' : 'Written by'}</small><strong>{article.author || 'Sykoti Center'}</strong><p>{fr ? 'Sykoti Center accompagne les jeunes pour un usage plus sûr, critique et créatif du numérique.' : 'Sykoti Center helps young people use technology more safely, critically and creatively.'}</p></div></div>
          <Share article={article} lang={lang}/>
        </div>
      </div>
    </article>
    {related.length > 0 && <section className="bl-related"><div className="rd-wide">
      <div className="bl-section-title"><h2>{fr ? 'À lire ensuite' : 'Keep reading'}</h2><a href={`${BASE}resources`} onClick={(e) => { e.preventDefault(); go('resources') }}>{fr ? 'Voir tout le blog' : 'View the whole blog'} →</a></div>
      <div className="bl-grid">{related.map((a) => <ArticleCard key={a._id} article={a} lang={lang} d={d}/>)}</div>
    </div></section>}
    {extras}
  </>
}
