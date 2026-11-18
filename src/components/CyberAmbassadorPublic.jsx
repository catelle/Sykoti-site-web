/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react'
import { modules } from '../data/siteContent'
import cohort from '../assets/user-1.png'
const heroImage = '/cyberambassador/media/cybera-fellows.jpeg'

const API = import.meta.env.VITE_API_URL || (['localhost', '127.0.0.1'].includes(window.location.hostname) ? 'http://localhost:4001/api' : `${window.location.origin}/api`)
const phases = [
  { number: '01', title: 'Le parcours complet des ambassadeurs', text: 'Un parcours de quatre modules pour comprendre le monde numérique, se protéger, développer ses compétences pratiques et exercer un leadership citoyen.', tag: '15 jeunes Camerounais formés au parcours complet', modules: ['Monde numérique', 'Survivant du numérique', 'Digital Superpowers', 'Leadership citoyen numérique'] },
  { number: '02', title: 'La phase de bourses', text: 'Une première étape plus courte, en français et en anglais, qui donne accès aux deux premiers modules. Elle ne se confond pas avec le parcours complet des ambassadeurs.', tag: '100 bourses proposées · 93 candidatures reçues · toutes admises', modules: ['Monde numérique', 'Survivant du numérique'] },
]
const stories = [
  { title: 'Think Before You Click', author: 'Roxanna Moussombo', need: 'Session WhatsApp avec les délégués africains IYC14 : reconnaître les arnaques et réagir face au cyberharcèlement.', result: 'Environ 18 répondants au post-test ; 100 % de bonnes réponses aux deux scénarios proposés.', note: 'Les questions et effectifs différaient entre les tests : ce résultat ne mesure pas un gain individuel avant/après ni un changement durable.' },
  { title: 'Campagne de terrain · Cité des cadres, route de Mfou', author: 'Auteur à identifier', need: '19 personnes rencontrées ; 13 ont déclaré une tentative d’arnaque, dont 4 victimes déclarées.', result: 'Conseils partagés sur la vérification des contacts, la double authentification et la protection des codes.', note: 'Ces chiffres décrivent le public rencontré, pas la prévalence dans la population générale.' },
  { title: 'Confidentialité et double vérification WhatsApp', author: 'Ngono Ekani Victorine', need: 'Atelier avec des volontaires de l’association Ayeume, en deux réunions.', result: '10 participations à la première réunion et 5 à la seconde ; les participants ont annoncé vouloir sensibiliser leurs proches.', note: 'Les participations ne sont pas présentées comme 15 personnes uniques.' },
  { title: 'Les cyberattaques : comprendre, prévenir, se protéger', author: 'Mokam Dora', need: 'Webinaire Google Meet de deux heures.', result: 'Environ 6 participants ; affiche et captures d’écran mentionnées comme preuves.', note: 'Les preuves associées restent à verser dans la galerie publique.' },
]
const fellowProfiles = [
  ['Lesly Voumo', 'Cameroun', '/cyberambassador/media/lesly-voumo.jpeg'],
  ['Kouatchou Lyne Dehlia', 'Cameroun', '/cyberambassador/media/kouatchou-lyne-dehlia.jpeg'],
  ['Wilfried Adi Yafsia', 'Cameroun', '/cyberambassador/media/wilfried-adi-yafsia.jpeg'],
  ['Mokam Dora', 'Cameroun', '/cyberambassador/media/mokam-dora.jpeg'],
  ['Esther Ngono', 'Cameroun', '/cyberambassador/media/esther-ngono.jpeg'],
  ['Roxanna Moussombo', 'Cameroun', '/cyberambassador/media/roxanna-moussombo.jpeg'],
  ['Toumpe Eric', 'Cameroun', '/cyberambassador/media/toumpe-eric.jpeg'],
  ['Bissa Marguerite', 'Cameroun', '/cyberambassador/media/bissa-marguerite.jpeg'],
]
const verifiedImpact = {
  cyberA: {
    acceptedCount: 20,
    countries: [{ label: 'Cameroun', count: 18 }, { label: 'RDC', count: 1 }, { label: 'Sénégal', count: 1 }],
    studyDomains: [{ label: 'Numérique, informatique & cybersécurité', count: 9 }, { label: 'Sciences & santé', count: 4 }, { label: 'Sciences humaines, droit & éducation', count: 6 }, { label: 'Autres / niveau non précisé', count: 1 }],
  },
  scholarships: {
    acceptedCount: 21,
    countries: [{ label: 'Cameroun', count: 16 }, { label: "Côte d’Ivoire", count: 3 }, { label: 'RDC', count: 1 }, { label: 'Burundi', count: 1 }],
    applicationCountries: [{ label: 'Cameroun', count: 73 }, { label: "Côte d’Ivoire", count: 4 }, { label: 'RDC', count: 3 }, { label: 'Burundi', count: 2 }, { label: 'Niger', count: 2 }, { label: 'Sénégal', count: 2 }, { label: 'Autres pays', count: 7 }],
    situations: [{ label: 'Étudiant·e', count: 14 }, { label: 'À la recherche d’un emploi', count: 3 }, { label: 'Entrepreneur·e', count: 2 }, { label: 'Salarié·e', count: 1 }, { label: 'Indépendant·e', count: 1 }],
  },
}
const galleryFallback = [
  { url: '/cyberambassador/media/cybera-graduation-1.jpeg', alt: 'Fellows CyberA-Rise présentant leurs certificats lors de la graduation', caption: 'Graduation CyberA-Rise · 2026' },
  { url: '/cyberambassador/media/cybera-graduation-2.jpeg', alt: 'Fellows CyberA-Rise réunis avec leurs certificats', caption: 'Une cohorte réunie autour des mêmes réflexes numériques' },
  { url: '/cyberambassador/media/cybera-fellows.jpeg', alt: 'Planche de portraits des fellows CyberA-Rise', caption: 'Les visages du parcours' },
]
const galleryBase = `${import.meta.env.BASE_URL}cyberambassador/media/gallery/`
const pdfGallery = [
  { url: `${galleryBase}platform-home.png`, alt: 'Page d’accueil de la plateforme CyberAmbassador', caption: 'La plateforme CyberAmbassador · parcours certifiant' },
  { url: `${galleryBase}platform-login.png`, alt: 'Écran de connexion de la plateforme CyberAmbassador', caption: 'Un accès bilingue pour les apprenants' },
  { url: `${galleryBase}platform-dashboard.png`, alt: 'Tableau de bord élève de la plateforme CyberAmbassador', caption: 'Tableau de bord, missions et progression' },
  { url: `${galleryBase}platform-module.png`, alt: 'Module de formation The Digital World sur la plateforme', caption: 'Des modules guidés pour apprendre en pratique' },
  { url: `${galleryBase}fellows-2026.jpg`, alt: 'Présentation des 18 fellows CyberAmbassador 2026', caption: 'CyberAmbassador 2026 · présentation des fellows' },
  { url: `${galleryBase}graduation-ceremony.png`, alt: 'Fellows Sykoti Center réunis avec leurs certificats', caption: 'Célébrer les apprentissages et l’engagement' },
  { url: `${galleryBase}graduation-group.jpg`, alt: 'Groupe de fellows CyberAmbassador avec leurs certificats', caption: 'Une cohorte réunie autour d’un numérique plus sûr' },
  { url: `${galleryBase}community-action.jpg`, alt: 'CyberAmbassadeurs en action sur le terrain', caption: 'Les apprentissages passent aussi par le terrain' },
  { url: `${galleryBase}cyber-attacks-webinar.png`, alt: 'Affiche du webinaire Les cyberattaques', caption: 'Comprendre, prévenir, se protéger' },
  { url: `${galleryBase}jeunes-connectes-workshop.png`, alt: 'Atelier Jeunes connectés, jeunes responsables', caption: 'Atelier Jeunes connectés, jeunes responsables' },
]

function Section({ eyebrow, title, children, className = '', id }) { return <section className={`cyber-section ${className}`} id={id}><div className="cyber-container"><p className="cyber-eyebrow">{eyebrow}</p><h2>{title}</h2>{children}</div></section> }
function Stat({ value, label, detail }) { return <div className="cyber-stat"><strong>{value}</strong><span>{label}</span>{detail && <small>{detail}</small>}</div> }
function ImpactList({ title, items, empty }) { const max = Math.max(...items.map((item) => item.count), 1); return <div className="cyber-impact-list"><h4>{title}</h4>{items.length ? items.map((item) => <div className="impact-row" key={item.label}><span>{item.label}</span><strong>{item.count}</strong><i style={{ '--bar': `${Math.max(10, item.count / max * 100)}%` }} /></div>) : <p>{empty}</p>}</div> }

export default function CyberAmbassadorPublic() {
  const [content, setContent] = useState({ media: [], testimonials: [] })
  const [impact, setImpact] = useState(verifiedImpact)
  const [liveFeedback, setLiveFeedback] = useState([])
  useEffect(() => {
    Promise.all([
      fetch(`${API}/cyberambassador/content`).then((r) => r.ok ? r.json() : null),
      fetch(`${API}/cyberambassador/impact`).then((r) => r.ok ? r.json() : null),
      fetch(`${API}/cyberambassador/cybercomp/feedback`).then((r) => r.ok ? r.json() : []),
    ]).then(([contentData, impactData, feedbackData]) => {
      if (contentData) setContent(contentData)
      if (impactData) setImpact({ ...verifiedImpact, ...impactData, cyberA: { ...verifiedImpact.cyberA, ...(impactData.cyberA || {}) }, scholarships: { ...verifiedImpact.scholarships, ...(impactData.scholarships || {}) } })
      if (Array.isArray(feedbackData)) setLiveFeedback(feedbackData)
    }).catch(() => {})
  }, [])
  const publishedMedia = content.media || []
  const publishedTestimonials = (content.testimonials || []).filter((item) => item.status === 'published' && item.publicationConsent)
  const testimonials = publishedTestimonials.length ? publishedTestimonials : liveFeedback.filter((item) => item.name && item.name !== 'CyberComp test account').map((item) => ({ quote: item.comment, author: item.name, context: 'Feedback partagé après CyberComp' }))
  const portraits = publishedMedia.filter((item) => item.category === 'portrait')
  const gallery = publishedMedia.filter((item) => ['formation', 'graduation', 'community-action'].includes(item.category))
  const galleryItems = [...pdfGallery, ...gallery, ...(gallery.length ? [] : galleryFallback)]
  return <>
    <section className="cyber-hero"><div className="cyber-container cyber-hero-grid"><div><p className="cyber-eyebrow">CyberA‑Rise · Cohorte pilote 2026</p><h1>La diversité devient <em>de l’impact.</em></h1><p className="cyber-lead">Des jeunes de parcours différents apprennent ensemble, puis transmettent des réflexes numériques plus sûrs.</p><div className="cyber-actions"><a className="cyber-button primary" href="#bilan">Voir les preuves <span>↗</span></a><a className="cyber-button ghost" href="#fellows">Voir les fellows</a></div></div><figure><img src={heroImage} alt="Portraits des fellows CyberA-Rise de la cohorte pilote 2026" /><figcaption><b>18 portraits</b> · une cohorte · plusieurs horizons.</figcaption></figure></div><div className="cyber-container cyber-hero-proof"><span><b>20</b> acceptés CyberA‑Rise</span><span><b>4</b> domaines d’étude</span><span><b>3</b> pays dans le parcours complet</span></div></section>
    <section className="cyber-stats" id="bilan"><div className="cyber-container cyber-stat-grid"><Stat value="20" label="fellows acceptés" detail="CyberA‑Rise · base vérifiée" /><Stat value="15" label="formés au parcours complet" detail="bilan communiqué" /><Stat value="8" label="capstones exécutés" detail="actions mises en œuvre" /><Stat value="217" label="portée cumulée déclarée" detail="catégories non dédoublonnées" /></div></section>
    <Section eyebrow="Impact & diversité" title="Des parcours différents. Un même pouvoir d’agir." className="cyber-impact-board"><div className="cyber-impact-columns"><div><div className="impact-heading"><span className="impact-big">{impact.cyberA.acceptedCount}</span><span>fellows<br />CyberA‑Rise</span></div><ImpactList title="Pays représentés" items={impact.cyberA.countries} empty="Données indisponibles." /><ImpactList title="Domaines d’étude" items={impact.cyberA.studyDomains} empty="Données indisponibles." /></div><div><div className="impact-heading"><span className="impact-big">93</span><span>accepté·es<br />100 bourses</span></div><ImpactList title="Pays représentés dans les 93 candidatures acceptées" items={impact.scholarships.applicationCountries} empty="Données indisponibles." /><ImpactList title="Situations déclarées" items={impact.scholarships.situations} empty="Données indisponibles." /></div></div><div className="impact-footline"><span>Étudiant·es</span><span>Sciences</span><span>Informatique</span><span>Droit</span><span>Entrepreneuriat</span><span>Sciences sociales</span></div></Section>
    <Section eyebrow="Pourquoi ce programme ?" title="Des réflexes utiles pour des situations réelles." className="cyber-light"><div className="cyber-two-col"><div><p>Reconnaître une arnaque, protéger ses données, réagir au cyberharcèlement ou savoir vers qui se tourner ne va pas toujours de soi. CyberAmbassador part de ces situations sans alarmisme et transforme les questions en apprentissages pratiques.</p><p>Les participants apprennent, mettent en pratique, puis transmettent ce qu’ils peuvent utiliser dans leur famille, leur établissement ou leur communauté.</p></div><div className="cyber-checks"><span>Vérifier avant de partager</span><span>Protéger ses comptes et ses codes</span><span>Signaler, bloquer ou demander de l’aide</span><span>Accompagner sans juger</span></div></div></Section>
    <Section eyebrow="Deux phases, deux objectifs" title="Un parcours complet. Une phase de bourses." className="cyber-phases" id="phases"><div className="cyber-phase-grid">{phases.map((phase) => <article key={phase.number}><b>{phase.number}</b><h3>{phase.title}</h3><p>{phase.text}</p><strong>{phase.tag}</strong><div className="cyber-module-tags">{phase.modules.map((item) => <span key={item}>{item}</span>)}</div></article>)}</div><div className="cyber-countries"><span>Phase 2 · pays des candidatures dans la base</span><strong>{impact.scholarships.applicationCountries.map((item) => `${item.label} (${item.count})`).join(' · ')}</strong><small>Formation bilingue : français et anglais.</small></div></Section>
    <Section eyebrow="La plateforme de formation" title="Là où les apprentissages deviennent des actions." className="cyber-platform"><div className="cyber-platform-grid"><img src="/program/dashboard-overview.png" alt="Tableau de bord de la plateforme CyberAmbassador" /><div><div className="platform-kpi"><b>01</b><span>Une plateforme dédiée</span></div><div className="platform-kpi"><b>04</b><span>Modules, missions et progression</span></div><div className="platform-kpi"><b>∞</b><span>Des apprentissages à partager</span></div><a className="cyber-button primary" href="/cyberambassador/">Voir la plateforme <span>↗</span></a></div></div></Section>
    <Section eyebrow="Le programme en pratique" title="Quatre modules pour passer de l’apprentissage à l’action." className="cyber-light"><div className="cyber-curriculum">{modules.map((item, index) => <article key={item[0]}><b>0{index + 1}</b><h3>{['Monde numérique', 'Survivant du numérique', 'Digital Superpowers', 'Leadership citoyen numérique'][index]}</h3><p>{item[1]}</p></article>)}</div></Section>
    <Section eyebrow="Rapports de projets capstone" title="Des projets qui font circuler les bons réflexes." className="cyber-stories"><div className="cyber-marquee"><div className="cyber-marquee-track">{[...stories, ...stories].map((story, index) => <article className="cyber-story-card" key={`${story.title}-${index}`}><p className="cyber-story-label">Rapport capstone</p><h3>{story.title}</h3><p><strong>Public.</strong> {story.need}</p><p><strong>Résultat.</strong> {story.result}</p><small>{story.note}</small><footer>{story.author}</footer></article>)}</div></div><p className="cyber-data-note">4 fiches de projets documentées sont affichées ici. Les autres rapports capstone restent à ajouter depuis l’administration lorsqu’ils sont disponibles.</p></Section>
    <Section eyebrow="Les visages du programme" title="Des fellows visibles, pas seulement des chiffres." className="cyber-light" id="fellows"><div className="cyber-people cyber-fellow-grid">{fellowProfiles.map(([name, country, url]) => <article key={name}><img src={url} alt={`Portrait de ${name}, fellow CyberA-Rise au Cameroun`} /><h3>{name}</h3><p>{country} · fellow CyberA-Rise</p></article>)}</div><p className="cyber-data-note">Les supports de cohorte fournis présentent 18 fellows. Cette galerie met en avant les portraits dont le nom est lisible sur les visuels reçus ; les autres peuvent être ajoutés via le CMS après vérification de leur autorisation.</p></Section>
    {testimonials.length > 0 && <Section eyebrow="Voix et feedbacks" title="Ce que les fellows retiennent du parcours." className="cyber-testimonials"><div className="cyber-testimonial-grid">{testimonials.slice(0, 6).map((item, index) => <blockquote key={item._id || `${item.quote}-${index}`}>“{item.quote}”<footer>{item.author}{item.context && <small>{item.context}</small>}</footer></blockquote>)}</div></Section>}
    <Section eyebrow="Galerie du parcours" title="Formation, graduation, actions communautaires." className="cyber-light"><div className="cyber-marquee gallery-marquee"><div className="cyber-marquee-track">{[...galleryItems, ...galleryItems].map((item, index) => <figure key={`${item.url}-${index}`}><img loading="lazy" src={item.url} alt={item.alt} /><figcaption>{item.caption}{item.credit && <small>Crédit : {item.credit}</small>}</figcaption></figure>)}</div></div><p className="cyber-data-note">Les visuels de la galerie présentent la plateforme, les fellows, les temps de formation, la graduation et les actions de sensibilisation. De nouvelles images peuvent être ajoutées depuis l’administration.</p></Section>
    <section className="cyber-note"><div className="cyber-container"><p><strong>Lecture des chiffres.</strong> La portée cumulée déclarée de 217 additionne 15 personnes formées, 42 participants ayant terminé deux modules et 160 personnes touchées par les ambassadeurs. Les chevauchements entre catégories n’ont pas pu être vérifiés : ce nombre ne doit pas être lu comme 217 personnes uniques. Les données d’audit du 6 octobre 2026 signalent par ailleurs des écarts de cohortes et des capstones non documentés dans l’extraction ; les sources ne sont pas corrigées pour correspondre au bilan communiqué.</p></div></section>
    <section className="cyber-cta"><div className="cyber-container"><div><p className="cyber-eyebrow">La suite</p><h2>Faire circuler les bons réflexes.</h2><p>Découvrez les ressources, proposez un partenariat ou recevez les nouvelles du programme. Les candidatures ne sont affichées que lorsqu’une cohorte est ouverte.</p></div><div className="cyber-actions"><a className="cyber-button light" href={import.meta.env.BASE_URL + 'resources'}>Découvrir les ressources <span>↗</span></a><a className="cyber-button outline-light" href={import.meta.env.BASE_URL + 'partner'}>Proposer un partenariat</a></div></div></section>
  </>
}
