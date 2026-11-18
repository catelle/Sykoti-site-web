import { useEffect, useState } from 'react'
import { modules } from '../data/siteContent'

const API = import.meta.env.VITE_API_URL || (['localhost', '127.0.0.1'].includes(window.location.hostname) ? 'http://localhost:4001/api' : `${window.location.origin}/api`)
const API_ORIGIN = API.replace(/\/api$/, '')
const asset = (url) => !url || /^https?:\/\//.test(url) ? url : url.startsWith('/uploads/') ? `${API_ORIGIN}${url}` : url
const media = `${import.meta.env.BASE_URL}cyberambassador/media/`
const gallery = `${media}gallery/`
const fellows = [['Lesly Voumo','lesly-voumo.jpeg'],['Kouatchou Lyne Dehlia','kouatchou-lyne-dehlia.jpeg'],['Wilfried Adi Yafsia','wilfried-adi-yafsia.jpeg'],['Mokam Dora','mokam-dora.jpeg'],['Esther Ngono','esther-ngono.jpeg'],['Roxanna Moussombo','roxanna-moussombo.jpeg'],['Toumpe Eric','toumpe-eric.jpeg'],['Bissa Marguerite','bissa-marguerite.jpeg']]
const fallbackActivities = [
  { title:'Think Before You Click', category:'Projet communautaire', description:'Sensibilisation aux arnaques et au cyberharcèlement auprès de jeunes délégués.', coverUrl:`${gallery}community-action.jpg` },
  { title:'Jeunes connectés, jeunes responsables', category:'Atelier', description:'Atelier pratique consacré aux usages responsables et à la protection en ligne.', coverUrl:`${gallery}jeunes-connectes-workshop.png` },
  { title:'Comprendre, prévenir, se protéger', category:'Webinaire', description:'Conversation accessible sur les cyberattaques et les réflexes de protection.', coverUrl:`${gallery}cyber-attacks-webinar.png` },
]
const fallbackGallery = [[`${gallery}graduation-group.jpg`,'Cohorte CyberAmbassador 2026 réunie après la graduation'],[`${gallery}community-action.jpg`,'CyberAmbassadeurs pendant une activité communautaire'],[`${gallery}platform-dashboard.png`,'Tableau de bord de la plateforme CyberAmbassador'],[`${gallery}graduation-ceremony.png`,'Cérémonie de graduation de la cohorte 2026']]

export default function CyberAmbassadorPage(){
  const[program,setProgram]=useState(null),[content,setContent]=useState({media:[],testimonials:[]}),[impact,setImpact]=useState(null)
  useEffect(()=>{Promise.all([fetch(`${API}/programs/cyberambassador`).then(r=>r.ok?r.json():null),fetch(`${API}/cyberambassador/content`).then(r=>r.ok?r.json():{media:[],testimonials:[]}),fetch(`${API}/cyberambassador/impact`).then(r=>r.ok?r.json():null)]).then(([p,c,i])=>{setProgram(p);setContent(c||{media:[],testimonials:[]});setImpact(i)}).catch(()=>{})},[])
  const cohorts=program?.cohorts?.length?program.cohorts:[{name:'CyberA-Rise · Cohorte 2026',slug:'pilot-2026',year:2026,statusLabel:'Cohorte pilote terminée',introduction:'Première cohorte du parcours complet CyberAmbassador.'}]
  const activities=program?.activities?.length?program.activities:fallbackActivities
  const published=(content.media||[]).filter(item=>['formation','graduation','community-action'].includes(item.category))
  const photos=published.length?published.map(item=>[asset(item.url),item.alt||item.caption]):fallbackGallery
  return <div className="ca-page">
    <section className="ca-hero"><div><p>Programme Sykoti Center</p><h1>CyberAmbassador</h1><strong>Apprendre. Pratiquer. Agir. Transmettre.</strong><span>Un parcours complet de citoyenneté, sécurité et leadership numériques. Les candidats sont sélectionnés, suivent la formation, réalisent les évaluations et un projet communautaire. Le titre de CyberAmbassadeur est obtenu après réussite du parcours.</span><a href="#cohortes">Découvrir la cohorte 2026 ↓</a></div><img src={`${media}cybera-fellows.jpeg`} alt="Fellows de la cohorte CyberAmbassador 2026"/></section>
    <section className="ca-pathway"><header><p>Le parcours</p><h2>Une progression structurée jusqu’à l’action communautaire.</h2></header><div>{modules.map((item,index)=><article key={item[0]}><b>0{index+1}</b><h3>{['Monde numérique','Survivant du numérique','Digital Superpowers','Leadership citoyen numérique'][index]}</h3><p>{item[1]}</p></article>)}</div><ol><li>Sélection</li><li>Formation</li><li>Évaluations</li><li>Projet communautaire</li><li>Validation du parcours</li></ol></section>
    <section className="ca-cohorts" id="cohortes"><header><p>Les cohortes</p><h2>Chaque édition conserve son histoire, ses personnes et ses activités.</h2><span>Les prochaines cohortes publiées depuis l’administration apparaîtront automatiquement ici.</span></header><div className="ca-cohort-list">{cohorts.map(c=><article key={c._id||c.slug}><span>{c.year}</span><h3>{c.name}</h3><strong>{c.statusLabel}</strong><p>{c.introduction}</p></article>)}</div><div className="ca-cohort-proof"><img src={`${gallery}fellows-2026.jpg`} alt="Présentation des fellows CyberAmbassador 2026"/><div><p>Cohorte 2026</p><h3>CyberA-Rise</h3><dl><div><dt>{impact?.cyberA?.acceptedCount||20}</dt><dd>participants retenus dans la base de cohorte</dd></div><div><dt>4</dt><dd>modules du parcours complet</dd></div><div><dt>2026</dt><dd>année de la cohorte pilote</dd></div></dl></div></div></section>
    <section className="ca-activities"><header><p>Activités de la cohorte</p><h2>Le programme continue en dehors de la plateforme.</h2></header><div>{activities.map(a=><article key={a._id||a.title}><img src={asset(a.coverUrl)||`${gallery}community-action.jpg`} alt="" loading="lazy"/><div><span>{a.category}</span><h3>{a.title}</h3><p>{a.description}</p>{a.location&&<small>{a.location}</small>}</div></article>)}</div></section>
    <section className="ca-fellows"><header><p>Les visages de 2026</p><h2>Les fellows de la cohorte pilote.</h2></header><div>{fellows.map(([name,file])=><article key={name}><img src={`${media}${file}`} alt={`Portrait de ${name}`} loading="lazy"/><h3>{name}</h3><p>Fellow CyberA-Rise · 2026</p></article>)}</div></section>
    <section className="ca-gallery"><header><p>Galerie</p><h2>Formation, plateforme, graduation et terrain.</h2></header><div>{photos.map(([url,alt])=><figure key={url}><img src={url} alt={alt} loading="lazy"/><figcaption>{alt}</figcaption></figure>)}</div></section>
    {(content.testimonials||[]).length>0&&<section className="ca-voices"><header><p>Paroles de fellows</p><h2>Ce que les participants choisissent de partager.</h2></header><div>{content.testimonials.slice(0,4).map(item=><blockquote key={item._id||item.quote}><p>“{item.quote}”</p><footer><strong>{item.author}</strong>{item.context&&<span>{item.context}</span>}</footer></blockquote>)}</div></section>}
    <section className="ca-next"><div><p>Prochaine cohorte</p><h2>Les candidatures sont annoncées lorsqu’une nouvelle édition est prête.</h2><span>Aucune candidature ouverte n’est affichée actuellement.</span></div><a href="mailto:contact@sykoticenter.com?subject=Informations%20CyberAmbassador">Recevoir les informations ↗</a></section>
  </div>
}
