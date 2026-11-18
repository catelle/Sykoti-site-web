/* eslint-disable react/prop-types */
// Get Involved page: contribution paths, support areas, interest form and FAQ.
// All copy comes from the editable site content (admin → Page content → Get involved).
import { useEffect, useId, useState } from 'react'
import { API, Button, go, rich, scrollToId, takePendingInterest } from './siteShared'

const TYPES = {
  en: [['volunteer', 'Volunteer'], ['donation', 'Donate / sponsor'], ['partnership', 'Partnership'], ['in-kind', 'Equipment / in-kind'], ['other', 'Other']],
  fr: [['volunteer', 'Bénévolat'], ['donation', 'Don / parrainage'], ['partnership', 'Partenariat'], ['in-kind', 'Matériel / en nature'], ['other', 'Autre']],
}
const LABELS = {
  en: { type: 'I would like to', name: 'Full name', email: 'Email', phone: 'Phone / WhatsApp', org: 'Organisation', optional: 'optional', level: 'Area to support', anyLevel: 'Not sure yet', amount: 'Amount you are considering (XAF)', message: 'Your message', consent: 'I agree that Sykoti Center may contact me about this request.', send: 'Send my request', sending: 'Sending…', again: 'Send another request', contactDirect: 'Prefer email?', placeholders: { volunteer: 'Your skills, availability and how you would like to help…', donation: 'What you would like to support and any questions about the use of funds…', partnership: 'Your organisation, its goals and the kind of collaboration you have in mind…', 'in-kind': 'The equipment or resources you can offer…', other: 'Tell us how you would like to contribute…' }, ask: 'Ask a question', jumpTo: 'Go to' },
  fr: { type: 'Je souhaite', name: 'Nom complet', email: 'E-mail', phone: 'Téléphone / WhatsApp', org: 'Organisation', optional: 'facultatif', level: 'Domaine à soutenir', anyLevel: 'Je ne sais pas encore', amount: 'Montant envisagé (XAF)', message: 'Votre message', consent: 'J’accepte que Sykoti Center me contacte au sujet de cette demande.', send: 'Envoyer ma demande', sending: 'Envoi…', again: 'Envoyer une autre demande', contactDirect: 'Vous préférez l’e-mail ?', placeholders: { volunteer: 'Vos compétences, disponibilités et la manière dont vous souhaitez aider…', donation: 'Ce que vous souhaitez soutenir et vos questions sur l’usage des fonds…', partnership: 'Votre organisation, ses objectifs et le type de collaboration envisagé…', 'in-kind': 'Le matériel ou les ressources que vous pouvez proposer…', other: 'Dites-nous comment vous souhaitez contribuer…' }, ask: 'Poser une question', jumpTo: 'Aller à' },
}
const emptyForm = { name: '', email: '', phone: '', organization: '', level: '', amount: '', message: '', consent: false, website: '' }
const Icon = ({ name }) => <span className="material-symbols-outlined" aria-hidden="true">{name}</span>

function Paths({ d, details, lang, active, setActive }) {
  const paths = d.paths || []
  const path = paths[active] || paths[0]
  const t = LABELS[lang]
  if (!path) return null
  const [icon, title, , body, commitment, steps, ctaLabel, ctaLink] = path
  const stepList = String(steps || '').split('\n').map((s) => s.trim()).filter(Boolean)
  const onKey = (event) => {
    if (!['ArrowDown', 'ArrowUp', 'ArrowLeft', 'ArrowRight'].includes(event.key)) return
    event.preventDefault()
    const next = (active + (['ArrowDown', 'ArrowRight'].includes(event.key) ? 1 : -1) + paths.length) % paths.length
    setActive(next)
    document.getElementById(`gi-tab-${next}`)?.focus()
  }
  return <section className="gi-paths" id="paths"><div className="rd-wide">
    <div className="rd-section-head"><span>{lang === 'fr' ? 'S’engager avec Sykoti' : 'Ways to get involved'}</span><h2>{rich(d.section)}</h2>{d.sectionLead && <p>{d.sectionLead}</p>}{details && <p className="rd-section-detail">{details}</p>}</div>
    <div className="gi-path-layout">
      <div className="gi-path-tabs" role="tablist" aria-orientation="vertical" onKeyDown={onKey}>
        {paths.map(([pIcon, pTitle, short], i) => <button key={`${pTitle}-${i}`} id={`gi-tab-${i}`} role="tab" type="button" aria-selected={i === active} aria-controls="gi-path-panel" tabIndex={i === active ? 0 : -1} className={i === active ? 'active' : ''} onClick={() => setActive(i)}>
          <span className="gi-tab-icon"><Icon name={pIcon || 'favorite'}/></span>
          <span className="gi-tab-copy"><strong>{pTitle}</strong>{short && <small>{short}</small>}</span>
          <span className="gi-tab-arrow"><Icon name="chevron_right"/></span>
        </button>)}
      </div>
      <article className="gi-path-panel" id="gi-path-panel" role="tabpanel" aria-labelledby={`gi-tab-${active}`} key={active}>
        <div className="gi-panel-top"><span className="gi-panel-icon"><Icon name={icon || 'favorite'}/></span>{commitment && <span className="gi-chip"><Icon name="schedule"/>{d.pathCommitment ? `${d.pathCommitment} · ` : ''}{commitment}</span>}</div>
        <h3>{title}</h3>
        {body && <p>{body}</p>}
        {stepList.length > 0 && <><h4>{d.pathSteps}</h4><ol className="gi-steps">{stepList.map((step, i) => <li key={i} style={{ '--i': i }}><b>{i + 1}</b><span>{step}</span></li>)}</ol></>}
        <div className="gi-panel-actions">{ctaLabel && <Button action={ctaLink}>{ctaLabel}</Button>}<button type="button" className="gi-link" onClick={() => go('#interest')}>{t.ask} →</button></div>
      </article>
    </div>
  </div></section>
}

function Levels({ d, onPick }) {
  const levels = d.levels || []
  if (!levels.length) return null
  return <section className="gi-levels-section"><div className="rd-wide">
    <div className="rd-section-head centered"><span>{d.levelsKicker}</span><h2>{rich(d.levelsTitle)}</h2>{d.levelsLead && <p>{d.levelsLead}</p>}</div>
    <div className={`gi-levels count-${Math.min(levels.length, 4)}`}>{levels.map(([icon, title, text, amount], i) => <article className="gi-level" key={`${title}-${i}`}>
      <span className="gi-level-icon"><Icon name={icon || 'favorite'}/></span>
      {amount && <strong className="gi-amount">{amount}</strong>}
      <h3>{title}</h3>
      <p>{text}</p>
      <button type="button" onClick={() => onPick(title)}>{d.levelsButton || 'Support this'} <Icon name="arrow_forward"/></button>
    </article>)}</div>
  </div></section>
}

function InterestForm({ d, lang, settings, type, setType, level, setLevel }) {
  const t = LABELS[lang]
  const ids = useId()
  const [form, setForm] = useState(emptyForm)
  const [state, setState] = useState({ sending: false, error: '', sent: false })
  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }))
  const levels = (d.levels || []).map((item) => item[1]).filter(Boolean)
  const showLevel = ['donation', 'in-kind'].includes(type) && levels.length > 0

  async function submit(event) {
    event.preventDefault()
    setState({ sending: true, error: '', sent: false })
    try {
      const response = await fetch(`${API}/support`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, level: showLevel ? level : '', amount: type === 'donation' && form.amount !== '' ? Number(form.amount) : undefined, contributionType: type, lang }),
      })
      const data = await response.json().catch(() => ({}))
      if (!response.ok) throw new Error(data.message || (lang === 'fr' ? 'Envoi impossible. Réessayez.' : 'Could not send. Please try again.'))
      setState({ sending: false, error: '', sent: true })
      setForm(emptyForm)
    } catch (error) {
      setState({ sending: false, error: error.message, sent: false })
    }
  }

  return <section className="gi-form-section" id="interest"><div className="rd-wide gi-form-grid">
    <div className="gi-form-intro">
      <span className="gi-kicker">{d.formKicker}</span>
      <h2>{rich(d.formTitle)}</h2>
      {d.formLead && <p>{d.formLead}</p>}
      <div className="gi-direct"><Icon name="mail"/><div><small>{t.contactDirect}</small><a href={`mailto:${settings.email}`}>{settings.email}</a></div></div>
    </div>
    {state.sent ? <div className="gi-form gi-success" role="status">
      <span className="gi-success-icon"><Icon name="check"/></span>
      <p>{d.formSuccess}</p>
      <button type="button" className="rd-button secondary" onClick={() => setState({ sending: false, error: '', sent: false })}>{t.again}</button>
    </div> : <form className="gi-form" onSubmit={submit}>
      <fieldset className="gi-types"><legend>{t.type}</legend>
        <div>{TYPES[lang].map(([value, label]) => <label key={value} className={type === value ? 'active' : ''}><input type="radio" name="contributionType" value={value} checked={type === value} onChange={() => setType(value)}/>{label}</label>)}</div>
      </fieldset>
      <div className="gi-fields">
        <label htmlFor={`${ids}-name`}>{t.name}<input id={`${ids}-name`} required minLength={2} maxLength={140} autoComplete="name" value={form.name} onChange={(e) => update('name', e.target.value)}/></label>
        <label htmlFor={`${ids}-email`}>{t.email}<input id={`${ids}-email`} type="email" required maxLength={180} autoComplete="email" value={form.email} onChange={(e) => update('email', e.target.value)}/></label>
        <label htmlFor={`${ids}-phone`}><span>{t.phone} <i>({t.optional})</i></span><input id={`${ids}-phone`} type="tel" maxLength={40} autoComplete="tel" value={form.phone} onChange={(e) => update('phone', e.target.value)}/></label>
        <label htmlFor={`${ids}-org`}><span>{t.org} <i>({t.optional})</i></span><input id={`${ids}-org`} maxLength={160} autoComplete="organization" value={form.organization} onChange={(e) => update('organization', e.target.value)}/></label>
        {showLevel && <label htmlFor={`${ids}-level`}>{t.level}<select id={`${ids}-level`} value={level} onChange={(e) => setLevel(e.target.value)}><option value="">{t.anyLevel}</option>{levels.map((title) => <option key={title} value={title}>{title}</option>)}</select></label>}
        {type === 'donation' && <label htmlFor={`${ids}-amount`}><span>{t.amount} <i>({t.optional})</i></span><input id={`${ids}-amount`} type="number" min="0" step="500" inputMode="numeric" value={form.amount} onChange={(e) => update('amount', e.target.value)}/></label>}
        <label htmlFor={`${ids}-message`} className="gi-full">{t.message}<textarea id={`${ids}-message`} required minLength={10} maxLength={3000} rows={5} placeholder={t.placeholders[type]} value={form.message} onChange={(e) => update('message', e.target.value)}/></label>
        <label className="gi-hp" aria-hidden="true">Website<input tabIndex={-1} autoComplete="off" value={form.website} onChange={(e) => update('website', e.target.value)}/></label>
      </div>
      <label className="gi-consent"><input type="checkbox" required checked={form.consent} onChange={(e) => update('consent', e.target.checked)}/><span>{t.consent}</span></label>
      {state.error && <p className="gi-error" role="alert">{state.error}</p>}
      <button className="rd-button gi-submit" type="submit" disabled={state.sending}>{state.sending ? t.sending : t.send}<Icon name="send"/></button>
    </form>}
  </div></section>
}

function Faq({ d }) {
  const items = (d.faq || []).filter((item) => item[0])
  const [open, setOpen] = useState(0)
  if (!items.length) return null
  return <section className="gi-faq"><div className="rd-wide gi-faq-grid">
    <div className="rd-section-head"><span>FAQ</span><h2>{rich(d.faqTitle)}</h2></div>
    <div className="gi-faq-list">{items.map(([question, answer], i) => <div className={`gi-faq-item${open === i ? ' open' : ''}`} key={`${question}-${i}`}>
      <h3><button type="button" aria-expanded={open === i} aria-controls={`gi-faq-${i}`} onClick={() => setOpen(open === i ? -1 : i)}>{question}<Icon name="add"/></button></h3>
      <div className="gi-faq-answer" id={`gi-faq-${i}`} role="region"><div><p>{answer}</p></div></div>
    </div>)}</div>
  </div></section>
}

export default function GetInvolvedPage({ lang, data, settings, heroSrc, extras }) {
  const d = data[lang].content
  const paths = d.paths || []
  const [active, setActive] = useState(0)
  const [type, setType] = useState('volunteer')
  const [level, setLevel] = useState('')

  // "interest:<type>" links (hero buttons, path CTAs, other pages) preselect the form.
  useEffect(() => {
    const onInterest = (event) => { if (LABELS.en.placeholders[event.detail]) setType(event.detail) }
    window.addEventListener('sykoti:interest', onInterest)
    const pending = takePendingInterest()
    if (pending?.type) onInterest({ detail: pending.type })
    const target = pending?.id || (location.hash && location.hash !== '#membership' ? location.hash.slice(1) : '')
    const timer = target ? setTimeout(() => scrollToId(target), 120) : null
    return () => { window.removeEventListener('sykoti:interest', onInterest); clearTimeout(timer) }
  }, [])

  const pickLevel = (title) => { setType('donation'); setLevel(title); scrollToId('interest') }
  const jump = (i) => { setActive(i); scrollToId('paths') }

  return <>
    <section className="gi-hero"><div className="rd-wide gi-hero-grid">
      <div className="gi-hero-copy">
        <span className="rd-pill">{d.pill}</span>
        <h1>{rich(d.title)}</h1>
        <p>{d.lead}</p>
        <div className="rd-actions">{d.primary?.[0] && <Button action={d.primary[1]}>{d.primary[0]}</Button>}{d.secondary?.[0] && <Button action={d.secondary[1]} secondary>{d.secondary[0]}</Button>}</div>
        {paths.length > 0 && <div className="gi-jump"><span>{d.jumpLabel}</span>{paths.map(([icon, title], i) => <button type="button" key={`${title}-${i}`} onClick={() => jump(i)}><Icon name={icon || 'favorite'}/>{title}</button>)}</div>}
      </div>
      <figure className="gi-hero-media">
        <img src={heroSrc} alt={d.heroAlt || (lang === 'fr' ? 'Jeunes participant à un atelier Sykoti Center' : 'Young people at a Sykoti Center workshop')}/>
        {paths.length > 0 && <figcaption><strong>{paths.length}</strong><span>{lang === 'fr' ? 'façons de contribuer' : 'ways to contribute'}</span></figcaption>}
      </figure>
    </div></section>
    <Paths d={d} details={data[lang].details} lang={lang} active={Math.min(active, Math.max(paths.length - 1, 0))} setActive={setActive}/>
    <Levels d={d} onPick={pickLevel}/>
    <InterestForm d={d} lang={lang} settings={settings} type={type} setType={setType} level={level} setLevel={setLevel}/>
    <Faq d={d}/>
    {extras}
  </>
}

