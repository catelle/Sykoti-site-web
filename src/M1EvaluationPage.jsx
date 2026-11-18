import { useState } from 'react'

const API = location.hostname === 'localhost' && location.port !== '4001' ? 'http://localhost:4001/api' : '/api'
const practices = [
  'Double authentification', 'Mots de passe plus solides', 'Vérifier une information',
  'Protéger ma vie privée', 'Signaler, bloquer ou demander de l’aide', 'Autre',
]
const initial = {
  participantCode: '', fullName: '', email: '', city: '', cohort: 'CyberA-Rise', completionDate: '',
  newPracticeAdopted: '', newPractices: [], practiceExample: '', voluntaryActionTaken: '',
  voluntaryActionDetails: '', riskActionTaken: '', riskActionExample: '', maintenanceObstacle: '',
  contactConsent: false, website: '',
}

export function M1EvaluationPage() {
  const [form, setForm] = useState(initial)
  const [status, setStatus] = useState({ loading: false, error: '', success: false })
  const set = (key, value) => setForm((current) => ({ ...current, [key]: value }))
  const togglePractice = (practice) => set('newPractices', form.newPractices.includes(practice) ? form.newPractices.filter((item) => item !== practice) : [...form.newPractices, practice])
  const submit = async (event) => {
    event.preventDefault(); setStatus({ loading: true, error: '', success: false })
    try {
      const response = await fetch(`${API}/m1-evaluation`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...form, newPracticeAdopted: form.newPracticeAdopted === 'yes', voluntaryActionTaken: form.voluntaryActionTaken === 'yes', riskActionTaken: form.riskActionTaken === 'yes' }) })
      const data = await response.json().catch(() => ({}))
      if (!response.ok) throw new Error(data.message || 'Impossible d’enregistrer le formulaire.')
      setStatus({ loading: false, error: '', success: true })
    } catch (error) { setStatus({ loading: false, error: error.message, success: false }) }
  }
  if (status.success) return <section className="commitment-shell m1-shell"><div className="commitment-success"><span className="success-mark">✓</span><p className="eyebrow">Évaluation M+1</p><h1>Merci pour ton retour.</h1><p>Ta réponse aide Sykoti à mesurer ce qui reste dans la vie quotidienne après CyberA.</p><div className="actions"><button className="button primary" onClick={() => { setForm(initial); setStatus({ loading: false, error: '', success: false }) }}>Envoyer une autre réponse</button></div></div></section>
  return <section className="commitment-shell m1-shell"><div className="commitment-heading"><p className="eyebrow">CyberA-Rise · Suivi-évaluation</p><h1>Évaluation M+1</h1><p>Quelques semaines après la fin du parcours, raconte ce que tu as réellement mis en pratique. Cela prend environ 5 minutes.</p></div><form className="commitment-form" onSubmit={submit}>
    <div className="m1-section-heading wide"><b>01</b><div><h2>À propos de toi</h2><p>Ces informations servent uniquement à retrouver ton suivi.</p></div></div>
    <label>Code participant<input required value={form.participantCode} onChange={(e) => set('participantCode', e.target.value)} placeholder="Ex. CA-001" /></label>
    <label>Nom complet<input required value={form.fullName} onChange={(e) => set('fullName', e.target.value)} /></label>
    <label>E-mail <small>facultatif</small><input type="email" value={form.email} onChange={(e) => set('email', e.target.value)} /></label>
    <label>Ville<input required value={form.city} onChange={(e) => set('city', e.target.value)} /></label>
    <label>Cohorte<input value={form.cohort} onChange={(e) => set('cohort', e.target.value)} /></label>
    <label>Date de fin du parcours<input required type="date" value={form.completionDate} onChange={(e) => set('completionDate', e.target.value)} /></label>

    <div className="m1-section-heading wide"><b>02</b><div><h2>Nouvelles pratiques</h2><p>As-tu changé une habitude numérique depuis la formation ?</p></div></div>
    <fieldset className="m1-options wide"><legend className="sr-only">Nouvelle pratique adoptée</legend><label><input type="radio" name="practice" required checked={form.newPracticeAdopted === 'yes'} onChange={() => set('newPracticeAdopted', 'yes')} /> Oui</label><label><input type="radio" name="practice" checked={form.newPracticeAdopted === 'no'} onChange={() => set('newPracticeAdopted', 'no')} /> Non</label></fieldset>
    <div className="m1-checks wide">{practices.map((practice) => <label key={practice}><input type="checkbox" checked={form.newPractices.includes(practice)} onChange={() => togglePractice(practice)} /> {practice}</label>)}</div>
    <label className="wide">Un exemple concret<textarea value={form.practiceExample} onChange={(e) => set('practiceExample', e.target.value)} placeholder="Qu’est-ce que tu fais différemment aujourd’hui ?" /></label>

    <div className="m1-section-heading wide"><b>03</b><div><h2>Relais volontaire</h2><p>As-tu partagé quelque chose appris avec ton entourage ?</p></div></div>
    <fieldset className="m1-options wide"><legend className="sr-only">Action comme relais volontaire</legend><label><input type="radio" name="relay" required checked={form.voluntaryActionTaken === 'yes'} onChange={() => set('voluntaryActionTaken', 'yes')} /> Oui</label><label><input type="radio" name="relay" checked={form.voluntaryActionTaken === 'no'} onChange={() => set('voluntaryActionTaken', 'no')} /> Non</label></fieldset>
    <label className="wide">Décris cette action<textarea value={form.voluntaryActionDetails} onChange={(e) => set('voluntaryActionDetails', e.target.value)} placeholder="Une discussion, un conseil, une sensibilisation…" /></label>

    <div className="m1-section-heading wide"><b>04</b><div><h2>Capacité d’action</h2><p>Te sens-tu capable de réagir face à un risque numérique ?</p></div></div>
    <fieldset className="m1-options wide"><legend className="sr-only">Capacité d’action</legend><label><input type="radio" name="action" required checked={form.riskActionTaken === 'yes'} onChange={() => set('riskActionTaken', 'yes')} /> Oui</label><label><input type="radio" name="action" checked={form.riskActionTaken === 'no'} onChange={() => set('riskActionTaken', 'no')} /> Non</label></fieldset>
    <label className="wide">Un exemple<textarea value={form.riskActionExample} onChange={(e) => set('riskActionExample', e.target.value)} placeholder="Que ferais-tu si un proche était victime d’une arnaque ou d’un compte piraté ?" /></label>

    <div className="m1-section-heading wide"><b>05</b><div><h2>Maintien et suivi</h2><p>Ce qui t’aiderait à continuer.</p></div></div>
    <label className="wide">Le principal obstacle aujourd’hui<textarea value={form.maintenanceObstacle} onChange={(e) => set('maintenanceObstacle', e.target.value)} placeholder="Temps, accès, confiance, accompagnement…" /></label>
    <label className="consent wide"><input type="checkbox" checked={form.contactConsent} onChange={(e) => set('contactConsent', e.target.checked)} /><span>J’accepte que Sykoti me recontacte au sujet du suivi du programme.</span></label>
    <input className="honey" tabIndex="-1" autoComplete="off" value={form.website} onChange={(e) => set('website', e.target.value)} aria-hidden="true" />
    {status.error && <p className="form-error wide" role="alert">{status.error}</p>}
    <button className="button primary submit-commitment" disabled={status.loading}>{status.loading ? 'Envoi…' : 'Envoyer mon évaluation'}</button>
  </form></section>
}
