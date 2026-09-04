/* eslint-disable react/prop-types */
import { useEffect, useMemo, useState } from 'react'

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

export function WallPage({ navigate }) {
  const [data, setData] = useState({ items: [], total: 0, shared: 0 }), [theme, setTheme] = useState(''), [loading, setLoading] = useState(true), [error, setError] = useState('')
  useEffect(() => { setLoading(true); request(`/engagements/wall${theme ? `?theme=${encodeURIComponent(theme)}` : ''}`).then(setData).catch((e) => setError(e.message)).finally(() => setLoading(false)) }, [theme])
  const items = useMemo(() => data.items || [], [data.items])
  return <section className="wall-shell"><div className="wall-heading"><div
  ><button className="button primary" onClick={() => navigate('engagement')}>Prendre un engagement <span>↗</span></button><p>Découvrez les promesses concrètes prises par les citoyens de différentes ville au Cameroun</p></div></div><div className="wall-tools"><label>Filtrer par thématique <select value={theme} onChange={(e) => setTheme(e.target.value)}><option value="">Toutes les thématiques</option>{THEMES.map((item) => <option key={item}>{item}</option>)}</select></label></div>
    {loading ? <p className="wall-state">Chargement des engagements…</p> : error ? <p className="wall-state form-error">{error}</p> : items.length ? <div className="commitment-grid">{items.map((item, index) => <article key={item._id} style={{ '--delay': `${Math.min(index, 12) * 45}ms` }}><span>{item.theme}</span><blockquote>« Je m’engage à {item.commitment.replace(/^je m['’]engage à\s*/i, '')} »</blockquote><footer>— {item.displayName || 'Citoyen·ne numérique'}</footer></article>)}</div> : <p className="wall-state">Aucun engagement approuvé dans cette thématique pour le moment.</p>}
  </section>
}
