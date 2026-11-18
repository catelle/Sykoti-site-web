/* eslint-disable react/prop-types */
// Focused membership application (/membership): a distraction-free, 5-step form.
// Answers are saved on the device as a draft; the CV is optional and stored privately.
import { useEffect, useMemo, useRef, useState } from 'react'
import './membership.css'
import { API, BASE, go } from './siteShared'

const DRAFT_KEY = 'sykotiMembershipDraft'
const MAX_CV = 4 * 1024 * 1024
const Icon = ({ name }) => <span className="material-symbols-outlined" aria-hidden="true">{name}</span>

const initialForm = {
  fullName: '', email: '', phone: '', dateOfBirth: '', gender: '', city: '', region: '', country: 'Cameroun',
  occupation: '', organization: '', fieldOfStudy: '', educationLevel: '', skills: [], otherSkills: '', languages: [], profileUrl: '',
  memberType: 'active', departments: [], availability: '', participationMode: '', referralSource: '',
  motivation: '', experience: '', contribution: '', expectations: '', referee: '',
  paymentPlan: '', interviewMode: '',
  commitments: { fee: false, statutes: false, safeguarding: false, accurate: false, dataConsent: false },
  website: '',
}

const T = {
  en: {
    title: 'Membership application', exit: 'Save & exit', step: 'Step', of: 'of', back: 'Back', next: 'Continue', submit: 'Submit my application', sending: 'Sending…',
    optional: 'optional', required: 'required', chars: 'characters', min: 'minimum',
    intro: 'This application takes about 15 minutes. Your answers are saved on this device as you go, so you can come back later.',
    savedDraft: 'Draft saved on this device',
    steps: [
      ['About you', 'Your contact details so we can reach you.'],
      ['Background & skills', 'What you do and what you know. A CV helps us, but is optional.'],
      ['Your engagement', 'How you would like to take part in the association.'],
      ['Motivation & experience', 'This is the heart of your application: we use it to decide who is invited to an interview.'],
      ['Contribution & commitments', 'The annual contribution and the commitments of every member.'],
    ],
    f: {
      fullName: 'Full name', email: 'Email', phone: 'Phone / WhatsApp', dateOfBirth: 'Date of birth', gender: 'Gender', city: 'City', region: 'Region', country: 'Country',
      occupation: 'Current situation', organization: 'School, university or organisation', fieldOfStudy: 'Field of study or profession', educationLevel: 'Highest level of education',
      skills: 'Your main skills', skillsHint: 'Choose all that apply.', otherSkills: 'Other skills or tools', languages: 'Languages you speak', profileUrl: 'LinkedIn, portfolio or website',
      cv: 'CV / résumé', cvHint: 'PDF or Word, 4 MB maximum.', cvChoose: 'Choose a file', cvRemove: 'Remove',
      memberType: 'Type of membership', departments: 'Departments you would like to join', departmentsHint: 'Choose at least one.', availability: 'Time you can give', participationMode: 'How you would take part', referralSource: 'How did you hear about Sykoti Center?',
      motivation: 'Why do you want to become a member of Sykoti Center?', motivationHint: 'Tell us what motivates you, why this association and why now.',
      experience: 'Relevant experience', experienceHint: 'Volunteering, community projects, teaching, technology, associations… Describe what you did and what changed.',
      contribution: 'What would you bring to Sykoti?', contributionHint: 'A skill, an idea, a project, a network… Be concrete.',
      expectations: 'What do you expect from your membership?', referee: 'Reference person', refereeHint: 'Name and contact of someone who knows your work (teacher, employer, community leader).',
      paymentPlan: 'If a contribution were requested, how would you prefer to pay it?', interviewMode: 'If shortlisted, how would you prefer the interview?',
    },
    gender: [['female', 'Female'], ['male', 'Male'], ['other', 'Other'], ['undisclosed', 'Prefer not to say']],
    occupation: [['secondary', 'Secondary school student'], ['university', 'University student'], ['employed', 'Employed'], ['self-employed', 'Self-employed / entrepreneur'], ['job-seeking', 'Looking for work'], ['other', 'Other']],
    education: [['secondary', 'Secondary school'], ['baccalaureate', 'Baccalaureate / A-level'], ['vocational', 'Technical / vocational'], ['bachelor', 'Bachelor / Licence'], ['master', 'Master'], ['doctorate', 'Doctorate'], ['other', 'Other']],
    skills: ['Communication & social media', 'Graphic design & video', 'Writing & editing', 'Teaching & facilitation', 'Mentoring & coaching', 'Software development', 'Cybersecurity', 'Data & AI', 'Project management', 'Fundraising & partnerships', 'Finance & accounting', 'Law & policy', 'Event organisation', 'Community mobilisation'],
    languages: ['French', 'English', 'Pidgin', 'Other local languages'],
    memberTypes: [['active', 'Active member', 'Takes on responsibilities, joins a department, can stand for election and votes at the General Assembly.'], ['supporting', 'Supporting member', 'Supports the association, joins activities when possible and would pay the annual contribution where applicable, without a regular role.']],
    departments: [['communication', 'Communication', 'Public presence, content, campaigns and community.'], ['administration', 'Administration, finance & partnerships', 'Project structuring, compliance, funding and partners.'], ['training', 'Training & mentorship', 'Education programmes, mentoring and feedback.'], ['technology', 'Technology & open-source innovation', 'Designing and deploying technical solutions.'], ['leadership', 'Leadership, advocacy & civic service', 'Local initiatives, advocacy and social impact.']],
    availability: ['2–4 hours per month', '5–10 hours per month', 'More than 10 hours per month'],
    participation: ['On-site', 'Online', 'Hybrid', 'All of the above'],
    referral: ['Social media', 'A friend or a member', 'A Sykoti event or workshop', 'The CyberAmbassador programme', 'The website', 'Other'],
    feeTitle: 'Annual membership contribution',
    feeText: (min, max, n) => `Members may be asked for an annual contribution set each year by the General Assembly — currently between ${min} and ${max} XAF, as some profiles may be exempted. It could be paid at once or in up to ${n} instalments. Nothing would be requested unless your application is accepted.`,
    plans: (n) => [['single', 'In one payment'], ['instalments', `In up to ${n} instalments`], ['discuss', 'I would like to discuss it']],
    interview: [['video', 'Video call'], ['phone', 'Phone call'], ['in-person', 'In person']],
    commitments: {
      fee: 'I understand that membership may involve an annual contribution, which would only be due after acceptance.',
      statutes: 'I accept the statutes and internal rules of Sykoti Center.',
      safeguarding: 'I commit to acting with integrity and respecting the protection of young people in all activities.',
      accurate: 'The information in this application is accurate.',
      dataConsent: 'I agree that Sykoti Center stores this application (and my CV) to evaluate it and contact me.',
    },
    process: 'How selection works', processSteps: ['We read every application carefully', 'Shortlisted applicants are invited to an interview', 'You receive our decision by email', 'Accepted members are welcomed and would settle any applicable contribution'],
    doneTitle: 'Your application has been received', doneText: 'Thank you for applying to join Sykoti Center. We will review your application and contact you by email.', home: 'Back to the website',
    closedTitle: 'Applications are currently closed', closedText: 'Membership applications are not open at the moment. Follow Sykoti Center to know when the next call opens.',
    errors: { cvType: 'The CV must be a PDF or Word document.', cvSize: 'The CV must be 4 MB or less.', departments: 'Please choose at least one department.' },
  },
  fr: {
    title: 'Candidature d’adhésion', exit: 'Enregistrer et quitter', step: 'Étape', of: 'sur', back: 'Retour', next: 'Continuer', submit: 'Envoyer ma candidature', sending: 'Envoi…',
    optional: 'facultatif', required: 'obligatoire', chars: 'caractères', min: 'minimum',
    intro: 'Cette candidature prend environ 15 minutes. Vos réponses sont enregistrées sur cet appareil au fur et à mesure : vous pouvez revenir plus tard.',
    savedDraft: 'Brouillon enregistré sur cet appareil',
    steps: [
      ['À propos de vous', 'Vos coordonnées pour que nous puissions vous joindre.'],
      ['Parcours & compétences', 'Ce que vous faites et ce que vous savez faire. Un CV nous aide, mais il est facultatif.'],
      ['Votre engagement', 'La manière dont vous souhaitez participer à l’association.'],
      ['Motivation & expérience', 'C’est le cœur de votre candidature : elle nous sert à décider qui sera invité en entretien.'],
      ['Cotisation & engagements', 'La cotisation annuelle et les engagements de chaque membre.'],
    ],
    f: {
      fullName: 'Nom complet', email: 'E-mail', phone: 'Téléphone / WhatsApp', dateOfBirth: 'Date de naissance', gender: 'Genre', city: 'Ville', region: 'Région', country: 'Pays',
      occupation: 'Situation actuelle', organization: 'Établissement, université ou organisation', fieldOfStudy: 'Domaine d’études ou métier', educationLevel: 'Niveau d’études le plus élevé',
      skills: 'Vos principales compétences', skillsHint: 'Choisissez tout ce qui s’applique.', otherSkills: 'Autres compétences ou outils', languages: 'Langues parlées', profileUrl: 'LinkedIn, portfolio ou site web',
      cv: 'CV', cvHint: 'PDF ou Word, 4 Mo maximum.', cvChoose: 'Choisir un fichier', cvRemove: 'Retirer',
      memberType: 'Type d’adhésion', departments: 'Départements que vous souhaitez rejoindre', departmentsHint: 'Choisissez au moins un département.', availability: 'Temps que vous pouvez consacrer', participationMode: 'Mode de participation', referralSource: 'Comment avez-vous connu Sykoti Center ?',
      motivation: 'Pourquoi souhaitez-vous devenir membre de Sykoti Center ?', motivationHint: 'Dites-nous ce qui vous motive, pourquoi cette association et pourquoi maintenant.',
      experience: 'Expérience pertinente', experienceHint: 'Bénévolat, projets communautaires, enseignement, technologie, associations… Décrivez ce que vous avez fait et ce que cela a changé.',
      contribution: 'Qu’apporteriez-vous à Sykoti ?', contributionHint: 'Une compétence, une idée, un projet, un réseau… Soyez concret.',
      expectations: 'Qu’attendez-vous de votre adhésion ?', referee: 'Personne de référence', refereeHint: 'Nom et contact d’une personne qui connaît votre travail (enseignant, employeur, responsable communautaire).',
      paymentPlan: 'Si une cotisation vous était demandée, comment préféreriez-vous la régler ?', interviewMode: 'Si vous êtes présélectionné·e, quel format d’entretien préférez-vous ?',
    },
    gender: [['female', 'Femme'], ['male', 'Homme'], ['other', 'Autre'], ['undisclosed', 'Préfère ne pas répondre']],
    occupation: [['secondary', 'Élève du secondaire'], ['university', 'Étudiant·e'], ['employed', 'Salarié·e'], ['self-employed', 'Indépendant·e / entrepreneur·e'], ['job-seeking', 'En recherche d’emploi'], ['other', 'Autre']],
    education: [['secondary', 'Secondaire'], ['baccalaureate', 'Baccalauréat / GCE A-level'], ['vocational', 'Technique / professionnel'], ['bachelor', 'Licence'], ['master', 'Master'], ['doctorate', 'Doctorat'], ['other', 'Autre']],
    skills: ['Communication & réseaux sociaux', 'Graphisme & vidéo', 'Rédaction', 'Enseignement & animation', 'Mentorat & coaching', 'Développement logiciel', 'Cybersécurité', 'Données & IA', 'Gestion de projet', 'Levée de fonds & partenariats', 'Finance & comptabilité', 'Droit & politiques publiques', 'Organisation d’événements', 'Mobilisation communautaire'],
    languages: ['Français', 'Anglais', 'Pidgin', 'Autres langues locales'],
    memberTypes: [['active', 'Membre actif', 'Prend des responsabilités, rejoint un département, peut être élu et vote à l’Assemblée générale.'], ['supporting', 'Membre sympathisant', 'Soutient l’association, participe aux activités quand il le peut et s’acquitterait, le cas échéant, de la cotisation, sans rôle régulier.']],
    departments: [['communication', 'Communication', 'Présence publique, contenus, campagnes et communauté.'], ['administration', 'Administration, finances & partenariats', 'Structuration des projets, conformité, financement et partenaires.'], ['training', 'Formation & mentorat', 'Programmes éducatifs, mentorat et retours.'], ['technology', 'Technologie & innovation open source', 'Conception et déploiement de solutions techniques.'], ['leadership', 'Leadership, plaidoyer & service civique', 'Initiatives locales, plaidoyer et impact social.']],
    availability: ['2 à 4 heures par mois', '5 à 10 heures par mois', 'Plus de 10 heures par mois'],
    participation: ['En présentiel', 'En ligne', 'Hybride', 'Tous les modes'],
    referral: ['Réseaux sociaux', 'Un ami ou un membre', 'Un événement ou atelier Sykoti', 'Le programme CyberAmbassador', 'Le site web', 'Autre'],
    feeTitle: 'Cotisation annuelle des membres',
    feeText: (min, max, n) => `Une cotisation annuelle, fixée chaque année par l’Assemblée générale, pourrait vous être demandée — actuellement entre ${min} et ${max} XAF, certains profils pouvant en être exonérés. Elle pourrait être réglée en une fois ou en ${n} tranches maximum. Rien ne vous serait demandé avant l’acceptation de votre candidature.`,
    plans: (n) => [['single', 'En une fois'], ['instalments', `En ${n} tranches maximum`], ['discuss', 'Je souhaite en discuter']],
    interview: [['video', 'Appel vidéo'], ['phone', 'Appel téléphonique'], ['in-person', 'En présentiel']],
    commitments: {
      fee: 'Je comprends que l’adhésion pourrait impliquer une cotisation annuelle, qui ne serait due qu’après acceptation.',
      statutes: 'J’accepte les statuts et le règlement intérieur de Sykoti Center.',
      safeguarding: 'Je m’engage à agir avec intégrité et à respecter la protection des jeunes dans toutes les activités.',
      accurate: 'Les informations de cette candidature sont exactes.',
      dataConsent: 'J’accepte que Sykoti Center conserve cette candidature (et mon CV) pour l’évaluer et me contacter.',
    },
    process: 'Comment se fait la sélection', processSteps: ['Nous lisons attentivement chaque candidature', 'Les candidats présélectionnés sont invités en entretien', 'Vous recevez notre décision par e-mail', 'Les membres acceptés sont accueillis et régleraient, le cas échéant, leur cotisation'],
    doneTitle: 'Votre candidature a bien été reçue', doneText: 'Merci d’avoir candidaté pour rejoindre Sykoti Center. Nous allons examiner votre candidature et vous contacterons par e-mail.', home: 'Retour au site',
    closedTitle: 'Les candidatures sont actuellement fermées', closedText: 'Les candidatures d’adhésion ne sont pas ouvertes pour le moment. Suivez Sykoti Center pour connaître le prochain appel.',
    errors: { cvType: 'Le CV doit être un document PDF ou Word.', cvSize: 'Le CV ne doit pas dépasser 4 Mo.', departments: 'Choisissez au moins un département.' },
  },
}

function readDraft() {
  try {
    const draft = JSON.parse(localStorage.getItem(DRAFT_KEY) || 'null')
    return draft?.form ? { form: { ...initialForm, ...draft.form, commitments: { ...initialForm.commitments, ...draft.form.commitments } }, step: Math.min(draft.step || 0, 4) } : null
  } catch { return null }
}

function Field({ label, hint, optional, t, children, wide, count, group }) {
  const Tag = group ? 'div' : 'label'
  return <Tag className={`ms-field${wide ? ' wide' : ''}`} role={group ? 'group' : undefined} aria-label={group ? label : undefined}>
    <span className="ms-label">{label}{optional && <i> · {t.optional}</i>}</span>
    {children}
    {(hint || count) && <span className="ms-hint">{hint}{count}</span>}
  </Tag>
}

function Chips({ options, value, onChange, name }) {
  const toggle = (option) => onChange(value.includes(option) ? value.filter((v) => v !== option) : [...value, option])
  return <div className="ms-chips" role="group" aria-label={name}>{options.map((option) => <label key={option} className={value.includes(option) ? 'on' : ''}>
    <input type="checkbox" checked={value.includes(option)} onChange={() => toggle(option)}/><Icon name={value.includes(option) ? 'check' : 'add'}/>{option}
  </label>)}</div>
}

function Choice({ options, value, onChange, name, required }) {
  return <div className="ms-choices" role="radiogroup">{options.map(([key, label, text]) => <label key={key} className={`ms-choice${value === key ? ' on' : ''}`}>
    <input type="radio" name={name} value={key} checked={value === key} required={required} onChange={() => onChange(key)}/>
    <span className="ms-radio" aria-hidden="true"/>
    <span><strong>{label}</strong>{text && <small>{text}</small>}</span>
  </label>)}</div>
}

export default function MembershipPage({ lang = 'en', setLang, settings = {} }) {
  const t = T[lang] || T.en
  const fr = lang === 'fr'
  const draft = useMemo(readDraft, [])
  const [form, setForm] = useState(draft?.form || initialForm)
  const [step, setStep] = useState(draft?.step || 0)
  const [cv, setCv] = useState(null)
  const [state, setState] = useState({ sending: false, error: '', done: false })
  const [savedAt, setSavedAt] = useState(Boolean(draft))
  const formRef = useRef(null)
  const topRef = useRef(null)
  const fileRef = useRef(null)
  const min = settings.membershipFeeMin || '0'
  const max = settings.membershipFeeMax || '25 000'
  const instalments = settings.membershipInstalments || '3'
  const closed = settings.membershipOpen === 'no'

  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }))
  const commit = (key, value) => setForm((current) => ({ ...current, commitments: { ...current.commitments, [key]: value } }))

  useEffect(() => { document.title = `${t.title} | Sykoti Center` }, [t.title])
  useEffect(() => {
    if (state.done) return undefined
    const timer = setTimeout(() => {
      try { localStorage.setItem(DRAFT_KEY, JSON.stringify({ form: { ...form, website: '' }, step })); setSavedAt(true) } catch { /* storage unavailable */ }
    }, 400)
    return () => clearTimeout(timer)
  }, [form, step, state.done])

  const scrollTop = () => topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })

  // Native validation for the visible step, plus a few rules HTML cannot express.
  const validateStep = () => {
    const section = formRef.current?.querySelector(`[data-step="${step}"]`)
    if (!section) return true
    for (const el of section.querySelectorAll('input, select, textarea')) {
      if (!el.checkValidity()) { el.reportValidity(); el.focus(); return false }
    }
    if (step === 2 && form.memberType === 'active' && !form.departments.length) { setState((s) => ({ ...s, error: t.errors.departments })); return false }
    if (step === 3) {
      const short = [['motivation', 150], ['experience', 80], ['contribution', 80]].find(([key, n]) => form[key].trim().length < n)
      if (short) {
        setState((s) => ({ ...s, error: fr ? `« ${t.f[short[0]]} » : ${short[1]} caractères minimum.` : `“${t.f[short[0]]}”: at least ${short[1]} characters.` }))
        section.querySelectorAll('textarea')[['motivation', 'experience', 'contribution'].indexOf(short[0])]?.focus()
        return false
      }
    }
    setState((s) => ({ ...s, error: '' }))
    return true
  }
  const next = () => { if (validateStep()) { setStep((s) => Math.min(4, s + 1)); scrollTop() } }
  const back = () => { setState((s) => ({ ...s, error: '' })); setStep((s) => Math.max(0, s - 1)); scrollTop() }

  const pickCv = (file) => {
    if (!file) return
    const okType = /\.(pdf|docx?)$/i.test(file.name)
    if (!okType) { setState((s) => ({ ...s, error: t.errors.cvType })); return }
    if (file.size > MAX_CV) { setState((s) => ({ ...s, error: t.errors.cvSize })); return }
    setState((s) => ({ ...s, error: '' }))
    setCv(file)
  }

  async function submit(event) {
    event.preventDefault()
    if (step < 4) { next(); return }
    if (!validateStep()) return
    setState({ sending: true, error: '', done: false })
    try {
      const body = new FormData()
      body.append('payload', JSON.stringify({ ...form, lang }))
      if (cv) body.append('cv', cv, cv.name)
      const response = await fetch(`${API}/membership/applications`, { method: 'POST', body })
      const data = await response.json().catch(() => ({}))
      if (!response.ok) throw new Error(data.message || (fr ? 'Envoi impossible. Réessayez.' : 'We could not send your application. Please try again.'))
      try { localStorage.removeItem(DRAFT_KEY) } catch { /* ignore */ }
      setState({ sending: false, error: '', done: true })
      scrollTop()
    } catch (error) {
      setState({ sending: false, error: error.message, done: false })
    }
  }

  const textarea = (key, minLength, rows = 6) => <>
    <textarea rows={rows} required={minLength > 0} minLength={minLength || undefined} maxLength={3000} value={form[key]} onChange={(e) => update(key, e.target.value)}/>
  </>
  const counter = (key, minLength) => <span className={`ms-count${form[key].trim().length >= minLength ? ' ok' : ''}`}> · {form[key].trim().length} / {minLength} {t.min}</span>
  const select = (key, options, required = true) => <select required={required} value={form[key]} onChange={(e) => update(key, e.target.value)}>
    <option value="">{fr ? 'Choisir…' : 'Choose…'}</option>
    {options.map((o) => (Array.isArray(o) ? <option key={o[0]} value={o[0]}>{o[1]}</option> : <option key={o} value={o}>{o}</option>))}
  </select>

  const shell = (content) => <div className="ms-page">
    <header className="ms-top" ref={topRef}>
      <a className="ms-brand" href={BASE} onClick={(e) => { e.preventDefault(); go('home') }}><img src={`${BASE}img/logo.png`} alt=""/><span><strong>Sykoti Center</strong><small>{t.title}</small></span></a>
      <div className="ms-top-tools">
        <div className="ms-lang">{['en', 'fr'].map((code) => <button key={code} type="button" className={lang === code ? 'on' : ''} aria-pressed={lang === code} onClick={() => setLang?.(code)}>{code.toUpperCase()}</button>)}</div>
        {!state.done && !closed && <a className="ms-exit" href={`${BASE}get-involved`} onClick={(e) => { e.preventDefault(); go('get-involved') }}><Icon name="close"/><span>{t.exit}</span></a>}
      </div>
      {!state.done && !closed && <div className="ms-progress" aria-hidden="true"><span style={{ width: `${((step + 1) / 5) * 100}%` }}/></div>}
    </header>
    {content}
  </div>

  if (closed) return shell(<main className="ms-center"><div className="ms-done"><span className="ms-done-icon closed"><Icon name="event_busy"/></span><h1>{t.closedTitle}</h1><p>{t.closedText}</p><button type="button" className="ms-btn primary" onClick={() => go('get-involved')}>{t.home}</button></div></main>)

  if (state.done) return shell(<main className="ms-center"><div className="ms-done">
    <span className="ms-done-icon"><Icon name="check"/></span>
    <h1>{t.doneTitle}</h1><p>{t.doneText}</p>
    <ol className="ms-timeline">{t.processSteps.map((s, i) => <li key={s} className={i === 0 ? 'now' : ''}><b>{i + 1}</b><span>{s}</span></li>)}</ol>
    <button type="button" className="ms-btn primary" onClick={() => go('home')}>{t.home}</button>
  </div></main>)

  const [stepTitle, stepText] = t.steps[step]
  return shell(<main className="ms-layout">
    <aside className="ms-aside">
      <ol className="ms-steps">{t.steps.map(([title], i) => <li key={title} className={i === step ? 'current' : i < step ? 'done' : ''}>
        <button type="button" disabled={i > step} onClick={() => { if (i < step) { setStep(i); scrollTop() } }}><b>{i < step ? <Icon name="check"/> : i + 1}</b><span>{title}</span></button>
      </li>)}</ol>
      <div className="ms-card">
        <h3><Icon name="payments"/>{t.feeTitle}</h3>
        <p className="ms-fee">{min} – {max} <small>XAF / {fr ? 'an' : 'year'}</small></p>
        <p>{fr ? `Le cas échéant, elle serait payable en ${instalments} tranches maximum, après acceptation. Certains profils pourraient en être exonérés.` : `Where applicable, it would be payable in up to ${instalments} instalments, after acceptance. Some profiles could be exempted.`}</p>
      </div>
      <div className="ms-card">
        <h3><Icon name="how_to_reg"/>{t.process}</h3>
        <ol className="ms-mini">{t.processSteps.map((s) => <li key={s}>{s}</li>)}</ol>
      </div>
    </aside>

    <form className="ms-form" ref={formRef} onSubmit={submit} noValidate>
      <div className="ms-form-head">
        <span className="ms-kicker">{t.step} {step + 1} {t.of} 5</span>
        <h1>{stepTitle}</h1>
        <p>{stepText}</p>
        {step === 0 && <p className="ms-note"><Icon name="schedule"/>{t.intro}</p>}
      </div>

      <div className="ms-step" data-step="0" hidden={step !== 0} key="s0">
        <div className="ms-grid">
          <Field label={t.f.fullName} t={t} wide><input required minLength={3} maxLength={140} autoComplete="name" value={form.fullName} onChange={(e) => update('fullName', e.target.value)}/></Field>
          <Field label={t.f.email} t={t}><input type="email" required maxLength={180} autoComplete="email" value={form.email} onChange={(e) => update('email', e.target.value)}/></Field>
          <Field label={t.f.phone} t={t}><input type="tel" required minLength={6} maxLength={40} autoComplete="tel" placeholder="+237 6…" value={form.phone} onChange={(e) => update('phone', e.target.value)}/></Field>
          <Field label={t.f.dateOfBirth} t={t}><input type="date" required max={new Date().toISOString().slice(0, 10)} value={form.dateOfBirth} onChange={(e) => update('dateOfBirth', e.target.value)}/></Field>
          <Field label={t.f.gender} t={t} optional>{select('gender', t.gender, false)}</Field>
          <Field label={t.f.city} t={t}><input required maxLength={120} autoComplete="address-level2" value={form.city} onChange={(e) => update('city', e.target.value)}/></Field>
          <Field label={t.f.region} t={t} optional><input maxLength={120} autoComplete="address-level1" value={form.region} onChange={(e) => update('region', e.target.value)}/></Field>
          <Field label={t.f.country} t={t}><input required maxLength={120} autoComplete="country-name" value={form.country} onChange={(e) => update('country', e.target.value)}/></Field>
        </div>
        <input className="ms-hp" tabIndex={-1} autoComplete="off" aria-hidden="true" value={form.website} onChange={(e) => update('website', e.target.value)}/>
      </div>

      <div className="ms-step" data-step="1" hidden={step !== 1} key="s1">
        <div className="ms-grid">
          <Field label={t.f.occupation} t={t}>{select('occupation', t.occupation)}</Field>
          <Field label={t.f.educationLevel} t={t}>{select('educationLevel', t.education)}</Field>
          <Field label={t.f.organization} t={t} optional><input maxLength={160} value={form.organization} onChange={(e) => update('organization', e.target.value)}/></Field>
          <Field label={t.f.fieldOfStudy} t={t}><input required maxLength={160} value={form.fieldOfStudy} onChange={(e) => update('fieldOfStudy', e.target.value)}/></Field>
          <Field label={t.f.skills} hint={t.f.skillsHint} t={t} wide group><Chips name={t.f.skills} options={t.skills} value={form.skills} onChange={(v) => update('skills', v)}/></Field>
          <Field label={t.f.otherSkills} t={t} optional wide><input maxLength={300} value={form.otherSkills} onChange={(e) => update('otherSkills', e.target.value)}/></Field>
          <Field label={t.f.languages} t={t} wide group><Chips name={t.f.languages} options={t.languages} value={form.languages} onChange={(v) => update('languages', v)}/></Field>
          <Field label={t.f.profileUrl} t={t} optional wide><input type="url" maxLength={300} placeholder="https://" value={form.profileUrl} onChange={(e) => update('profileUrl', e.target.value)}/></Field>
          <div className="ms-field wide">
            <span className="ms-label">{t.f.cv}<i> · {t.optional}</i></span>
            <div className={`ms-file${cv ? ' has' : ''}`} onDragOver={(e) => e.preventDefault()} onDrop={(e) => { e.preventDefault(); pickCv(e.dataTransfer.files[0]) }}>
              <Icon name={cv ? 'description' : 'upload_file'}/>
              {cv ? <span><strong>{cv.name}</strong><small>{(cv.size / 1024 / 1024).toFixed(2)} MB</small></span> : <span><strong>{t.f.cvChoose}</strong><small>{t.f.cvHint}</small></span>}
              {cv ? <button type="button" className="ms-btn ghost small" onClick={() => setCv(null)}>{t.f.cvRemove}</button>
                : <button type="button" className="ms-btn small" onClick={() => fileRef.current?.click()}>{t.f.cvChoose}</button>}
              <input ref={fileRef} type="file" hidden accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" onChange={(e) => { pickCv(e.target.files[0]); e.target.value = '' }}/>
            </div>
          </div>
        </div>
      </div>

      <div className="ms-step" data-step="2" hidden={step !== 2} key="s2">
        <Field label={t.f.memberType} t={t} wide group><Choice name="memberType" required options={t.memberTypes} value={form.memberType} onChange={(v) => update('memberType', v)}/></Field>
        <Field label={t.f.departments} hint={form.memberType === 'active' ? t.f.departmentsHint : ''} optional={form.memberType !== 'active'} t={t} wide group>
          <div className="ms-departments">{t.departments.map(([key, label, text]) => <label key={key} className={form.departments.includes(key) ? 'on' : ''}>
            <input type="checkbox" checked={form.departments.includes(key)} onChange={() => update('departments', form.departments.includes(key) ? form.departments.filter((d) => d !== key) : [...form.departments, key])}/>
            <span className="ms-box" aria-hidden="true"><Icon name="check"/></span><span><strong>{label}</strong><small>{text}</small></span>
          </label>)}</div>
        </Field>
        <div className="ms-grid">
          <Field label={t.f.availability} t={t}>{select('availability', t.availability)}</Field>
          <Field label={t.f.participationMode} t={t}>{select('participationMode', t.participation)}</Field>
          <Field label={t.f.referralSource} t={t} optional wide>{select('referralSource', t.referral, false)}</Field>
        </div>
      </div>

      <div className="ms-step" data-step="3" hidden={step !== 3} key="s3">
        <Field label={t.f.motivation} hint={t.f.motivationHint} count={counter('motivation', 150)} t={t} wide>{textarea('motivation', 150, 7)}</Field>
        <Field label={t.f.experience} hint={t.f.experienceHint} count={counter('experience', 80)} t={t} wide>{textarea('experience', 80, 6)}</Field>
        <Field label={t.f.contribution} hint={t.f.contributionHint} count={counter('contribution', 80)} t={t} wide>{textarea('contribution', 80, 5)}</Field>
        <Field label={t.f.expectations} t={t} optional wide>{textarea('expectations', 0, 4)}</Field>
        <Field label={t.f.referee} hint={t.f.refereeHint} t={t} optional wide><input maxLength={300} value={form.referee} onChange={(e) => update('referee', e.target.value)}/></Field>
      </div>

      <div className="ms-step" data-step="4" hidden={step !== 4} key="s4">
        <div className="ms-fee-box"><Icon name="payments"/><div><h3>{t.feeTitle}</h3><p>{t.feeText(min, max, instalments)}</p></div></div>
        <Field label={t.f.paymentPlan} t={t} wide group><Choice name="paymentPlan" required options={t.plans(instalments)} value={form.paymentPlan} onChange={(v) => update('paymentPlan', v)}/></Field>
        <Field label={t.f.interviewMode} t={t} wide group><Choice name="interviewMode" required options={t.interview} value={form.interviewMode} onChange={(v) => update('interviewMode', v)}/></Field>
        <fieldset className="ms-commitments"><legend>{fr ? 'Engagements' : 'Commitments'}</legend>
          {Object.entries(t.commitments).map(([key, label]) => <label key={key} className={form.commitments[key] ? 'on' : ''}>
            <input type="checkbox" required checked={form.commitments[key]} onChange={(e) => commit(key, e.target.checked)}/>
            <span className="ms-box" aria-hidden="true"><Icon name="check"/></span><span>{label}</span>
          </label>)}
        </fieldset>
      </div>

      {state.error && <p className="ms-error" role="alert"><Icon name="error"/>{state.error}</p>}
      <div className="ms-actions">
        {step > 0 ? <button type="button" className="ms-btn ghost" onClick={back}><Icon name="arrow_back"/>{t.back}</button> : <span/>}
        <span className="ms-saved">{savedAt && <><Icon name="cloud_done"/>{t.savedDraft}</>}</span>
        {step < 4 ? <button type="submit" className="ms-btn primary">{t.next}<Icon name="arrow_forward"/></button>
          : <button type="submit" className="ms-btn primary" disabled={state.sending}>{state.sending ? t.sending : t.submit}<Icon name="send"/></button>}
      </div>
    </form>
  </main>)
}
