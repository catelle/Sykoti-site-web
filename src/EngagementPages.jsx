/* eslint-disable react/prop-types */
import { useEffect, useMemo, useState } from 'react'
import './wall.css'

const API = location.hostname === 'localhost' && location.port !== '4001' ? 'http://localhost:4001/api' : '/api'
const THEMES = ['Protection de mes données personnelles','Sécurité de mes comptes','Vérification des informations','Respect des autres en ligne','Utilisation responsable des réseaux sociaux','Intelligence artificielle responsable','Protection contre les arnaques en ligne','Sensibilisation de mon entourage','Autre']
const AGES = ['Moins de 15 ans','15–18 ans','19–24 ans','25–34 ans','35 ans et plus','Je préfère ne pas répondre']
const EXAMPLES = ['activer la double authentification','vérifier une information avant de la partager','mieux protéger mes données personnelles','réfléchir avant de publier','respecter la vie privée des autres','sensibiliser mon entourage']

async function request(url, options) {
  const response = await fetch(`${API}${url}`, options)
  const data = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(data.message || 'Une erreur est survenue. Veuillez réessayer.')
  return data
}

export function EngagementPage({ navigate }) {
  const [form, setForm] = useState({ displayName: '', ageRange: '', location: '', theme: '', commitment: '', phone: '', contactConsent: false, consentToPublish: false, website: '' })
  const [locations, setLocations] = useState([]), [busy, setBusy] = useState(false), [error, setError] = useState(''), [total, setTotal] = useState(null)
  useEffect(() => { request('/engagements/locations').then(setLocations).catch(() => {}) }, [])
  const change = (key, value) => setForm((current) => ({ ...current, [key]: value }))
  const submit = async (event) => {
    event.preventDefault(); if (busy) return
    setError(''); setBusy(true)
    try {
      const data = await request('/engagements', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
      setTotal(data.total)
    } catch (e) { setError(e.message) } finally { setBusy(false) }
  }
  if (total !== null) return <section className="commitment-shell commitment-success"><span className="success-mark">✓</span><p className="eyebrow">Digital Citizenship Tour</p><h1>Engagement enregistré !</h1><p>Merci de contribuer à un numérique plus sûr et plus responsable.</p><strong>{total.toLocaleString('fr-FR')} engagements ont déjà été pris.</strong><div className="actions"><button className="button primary" onClick={() => navigate('wall')}>Voir le Mur des engagements <span>↗</span></button><button className="button ghost" onClick={() => navigate('home')}>Retour à Sykoti Center</button></div></section>
  return <section className="commitment-shell"><div className="commitment-heading"><p className="eyebrow">Digital Citizenship Tour</p><h1>Mon engagement pour un numérique plus responsable</h1><p>Un numérique plus sûr commence aussi par nos propres actions. Choisissez un engagement simple et concret que vous souhaitez appliquer dès aujourd’hui.</p></div><form className="commitment-form" onSubmit={submit}>
    <label>Prénom ou pseudonyme <small>Facultatif</small><input value={form.displayName} maxLength="60" placeholder="Votre prénom ou pseudonyme" onChange={(e) => change('displayName', e.target.value)} /></label>
    <label>Tranche d’âge <small>Facultatif</small><select value={form.ageRange} onChange={(e) => change('ageRange', e.target.value)}><option value="">Sélectionner</option>{AGES.map((age) => <option key={age}>{age}</option>)}</select></label>
    <label className="wide">Où nous sommes-nous rencontrés ? <input required minLength="2" maxLength="120" list="campaign-locations" value={form.location} placeholder="Ex. Bonanjo Park, CAMTEL Bépanda, Bonabéri…" onChange={(e) => change('location', e.target.value)} /><datalist id="campaign-locations">{locations.map((location) => <option key={location} value={location} />)}</datalist></label>
    <label className="wide">Thématique de mon engagement <select required value={form.theme} onChange={(e) => change('theme', e.target.value)}><option value="">Choisir une thématique</option>{THEMES.map((theme) => <option key={theme}>{theme}</option>)}</select></label>
    <label className="wide">Je m’engage à… <textarea required minLength="5" maxLength="250" value={form.commitment} placeholder="Ex. vérifier une information avant de la partager." onChange={(e) => change('commitment', e.target.value)} /><span className="char-count">{form.commitment.length}/250</span></label>
    <div className="examples wide"><small>Quelques idées</small>{EXAMPLES.map((example) => <button type="button" key={example} onClick={() => change('commitment', example)}>+ {example}</button>)}</div>
    <label className="wide">Téléphone / WhatsApp <small>Facultatif — pour rejoindre notre communauté</small><input type="tel" maxLength="40" autoComplete="tel" value={form.phone} placeholder="Ex. +237 6 55 00 00 00" onChange={(e) => change('phone', e.target.value)} /></label>
    <label className="consent wide"><input type="checkbox" checked={form.contactConsent} onChange={(e) => change('contactConsent', e.target.checked)} /><span>J’accepte que Sykoti Center utilise ce numéro pour me contacter au sujet de la communauté.</span></label>
    <label className="consent wide"><input type="checkbox" checked={form.consentToPublish} onChange={(e) => change('consentToPublish', e.target.checked)} /><span>J’accepte que mon engagement soit publié sur le Mur des engagements de Sykoti Center.</span></label>
    <input className="honey" tabIndex="-1" autoComplete="off" name="website" value={form.website} onChange={(e) => change('website', e.target.value)} />
    <p className="privacy wide">Votre numéro reste privé et ne sera jamais affiché sur le Mur. Il sera conservé uniquement si vous acceptez que nous vous contactions pour rejoindre la communauté.</p>
    {error && <p className="form-error wide" role="alert">{error}</p>}<button className="button primary submit-commitment wide" disabled={busy}>{busy ? 'Enregistrement…' : 'Je prends mon engagement'} <span>↗</span></button>
  </form></section>
}

// Each theme gets its own note colour and icon, so the wall reads at a glance.
const THEME_STYLE = {
  'Protection de mes données personnelles': ['lock', '#ffd6e2', '#bc0050'],
  'Sécurité de mes comptes': ['key', '#fff0a6', '#9a5b00'],
  'Vérification des informations': ['fact_check', '#dcf3c4', '#3d7a12'],
  'Respect des autres en ligne': ['diversity_1', '#e6defe', '#5a3fc0'],
  'Utilisation responsable des réseaux sociaux': ['share', '#d5ecff', '#1f5fb4'],
  'Intelligence artificielle responsable': ['smart_toy', '#ffe2cf', '#b4500f'],
  'Protection contre les arnaques en ligne': ['gpp_maybe', '#ffdada', '#b42318'],
  'Sensibilisation de mon entourage': ['campaign', '#cff3ec', '#0f766e'],
  Autre: ['favorite', '#f3e9ee', '#7a3553'],
}
const themeStyle = (theme) => THEME_STYLE[theme] || THEME_STYLE.Autre
const ROTATIONS = [-1.6, 1.1, -0.6, 1.8, -1.2, 0.7]

function since(date) {
  if (!date) return ''
  const days = Math.round((Date.now() - new Date(date).getTime()) / 86400000)
  if (!Number.isFinite(days)) return ''
  const rtf = new Intl.RelativeTimeFormat('fr', { numeric: 'auto' })
  if (days < 1) return 'aujourd’hui'
  if (days < 30) return rtf.format(-days, 'day')
  if (days < 365) return rtf.format(-Math.round(days / 30), 'month')
  return rtf.format(-Math.round(days / 365), 'year')
}

function useCount(target) {
  const [value, setValue] = useState(0)
  useEffect(() => {
    if (!target || window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) { setValue(target || 0); return undefined }
    let frame
    const start = performance.now()
    const tick = (now) => {
      const t = Math.min(1, (now - start) / 1300)
      setValue(Math.round(target * (1 - (1 - t) ** 3)))
      if (t < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [target])
  return value.toLocaleString('fr-FR')
}

export function WallPage({ navigate }) {
  const [data, setData] = useState({ items: [], total: 0, shared: 0 }), [theme, setTheme] = useState(''), [query, setQuery] = useState(''), [loading, setLoading] = useState(true), [error, setError] = useState('')
  useEffect(() => {
    setLoading(true); setError('')
    request(`/engagements/wall${theme ? `?theme=${encodeURIComponent(theme)}` : ''}`).then(setData).catch((e) => setError(e.message)).finally(() => setLoading(false))
  }, [theme])
  const items = useMemo(() => {
    const q = query.trim().toLowerCase()
    const list = data.items || []
    return q ? list.filter((item) => `${item.commitment} ${item.displayName || ''} ${item.theme}`.toLowerCase().includes(q)) : list
  }, [data.items, query])
  const total = useCount(data.total), shared = useCount(data.shared)
  const takePledge = () => navigate('engagement')
  return <div className="mw">
    <section className="mw-hero">
      <div className="mw-hero-glow" aria-hidden="true"/>
      <div className="mw-wrap mw-hero-grid">
        <div>
          <span className="mw-pill"><span className="material-symbols-outlined">travel_explore</span>Digital Citizenship Tour</span>
          <h1>Le Mur des <em>engagements</em></h1>
          <p>Des promesses concrètes prises par des citoyennes et citoyens de différentes villes du Cameroun pour un numérique plus sûr, plus juste et plus responsable.</p>
          <div className="mw-actions">
            <button type="button" className="mw-btn" onClick={takePledge}>Prendre un engagement<span className="material-symbols-outlined">arrow_forward</span></button>
            <a className="mw-btn ghost" href="#mur">Lire les engagements<span className="material-symbols-outlined">arrow_downward</span></a>
          </div>
        </div>
        <div className="mw-counters">
          <div><strong>{total}</strong><span>engagements pris</span></div>
          <div><strong>{shared}</strong><span>affichés sur le mur</span></div>
          <div><strong>{Object.keys(THEME_STYLE).length - 1}</strong><span>thématiques citoyennes</span></div>
        </div>
      </div>
    </section>

    <section className="mw-board-section" id="mur">
      <div className="mw-wrap">
        <div className="mw-tools">
          <div className="mw-chips" role="group" aria-label="Filtrer par thématique">
            <button type="button" className={!theme ? 'active' : ''} aria-pressed={!theme} onClick={() => setTheme('')}><span className="material-symbols-outlined">apps</span>Toutes</button>
            {THEMES.map((item) => { const [icon, , accent] = themeStyle(item); return <button type="button" key={item} className={theme === item ? 'active' : ''} aria-pressed={theme === item} style={{ '--accent': accent }} onClick={() => setTheme(theme === item ? '' : item)}><span className="material-symbols-outlined">{icon}</span>{item}</button> })}
          </div>
          <label className="mw-search"><span className="material-symbols-outlined" aria-hidden="true">search</span><input type="search" value={query} placeholder="Rechercher un engagement, un prénom…" aria-label="Rechercher un engagement" onChange={(e) => setQuery(e.target.value)}/></label>
        </div>

        {loading ? <div className="mw-board" aria-busy="true">{[0, 1, 2, 3, 4, 5, 6, 7].map((i) => <div className="mw-note mw-skeleton" key={i}><i/><i/><i/></div>)}</div>
          : error ? <p className="mw-state error" role="alert">{error}</p>
          : items.length ? <div className="mw-board">{items.map((item, index) => {
            const [icon, bg, accent] = themeStyle(item.theme)
            const name = item.displayName || 'Citoyen·ne numérique'
            return <article className="mw-note" key={item._id} style={{ '--bg': bg, '--accent': accent, '--rot': `${ROTATIONS[index % ROTATIONS.length]}deg`, '--delay': `${Math.min(index, 16) * 50}ms` }}>
              <span className="mw-pin" aria-hidden="true"/>
              <span className="mw-theme"><span className="material-symbols-outlined">{icon}</span>{item.theme}</span>
              <p className="mw-quote">{item.commitment}</p>
              <div className="mw-author"><span className="mw-avatar" aria-hidden="true">{name.trim()[0]?.toUpperCase() || '★'}</span><span><strong>{name}</strong>{item.approvedAt && <small>{since(item.approvedAt)}</small>}</span></div>
            </article>
          })}</div>
          : <div className="mw-state"><span className="material-symbols-outlined">sticky_note_2</span><p>{query ? 'Aucun engagement ne correspond à votre recherche.' : 'Aucun engagement publié dans cette thématique pour le moment. Soyez la première personne à en prendre un !'}</p><button type="button" className="mw-btn" onClick={takePledge}>Prendre un engagement</button></div>}
      </div>
    </section>

    <section className="mw-cta">
      <div className="mw-wrap">
        <h2>Et vous, quel sera <em>votre</em> engagement ?</h2>
        <p>Un petit geste numérique, répété chaque jour, protège aussi celles et ceux qui vous entourent.</p>
        <button type="button" className="mw-btn light" onClick={takePledge}>J’ajoute mon engagement au mur<span className="material-symbols-outlined">arrow_forward</span></button>
      </div>
    </section>
  </div>
}
